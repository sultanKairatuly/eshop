<template>
  <div class="header_top">
    <div class="header_top_container">
      <div class="profile" v-if="userStore.user">
        <div class="avatar_container">
          <img :src="userStore.user?.photoURL" class="avatar" />
        </div>
        <div class="name">{{ userStore.user?.displayName }}</div>
        <button
          class="auth_btn"
          v-if="isUser(userStore.user)"
          @click="logoutUser"
        >
          Выйти
        </button>
        <button class="auth_btn" @click="$router.push('/signin')" v-else>
          Войти
        </button>
      </div>
      <div class="lang">
        <div class="lang_item">Қаз</div>
        <div class="lang_item active_lang">Рус</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from "../../types/types";
import { useUserStore } from "../stores/user";
import { useUserUtilities } from "../composables/utilities";
const userStore = useUserStore();
const { isUser } = useUserUtilities();
async function logoutUser() {
  console.log("logging out");
  await userStore.logoutUser();
  console.log("logged out!");
}
</script>

<style scoped>
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
