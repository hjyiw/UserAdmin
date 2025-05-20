// 用户管理模块
import { defineStore } from "pinia";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { usePermissionStore } from "./permission";
import router from "@/router";

// 模拟API调用
const mockLogin = (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟登录成功返回token
      resolve({
        code: 200,
        data: {
          token: "admin-token-" + new Date().getTime(),
        },
        msg: "登录成功",
      });
    }, 500);
  });
};

const mockGetUserInfo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟获取用户信息
      resolve({
        code: 200,
        data: {
          user: {
            id: 1,
            username: "admin",
            nickname: "管理员",
            avatar:
              "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            email: "admin@example.com",
            roles: ["admin"],
            permissions: [
              "system:user:list",
              "system:role:list",
              "system:dept:list",
            ],
          },
        },
        msg: "获取成功",
      });
    }, 500);
  });
};

export const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    userInfo: {},
    roles: [],
    permissions: [],
  }),

  getters: {
    // 获取用户角色
    getRoles: (state) => state.roles,
    // 获取用户权限
    getPermissions: (state) => state.permissions,
  },

  actions: {
    // 登录
    login(userInfo) {
      const { username, password } = userInfo;
      return new Promise((resolve, reject) => {
        mockLogin(username, password)
          .then((response) => {
            const { data } = response;
            // 设置token
            setToken(data.token);
            this.token = data.token;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    getUserInfo() {
      return new Promise((resolve, reject) => {
        mockGetUserInfo()
          .then((response) => {
            const { data } = response;
            const { user } = data;

            // 验证返回的用户信息是否包含角色信息
            if (!user.roles || user.roles.length <= 0) {
              reject("用户角色不能为空");
              return;
            }

            // 保存用户信息
            this.userInfo = user;
            this.roles = user.roles;
            this.permissions = user.permissions;

            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 退出登录
    logout() {
      return new Promise((resolve) => {
        // 清除token
        removeToken();
        this.token = "";
        this.userInfo = {};
        this.roles = [];
        this.permissions = [];

        // 重置路由
        const permissionStore = usePermissionStore();
        permissionStore.resetRoutes();

        // 跳转到登录页
        router.push("/login");
        resolve();
      });
    },

    // 重置token
    resetToken() {
      return new Promise((resolve) => {
        removeToken();
        this.token = "";
        this.userInfo = {};
        this.roles = [];
        this.permissions = [];
        resolve();
      });
    },
  },
});
