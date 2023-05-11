<template>
  <ProductParametersList
    :product="props.product"
    @changeProductProperty="changeProductProperty"
    @changeCurrentImage="changeCurrentImage"
  />
  <div class="buy_btn">В корзину</div>
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
.buy_btn {
  background-color: #f14635;
  color: #fff;
  padding: 10px 50px;
  width: 100%;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
}

.buy_btn:hover {
  background-color: #e04131;
}
</style>
