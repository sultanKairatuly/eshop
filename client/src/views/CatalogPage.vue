<template>
  <div class="wrapper">
    <EshopLoader v-if="loading" />
    <div v-else class="container">
      <div class="filters">
        <DropdownFilter
          :active-id="currentTreeLinkId"
          @treeLinkClicked="treeLinkClicked"
          :dropdown-filter="dropdownFilter"
        />
      </div>
      <div class="products">
        <div class="breadcrumps">
          <div
            class="breadcrump"
            v-for="(breadcrump, index) in breadcrumps"
            :key="breadcrump.catalog"
            :class="{
              active_breadcrump: breadcrump.id === currentTreeLinkId,
            }"
            @click="treeLinkClicked(breadcrump)"
          >
            {{ breadcrump.value }}
            <i
              class="fa-solid fa-arrow-right breadcrump_arrow"
              v-if="index !== breadcrumps.length - 1"
            ></i>
          </div>
        </div>
        <div class="products_content">
          <div class="product" :key="product.id" v-for="product in products">
            <img
              class="product_image"
              :src="getImageUrl(product?.current_type.images[0])"
              alt="product image"
              @click="viewProduct(product.model)"
            />
            <div class="image_separator"></div>
            <div class="product_name">{{ product.model }}</div>
            <div class="bills">
              <div class="price">
                <div class="price_title">Цена</div>
                <div class="price_value">
                  {{ product.price || product.current_bundle.price }}
                </div>
              </div>
              <div class="installment">
                <div class="installment_title">В рассрочку</div>
                <div class="installment_value">
                  {{
                    getInstallment(
                      product.price || product.current_bundle.price
                    )
                  }}
                </div>
                <span class="mode">x12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import DropdownFilter from "../components/DropdownFilter.vue";
import type { DropdownFilterType } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import { useRoute, useRouter } from "vue-router";
import { useUserUtilities } from "../composables/utilities";
import EshopLoader from "../components/EshopLoader.vue";

const router = useRouter();
const loading = ref<boolean>(false);
const { isHasDepth, findTreeLinkAndDepth, getImageUrl } = useUserUtilities();
const route = useRoute();
const dropdownFilter: DropdownFilterType[] = reactive([
  {
    value: "Телефоны и гаджеты",
    catalog: "mobiles-clocks-chargers",
    opened: false,
    id: uuidv4(),
    children: [
      {
        value: "Телефоны",
        opened: false,
        catalog: "mobiles",
        children: [],
        id: uuidv4(),
      },
      {
        value: "Гаджеты",
        opened: false,
        catalog: "clocks-chargers",
        id: uuidv4(),
        children: [
          {
            value: "Зарядки",
            opened: false,
            catalog: "chargers",
            children: [],
            id: uuidv4(),
          },
          {
            value: "Часы",
            opened: false,
            catalog: "clocks",
            children: [],
            id: uuidv4(),
          },
        ],
      },
    ],
  },
]);
const breadcrumps: DropdownFilterType[] = reactive([dropdownFilter[0]]);
const catalogName = ref<string>(route.params.catalogName as string);
const catalog: Record<string, any>[] = reactive([]);
const products: Record<string, any>[] = reactive([]);
const currentTreeLinkId = ref<string>(dropdownFilter[0].id);

fetchCatalog();
async function fetchCatalog() {
  loading.value = true;
  try {
    const response = await fetch(
      `http://localhost:5000/catalogs/${catalogName.value}`
    );
    const data = await response.json();
    catalog.splice(0);
    catalog.push(...data);
    const allProducts = findTreeLinkAndDepth(
      currentTreeLinkId.value,
      dropdownFilter
    );
    if (isHasDepth(allProducts)) {
      products.splice(0);
      for (let item of catalog) {
        for (let catalogName of allProducts.item.catalog.split("-")) {
          products.push(...item[catalogName]);
        }
      }
    }
    loading.value = false;
  } catch (e) {
    loading.value = false;
    console.log(e);
  }
}
function treeLinkClicked(treeLink: DropdownFilterType) {
  currentTreeLinkId.value = treeLink.id;
  const isExist = !!breadcrumps.find((item) => item.id === treeLink.id);
  const clickedTreeLinkDepth = findTreeLinkAndDepth(
    treeLink.id,
    dropdownFilter
  );

  if (isHasDepth(clickedTreeLinkDepth)) {
    const depth = clickedTreeLinkDepth.depth;
    for (let i = 0; i < breadcrumps.length; i++) {
      const breadcrumpDepth = findTreeLinkAndDepth(
        breadcrumps[i].id,
        dropdownFilter
      );
      if (isHasDepth(breadcrumpDepth)) {
        if (breadcrumpDepth.depth >= depth) {
          breadcrumps.splice(i, 1);
        }
      }
    }
  }
  if (!isExist) {
    breadcrumps.push(treeLink);
  }
  const allProducts = findTreeLinkAndDepth(
    currentTreeLinkId.value,
    dropdownFilter
  );
  if (isHasDepth(allProducts)) {
    products.splice(0);
    for (let item of catalog) {
      for (let catalogName of allProducts.item.catalog.split("-")) {
        products.push(...item[catalogName]);
      }
    }
  }
}

function getInstallment(price: string): string {
  const value: string = Math.round(
    +price.replace(/[\s₸]/g, "") / 12
  ).toString();
  switch (value.length) {
    case 4:
      return `${value[0]} ${value.slice(1)} ₸`;
    case 5:
      return `${value[0]}${value[1]} ${value.slice(2)} ₸`;
    case 6:
      return `${value[0]}${value[1]}${value[2]} ${value.slice(3)} ₸`;
  }
  return value + " ₸";
}

function viewProduct(model: string) {
  const allProducts = findTreeLinkAndDepth(
    dropdownFilter[0].id,
    dropdownFilter
  );

  if (isHasDepth(allProducts)) {
    products.splice(0);
    for (let item of catalog) {
      for (let subcatalogName of allProducts.item.catalog.split("-")) {
        const foundItem = item[subcatalogName].find(
          (item: Record<string, any>) => item.model === model
        );
        if (foundItem) {
          router.push(
            `/catalogs/${catalogName.value}/${item.brand}/${subcatalogName}/${model}`
          );
        }
      }
    }
  }

  const subcatalog = catalog.forEach((item) => {});
}
</script>

<style scoped>
.wrapper {
  background-color: #fbfbfb;
  min-height: 100vh;
}

.bills {
  display: flex;
}
.price {
  border-right: 1px solid #e5e5e5;
  padding-right: 15px;
}

.price_title {
  color: #999999;
  font-size: 19px;
}
.price_value {
  font-size: 21px;
  margin-top: 15px;
  font-weight: 500;
}
.installment {
  margin-left: 15px;
}
.installment_title {
  color: #999999;
  font-size: 19px;
}
.installment_value {
  font-size: 18px;
  font-weight: 500;
  background-color: #ffd300;
  display: inline-block;
  margin-right: 5px;
  margin-top: 15px;
}

.mode {
  color: #999999;
  font-size: 16px;
}

.breadcrumps {
  display: flex;
}

.container {
  max-width: 1200px;
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.filters {
  width: 200px;
}

.products {
  width: 78%;
}

.breadcrumps {
  font-size: 25px;
  margin: 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.products_content {
  display: flex;
  flex-wrap: wrap;
}
.product {
  width: 33.333%;
  padding: 15px;
  border: 1px solid #e5e5e5;
  background: #fff;
  padding: 21px 14px;
}
.product_image {
  width: 100%;
  height: 210px;
  cursor: pointer;
  margin: 0 auto;
  object-fit: contain;
}
.product_name {
  color: #0098de;
  text-align: center;
  cursor: pointer;
  margin: 15px 0;
  font-size: 20px;
}

.product_name:hover {
  text-decoration: underline;
}

.image_separator {
  height: 1px;
  background-color: #e5e5e5;
  margin: 20px auto;
  width: 100%;
}

.breadcrump {
  color: #188ed6;
  font-size: 20px;
  cursor: pointer;
}

.breadcrump:hover {
  text-decoration: underline;
}

.active_breadcrump {
  color: #9fa19f;
  cursor: default;
}

.active_breadcrump:hover {
  text-decoration: none;
}

.breadcrump_arrow {
  color: #9a9a9a;
  margin: 0 5px;
}
</style>
