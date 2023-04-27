<template>
  <div class="sort">
    <select
      class="sort_select"
      :value="props.modelValue"
      @change="changeSortingCriteria"
    >
      <option class="sort_option" value="popular">Популярные</option>
      <option class="sort_option" value="price-down">Сначала дешевые</option>
      <option class="sort_option" value="price-up">Сначала дорогие</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function changeSortingCriteria(e: Event) {
  const target: HTMLInputElement = e.target as HTMLInputElement;
  if (target) {
    emit("update:modelValue", target.value);
  }
}
</script>

<style scoped>
.sort_select {
  padding: 10px;
  font-size: 18px;
  border: 1px solid #e5e5e5;
  outline: none;
  margin: 15px 0 25px 0;
}
</style>
