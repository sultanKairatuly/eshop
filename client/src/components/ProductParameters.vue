<template>
  <div class="parameters">
    <ProductParametersConfiguration
      :active-configuration="activeConfiguration"
      :product="product"
      :parameters="props.parameters"
      @changeActiveConfiguration="changeActiveConfiguration"
    />
    <ProductParametersSelect
      :product="product"
      v-if="props.parameters.title.ru === props.activeConfiguration?.title.ru"
      :parameters="parameters"
      :active-configuration="activeConfiguration"
      @changeActiveConfiguration="changeActiveConfiguration"
      @changeProductProperty="changeProductProperty"
      @changeCurrentImage="changeCurrentImage"
    />
  </div>
</template>

<script setup lang="ts">
import { Product, ProductParametersType } from "../../types/types";
import ProductParametersConfiguration from "./ProductParametersConfiguration.vue";
import ProductParametersSelect from "./ProductParametersSelect.vue";

const props = defineProps<{
  parameters: ProductParametersType;
  product: Product;
  activeConfiguration: ProductParametersType | null;
}>();

const emit = defineEmits<{
  (e: "changeProductProperty", property: keyof Product, value: unknown): void;
  (e: "changeCurrentImage", value: string): void;
  (e: "changeActiveConfiguration", value: ProductParametersType | null): void;
}>();

function changeActiveConfiguration(value: ProductParametersType | null) {
  emit("changeActiveConfiguration", value);
}

function changeProductProperty(property: keyof Product, value: unknown) {
  emit("changeProductProperty", property, value);
}

function changeCurrentImage(value: string) {
  emit("changeCurrentImage", value);
}
</script>

<style scoped>
.parameters {
  position: relative;
}
</style>
