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

// 模拟修改密码API调用
const mockUpdatePassword = (oldPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 这里可以添加密码验证逻辑，例如：
      // 假设旧密码必须是123456才能修改成功
      if (oldPassword === "123456") {
        resolve({
          code: 200,
          data: null,
          msg: "密码修改成功",
        });
      } else {
        reject({
          code: 400,
          message: "原密码错误",
        });
      }
    }, 500);
  });
};

// 模拟发送重置密码邮件API调用
const mockSendResetEmail = (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟验证邮箱
      if (email && email.includes("@")) {
        resolve({
          code: 200,
          data: null,
          msg: "重置密码邮件已发送，请查收",
        });
      } else {
        reject({
          code: 400,
          message: "邮箱格式不正确",
        });
      }
    }, 800);
  });
};

// 模拟重置密码API调用
const mockResetPassword = (resetInfo) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { token, password, confirmPassword } = resetInfo;

      // 验证重置token
      if (!token || token.length < 10) {
        reject({
          code: 400,
          message: "重置链接无效或已过期",
        });
        return;
      }

      // 验证密码一致性
      if (password !== confirmPassword) {
        reject({
          code: 400,
          message: "两次输入的密码不一致",
        });
        return;
      }

      // 验证密码长度
      if (password.length < 6) {
        reject({
          code: 400,
          message: "密码长度不能小于6位",
        });
        return;
      }

      resolve({
        code: 200,
        data: null,
        msg: "密码重置成功，请使用新密码登录",
      });
    }, 800);
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

    // 修改密码
    updatePassword(passwordInfo) {
      const { oldPassword, newPassword } = passwordInfo;

      return new Promise((resolve, reject) => {
        mockUpdatePassword(oldPassword, newPassword)
          .then((response) => {
            // 如果用户勾选了记住密码，更新已保存的密码
            if (this.rememberMe) {
              setPassword(newPassword);
            }
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 发送重置密码邮件
    sendResetEmail(email) {
      return new Promise((resolve, reject) => {
        mockSendResetEmail(email)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 重置密码
    resetPassword(resetInfo) {
      return new Promise((resolve, reject) => {
        mockResetPassword(resetInfo)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 退出登录
    logout() {
      return new Promise((resolve, reject) => {
        mockLogout()
          .then(() => {
            this.clearUserState();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 清除用户状态
    clearUserState() {
      // 清除token
      this.token = "";
      removeToken();

      // 清除用户信息
      this.userInfo = {};
      this.roles = [];
      this.permissions = [];

      // 重置路由
      const permissionStore = usePermissionStore();
      permissionStore.resetRoutes();

      // 重定向到登录页
      router.push("/login");
    },

    // 重置token
    resetToken() {
      return new Promise((resolve) => {
        // 清除token
        this.token = "";
        removeToken();

        // 清除用户信息
        this.userInfo = {};
        this.roles = [];
        this.permissions = [];

        // 重置路由
        const permissionStore = usePermissionStore();
        permissionStore.resetRoutes();

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
