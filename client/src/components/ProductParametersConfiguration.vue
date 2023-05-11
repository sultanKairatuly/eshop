<template>
  <div
    class="parameters_configuration"
    @click="handleParameterConfigClick(props.parameters)"
    :class="{
      'parameters_configuration-open':
        activeConfiguration?.title?.ru === props.parameters.title.ru,
    }"
  >
    <div class="parameters_title">{{ props.parameters.title.ru }}</div>
    <div class="parameters_value">
      {{ props.product[parameters.properties[0] as keyof Product] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductParametersType, Product } from "../../types/types";

const props = defineProps<{
  parameters: ProductParametersType;
  product: Product;
  activeConfiguration: ProductParametersType | null;
}>();

const emit = defineEmits<{
  (e: "changeActiveConfiguration", value: ProductParametersType | null): void;
}>();

function handleParameterConfigClick(parameter: ProductParametersType) {
  if (props.activeConfiguration?.title.ru === parameter.title.ru) {
    emit("changeActiveConfiguration", null);
  } else {
    emit("changeActiveConfiguration", parameter);
  }
}
</script>

<style scoped>
.parameters_configuration {
  border: 1px solid #dcdcdc;
  padding: 10px;
}

.parameters_configuration-open {
  border: 1px solid #3b87ca;
}

.parameters_title {
  color: #b7b8b7;
  font-size: 15px;
  margin-bottom: 5px;
}

.parameters_value {
  font-size: 18px;
}
</style>
