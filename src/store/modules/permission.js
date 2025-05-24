// 权限管理模块
import { defineStore } from "pinia";
import { publicRoutes, permissionRoutes } from "@/router";
import router from "@/router"; // 导入router实例

// 过滤路由
function filterAsyncRoutes(routes, permissions) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    // 检查是否有权限访问该路由
    if (hasPermission(permissions, tmp)) {
      // 如果有子路由，递归过滤
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions);
      }
      res.push(tmp);
    }
  });

  return res;
}

// 判断是否有权限
function hasPermission(permissions, route) {
  // 如果路由没有设置权限要求，则默认可访问
  if (!route.meta || !route.meta.permissions) {
    return true;
  }

  // 判断用户权限是否包含路由所需权限
  return permissions.some((permission) =>
    route.meta.permissions.includes(permission)
  );
}

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    routes: [],
    addRoutes: [],
    permissions: [],
  }),

  getters: {
    // 获取所有路由
    getRoutes: (state) => state.routes,
    // 获取用户权限
    getPermissions: (state) => state.permissions,
  },

  actions: {
    // 设置路由
    setRoutes(routes) {
      this.addRoutes = routes;
      this.routes = publicRoutes.concat(routes);
    },

    // 设置权限
    setPermissions(permissions) {
      this.permissions = permissions;
    },

    // 生成路由
    generateRoutes(permissions) {
      return new Promise((resolve) => {
        // 保存权限
        this.setPermissions(permissions);

        let accessedRoutes;
        // 如果包含admin权限，可以访问所有路由
        if (permissions.includes("admin")) {
          accessedRoutes = permissionRoutes || [];
        } else {
          // 根据权限过滤路由
          accessedRoutes = filterAsyncRoutes(permissionRoutes, permissions);
        }

        // 设置路由
        this.setRoutes(accessedRoutes);
        resolve(accessedRoutes);
      });
    },

    // 重置路由
    resetRoutes() {
      // 记录当前已添加的动态路由
      const currentRoutes = [...this.addRoutes];

      // 清空状态
      this.routes = [];
      this.addRoutes = [];
      this.permissions = [];

      // 从路由实例中移除动态添加的路由
      currentRoutes.forEach((route) => {
        if (route.name) {
          router.hasRoute(route.name) && router.removeRoute(route.name);
        }
      });

      // 检查是否还有其他动态添加的路由
      const remainingRoutes = router.getRoutes();
      console.log(
        "Routes after reset:",
        remainingRoutes.map((r) => r.path)
      );
    },
  },
});
