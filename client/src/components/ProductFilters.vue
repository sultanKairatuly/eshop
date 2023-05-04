<template>
  <div class="container">
    <div class="filter_wrapper" :key="category?._id" v-for="category in categoryFilters">
      <div
        class="filter"
        v-for="(filter, idx) in category?.filters"
        :key="filter.value"
        :class="{
          borderToped: idx === 0
        }"
      >
        <div class="filter_title">{{ filter.title.ru }}</div>
        <p
          class="label"
          v-for="checkbox in filter.values"
          :key="checkbox.value"
        >
          <input
            type="checkbox"
            class="checkbox"
            @click="filterProducts(filter, checkbox)"
            :value="checkbox.value"
            :name="filter.value"
            :checked="checkbox.checked"
          />
          <div class="label_item">{{ checkbox.title }}</div>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Category, Filter, EmittedFilterType } from "../../types/types";
import { useRoute } from 'vue-router'

const route = useRoute()
const catalogName = ref<string>(route.query.catalogName as string)
const subcatalogName = ref<string>(route.query.subcatalogName as string)
const props = defineProps<{
  categories: Category[];
}>();


watch(() => route.query, (query) => {
  catalogName.value = query.catalogName as string
  subcatalogName.value = query.subcatalogName as string
}, { immediate: true })



const emit = defineEmits<{
  (e: "changePriceFilter", value: { max: number; min: number }): void;
  (e: "filterProducts", value: EmittedFilterType): void;
  (e: "fillWithProducts"): void;
}>();

const categoryFilters = computed(() => {
  const result: Category[] = [];
  for (let category of props.categories) {
    const catalogs = (subcatalogName.value || catalogName.value).split("-");
    if (catalogs.includes(category.category)) {
      result.push(category);
    }
  }
  if(result.length === 1){
    return result
  }else{
    let maxFilterValues: string[] = []
    let maxFilters: Filter[] = []
    let commonFilters: Category[] = []
    let maxLength = 0
    const hash: Record<string, number> = {}
    result.forEach(category => {
      const currentCategoryFilterLength = (category.filters || []).length
      if(currentCategoryFilterLength > maxLength){
        maxFilterValues = (category.filters?.map(item => item.value) ?? [])
        maxFilters = (category.filters ?? [])
        maxLength = currentCategoryFilterLength
      }
    })
    result.forEach(({ filters }) => {
      filters?.forEach(({ value }) => {
        if(maxFilterValues.includes(value)){
          hash[value] = hash[value] + 1 || 1
        }
      })
    })
    const filters: Filter[] = []
    for(let key in hash){
      if(hash[key] === result.length){
        filters.push(maxFilters.find(filter => filter.value === key) as Filter)
      }
    }

    commonFilters = props.categories.map(item => ({...item, filters}) )
    return [commonFilters[0]]
  }
});


function filterProducts(
  filter: Filter,
  checkbox: { title: string; value: string; checked: boolean }
) {
  checkbox.checked = !checkbox.checked;
  let empty = false;
  for (let i = 0; i < (categoryFilters.value || []).length; i++) {
    const category = (categoryFilters.value || [])[i];
    for (let j = 0; j < (category?.filters?.length ?? 0); j++) {
      let values = (category?.filters || [])[j]?.values;
      let a = !!values.filter((value) => value.checked)[0];
      if (a) {
        empty = true;
      }
    }
  }
  if (!empty) {
    emit("filterProducts", {
      property: filter.value,
      values: filter.values
        .filter((item) => item.checked)
        .map((item) => item.value),
      empty: true,
      type: filter.type,
    });
  } else {
    emit("filterProducts", {
      property: filter.value,
      values: filter.values
        .filter((item) => item.checked)
        .map((item) => item.value),
      empty: false,
      type: filter.type,
    });
  }
}
</script>

<style scoped>
.filter_wrapper{
  margin-top: 50px;
}
.checkbox {
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: #000;
  width: 20px;
  height: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 0.15em;
  cursor: pointer;
  transition: border 0.2s ease-in-out;
  margin-right: 7px;
  margin-bottom: 7px;
}

.checkbox:hover {
  border: 1px solid blue;
}

.checkbox:checked {
  background-image: url(../assets/small-checked.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 13px 10px;
}

.label {
  display: flex;
  align-items: center;
}


.label_item{
  font-size: 20px;

}
.filter {
  padding: 40px 0;
  border-bottom: 1px solid #e5e5e5;
}

.borderToped{
  border-top: 1px solid #e5e5e5;
}

.filter_title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
}
</style>
