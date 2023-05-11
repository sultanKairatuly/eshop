<template>
  <div class="parameters_container" v-if="isHasParameters(props.product)">
    <ProductParameters
      :parameters="parameters"
      :product="product"
      :key="parameters.title.ru"
      :activeConfiguration="activeConfiguration"
      v-for="parameters in props.product.parameters"
      @changeProductProperty="changeProductProperty"
      @changeCurrentImage="changeCurrentImage"
      @changeActiveConfiguration="changeActiveConfiguration"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProductParameters from "./ProductParameters.vue";
import { useUserUtilities } from "../composables/utilities";
import { Product, ProductParametersType } from "../../types/types";

const emit = defineEmits<{
  (e: "changeProductProperty", property: keyof Product, value: unknown): void;
  (e: "changeCurrentImage", value: string): void;
}>();
const activeConfiguration = ref<ProductParametersType | null>(null);
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

function changeActiveConfiguration(value: ProductParametersType | null) {
  activeConfiguration.value = value;
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
