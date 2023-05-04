<template>
  <div class="product">
    <EshopLoader v-if="loading" />
    <div v-else class="product_container">
      <ProductsBreadcrumps
        :breadcrumps="breadcrumps"
        :current-tree-link-id="props.currentTreeLinkId"
      />
      <div class="product_content">
        <div class="product_left">
          <div class="product_image_container">
            <img class="product_image" :src="imageURL" />
          </div>
        </div>
        <div class="product_right">
          <div class="product_model">{{ product.model }}</div>
          <div class="separator"></div>
          <div class="product_price">
            <div class="product_price_item">
              <h4 class="price_title">Цена</h4>
              <div class="price_value">
                {{
                  isHasBundle(product)
                    ? product.current_bundle.price
                    : product.price
                }}
              </div>
            </div>

            <div class="product_price_item">
              <h4 class="price_title">В рассрочку</h4>
              <div class="installment_value">
                {{ getInstallment(product) }}
              </div>
              <div class="price-info">x 12</div>
            </div>
          </div>

          <div class="params" v-if="isHasCurrentType(product)"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import { useRoute } from "vue-router";
import { reactive, ref, computed } from "vue";
import type { DropdownFilterType, Product } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";
import { useHttpRequests } from "../composables/httpRequests";
import ProductsBreadcrumps from "../components/ProductsBreadcrumps.vue";
import EshopLoader from "../components/EshopLoader.vue";

const props = defineProps<{
  dropdownFilter: DropdownFilterType[];
  currentTreeLinkId: string;
}>();

function isHasImages(value: unknown): value is { images: string[] } {
  return value !== null && typeof value === "object" && "images" in value;
}

const route = useRoute();
const { isHasBundle, isHasCurrentType, getImageUrl, getInstallment } =
  useUserUtilities();
const product: Product = reactive({}) as Product;
const categoryName = route.params.category as string;
const { fetchCatalog } = useHttpRequests(categoryName);
const catalogName = route.params.catalogName as string;
const subcatalogName = route.params.subcatalogName as string;
const productModel = route.params.model as string;
const loading = ref<boolean>(false);
const breadcrumps = reactive([props.dropdownFilter[0]]);
fetchData();
async function fetchData() {
  try {
    loading.value = true;
    await fetchCatalog();
    await fetchProduct();
    console.log(product);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

const imageURL = computed(() => {
  if (isHasImages(product)) {
    return getImageUrl(product?.images?.[0]);
  } else {
    return getImageUrl(product?.current_type?.images?.[0]);
  }
});

async function fetchProduct() {
  const response = await axios.get<Product[]>(
    `http://localhost:5000/getproductbymodel/${categoryName}/${
      catalogName ?? subcatalogName
    }/${productModel}`
  );
  Object.assign(product, response.data[0]);
}
</script>
<style scoped>
.product {
  background-color: #fbfbfb;
  min-height: 100vh;
}

.product_container {
  max-width: 1200px;
  width: 100%;
  margin: 0px auto;
  padding-top: 30px;
  position: relative;
}

.product_content {
  display: flex;
  background-color: #fff;
  border: 1px solid #e5e5e5;
}
.product_left {
  width: 65%;
  border-right: 1px solid #e5e5e5;
}
.product_image_container {
  height: 400px;
  width: 250px;
  position: relative;
  width: 100%;
}
.product_image {
  width: 100%;
  margin: 0 auto;
  height: 100%;
  object-fit: contain;
}
.product_right {
  width: 35%;
  padding: 20px 40px;
}
.product_model {
  font-size: 30px;
}
.separator {
  height: 1px;
  margin: 30px 0;
  background-color: #e5e5e5;
}
.product_price {
  display: flex;
  align-items: center;
}

.product_price_item:first-child {
  padding-right: 12px;
  border-right: 1px solid #e5e5e5;
}

.product_price_item:last-child {
  padding-left: 12px;
}
.price_title {
  color: #9fa19f;
  margin-bottom: 10px;
  font-size: 22px;
}
.price_value {
  font-weight: 500;
  font-size: 23px;
}

.installment_value {
  padding: 3px;
  width: fit-content;
  background-color: #ffd300;
  font-weight: 500;
  font-size: 19px;
  display: inline-block;
}

.price-info {
  color: #999999;
  margin-left: 10px;
  display: inline-block;
  font-size: 18px;
}
</style>
