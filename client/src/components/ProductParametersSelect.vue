<template>
  <div class="parameters_select">
    <ProductParam
      :product="props.product"
      :parameters="props.parameters"
      :param="param"
      v-for="param in props.parameters.values"
      :key="param[0]"
      @changeActiveConfiguration="changeActiveConfiguration"
      @changeCurrentImage="changeCurrentImage"
      @changeProductProperty="changeProductProperty"
    />
  </div>
</template>

<script setup lang="ts">
import { ProductParametersType, Product } from "../../types/types";
import ProductParam from "./ProductParam.vue";

const props = defineProps<{
  parameters: ProductParametersType;
  product: Product;
}>();



const emit = defineEmits<{
  (e: "changeProductProperty", property: keyof Product, value: unknown): void;
  (e: "changeCurrentImage", value: string): void;
  (e: "changeActiveConfiguration", value: null | ProductParametersType): void;
}>();

function changeActiveConfiguration(value: ProductParametersType | null) {
  emit("changeActiveConfiguration", value);
}

function changeCurrentImage(value: string) {
  emit("changeCurrentImage", value);
}

function changeProductProperty(property: keyof Product, value: unknown) {
  emit("changeProductProperty", property, value);
}
</script>

<style scoped>
.parameters_select {
  padding: 5px 0;
  border: 1px solid #dcdcdc;
  position: absolute;
  top: 67px;
  background-color: #fff;
  left: 0;
  z-index: 50;
  width: 100%;
}
</style>
