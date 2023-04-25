import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    alias: "/shop",
    name: "Home",
    component: () => import("../views/HomePage.vue"),
  },
  {
    path: "/signup",
    name: "Sign Up",
    component: () => import("../views/SignUp.vue"),
  },
  {
    path: "/signin",
    name: "Sign In",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/catalogs/:catalogName",
    name: "Catalog",
    component: () => import('../views/CatalogPage.vue')
  },
  {
    path: "/catalogs/:catalogName/:brand/:subcatalogName/:model",
    name: "Product",
    component: () => import('../views/ProductPage.vue')
  }
];
export default routes;
