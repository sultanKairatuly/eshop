<template>
  <div class="app">
    <EshopHeader
      v-if="isHeader"
      @findProducts="findProducts"
      @clearSearch="clearSearch"
    />
    <router-view
      :dropdown-filter="dropdownFilter"
      :current-tree-link-id="currentTreeLinkId"
      :foundProducts="foundProducts"
      :loading="loading"
      @updateCurrentTreeLinkId="updateCurrentTreeLinkId"
      @changeLoader="changeLoader"
      @changeCurrentTreeLinkId="changeCurrentTreeLinkId"
    ></router-view>
    <EshopFooter />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, watch, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import { DropdownFilterType, Product } from "../types/types";
import axios from "axios";
import EshopHeader from "./components/EshopHeader.vue";
import EshopFooter from "./components/EshopFooter.vue";

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
