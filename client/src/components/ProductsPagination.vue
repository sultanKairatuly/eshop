<template>
  <div class="pagination" v-if="props.products.length">
    <div
      class="pagination_item prev_pag"
      :class="{
        blocked: props.page === 1,
      }"
      @click="updatePage(props.page - 1)"
    >
      ← Предыдущая
    </div>
    <div
      class="pagination_item"
      v-for="pag in Math.ceil(props.products.length / props.productsPerPage)"
      :key="pag"
      @click="updatePage(pag)"
      :class="{
        'pagination_item-active': pag === props.page,
      }"
    >
      {{ pag }}
    </div>
    <div
      class="pagination_item next_pag"
      @click="updatePage(props.page + 1)"
      :class="{
        blocked:
          props.page ===
          Math.ceil(props.products.length / props.productsPerPage),
      }"
    >
      Следующая →
    </div>
  </div>
</template>

<script setup lang="ts">
import { Product } from "../../types/types";

const props = withDefaults(
  defineProps<{
    page: number;
    products: Product[];
    productsPerPage?: number;
  }>(),
  {
    productsPerPage: 12,
  }
);

console.log(props.products.length);

const emit = defineEmits<{
  (e: "updatePage", value: number): void;
}>();

function updatePage(updatedPage: number) {
  if (
    updatedPage > 0 &&
    updatedPage <= Math.ceil(props.products.length / props.productsPerPage)
  ) {
    emit("updatePage", updatedPage);
  } else {
    return;
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin: 50px 0;
}

.pagination_item {
  padding: 10px 25px;
  font-size: 20px;
  border: 1px solid #fff;
  border-left: 1px solid #dcdcdc;
  cursor: pointer;
  border-radius: 0;
}

.pagination_item:hover {
  border-radius: 3px;
  border: 1px solid #dcdcdc;
  color: #000077;
  background-color: #e6e6e6;
}

.next_pag {
  border: 1px solid #fff;
  border-right: 1px solid #dcdcdc;
}

.pagination_item-active {
  border-radius: 3px;
  border: 1px solid #dcdcdc;
  color: #000077;
  background-color: #e6e6e6;
}

.blocked {
  color: #e2e2e2;
  cursor: default;
}

.blocked:hover {
  color: #e2e2e2;
  background-color: transparent;
  border: 1px solid transparent;
  border-left: 1px solid #dcdcdc;
}

.next_pag:hover {
  border: 1px solid transparent;
  border-right: 1px solid #dcdcdc;
}
</style>
