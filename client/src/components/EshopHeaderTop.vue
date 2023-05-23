<template>
  <div class="header_top">
    <div class="header_top_container">
      <div class="profile" v-if="userStore.user">
        <div class="avatar_container">
          <img :src="userStore.user?.photoURL" class="avatar" />
        </div>
        <div class="name">
          {{
            userStore.user?.email
              ? userStore.user.displayName
              : userStore.user.displayName[userStore.activeLocale]
          }}
        </div>
        <button
          class="auth_btn"
          v-if="isUser(userStore.user)"
          @click="logoutUser"
        >
          {{ $t("headerTop.logout") }}
        </button>
        <button class="auth_btn" @click="$router.push('/signin')" v-else>
          {{ $t("headerTop.login") }}
        </button>
        <button class="cart_btn" @click="$router.push('/cart')">
          <div class="unchecked">{{ uncheckedProductsLength }}</div>
          <i class="fa-solid fa-cart-shopping"></i>
        </button>
      </div>
      <div class="lang">
        <div
          class="lang_item"
          v-for="locale in locales"
          :key="locale.value"
          :class="{
            active_lang: userStore.activeLocale === locale.value,
          }"
          @click="changeLocale(locale.value)"
        >
          {{ locale.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";
import { useUserUtilities } from "../composables/utilities";
import { computed, ref, reactive } from "vue";
import { Product } from "../../types/types";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const userStore = useUserStore();
const { isUser } = useUserUtilities();
async function logoutUser() {
  await userStore.logoutUser();
}
const uncheckedProductsLength = computed(() => {
  const unchecked = userStore.user.cart.filter(
    (product: Product & { checked: boolean }) => !product.checked
  ).length;
  return unchecked;
});
type Locale = {
  title: string;
  value: string;
};

const locales: Locale[] = reactive([
  {
    title: "Қаз",
    value: "kz",
  },
  {
    title: "Рус",
    value: "ru",
  },
]);

function changeLocale(locale: string) {
  i18n.locale.value = locale;
  userStore.changeLocale(locale);
}
</script>

<style scoped>
.cart_btn {
  position: relative;
  padding: 3px;
  background-color: #cf4e3b;
  color: #fff;
  border: none;
  font-size: 20px;
  border-radius: 5px;
  cursor: pointer;
}

.unchecked {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  padding: 2px 6px;
  font-size: 15px;
  border-radius: 50%;
}

.cart_btn:hover {
  background-color: #b04231;
}

.header_top {
  box-shadow: 0px 4px 10px 2px rgba(34, 60, 80, 0.2);
  z-index: 10;
  background-color: #fff;
}

.header_top_container {
  padding: 20px 0px;
  margin: 0 auto;
  display: flex;
  width: 80%;
  max-width: 1200px;
  text-align: center;
  justify-content: space-between;
}

.profile {
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.avatar_container {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.name {
  font-size: 21px;
  font-weight: 600;
}
.lang {
  display: flex;
  column-gap: 5px;
  text-align: center;
}
.lang_item {
  font-size: 20px;
  padding: 10px;
  color: #e0e0e0;
}

.active_lang {
  color: #000;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
}

.auth_btn {
  padding: 5px 15px;
  color: #fff;
  border: none;
  font-size: 15px;
  background-color: #cf4e3b;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.auth_btn:hover {
  background-color: red;
}
</style>
