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
            :key="breadcrump.category"
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
        <SortingSelect
          :model-value="sortingCriteria"
          @update:modelValue="updateSortingCriteria"
        />
        <EshopProductsList
          :products="sortedProducts"
          @productClicked="viewProduct"
        />
        <div class="pagination">
          <div class="pagination_item prev_pag" @click="decrementPage">
            ← Предыдущая
          </div>
          <div
            class="pagination_item"
            v-for="pag in Math.ceil(products.length / productsPerPage)"
            :key="pag"
            @click="page = pag"
            :class="{
              'pagination_item-active': pag === page,
            }"
          >
            {{ pag }}
          </div>
          <div class="pagination_item next_pag" @click="incrementPage">
            Следующая →
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import DropdownFilter from "../components/DropdownFilter.vue";
import type { DropdownFilterType, Product } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import { useRoute, useRouter } from "vue-router";
import { useUserUtilities } from "../composables/utilities";
import EshopLoader from "../components/EshopLoader.vue";
import EshopProductsList from "../components/EshopProductsList.vue";
import SortingSelect from "../components/SortingSelect.vue";

const { isHasDepth, findTreeLinkAndDepth, isHasBundle } = useUserUtilities();
const router = useRouter();
const route = useRoute();
let catalogName = route.query.catalogName as string;
let subcatalogName = route.query.subcatalog as string;
const loading = ref<boolean>(false);
const sortingCriteria = ref<string>("popular");
const productsPerPage = 12;
const page = ref<number>(1);

watch(
  () => route.query,
  (newQueries) => {
    handleRouteQueryUpdating(
      newQueries.catalogName as string,
      newQueries.subcatalogName as string
    );
  }
);

function decrementPage() {
  if (page.value !== 1) {
    page.value--;
  }
}

function incrementPage() {
  if (page.value !== Math.ceil(products.length / productsPerPage)) {
    page.value++;
  }
}

const dropdownFilter: DropdownFilterType[] = reactive([
  {
    value: "Телефоны и гаджеты",
    category: "mobiles-clocks-chargers",
    opened: false,
    id: uuidv4(),
    children: [
      {
        value: "Телефоны",
        opened: false,
        category: "mobiles",
        children: [],
        id: uuidv4(),
      },
      {
        value: "Гаджеты",
        opened: false,
        category: "clocks-chargers",
        id: uuidv4(),
        children: [
          {
            value: "Зарядки",
            opened: false,
            category: "chargers",
            children: [],
            id: uuidv4(),
          },
          {
            value: "Часы",
            opened: false,
            category: "clocks",
            children: [],
            id: uuidv4(),
          },
        ],
      },
    ],
  },
]);

const breadcrumps: DropdownFilterType[] = reactive([dropdownFilter[0]]);
const categoryName = ref<string>(route.params.category as string);
const category: Record<string, any>[] = reactive([]);
const products: Product[] = reactive([]);
const currentTreeLinkId = ref<string>(dropdownFilter[0].id);
const paginatedProducts = computed(() => {
  return products.slice(
    (page.value - 1) * productsPerPage,
    (page.value - 1) * productsPerPage + 12
  );
});

const sortedProducts = computed(() => {
  if (sortingCriteria.value === "popular") {
    return paginatedProducts.value;
  } else if (sortingCriteria.value === "price-up") {
    return sortProducts();
  } else {
    return sortProducts(true);
  }
});

watch(page, (newPage) => {
  console.log(
    products.slice(
      (page.value - 1) * productsPerPage,
      page.value * productsPerPage + 12
    )
  );
  console.log(products.length);
});

fetchCatalog();

function updateSortingCriteria(value: string) {
  sortingCriteria.value = value;
}

function handleRouteQueryUpdating(newCatalog: string, newSubCatalog: string) {
  catalogName = newCatalog;
  subcatalogName = newSubCatalog;
  products.splice(0);
  for (let item of category) {
    if (!subcatalogName) {
      for (let categoryName of catalogName.split("-")) {
        products.push(...item[categoryName]);
      }
    } else {
      for (let subcatalog of subcatalogName.split("-")) {
        products.push(...item[subcatalog]);
      }
    }
  }
}
function sortProducts(increment: boolean = false) {
  return [...paginatedProducts.value].sort((a, b) => {
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

async function fetchCatalog() {
  loading.value = true;
  try {
    const response = await fetch(
      `http://localhost:5000/c/${categoryName.value}`
    );
    const data = await response.json();
    category.splice(0);
    category.push(...data);
    products.splice(0);

    if (catalogName) {
      for (let categoryName of catalogName.split("-")) {
        products.push(...category[0][categoryName]);
      }
    } else {
      const allProducts = findTreeLinkAndDepth(
        currentTreeLinkId.value,
        dropdownFilter
      );
      if (isHasDepth(allProducts)) {
        for (let item of category) {
          for (let catalogName of allProducts.item.category.split("-")) {
            products.push(...item[catalogName]);
          }
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
    for (let item of category) {
      for (let categoryName of allProducts.item.category.split("-")) {
        products.push(...item[categoryName]);
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
    for (let item of category) {
      for (let catalogName of allProducts.item.category.split("-")) {
        const foundItem = item[catalogName].find(
          (item: Record<string, any>) => item.model === model
        );
        if (foundItem) {
          router.push(
            `/c/${categoryName.value}/${item.brand}/${catalogName}/${model}`
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

.pagination {
  display: flex;
  justify-content: center;
  margin: 50px 0;
}

.pagination_item {
  padding: 10px 25px;
  font-size: 20px;
  border: 1px solid #fff;
  border-left: 1px solid #dcdcdc;
  cursor: pointer;
  border-radius: 0;
}

.pagination_item:hover {
  border-radius: 3px;
  border: 1px solid #dcdcdc;
  color: #000077;
  background-color: #e6e6e6;
}

.next_pag {
  border-right: 1px solid #dcdcdc;
}

.pagination_item-active {
  border-radius: 3px;
  border: 1px solid #dcdcdc;
  color: #000077;
  background-color: #e6e6e6;
}
</style>
