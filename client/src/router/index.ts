import { createRouter, createWebHistory, useRoute } from "vue-router";
import type {
  Router,
  RouteLocationNormalized,
  NavigationGuardNext,
} from "vue-router";
import routes from "./routes";
import { useUserStore } from "../stores/user";
import { useUserUtilities } from "../composables/utilities";

const router: Router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const userStore = useUserStore();
    const { isUser } = useUserUtilities();
    if (
      (to.path === "/signin" || to.path === "/signup") &&
      isUser(userStore.user)
    ) {
      next("/");
    } else {
      next();
    }
  }
);

export default router;
