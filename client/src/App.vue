<template>
  <div class="app">
    <EshopHeader
      v-if="isHeader"
      @findProducts="findProducts"
      @clearSearch="clearSearch"
    />
    <EshopHeaderTop v-else />
    <router-view
      :dropdown-filter="dropdownFilter"
      :current-tree-link-id="currentTreeLinkId"
      :foundProducts="foundProducts"
      :loading="loading"
      @updateCurrentTreeLinkId="updateCurrentTreeLinkId"
      @changeLoader="changeLoader"
      @changeCurrentTreeLinkId="changeCurrentTreeLinkId"
      @openDropdown="openDropdown"
    ></router-view>
    <EshopFooter />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, watch, computed, reactive, provide } from "vue";
import { v4 as uuidv4 } from "uuid";
import { DropdownFilterType, Product } from "../types/types";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useUserUtilities } from "./composables/utilities";
import { useUserStore } from "./stores/user";
import EshopHeader from "./components/EshopHeader.vue";
import EshopFooter from "./components/EshopFooter.vue";
import EshopHeaderTop from "./components/EshopHeaderTop.vue";

const { findTreeLinkAndDepth, isHasDepth } = useUserUtilities();
const i18n = useI18n();
const userStore = useUserStore();
setTimeout(() => {
  userStore.changeLocale(userStore.activeLocale);
}, 0);

const categoriesNames = computed(() => ({
  smartphones_and_gadgets: {
    value: i18n.t("headerBottom.smartphones_and_gadgets.value"),
    children: {
      smartphones: {
        value: i18n.t(
          "headerBottom.smartphones_and_gadgets.children.smartphones.value"
        ),
        children: {},
      },
      gadgets: {
        value: i18n.t(
          "headerBottom.smartphones_and_gadgets.children.gadgets.value"
        ),
        children: {
          chargers: {
            value: i18n.t(
              "headerBottom.smartphones_and_gadgets.children.gadgets.children.chargers.value"
            ),
            children: {},
          },
          clocks: {
            value: i18n.t(
              "headerBottom.smartphones_and_gadgets.children.gadgets.children.clocks.value"
            ),
            children: {},
          },
        },
      },
    },
  },
  tv_audio_video: {
    value: "ТВ, аудио, видео",
    children: {},
  },
  computers: {
    value: "компьютерлер",
    children: {},
  },
  furniture: {
    value: "жиһаз",
    children: {},
  },
  food: {
    value: "азық-түлік",
    children: {},
  },
  technics: {
    value: "Тұрмыстық техника",
    children: {},
  },
}));

provide("categoriesNames", categoriesNames);

watch(categoriesNames, () => {
  console.log(categoriesNames.value);
});

const dropdownFilter = reactive([
  {
    value: "smartphones_and_gadgets.value",
    category: "mobiles-clocks-chargers",
    opened: false,
    id: uuidv4(),
    children: [
      {
        value: "smartphones_and_gadgets.children.smartphones.value",
        opened: false,
        category: "mobiles",
        children: [],
        id: uuidv4(),
      },
      {
        value: "smartphones_and_gadgets.children.gadgets.value",
        opened: false,
        category: "clocks-chargers",
        id: uuidv4(),
        children: [
          {
            value:
              "smartphones_and_gadgets.children.gadgets.children.chargers.value",
            opened: false,
            category: "chargers",
            children: [],
            id: uuidv4(),
          },
          {
            value:
              "smartphones_and_gadgets.children.gadgets.children.clocks.value",
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

const foundProducts = ref<null | Product[]>(null);
const currentTreeLinkId = ref<string>(dropdownFilter[0].id);
const isHeader = ref<boolean>(true);
const loading = ref<boolean>(false);
const route = useRoute();

watch(
  () => route.path,
  (newPath: string) => {
    if (newPath.includes("signup") || newPath.includes("signin")) {
      isHeader.value = false;
    } else {
      isHeader.value = true;
    }
  },
  {
    immediate: true,
  }
);

function updateCurrentTreeLinkId(id: string) {
  currentTreeLinkId.value = id;
}

function changeCurrentTreeLinkId(id: string) {
  currentTreeLinkId.value = id;
}
function changeLoader(loaderValue: boolean) {
  loading.value = loaderValue;
}

async function findProducts(search: string) {
  loading.value = true;
  const response = await axios.get(
    `http://localhost:5000/getproductbyname/${search}`
  );
  foundProducts.value = response.data;
  loading.value = false;
}

function clearSearch() {
  foundProducts.value = null;
}

function openDropdown(id: string) {
  const treeLink = findTreeLinkAndDepth(id, dropdownFilter);
  console.log("id", id);
  if (isHasDepth(treeLink)) {
    treeLink.item.opened = !treeLink.item.opened;
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");

.app {
  position: relative;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
}
</style>
