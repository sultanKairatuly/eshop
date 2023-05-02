<template>
  <div class="filters">
    <div class="filter" v-for="filter in filters" :key="filter.name.value">
      <div class="filter_title">{{ filter.name.ru }}</div>
      <p v-for="checkbox in filter.values" :key="checkbox.value">
        <input
          type="checkbox"
          @click="setPrice(filter.values, checkbox)"
          :value="checkbox.value"
          :name="filter.name.value"
          :checked="checkbox.checked"
        />
        {{ checkbox.title }}
      </p>
    </div>
    <div class="filter_wrapper" v-for="category in categoryFilters">
      <div v-for="filter in category?.filters">
        <div class="filter_title">{{ filter.title.ru }}</div>
        <p v-for="checkbox in filter.values" :key="checkbox.value">
          <input
            type="checkbox"
            @click="filterProducts(filter, checkbox)"
            :value="checkbox.value"
            :name="filter.value"
            :checked="checkbox.checked"
          />
          {{ checkbox.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { Category, Filter, EmittedFilterType } from "../../types/types";

const props = defineProps<{
  categories: Category[];
  catalogs: string;
}>();

const emit = defineEmits<{
  (e: "changePriceFilter", value: { max: number; min: number }): void;
  (e: "filterProducts", value: EmittedFilterType): void;
  (e: "fillWithProducts"): void;
}>();

type Price = {
  max: number;
  min: number;
};

const price: Price = reactive({
  min: 0,
  max: Infinity,
});

watch(price, (nv) => {
  emit("changePriceFilter", { max: nv.max, min: nv.min });
});

const categoryFilters = computed(() => {
  const result: Category[] = [];
  for (let category of props.categories) {
    const catalogs = props.catalogs.split("-");
    if (catalogs.includes(category.category)) {
      result.push(category);
    }
  }

  return result.length > 1 ? [] : result;
});

function filterProducts(
  filter: Filter,
  checkbox: { title: string; value: string; checked: boolean }
) {
  checkbox.checked = !checkbox.checked;
  let empty = false;
  for (let i = 0; i < categoryFilters.value.length; i++) {
    const category = categoryFilters.value[i];
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

function setPrice(
  values: { title: string; value: string; checked: boolean }[],
  checkbox: { title: string; value: string; checked: boolean }
) {
  checkbox.checked = !checkbox.checked;
  const minPrices: number[] = [];
  const maxPrices: number[] = [];
  values.forEach((checkbox) => {
    if (checkbox.checked) {
      const [currentCheckboxMin, currentCheckboxMax] = checkbox.value
        .split("-")
        .map(Number);
      minPrices.push(currentCheckboxMin);
      maxPrices.push(currentCheckboxMax);
    }
  });
  if (minPrices.length || maxPrices.length) {
    price.min = Math.min(...minPrices);
    price.max = Math.max(...maxPrices);
  } else {
    price.min = 0;
    price.max = Infinity;
  }
}

const filters = [
  {
    name: {
      value: "Price",
      ru: "Цена",
      kz: "Бага",
    },
    values: [
      { title: "до 10 000т", value: "0-10000", checked: false },
      { title: "10 000 - 49 999т", value: "10000-49999", checked: false },
      {
        title: "50 000 - 99 999т",
        value: "50000-99999",
        checked: false,
      },
      {
        title: "100 000 - 149 999т",
        value: "100000-149999",
        checked: false,
      },
      {
        title: "150 000 - 199 999т",
        value: "150000-199999",
        checked: false,
      },
      {
        title: "200 000 - 499 000т",
        value: "200000-499000",
        checked: false,
      },
      {
        title: "более 500 000т",
        value: "500000-100000000",
        checked: false,
      },
    ],
  },
];
</script>

<style scoped></style>
