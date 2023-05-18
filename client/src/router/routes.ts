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
    path: "/c/:category",
    name: "Catalog",
    component: () => import("../views/CatalogPage.vue"),
  },
  {
    path: "/c/:category/:subcatalogName/:model",
    name: "Product",
    component: () => import("../views/ProductPage.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/CartPage.vue"),
  },
];
export default routes;
