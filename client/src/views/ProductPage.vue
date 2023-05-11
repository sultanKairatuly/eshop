<template>
  <div class="product">
    <ProductSlider
      :images="product.images ?? ['']"
      :isSlider="isSlider"
      :current-slide-index="currentSlideIndex"
      @changeSlideIndex="changeSlideIndex"
      @changeSliderFlag="changeSliderFlag"
    />
    <EshopLoader v-if="loading" />
    <div v-else class="product_container">
      <ProductsBreadcrumps
        :breadcrumps="breadcrumps"
        :current-tree-link-id="props.currentTreeLinkId"
        @breadcrumpClicked="breadcrumpClicked"
      />
      <div class="product_content">
        <ProductInnerLeft
          :current-image="currentImage"
          :images="product.images"
          @activateSliderFlag="isSlider = true"
          @handleMiniImageClick="handleMiniImageClick"
        />
        <ProductInnerRight
          :current-image="currentImage"
          :product="product"
          @changeProductProperty="changeProductProperty"
          @changeCurrentImage="changeCurrentImage"
        />
      </div>
      <ProductTabs :product="product" />
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { reactive, ref } from "vue";
import type { DropdownFilterType, Product } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";
import { useHttpRequests } from "../composables/httpRequests";
import ProductsBreadcrumps from "../components/ProductsBreadcrumps.vue";
import EshopLoader from "../components/EshopLoader.vue";
import ProductInnerLeft from "../components/ProductInnerLeft.vue";
import ProductInnerRight from "../components/ProductInnerRight.vue";
import ProductSlider from "../components/ProductSlider.vue";
import ProductTabs from "../components/ProductTabs.vue";

const props = defineProps<{
  dropdownFilter: DropdownFilterType[];
  currentTreeLinkId: string;
}>();
const router = useRouter();
const route = useRoute();
const { findTreeLinkAndDepth, isHasDepth } = useUserUtilities();
const product: Product = reactive({}) as Product;
const categoryName = route.params.category as string;
const { fetchCatalog } = useHttpRequests(categoryName);
const catalogName = route.params.catalogName as string;
const subcatalogName = route.params.subcatalogName as string;
const productModel = route.params.model as string;
const loading = ref<boolean>(false);
const breadcrumps = reactive([props.dropdownFilter[0]]);
const currentImage = ref<string>("");
const currentSlideIndex = ref<number>(0);
const isSlider = ref<boolean>(false);
fetchData();

async function fetchData() {
  try {
    loading.value = true;
    await fetchCatalog();
    await fetchProduct();
    console.log(product.reviews);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

function changeCurrentImage(value: string) {
  currentImage.value = value;
}

function changeProductProperty(property: keyof Product, value: unknown) {
  if (value && Array.isArray(value) && typeof value === "string") {
    product[property] = value;
  }
}

function handleMiniImageClick(src: string, idx: number) {
  currentImage.value = src;
  currentSlideIndex.value = idx;
}

function changeSlideIndex(idx: number) {
  currentSlideIndex.value = idx;
}

function changeSliderFlag(value: boolean) {
  isSlider.value = value;
}

async function fetchProduct() {
  const response = await axios.get<Product[]>(
    `http://localhost:5000/getproductbymodel/${categoryName}/${
      catalogName ?? subcatalogName
    }/${productModel}`
  );
  Object.assign(product, response.data[0]);
  currentImage.value = product?.images?.[0];
}

function breadcrumpClicked(id: string) {
  const foundTreeLink = findTreeLinkAndDepth(id, props.dropdownFilter);
  if (isHasDepth(foundTreeLink)) {
    const queryKey = foundTreeLink.depth > 1 ? "subcatalogName" : "catalogName";
    router.push({
      path: `/c/${route.params.category}`,
      query: { [queryKey]: foundTreeLink.item.category },
    });
  }
}
</script>
<style scoped>
.product {
  background-color: #fbfbfb;
  min-height: 100vh;
  padding-bottom: 50px;
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
  margin-bottom: 40px;
}
</style>
