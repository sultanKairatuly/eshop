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
        <component
          @updateReviews="updateReviews"
          :reviews="props.product.reviews"
          :product="props.product"
          :is="currentComponent"
        />
      </div>
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed } from "vue";
import type { Component } from "vue";
import { Product, Review, Tab } from "../../types/types";
import ProductDescription from "./ProductDescription.vue";
import ProductReviews from "./ProductReviews.vue";
import ProductTab from "../components/ProductTab.vue";
import { v4 as uuidv4 } from "uuid";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (e: "updateReviews", value: Review): void;
}>();

let currentComponent = shallowRef<Component>(ProductDescription);
const tabs = computed<Tab[]>(() => [
  {
    name: t("reviews.description"),
    component: ProductDescription,
    id: uuidv4(),
  },
  {
    name: t("reviews.reviews"),
    component: ProductReviews,
    id: uuidv4(),
  },
]);

function changeTab(component: Component) {
  currentComponent.value = component;
}

function updateReviews(review: Review) {
  emit("updateReviews", review);
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
