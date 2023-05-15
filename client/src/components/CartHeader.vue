<template>
  <header class="header">
    <h2 class="title">Ваша корзина({{ props.cartItems }})</h2>
  </header>
</template>

<script setup lang="ts">
import { Product } from "../../types/types";

const props = defineProps<{
  cartItems: number;
}>();
</script>
<style scoped></style>
