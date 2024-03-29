<template>
  <div
    class="header_bottom"
    :class="{
      unhovered: hoveredCategory,
    }"
  >
    <div class="header_bottom_content">
      <div
        class="category"
        :key="category.name"
        v-for="(category, index) in categories"
        @click="
          $router.push({
            path: `/c/${category.value}`,
            query: {
              catalogName: category.category,
            },
          })
        "
        :class="{
          'left-bordered': index === 0,
          hovered: category.id === hoveredCategory?.id,
        }"
        @mouseleave="changeHoveredCategory(null)"
        @mouseenter="changeHoveredCategory(category)"
      >
        {{ category.name }}
      </div>
      <CategoryExplorer
        @mouseleave="changeHoveredCategory"
        @mouseenter="changeHoveredCategory(hoveredCategory)"
        :category="hoveredCategory"
        @routeToProducts="clearHoveredCategory"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { CategoryExplorerType } from "../../types/types";
import CategoryExplorer from "./CategoryExplorer.vue";
import { useI18n } from "vue-i18n";
import messages from "../../translation.json";

const { t } = useI18n({
  messages,
  locale: "kz",
});
const hoveredCategory = ref<null | CategoryExplorerType>(null);
const tillHovered = ref<boolean>(false);
function clearHoveredCategory() {
  hoveredCategory.value = null;
}


const categories = computed<CategoryExplorerType[]>(() => [
  {
    name: t("headerBottom.smartphones_and_gadgets.value"),
    category: "mobiles-clocks-chargers",
    value: "smartphones_and_gadgets",
    id: uuidv4(),
    children: [
      {
        name: t(
          "headerBottom.smartphones_and_gadgets.children.smartphones.value"
        ),
        category: "mobiles",
        children: [],
        id: uuidv4(),
      },
      {
        name: t("headerBottom.smartphones_and_gadgets.children.gadgets.value"),
        category: "clocks-chargers",
        id: uuidv4(),
        children: [
          {
            name: t(
              "headerBottom.smartphones_and_gadgets.children.gadgets.children.chargers.value"
            ),
            category: "chargers",
            children: [],
            id: uuidv4(),
          },
          {
            name: t(
              "headerBottom.smartphones_and_gadgets.children.gadgets.children.clocks.value"
            ),
            category: "clocks",
            children: [],
            id: uuidv4(),
          },
        ],
      },
    ],
  },
  {
    name: t("headerBottom.tv_audio_video.value"),
    category: "",
    children: [],
    id: uuidv4(),
  },
  {
    name: t("headerBottom.computers.value"),
    category: "",
    children: [],
    id: uuidv4(),
  },

  {
    name: t("headerBottom.furniture.value"),
    category: "",
    children: [],
    id: uuidv4(),
  },
  {
    name: t("headerBottom.food.value"),
    category: "",
    children: [],
    id: uuidv4(),
  },
]);

function changeHoveredCategory(category: CategoryExplorerType | null = null) {
  tillHovered.value = category ? true : false;
  const timeout = setTimeout(() => {
    if (tillHovered.value) {
      hoveredCategory.value = category;
    } else {
      hoveredCategory.value = null;
    }
  }, 500);
}
</script>

<style scoped>
.header_bottom {
  width: 100%;
  border-top: 2px solid #e5e5e5;
  border-bottom: 2px solid #e5e5e5;
  background-color: #fbfbfb;
}
.header_bottom_content {
  margin: 0 auto;
  width: 80%;
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  row-gap: 0;
}
.category {
  text-transform: uppercase;
  border-right: 1px solid #e5e5e5;
  color: #319ad8;
  font-weight: 600;
  text-align: center;
  padding: 15px;
  width: 25%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.left-bordered {
  border-left: 1px solid #e5e5e5;
}

.hovered {
  background-color: #fff;
  position: relative;
}

.hovered::before {
  content: "";
  background-color: #000;
  height: 4px;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
}
.unhovered {
  background-color: #f5f5f5;
}
</style>
