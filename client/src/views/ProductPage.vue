<template>
  <div class="product">
    <div class="product_left">
      <div class="product_image"></div>
    </div>
    <div class="product_right">
      <div class="product_model">{{ product.model }}</div>
      <div class="separator"></div>
      <div class="product_price">
        <h4 class="price_title">Цена</h4>
        <div class="price_value">
          {{
            isHasBundle(product) ? product.current_bundle.price : product.price
          }}
        </div>
      </div>
      <div class="colors" v-if="isHasCurrentType(product)">
        <select class="color_select">
          <option value=""></option>
        </select>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import type { Product } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";
import { useHttpRequests } from "../composables/httpRequests";
import axios from "axios";

const route = useRoute();
const { isHasBundle, isHasCurrentType } = useUserUtilities();
const product: Product = reactive({}) as Product;
const categoryName = route.params.category as string;
const { fetchCatalog } = useHttpRequests(categoryName);
const catalogName = route.params.catalogName as string;
const subcatalogName = route.params.subcatalogName as string;
const productModel = route.params.model as string;
const loading = ref<boolean>(false);
fetchData();
async function fetchData() {
  try {
    loading.value = true;
    await fetchCatalog();
    await fetchProduct();
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

async function fetchProduct() {
  const response = await axios.get<Product[]>(
    `http://localhost:5000/getproductbymodel/${categoryName}/${
      catalogName ?? subcatalogName
    }/${productModel}`
  );
  Object.assign(product, response.data[0]);
}
</script>
<style scoped></style>
