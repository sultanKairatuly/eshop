<template>
  <div class="products">
    <ProductsBreadcrumps
      :breadcrumps="props.breadcrumps"
      :currentTreeLinkId="props.currentTreeLinkId"
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
      :page="props.page"
      @updatePage="updatePage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import EshopProductsList from "./EshopProductsList.vue";
import SortingSelect from "./SortingSelect.vue";
import ProductsPagination from "./ProductsPagination.vue";
import ProductsBreadcrumps from "./ProductsBreadcrumps.vue";
import {
  Category,
  Product,
  totalFilterItemType,
  DropdownFilterType,
} from "../../types/types";
import { useUserUtilities } from "../composables/utilities";

const router = useRouter();

const { isHasDepth, findTreeLinkAndDepth, isHasBundle, isHasValues } =
  useUserUtilities();

const scrollYCoordinates = ref<number>(window.scrollY);
document.addEventListener("scroll", () => {
  scrollYCoordinates.value = window.scrollY;
});

onUnmounted(() => {
  document.removeEventListener("scroll", () => {
    scrollYCoordinates.value = window.scrollY;
  });
});

const props = withDefaults(
  defineProps<{
    products: Product[];
    page: number;
    category: Category[];
    catalog: string;
    totalFilter: Record<string, totalFilterItemType>;
    productsPerPage?: number;
    breadcrumps: DropdownFilterType[];
    currentTreeLinkId: string;
    dropdownFilter: DropdownFilterType[];
    categoryName: string;
  }>(),
  {
    productsPerPage: 12,
  }
);

const emit = defineEmits<{
  (e: "updatePage", value: number): void;
}>();
const sortingCriteria = ref<string>("popular");
const filtered = computed(() => {
  if (props.totalFilter.empty || Object.keys(props.totalFilter).length === 0) {
    return props.products;
  }
  const r: Product[] = [];
  props.products.forEach((product) => {
    const candidates = [];
    for (let key in props.totalFilter) {
      if (key !== "empty") {
        let match = 0;
        if (typeof props.totalFilter[key] !== "boolean" && key !== "empty") {
          let trueKey = "";
          for (let i = 0; i < key.split("|").length; i++) {
            if (
              product[key.replace(/\.\w+/, "").split("|")[i] as keyof Product]
            ) {
              trueKey = key.split("|")[i];
            }
          }
          if (
            (props.totalFilter[key] as Exclude<totalFilterItemType, boolean>)
              .type === "default"
          ) {
            (
              props.totalFilter[key] as Exclude<totalFilterItemType, boolean>
            ).values.forEach((item) => {
              if (!product[trueKey as keyof Product]?.includes(item)) {
              } else {
                match++;
              }
            });
          } else {
            //! HERE IS THE TYPE OF FILTER === 'RANGE'
            const values = (
              props.totalFilter[key] as Exclude<totalFilterItemType, boolean>
            ).values
              .flatMap((item) => item.split("-"))
              .map(Number);
            const maxValue = Math.max(...values);
            const minValue = Math.min(...values);
            let key1 = "";
            let key2 = "";
            let productKey: string = "";
            let priceAsNumber: number = 0;

            if (trueKey.split(".").length > 1) {
              [key1, key2] = trueKey.split(".");
              productKey = product[key1 as keyof Product]?.[
                key2 as string
              ] as string;
            } else {
              productKey = product[trueKey as keyof Product] as string;
            }

            if (typeof productKey === "string") {
              priceAsNumber = +productKey.replace(/[\s₸]/g, "");
            }
            if (priceAsNumber < maxValue && priceAsNumber > minValue) {
              match++;
            }
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
  const pageCopy = props.page;
  return filtered.value.slice(
    (pageCopy - 1) * props.productsPerPage,
    (pageCopy - 1) * props.productsPerPage + 12
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

function breadcrumpClicked(id: string) {
  const foundTreeLink = findTreeLinkAndDepth(id, props.dropdownFilter);
  if (isHasDepth(foundTreeLink)) {
    const queryKey = foundTreeLink.depth > 1 ? "subcatalogName" : "catalogName";
    router.push({
      path: `/c/${props.categoryName}`,
      query: { [queryKey]: foundTreeLink.item.category },
    });
  }
}

function updatePage(updatedPage: number) {
  //   page.value = updatedPage;
  emit("updatePage", updatedPage);
  const capturedScrollYCoordinates: number = scrollYCoordinates.value;
  setTimeout(() => {
    window.scroll({ top: capturedScrollYCoordinates });
  }, 0);
}

function updateSortingCriteria(value: string) {
  sortingCriteria.value = value;
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

function handleProductClick(value: { model: string; category: string }) {
  router.push(`/c/${props.categoryName}/${value.category}/${value.model}`);
}
</script>

<style scoped>
.breadcrumps {
  display: flex;
}
</style>
