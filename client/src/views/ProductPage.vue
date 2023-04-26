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
import type { Clock, Phone, Charger } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";

const route = useRoute();
const { isHasBundle, isHasCurrentType } = useUserUtilities();
const product: Phone | Clock | Charger = reactive({}) as
  | Phone
  | Clock
  | Charger;
const catalog: Record<string, any>[] = reactive([]);
const catalogName = ref<string>(route.params.catalogName as string);
const subcatalogName = ref<string>(route.params.subcatalogName as string);
const productModel = ref<string>(route.params.model as string);
const productBrand = ref<string>(route.params.brand as string);
const loading = ref<boolean>(false);

fetchData();

async function fetchData() {
  await fetchCatalog();
  await fetchProduct();
}

async function fetchProduct() {
  const brand = catalog.find((item) => item.brand === productBrand.value);
  if (brand) {
    const searchingProduct = brand[subcatalogName.value].find(
      (item: Record<string, any>[] & { model: string }) =>
        item.model === productModel.value
    );
    Object.assign(product, searchingProduct);
  }
}

async function fetchCatalog() {
  loading.value = true;
  try {
    const response = await fetch(
      `http://localhost:5000/catalogs/${catalogName.value}`
    );
    const data = await response.json();
    catalog.splice(0);
    catalog.push(...data);
    loading.value = false;
  } catch (e) {
    loading.value = false;
    console.log(e);
  }
}
</script>
<style scoped></style>
