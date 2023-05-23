<template>
  <div class="container">
    <EshopLoader v-if="loading" />
    <div class="content_block">
      <div class="title">{{ $t("auth.registration") }}</div>
      <form class="form" @submit="registerUser">
        <div class="form_item">
          <div class="label">{{ $t("auth.name") }}:</div>
          <EshopInput
            :model-value="name"
            :placeholder="$t('auth.namePlaceholder')"
            @update:modelValue="(value) => (name = value)"
          />
        </div>
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
        <div class="form_item">
          <div class="image_label">
            <img :src="avatar" class="avatar" />
          </div>
          <button class="upload_avatar_btn" type="button" @click="uploadImage">
            {{ $t("auth.upload") }}
          </button>
        </div>
        <button type="submit" class="register_btn">
          {{ $t("auth.register") }}
        </button>
      </form>
      <div class="link">
        {{ $t("auth.alreadyHave") }}?<RouterLink to="/signin" tag="span">{{
          $t("auth.loginThen")
        }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EshopInput from "../UIcomponents/EshopInput.vue";
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import { FormUser } from "../../types/types";

const userStore = useUserStore();
const isPwt = ref<boolean>(false);
const name = ref<string>("");
const password = ref<string>("");
const email = ref<string>("");
const avatar = ref<string>(
  "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"
);
const loading = ref<boolean>(false);

async function registerUser(e: Event): Promise<void> {
  e.preventDefault();
  try {
    const user: FormUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      photoURL: avatar.value,
    };
    loading.value = true;
    await userStore.registerUser(user);
    loading.value = false;
    name.value = "";
    password.value = "";
    email.value = "";
  } catch (e) {
    loading.value = false;
    console.log(e);
  }
}

function onFilePicked(e: Event): void {
  const target: HTMLInputElement = e?.target as HTMLInputElement;
  if (target) {
    const files = [target][0].files!;
    const fileReader = new FileReader();
    fileReader.addEventListener("load", async () => {
      avatar.value = fileReader.result as string;
    });
    fileReader.readAsDataURL(files[0]);
  }
}

function uploadImage(): void {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.addEventListener("change", onFilePicked);
  fileInput.click();
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
  margin: 10px 0;
  color: blue;
}

.register_btn {
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

.image_label {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.upload_avatar_btn {
  border: none;
  cursor: pointer;
  padding: 10px 30px;
  font-size: 18px;
  color: #fff;
  background-color: teal;
  display: block;
  margin: 15px auto;
  width: fit-content;
}

.upload_avatar_btn:hover {
  background-color: rgb(4, 164, 164);
}
</style>
