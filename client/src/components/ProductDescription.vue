<template>
  <div class="description">{{ props.product.description }}</div>
</template>

<script setup lang="ts">
import { Product } from "../../types/types";

const props = defineProps<{
  product: Product;
}>();
</script>

<style scoped>
.description {
}
</style>
