<template>
  <ProductParametersList
    :product="props.product"
    @changeProductProperty="changeProductProperty"
    @changeCurrentImage="changeCurrentImage"
  />
</template>

<script setup lang="ts">
import { Product } from "../../types/types";
import ProductParametersList from "./ProductParametersList.vue";

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (e: "changeProductProperty", property: keyof Product, value: unknown): void;
  (e: "changeCurrentImage", value: string): void;
}>();

function changeProductProperty(property: keyof Product, value: unknown) {
  emit("changeProductProperty", property, value);
}

function changeCurrentImage(value: string) {
  emit("changeCurrentImage", value);
}
</script>

<style scoped>


</style>
