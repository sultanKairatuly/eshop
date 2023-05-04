<template>
  <div class="wrapper">
    <EshopLoader v-if="loading" />
    <div class="container">
      <CatalogPageContent
        :dropdown-filter="props.dropdownFilter"
        :loading="loading"
        :currentTreeLinkId="props.currentTreeLinkId"
        @changeLoading="changeLoading"
        @updateCurrentTreeLinkId="updateCurrentTreeLinkId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CatalogPageContent from "../components/CatalogPageContent.vue";
import { DropdownFilterType } from "../../types/types";

const props = defineProps<{
  dropdownFilter: DropdownFilterType[];
  currentTreeLinkId: string;
}>();
const emit = defineEmits<{
  (e: "updateCurrentTreeLinkId", value: string): void;
}>();

const loading = ref<boolean>(false);

function changeLoading(loadingValue: boolean) {
  loading.value = loadingValue;
}

function updateCurrentTreeLinkId(id: string) {
  emit("updateCurrentTreeLinkId", id);
}
</script>

<style scoped>
.wrapper {
  background-color: #fbfbfb;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0px auto;
  display: flex;
  padding-top: 30px;
  justify-content: space-between;
}

.not-found {
  padding: 30px 0;
}
</style>
