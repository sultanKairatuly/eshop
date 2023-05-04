<template>
  <div class="container">
    <div class="filters_container">
      <CatalogPageFilters
        :category-name="categoryName"
        :page="page"
        :dropdown-filter="dropdownFilter"
        :total-filter="totalFilter"
        :current-tree-link-id="currentTreeLinkId"
        :category="category"
        :catalogName="catalogName"
        :subcatalogName="subcatalogName"
        @setTotalFilterValue="setTotalFilterValue"
        @updateCurrentTreeLinkId="updateCurrentTreeLinkId"
        @updatePage="updatePage"
        @deleteTotalFilterValue="deleteTotalFilterValue"
      />
    </div>
    <div class="products_container">
      <CatalogPageProducts
        :products="products"
        :category-name="categoryName"
        :page="page"
        :dropdown-filter="props.dropdownFilter"
        :total-filter="totalFilter"
        :current-tree-link-id="props.currentTreeLinkId"
        :category="category"
        :breadcrumps="breadcrumps"
        :products-per-page="productsPerPage"
        :catalog="subcatalogName ?? catalogName"
        @updatePage="updatePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type {
  DropdownFilterType,
  totalFilterItemType,
  Product,
} from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import { useRoute, useRouter } from "vue-router";
import { useUserUtilities } from "../composables/utilities";
import { FilterType } from "../../types/types";

import { useHttpRequests } from "../composables/httpRequests";
import CatalogPageFilters from "./CatalogPageFilters.vue";
import CatalogPageProducts from "./CatalogPageProducts.vue";

const emit = defineEmits<{
  (e: "changeLoading", value: boolean): void;
  (e: "updateCurrentTreeLinkId", value: string): void;
}>();

const props = defineProps<{
  dropdownFilter: DropdownFilterType[];
  currentTreeLinkId: string;
}>();

const { isHasDepth, findTreeLinkAndDepth, isHasBundle, isHasValues } =
  useUserUtilities();
const route = useRoute();
const categoryName = route.params.category as string;
const { fetchCatalog, category } = useHttpRequests(categoryName);
let catalogName: string = route.query.catalogName as string;
let subcatalogName: string = route.query.subcatalogName as string;
const productsPerPage = 12;
const page = ref<number>(1);



const totalFilter: Record<string, totalFilterItemType> = reactive({});

const breadcrumps: DropdownFilterType[] = reactive([props.dropdownFilter[0]]);
const products: Product[] = reactive([]);
// const currentTreeLinkId = ref<string>(dropdownFilter[0].id);
fetchData();

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

function deleteTotalFilterValue(property: string) {
  delete totalFilter[property];
  console.log(totalFilter);
}

function setTotalFilterValue(value: {
  property: string;
  data:
    | {
        values: string[];
        type: FilterType;
      }
    | boolean;
}) {
  totalFilter[value.property] = value.data;
}

function updateCurrentTreeLinkId(id: string) {
  // props.currentTreeLinkId = id;
  emit("updateCurrentTreeLinkId", id);
}

function updatePage(newPage: number) {
  page.value = newPage;
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
  const result = traverse(props.dropdownFilter[0], 0);
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
      props.dropdownFilter,
      1,
      category
    );
    // currentTreeLinkId.value = isHasDepth(foundTreeLink)
    //   ? foundTreeLink.item.id
    //   : dropdownFilter[0].id;

    if (isHasDepth(foundTreeLink)) {
      emit("updateCurrentTreeLinkId", foundTreeLink.item.id);
    } else {
      emit("updateCurrentTreeLinkId", props.dropdownFilter[0].id);
    }
  }
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

async function fetchData() {
  try {
    emit("changeLoading", true);
    await fetchCatalog();
    fetchProducts();
  } catch (e) {
    console.log(e);
  } finally {
    emit("changeLoading", false);
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
</script>

<style scoped>
.products_container {
  width: 77%;
}

.filters_container {
  width: 20%;
}
</style>
