<template>
  <div class="cart_container">
    <div class="cart_content">
      <CartHeader :cartItems="userStore.user.cart.length" />
      <div v-if="userStore.user.cart.length">
        <CartitemList />
        <CartFooter class="footer" />
      </div>
      <CartEmpty v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";
import CartHeader from "../components/CartHeader.vue";
import CartitemList from "../components/CartitemList.vue";
import CartEmpty from "../components/CartEmpty.vue";
import CartFooter from "../components/CartFooter.vue";

const userStore = useUserStore();
</script>

<style scoped>
.cart_container {
  min-height: 100vh;
}
.cart_content {
  max-width: 1200px;
  width: 80%;
  margin: 0 auto;
  padding-bottom: 40px;
}

.footer {
  margin-top: 50px;
}
</style>
