<template>
  <div
    class="parameter"
    @click="handleParameterClick(parameters.properties, param)"
  >
    <div
      class="parameter_content"
      v-if="parameters.properties.includes('images')"
    >
      <div class="parameter_image_container">
        <img :src="getImageUrl(param.images[0])" class="parameter_image" />
      </div>

      <div class="parameter_value">{{ param.color }}</div>
    </div>
    <div class="parameter_content" v-else>
      <div class="parameter_value">
        {{ param[props.parameters.properties[0]] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserUtilities } from "../composables/utilities";
import { ProductParametersType, Product } from "../../types/types";

const { getImageUrl } = useUserUtilities();

const props = defineProps<{
  param: any;
  parameters: ProductParametersType;
  product: Product;
}>();

const emit = defineEmits<{
  (e: "changeProductProperty", property: keyof Product, value: unknown): void;
  (e: "changeCurrentImage", value: string): void;
  (e: "changeActiveConfiguration", value: null | ProductParametersType): void;
}>();

function handleParameterClick(
  properties: string[],
  value: Record<string, any>
) {
  properties.forEach((property: string) => {
    props.product[property as keyof Product] = value[property];
    emit("changeProductProperty", property as keyof Product, value[property]);
  });
  emit("changeCurrentImage", props.product?.images?.[0]);
  emit("changeActiveConfiguration", null);
}
</script>

<style scoped>
.parameter {
  padding: 10px;
}

.parameter:hover {
  background-color: #f5f5f5;
}
.parameter_content {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  column-gap: 10px;
}

.parameter_image_container {
  padding: 0 20px;
  width: 60px;
  height: 40px;
  border: 1px solid #dcdcdc;
  display: flex;
  justify-content: center;
  align-items: center;
}
.parameter_image {
  display: block;
  margin: 0 auto;
  width: 30px;
  height: 40px;
  object-fit: contain;
}
.param_image {
  width: 38px;
  height: 40px;
}
.param_value {
  font-size: 16px;
}
.param:hover {
  background-color: #e5e5e5;
}
</style>
