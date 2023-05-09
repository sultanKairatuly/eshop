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
      :parameters="parameters"
      :active-configuration="activeConfiguration"
      @changeActiveConfiguration="changeActiveConfiguration"
      @changeProductProperty="changeProductProperty"
      @changeCurrentImage="changeCurrentImage"
    />
  </div>
</template>

<script setup lang="ts">
import { Product, ProductParameters } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";
import { ref } from "vue";
import ProductParametersConfiguration from "./ProductParametersConfiguration.vue";
import ProductParametersSelect from "./ProductParametersSelect.vue";

const props = defineProps<{
  parameters: ProductParameters;
  product: Product;
}>();

const emit = defineEmits<{
  (e: "changeProductProperty", property: keyof Product, value: unknown): void;
  (e: "changeCurrentImage", value: string): void;
}>();

const activeConfiguration = ref<ProductParameters | null>(null);

function changeActiveConfiguration(value: ProductParameters | null) {
  activeConfiguration.value = value;
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
