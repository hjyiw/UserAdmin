// 用户管理模块
import { defineStore } from "pinia";
import {
  getToken,
  setToken,
  removeToken,
  getUsername,
  setUsername,
  getPassword,
  setPassword,
  getRememberMe,
  setRememberMe,
  clearLoginInfo,
} from "@/utils/auth";
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

// 模拟退出登录API调用
const mockLogout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: null,
        msg: "退出成功",
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
    rememberMe: getRememberMe() || false,
  }),

  getters: {
    // 获取用户角色
    getRoles: (state) => state.roles,
    // 获取用户权限
    getPermissions: (state) => state.permissions,
    // 获取记住我状态
    getRememberMe: (state) => state.rememberMe,
  },

  actions: {
    // 登录
    login(userInfo) {
      const { username, password, rememberMe = false } = userInfo;
      return new Promise((resolve, reject) => {
        mockLogin(username, password)
          .then((response) => {
            const { data } = response;
            // 设置token
            setToken(data.token);
            this.token = data.token;

            // 更新记住我状态
            this.rememberMe = rememberMe;
            setRememberMe(rememberMe);

            // 如果记住我，保存用户名和密码
            if (rememberMe) {
              setUsername(username);
              setPassword(password);
            } else {
              // 如果不记住，清除之前可能存储的信息
              clearLoginInfo();
              setToken(data.token); // 重新设置token，因为clearLoginInfo也会清除token
            }

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
      return new Promise((resolve, reject) => {
        // 调用退出登录API
        mockLogout()
          .then(() => {
            this.clearUserState();
            resolve();
          })
          .catch((error) => {
            // 即使API调用失败，也清除本地状态
            console.error("退出登录失败，但仍会清除本地状态:", error);
            this.clearUserState();
            resolve();
          });
      });
    },

    // 清除用户状态
    clearUserState() {
      // 判断是否需要保留用户凭据（记住密码）
      if (!this.rememberMe) {
        // 如果没有记住密码，清除所有登录信息
        clearLoginInfo();
      } else {
        // 如果记住密码，只清除token
        removeToken();
      }

      this.token = "";
      this.userInfo = {};
      this.roles = [];
      this.permissions = [];

      // 重置路由
      const permissionStore = usePermissionStore();
      permissionStore.resetRoutes();

      // 跳转到登录页
      router.push("/login");
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

    // 加载存储的用户信息（如果有）
    loadSavedUserInfo() {
      // 获取存储的用户名和密码（如果启用了记住我）
      if (this.rememberMe) {
        const username = getUsername();
        const password = getPassword();

        if (username && password) {
          return {
            username,
            password,
            rememberMe: true,
          };
        }
      }

      return null;
    },
  },
});
