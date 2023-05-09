<template>
  <div class="header">
    <EshopHeaderTop />
    <EshopHeaderMiddle
      :model-value="productSearch"
      @update:model-value="(event) => (productSearch = event)"
      @searchProduct="searchProduct"
    />
    <EshopHeaderBottom />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EshopHeaderTop from "./EshopHeaderTop.vue";
import EshopHeaderMiddle from "./EshopHeaderMiddle.vue";
import EshopHeaderBottom from "./EshopHeaderBottom.vue";
import axios from "axios";

const productSearch = ref<string>("");

async function searchProduct() {
  const response = await axios.get(
    `http://localhost:5000/getproductbyname/${productSearch.value}`
  );
  console.log(response);
  console.log(response.data);
  console.log('===============')
}
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  row-gap: 0;
}
</style>
