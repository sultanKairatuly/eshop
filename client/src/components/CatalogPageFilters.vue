<template>
  <div class="filters">
    <DropdownFilter
      :active-id="currentTreeLinkId"
      :dropdown-filter="dropdownFilter"
      @treeLinkClicked="treeLinkClicked"
    />
    <ProductFilters
      :categories="props.category"
      @filterProducts="filterProducts"
    />
  </div>
</template>

<script setup lang="ts">
import ProductFilters from "../components/ProductFilters.vue";
import DropdownFilter from "../components/DropdownFilter.vue";
import {
  Category,
  DropdownFilterType,
  FilterType,
  totalFilterItemType,
} from "../../types/types";
import { useUserUtilities } from "../composables/utilities";
import { useRouter } from "vue-router";

const router = useRouter();
const { isHasDepth, findTreeLinkAndDepth } = useUserUtilities();
const props = defineProps<{
  category: Category[];
  totalFilter: Record<string, totalFilterItemType>;
  currentTreeLinkId: string;
  dropdownFilter: DropdownFilterType[];
  categoryName: string;
  page: number;
  catalog?: string;
}>();

const emit = defineEmits<{
  (e: "updateCurrentTreeLinkId", value: string): void;
  (e: "updatePage", value: number): void;
  (
    e: "setTotalFilterValue",
    value: {
      property: string;
      data:
        | {
            values: string[];
            type: FilterType;
          }
        | boolean;
    }
  ): void;
  (e: "deleteTotalFilterValue", value: string): void;
}>();

function treeLinkClicked(treeLink: DropdownFilterType) {
  //   props.currentTreeLinkId = treeLink.id;
  emit("updateCurrentTreeLinkId", treeLink.id);
  const currentTreeLinkDepth = findTreeLinkAndDepth(
    treeLink.id,
    props.dropdownFilter
  );
  if (isHasDepth(currentTreeLinkDepth)) {
    if (currentTreeLinkDepth.depth > 1) {
      router.push({
        path: `/c/${props.categoryName}`,
        query: { ["subcatalogName"]: treeLink.category },
      });
    } else {
      router.push({
        path: `/c/${props.categoryName}`,
        query: { ["catalogName"]: treeLink.category },
      });
    }
  }
}

function filterProducts(filter: {
  property: string;
  values: any[];
  empty: boolean;
  type: "default" | "range";
}) {
  emit("updatePage", 1);
  if (filter.values.length) {
    const data: { values: string[]; type: FilterType } = {
      values: filter.values,
      type: filter.type,
    };
    emit("setTotalFilterValue", { property: filter.property, data });
  } else {
    emit("deleteTotalFilterValue", filter.property);
  }

  emit("setTotalFilterValue", {
    property: "empty",
    data: filter.empty,
  });
}
</script>

<style scoped></style>
