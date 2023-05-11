<template>
  <div class="product_right">
    <ProductInnerRigthTop :product="props.product" />
    <ProductInnerRightBottom
      :product="props.product"
      @changeCurrentImage="changeCurrentImage"
      @changeProductProperty="changeProductProperty"
    />
  </div>
</template>

<script setup lang="ts">
import { Product } from "../../types/types";
import ProductInnerRigthTop from "./ProductInnerRightTop.vue";
import ProductInnerRightBottom from "./ProductInnerRightBottom.vue";

const props = defineProps<{
  product: Product;
  currentImage: string;
}>();
console.log(props.product);
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
.product_right {
  width: 35%;
  padding: 20px 40px;
}
</style>
