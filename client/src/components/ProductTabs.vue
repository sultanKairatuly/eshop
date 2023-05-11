<template>
  <div class="tabs_container">
    <div class="tabs">
      <ProductTab
        :currentComponent="currentComponent"
        :tab="tab"
        :key="tab.id"
        v-for="tab in tabs"
        @changeTab="changeTab"
      />
    </div>
    <KeepAlive>
      <div class="tab_content">
        <component :reviews="props.product.reviews" :product="props.product" :is="currentComponent" />
      </div>
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import type { Component } from "vue";
import { Product, Tab } from "../../types/types";
import ProductDescription from "./ProductDescription.vue";
import ProductReviews from "./ProductReviews.vue";
import ProductTab from "../components/ProductTab.vue";
import { v4 as uuidv4 } from "uuid";
const props = defineProps<{
  product: Product;
}>();
console.log();
let currentComponent = shallowRef<Component>(ProductDescription);
const tabs: Tab[] = [
  {
    name: "Описание",
    component: ProductDescription,
    id: uuidv4(),
  },
  {
    name: "Отзывы",
    component: ProductReviews,
    id: uuidv4(),
  },
];

function changeTab(component: Component) {
  currentComponent.value = component;
}
</script>

<style scoped>
.tabs {
  display: flex;
}

.tab_content {
  border: 1px solid #e5e5e5;
  font-size: 20px;
  padding: 30px 40px;
  background-color: #fff;
}
</style>
