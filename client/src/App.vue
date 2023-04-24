<template>
  <div class="app">
    <EshopHeader v-if="isHeader" />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import EshopHeader from "./components/EshopHeader.vue";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

const isHeader = ref<boolean>(true);
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
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
}
</style>
