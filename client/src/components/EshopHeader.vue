<template>
  <div class="header">
    <EshopHeaderTop />
    <EshopHeaderMiddle
      :model-value="productSearch"
      @update:model-value="(event) => (productSearch = event)"
    />
    <EshopHeaderBottom />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EshopHeaderTop from "./EshopHeaderTop.vue";
import EshopHeaderMiddle from "./EshopHeaderMiddle.vue";
import EshopHeaderBottom from "./EshopHeaderBottom.vue";

const productSearch = ref<string>("");
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  row-gap: 0;
}
</style>
