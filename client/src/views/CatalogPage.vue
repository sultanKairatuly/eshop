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
      <div class="products_container">
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
        <div class="sort">
          <select class="sort_select" v-model="sortingCriteria">
            <option class="sort_option" value="popular">Популярные</option>
            <option class="sort_option" value="price-down">
              Сначала дешевые
            </option>
            <option class="sort_option" value="price-up">
              Сначала дорогие
            </option>
          </select>
        </div>
        <EshopProductsList
          :products="sortedProducts"
          @productClicked="viewProduct"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import DropdownFilter from "../components/DropdownFilter.vue";
import type { DropdownFilterType, Product } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import { useRoute, useRouter } from "vue-router";
import { useUserUtilities } from "../composables/utilities";
import EshopLoader from "../components/EshopLoader.vue";
import EshopProductsList from "../components/EshopProductsList.vue";

const router = useRouter();
const loading = ref<boolean>(false);
const { isHasDepth, findTreeLinkAndDepth, isHasBundle } = useUserUtilities();
const route = useRoute();
const sortingCriteria = ref<string>("popular");
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

const sortedProducts = computed(() => {
  if (sortingCriteria.value === "popular") {
    return products;
  } else if (sortingCriteria.value === "price-up") {
    return sortProducts();
  } else {
    return sortProducts(true);
  }
});

function sortProducts(increment: boolean = false) {
  return [...products].sort((a, b) => {
    let aPrice: number = 0;
    let bPrice: number = 0;
    if (isHasBundle(a)) {
      aPrice = +a.current_bundle.price.replace(/[\s₸]/g, "");
    } else {
      aPrice = +a.price.replace(/[\s₸]/g, "");
    }

    if (isHasBundle(b)) {
      bPrice = +b.current_bundle.price.replace(/[\s₸]/g, "");
    } else {
      bPrice = +b.price.replace(/[\s₸]/g, "");
    }

    return increment ? aPrice - bPrice : bPrice - aPrice;
  });
}

const breadcrumps: DropdownFilterType[] = reactive([dropdownFilter[0]]);
const catalogName = ref<string>(route.params.catalogName as string);
const catalog: Record<string, any>[] = reactive([]);
const products: Product[] = reactive([]);
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
}
</script>

<style scoped>
.wrapper {
  background-color: #fbfbfb;
  min-height: 100vh;
}

.products_container {
  width: 85%;
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

.breadcrumps {
  font-size: 25px;
  margin: 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
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
