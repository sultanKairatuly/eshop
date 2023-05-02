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
        <ProductFilters
          @changePriceFilter="changePriceFilter"
          :categories="category"
          :catalogs="catalogName ?? subcatalogName"
          @filterProducts="filterProducts"
        />
      </div>
      <div class="products_container">
        <ProductsBreadcrumps
          :breadcrumps="breadcrumps"
          :currentTreeLinkId="currentTreeLinkId"
          @breadcrumpClicked="breadcrumpClicked"
        />
        <SortingSelect
          :model-value="sortingCriteria"
          @update:modelValue="updateSortingCriteria"
        />
        <EshopProductsList
          :products="sortedProducts"
          @productClicked="handleProductClick"
        />
        <ProductsPagination
          :products="filtered"
          :page="page"
          @updatePage="updatePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onUnmounted } from "vue";
import DropdownFilter from "../components/DropdownFilter.vue";
import type {
  DropdownFilterType,
  Filter,
  totalFilterItemType,
  Product,
} from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import { useRoute, useRouter } from "vue-router";
import { useUserUtilities } from "../composables/utilities";
import EshopLoader from "../components/EshopLoader.vue";
import EshopProductsList from "../components/EshopProductsList.vue";
import SortingSelect from "../components/SortingSelect.vue";
import ProductsPagination from "../components/ProductsPagination.vue";
import ProductsBreadcrumps from "../components/ProductsBreadcrumps.vue";
import { useHttpRequests } from "../composables/httpRequests";
import ProductFilters from "../components/ProductFilters.vue";

const { isHasDepth, findTreeLinkAndDepth, isHasBundle } = useUserUtilities();
const router = useRouter();
const route = useRoute();
const categoryName = route.params.category as string;
const { fetchCatalog, category } = useHttpRequests(categoryName);
let catalogName = route.query.catalogName as string;
let subcatalogName = route.query.subcatalogName as string;
const loading = ref<boolean>(false);
const sortingCriteria = ref<string>("popular");
const productsPerPage = 12;
const page = ref<number>(1);
const minPrice = ref<number>(0);
const maxPrice = ref<number>(Infinity);
const scrollYCoordinates = ref<number>(window.scrollY);
document.addEventListener("scroll", () => {
  scrollYCoordinates.value = window.scrollY;
});
const totalFilter: {
  [key: string]: totalFilterItemType;
} = reactive({});

onUnmounted(() => {
  document.removeEventListener("scroll", () => {
    scrollYCoordinates.value = window.scrollY;
  });
});

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

const filtered = computed(() => {
  if (totalFilter.empty || Object.keys(totalFilter).length === 0) {
    return products;
  }
  const r: Product[] = [];
  products.forEach((product) => {
    const candidates = [];
    for (let key in totalFilter) {
      if (key !== "empty") {
        let match = 0;
        if (typeof totalFilter[key] !== "boolean" && key !== "empty") {
          if (
            (totalFilter[key] as Exclude<totalFilterItemType, boolean>).type ===
            "default"
          ) {
            (
              totalFilter[key] as Exclude<totalFilterItemType, boolean>
            ).values.forEach((item) => {
              if (!product[key as keyof Product].includes(item)) {
              } else {
                match++;
              }
            });
          } else {
            //! HERE IS THE TYPE OF FILTER === 'RANGE'
            console.log("Range type is not expected");
          }
        }
        candidates.push(match);
      }
    }
    const matches = candidates.reduce((acc, i) => (acc += i));
    if (matches === candidates.length) {
      r.push(product);
    }
  });

  return r;
});

const paginatedProducts = computed(() => {
  return filtered.value.slice(
    (page.value - 1) * productsPerPage,
    (page.value - 1) * productsPerPage + 12
  );
});

const breadcrumps: DropdownFilterType[] = reactive([dropdownFilter[0]]);
const products: Product[] = reactive([]);
fetchData();
const currentTreeLinkId = ref<string>(dropdownFilter[0].id);
const filteredProducts = computed(() => {
  const filtered: Product[] = [];
  products.forEach((product) => {
    if (isHasBundle(product)) {
      const productPrice: number = +product.current_bundle.price.replace(
        /[\s₸]/g,
        ""
      );
      if (productPrice > minPrice.value && productPrice < maxPrice.value) {
        filtered.push(product);
      }
    } else {
      const productPrice: number = +product.price.replace(/[\s₸]/g, "");
      if (productPrice > minPrice.value && productPrice < maxPrice.value) {
        filtered.push(product);
      }
    }
  });
  return filtered;
});

function changePriceFilter({ min, max }: { min: number; max: number }) {
  page.value = 1;
  minPrice.value = min;
  maxPrice.value = max;
}

watch(
  () => route.query,
  (newQueries) => {
    handleRouteQueryUpdating(
      newQueries.catalogName as string,
      newQueries.subcatalogName as string
    );
    updateCurrentLinkId();
  },
  {
    immediate: true,
  }
);

const sortedProducts = computed(() => {
  if (sortingCriteria.value === "popular") {
    return paginatedProducts.value;
  } else if (sortingCriteria.value === "price-up") {
    return sortProducts();
  } else {
    return sortProducts(true);
  }
});

function filterProducts(filter: {
  property: string;
  values: any[];
  empty: boolean;
  type: "default" | "range";
}) {
  console.log(filter.values);
  if (filter.values.length) {
    totalFilter[filter.property] = {
      values: filter.values,
      type: filter.type,
    };
  } else {
    delete totalFilter[filter.property];
  }

  totalFilter["empty"] = filter.empty;
}

function breadcrumpClicked(id: string) {
  const foundTreeLink = findTreeLinkAndDepth(id, dropdownFilter);
  if (isHasDepth(foundTreeLink)) {
    const queryKey = foundTreeLink.depth > 1 ? "subcatalogName" : "catalogName";
    router.push({
      path: `/c/${categoryName}`,
      query: { [queryKey]: foundTreeLink.item.category },
    });
  }
}

function findTreeLinkParentChain(category: string): DropdownFilterType[] {
  let parentChain: (DropdownFilterType & { depth: number })[] = [];
  const traverse = (
    node: DropdownFilterType,
    depth: number
  ): DropdownFilterType | null => {
    if (node.category === category) {
      return node;
    } else if (node.children) {
      for (const child of node.children) {
        const result = traverse(child, depth + 1);
        if (result !== null) {
          parentChain.push({ ...node, depth });
          return result;
        }
      }
    }
    return null;
  };
  const result = traverse(dropdownFilter[0], 0);
  if (result !== null) {
    parentChain.push({ ...result, depth: parentChain.length });
  }
  return parentChain.sort((a, b) => a.depth - b.depth);
}

function updateCurrentLinkId() {
  if (subcatalogName || catalogName) {
    breadcrumps.splice(0);
    let category = subcatalogName ?? catalogName;
    if (findTreeLinkParentChain(category)) {
      breadcrumps.push(...findTreeLinkParentChain(category));
    }

    const foundTreeLink = findTreeLinkAndDepth(
      "blank",
      dropdownFilter,
      1,
      category
    );
    currentTreeLinkId.value = isHasDepth(foundTreeLink)
      ? foundTreeLink.item.id
      : dropdownFilter[0].id;
  }
}

function updatePage(updatedPage: number) {
  page.value = updatedPage;
  const capturedScrollYCoordinates: number = scrollYCoordinates.value;
  setTimeout(() => {
    window.scroll({ top: capturedScrollYCoordinates });
  }, 0);
}

function updateSortingCriteria(value: string) {
  sortingCriteria.value = value;
}

function handleRouteQueryUpdating(newCatalog: string, newSubCatalog: string) {
  page.value = 1;
  catalogName = newCatalog;
  subcatalogName = newSubCatalog;
  products.splice(0);
  if (!subcatalogName) {
    for (let categoryName of catalogName.split("-")) {
      for (let i = 0; i < category.length; i++) {
        if (category[i].category === categoryName) {
          products.push(...category[i].products);
        }
      }
    }
  } else {
    for (let categoryName of subcatalogName.split("-")) {
      for (let i = 0; i < category.length; i++) {
        if (category[i].category === categoryName) {
          products.push(...category[i].products);
        }
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

async function fetchData() {
  try {
    loading.value = true;
    await fetchCatalog();
    fetchProducts();
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

function fetchProducts() {
  try {
    products.splice(0);
    if (catalogName || subcatalogName) {
      for (let categoryName of (catalogName ?? subcatalogName).split("-")) {
        for (let i = 0; i < category.length; i++) {
          if (category[i].category === categoryName) {
            products.push(...category[i].products);
          }
        }
      }
    } else {
      console.log("We need `catalogName` or `subcatalogName` query parameter!");
    }
  } catch (err) {
    console.log(err);
  }
}

function treeLinkClicked(treeLink: DropdownFilterType) {
  currentTreeLinkId.value = treeLink.id;
  const currentTreeLinkDepth = findTreeLinkAndDepth(
    treeLink.id,
    dropdownFilter
  );
  if (isHasDepth(currentTreeLinkDepth)) {
    if (currentTreeLinkDepth.depth > 1) {
      router.push({
        path: `/c/${categoryName}`,
        query: { ["subcatalogName"]: treeLink.category },
      });
    } else {
      router.push({
        path: `/c/${categoryName}`,
        query: { ["catalogName"]: treeLink.category },
      });
    }
  }
}

function handleProductClick(model: string) {
  // const allProducts = findTreeLinkAndDepth(
  //   dropdownFilter[0].id,
  //   dropdownFilter
  // );

  // if (isHasDepth(allProducts)) {
  //   products.splice(0);
  //   for (let item of category) {
  //     for (let catalogName of allProducts.item.category.split("-")) {
  //       const foundItem = item[catalogName].find(
  //         (item: Record<string, any>) => item.model === model
  //       );
  //       if (foundItem) {
  //         router.push(
  //           `/c/${categoryName.value}/${catalogName ?? subcatalogName}/${model}`
  //         );
  //       }
  //     }
  //   }
  // }
  router.push(`/c/${categoryName}/${catalogName ?? subcatalogName}/${model}`);
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

.not-found {
  padding: 30px 0;
}
</style>
