import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "@/utils/auth";
import { useUserStore, usePermissionStore } from "@/store";

// 公共路由
const publicRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录", hidden: true },
  },
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "首页", icon: "HomeFilled" },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/system/user/profile/index.vue"),
        meta: { title: "个人中心", hidden: true },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/error/404.vue"),
    meta: { title: "404", hidden: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    meta: { hidden: true },
  },
];

// 权限路由
const permissionRoutes = [
  {
    path: "/system",
    component: () => import("@/layout/index.vue"),
    redirect: "/system/user",
    meta: { title: "系统管理", icon: "Setting" },
    children: [
      {
        path: "user",
        name: "User",
        component: () => import("@/views/system/user/index.vue"),
        meta: { title: "用户管理", icon: "User" },
      },
      {
        path: "role",
        name: "Role",
        component: () => import("@/views/system/role/index.vue"),
        meta: { title: "角色管理", icon: "UserFilled" },
      },
      {
        path: "dept",
        name: "Dept",
        component: () => import("@/views/system/dept/index.vue"),
        meta: { title: "部门管理", icon: "OfficeBuilding" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes,
});

// 白名单路由
const whiteList = ["/login"];

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 获取token
  const hasToken = getToken();

  if (hasToken) {
    // 已登录状态下访问登录页，重定向到首页
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      // 获取用户信息和权限
      const userStore = useUserStore();
      const permissionStore = usePermissionStore();

      // 判断是否已获取用户信息
      if (userStore.roles.length === 0) {
        try {
          // 获取用户信息
          const { user } = await userStore.getUserInfo();

          // 根据用户权限生成可访问路由
          const accessRoutes = await permissionStore.generateRoutes(
            user.permissions
          );

          // 动态添加路由
          accessRoutes.forEach((route) => {
            router.addRoute(route);
          });

          // 重新导航到目标页面，确保路由已加载
          next({ ...to, replace: true });
        } catch (error) {
          // 获取用户信息失败，清空token并跳转到登录页
          await userStore.resetToken();
          next(`/login?redirect=${to.path}`);
        }
      } else {
        next();
      }
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.includes(to.path)) {
      next();
    } else {
      // 重定向到登录页
      next(`/login?redirect=${to.path}`);
    }
  }
});

// 导出路由
export { publicRoutes, permissionRoutes };
export default router;
