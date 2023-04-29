<template>
  <div class="navigation" v-if="isCategory(props.category)">
    <div class="navigation_content">
      <h3 class="navigation_title">
        {{ props.category.name }}
      </h3>
      <div class="navigation_children">
        <div
          class="navigation_child"
          v-for="(child, index) in props.category.children"
          :key="child.id"
          @click="routeToProducts(child.category)"
        >
          <h4 class="navigation_child_title">{{ child.name }}</h4>
          <div class="navigation_grandchildren">
            <div
              class="grandnavigation_child"
              v-for="grandchild in child.children"
              :key="grandchild.id"
              @click.stop="routeToProducts(grandchild.category, true)"
            >
              <div class="grandchild_title">{{ grandchild.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Category } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";
import { useRouter } from "vue-router";

const router = useRouter();
const { isCategory } = useUserUtilities();
const props = defineProps<{
  category: Category | null;
}>();
const emit = defineEmits<{
  (e: "routeToProducts"): void;
}>();

function routeToProducts(routeQuery: string, sub: boolean = false) {
  router.push({
    path: `/c/${props.category?.value}`,
    query: { [sub ? "subcatalogName" : "catalogName"]: routeQuery },
  });
  emit("routeToProducts");
}
</script>

<style scoped>
.navigation {
  height: 90vh;
  background-color: #fff;
  position: absolute;
  z-index: 20;
  padding: 10px 30px;
  margin-top: 80px;
  width: 100%;
  left: 0;
  border-bottom: 1px solid #e5e5e5;
}
.navigation_content {
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
}
.navigation_title {
  font-size: 45px;
  font-weight: 500;
  margin-right: 10px;
}
.navigation_children {
  display: flex;
  max-width: 1200px;
  width: 100%;
  margin-top: 30px;
}

.navigation_child {
  width: 100%;
}

.navigation_child::after {
  content: "";
  background-color: red;
  width: 2px;
  height: 100%;
  display: inline;
}

.navigation_child_title:hover {
  text-decoration: underline;
}
.navigation_child_title {
  font-size: 25px;
  cursor: pointer;
  font-weight: 400;
}
.navigation_grandchildren {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-top: 20px;
}
.grandnavigation_child {
  font-size: 20px;
}

.grandchild_title:hover {
  text-decoration: underline;
}

.grandchild_title {
  color: #008fd4;
  cursor: pointer;
}

.separator {
  width: 2px;
  height: 100%;
  background-color: red;
  display: inline-block;
}
</style>
