<template>
  <div class="container">
    <EshopLoader v-if="loading" />
    <div class="content_block">
      <div class="title">{{ $t("auth.loginTitle") }}</div>
      <form class="form" @submit="loginUser">
        <div class="form_item">
          <div class="label">{{ $t("auth.email") }}:</div>
          <EshopInput
            :placeholder="$t('auth.emailPlaceholder')"
            :model-value="email"
            @update:modelValue="(value) => (email = value)"
          />
        </div>
        <div class="form_item">
          <div class="label">{{ $t("auth.password") }}:</div>
          <EshopInput
            :placeholder="$t('auth.passwordPlaceholder')"
            @update:modelValue="(value) => (password = value)"
            :type="isPwt ? 'text' : 'password'"
            :icon="isPwt ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
            :model-value="password"
            @iconClicked="isPwt = !isPwt"
          />
        </div>
        <div class="error_message">{{ errorMessage }}</div>
        <button type="submit" class="signin_btn">{{ $t("auth.login") }}</button>
      </form>
      <div class="link">
        {{ $t("auth.noAccount") }}
        <RouterLink to="/signup" tag="span">{{
          $t("auth.register")
        }}</RouterLink>
      </div>
      <div class="link" v-if="userStore.activeLocale === 'ru'">
        {{ $t("auth.continueAs") }}
        <RouterLink to="/" tag="span">{{ $t("headerTop.guest") }}</RouterLink>
      </div>
      <div v-else class="link">
        <RouterLink to="/" tag="span">{{ $t("headerTop.guest") }}</RouterLink>
        {{ $t("auth.continueAs") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EshopInput from "../UIcomponents/EshopInput.vue";
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import type { LoginUser } from "../../types/types";

const userStore = useUserStore();
const isPwt = ref<boolean>(false);
const password = ref<string>("");
const email = ref<string>("");
const loading = ref<boolean>(false);
const errorMessage = ref<string>("");

async function loginUser(e: Event) {
  e.preventDefault();
  try {
    loading.value = true;
    const user: LoginUser = {
      password: password.value,
      email: email.value,
    };
    await userStore.loginUser(user);
    loading.value = false;
  } catch (e) {
    loading.value = false;
    if (e instanceof Error && typeof e.message === "string") {
      errorMessage.value = e.message;
      setTimeout(() => {
        errorMessage.value = "";
      }, 1500);
    } else {
      errorMessage.value = "Произошла непредвиденная ошибка";
      setTimeout(() => {
        errorMessage.value = "";
      }, 1500);
    }
  }
}
</script>

<style scoped>
.content_block {
  background-color: #f5f5f5;
  padding: 10px 0;
}
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  padding: 0px 15px;
}

.title {
  text-transform: uppercase;
  margin-bottom: 15px;
  padding: 10px 0;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
  font-size: 23px;
}

.form_item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.label {
  margin-bottom: 10px;
  font-size: 18px;
}

.link {
  text-align: center;
  color: blue;
  margin: 10px 0;
}

.signin_btn {
  padding: 10px 15px;
  text-align: center;
  color: #fff;
  background-color: red;
  text-transform: uppercase;
  font-size: 16px;
  display: block;
  margin: 0 auto;
  border: none;
  cursor: pointer;
}

.error_message {
  color: red;
  margin: 15px 0;
  font-size: 17px;
  text-align: center;
}
</style>
