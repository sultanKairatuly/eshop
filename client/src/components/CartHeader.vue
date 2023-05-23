<template>
  <header class="header">
    <h2 class="title">{{ $t('cart.headerTitle') }}({{ props.cartItems }})</h2>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  cartItems: number;
}>();
</script>
<style scoped>
.header {
  padding: 30px 0;
}
</style>
