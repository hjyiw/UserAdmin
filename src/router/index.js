import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "@/utils/auth";
import { useUserStore, usePermissionStore } from "@/store";
import { ElMessage } from "element-plus";

// 公共路由: 登录、忘记密码、重置密码、主页、404页
const publicRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录", hidden: true },
  },
  {
    path: "/forget",
    name: "Forget",
    component: () => import("@/views/login/forget.vue"),
    meta: { title: "忘记密码", hidden: true },
  },
  {
    path: "/reset-password/:token",
    name: "Reset",
    component: () => import("@/views/login/reset.vue"),
    meta: { title: "重置密码", hidden: true },
  },
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    redirect: "/dashboard",
    meta: { hidden: true },
    children: [
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/system/user/profile/index.vue"),
        meta: { title: "个人中心", hidden: true },
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "首页", icon: "HomeFilled" },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/error/404.vue"),
    meta: { title: "404", hidden: true },
  },
];

// 将404路由分离出来，在动态路由加载后再添加
const notFoundRoute = {
  path: "/:pathMatch(.*)*",
  redirect: "/404",
  meta: { hidden: true },
};

// 权限路由: 系统管理、用户管理、角色管理、部门管理
const permissionRoutes = [
  {
    path: "/system",
    component: () => import("@/layout/index.vue"),
    redirect: "/system/user",
    meta: {
      title: "系统管理",
      icon: "Setting",
      permissions: ["system:view"],
    },
    children: [
      // 用户管理
      {
        path: "user",
        name: "User",
        component: () => import("@/views/system/user/index.vue"),
        meta: {
          title: "用户管理",
          icon: "User",
          permissions: ["system:user:list"],
        },
      },
      // 角色管理
      {
        path: "role",
        name: "Role",
        component: () => import("@/views/system/role/index.vue"),
        meta: {
          title: "角色管理",
          icon: "UserFilled",
          permissions: ["system:role:list"],
        },
      },
      // 部门管理
      {
        path: "dept",
        name: "Dept",
        component: () => import("@/views/system/dept/index.vue"),
        meta: {
          title: "部门管理",
          icon: "OfficeBuilding",
          permissions: ["system:dept:list"],
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes, // 初始路由不包含404的通配符路由
});

// 白名单路由：登录、忘记密码、重置密码
const whiteList = ["/login", "/forget", "/reset-password"];

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 获取token
  const hasToken = getToken();

  console.log("Navigation to:", to.path, "| Has token:", !!hasToken);
  // 如果有token，已登录
  if (hasToken) {
    // 已登录状态下访问登录页，重定向到首页
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      // 获取用户信息和权限

      const userStore = useUserStore();
      const permissionStore = usePermissionStore();

      // 打印用户角色长度
      console.log("User roles length:", userStore.roles.length);

      // 判断是否已获取用户信息
      if (userStore.roles.length === 0) {
        try {
          // 发送请求 获取用户信息
          const { user } = await userStore.getUserInfo();

          console.log(
            "User info loaded:",
            user.username, // 用户名
            "| Permissions:",
            user.permissions // 用户权限
          );

          // 根据用户权限生成可访问路由
          const accessRoutes = await permissionStore.generateRoutes(
            user.permissions,
            user.roles
          );

          // 打印生成的路由
          console.log(
            "Generated routes:",
            accessRoutes.map((r) => r.path)
          );

          // 动态添加路由
          accessRoutes.forEach((route) => {
            console.log("Adding route:", route.path);
            router.addRoute(route);
          });

          // 添加404路由，确保它在所有动态路由之后
          router.addRoute(notFoundRoute);

          // 打印所有路由，检查是否成功添加
          console.log(
            "All routes after adding:",
            router.getRoutes().map((r) => r.path)
          );

          // 重新导航到目标页面，确保路由已加载
          console.log("Redirecting to:", to.path);

          // replace: true 指定使用 router.replace() 而非默认的 router.push()，
          // 这意味着浏览器历史记录会被替换而非追加，
          // 用户无法通过后退按钮返回前一个页面
          next({ ...to, replace: true });
        } catch (error) {
          // 获取用户信息失败，清空token并跳转到登录页
          console.error("Error during beforeEach guard:", error);
          await userStore.resetToken();
          ElMessage.error(error.message || "获取用户信息失败，请重新登录");
          next(`/login?redirect=${to.path}`);
        }
      } else {
        // 检查要访问的路由是否存在
        console.log("Route matched length:", to.matched.length);

        if (to.matched.length === 0) {
          console.log("No matched routes for:", to.path);
          // 路由不存在，可能是因为路由表尚未完全加载
          // 重新获取路由配置
          const permissionStore = usePermissionStore();
          const accessRoutes = await permissionStore.generateRoutes(
            userStore.permissions,
            userStore.roles
          );

          // 打印重新生成的路由
          console.log(
            "Re-generated routes:",
            accessRoutes.map((r) => r.path)
          );

          // 动态添加路由
          accessRoutes.forEach((route) => {
            console.log("Re-adding route:", route.path);
            router.addRoute(route);
          });

          // 重新添加404路由，确保它在所有动态路由之后
          router.addRoute(notFoundRoute);

          // 打印所有路由，检查是否成功添加
          console.log(
            "All routes after re-adding:",
            router.getRoutes().map((r) => r.path)
          );

          // 确保路由表已更新
          // 使用 router.resolve 检查路由是否可以被解析
          const resolved = router.resolve(to.path);

          // 打印解析后的路由
          console.log(
            "Resolved route:",
            resolved.path,
            "| Matched:",
            !!resolved.matched.length
          );

          if (resolved.matched.length > 0) {
            // 路由可以被解析，直接导航
            next({ ...to, replace: true });
          } else {
            // 路由仍然无法解析，可能是真的不存在
            console.warn("Route still not found after adding routes:", to.path);
            next("/dashboard"); // 导航到安全的默认页面
          }
        } else {
          // 路由可以被解析，直接导航
          next();
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.some((path) => to.path.startsWith(path))) {
      next();
    } else {
      // 重定向到登录页
      next(`/login?redirect=${to.path}`);
    }
  }
});

// 导出路由
export { publicRoutes, permissionRoutes, notFoundRoute };
export default router;
