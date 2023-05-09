<template>
  <div class="parameters_container" v-if="isHasParameters(props.product)">
    <ProductParameters
      :parameters="parameters"
      :product="product"
      :key="parameters.title.ru"
      v-for="parameters in props.product.parameters"
      @changeProductProperty="changeProductProperty"
      @changeCurrentImage="changeCurrentImage"
    />
  </div>
</template>

<script setup lang="ts">
import ProductParameters from "./ProductParameters.vue";
import { useUserUtilities } from "../composables/utilities";
import { Product } from "../../types/types";

const emit = defineEmits<{
  (e: "changeProductProperty", property: keyof Product, value: unknown): void;
  (e: "changeCurrentImage", value: string): void;
}>();

const { isHasParameters } = useUserUtilities();
const props = defineProps<{
  product: Product;
}>();

function changeProductProperty(property: keyof Product, value: unknown) {
  emit("changeProductProperty", property, value);
}

function changeCurrentImage(value: string) {
  emit("changeCurrentImage", value);
}
</script>

<style scoped>
.parameters_container {
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}
</style>
