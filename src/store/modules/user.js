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
import { DATA_SCOPE_TYPES } from "@/utils/permission";

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
            userId: 1,
            username: "admin",
            nickname: "管理员",
            avatar:
              "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            email: "admin@example.com",
            deptId: 1,
            deptName: "研发部门",
            deptPath: "0,1",
            roles: ["admin"],
            permissions: [
              "system:user:list",
              "system:role:list",
              "system:dept:list",
            ],
            dataScope: "1", // 全部数据权限
            deptIds: [1, 2, 3, 4, 5, 6, 7, 8, 9], // 自定义权限部门列表
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
    dataScope: "5", // 默认数据权限为仅本人
    deptIds: [], // 自定义权限部门列表
  }),

  getters: {
    // 获取用户角色
    getRoles: (state) => state.roles,
    // 获取用户权限
    getPermissions: (state) => state.permissions,
    // 获取记住我状态
    getRememberMe: (state) => state.rememberMe,
    // 获取数据权限
    getDataScope: (state) => state.dataScope,
    // 获取自定义权限部门列表
    getDeptIds: (state) => state.deptIds,
    // 判断是否有指定数据权限
    hasDataScope: (state) => (scopeType) => state.dataScope === scopeType,
    // 判断是否有全部数据权限
    hasAllDataScope: (state) =>
      state.dataScope === DATA_SCOPE_TYPES.ALL || state.roles.includes("admin"),
    // 判断是否有自定义数据权限
    hasCustomDataScope: (state) => state.dataScope === DATA_SCOPE_TYPES.CUSTOM,
    // 判断是否有部门数据权限
    hasDeptDataScope: (state) => state.dataScope === DATA_SCOPE_TYPES.DEPT,
    // 判断是否有部门及以下数据权限
    hasDeptAndChildDataScope: (state) =>
      state.dataScope === DATA_SCOPE_TYPES.DEPT_AND_CHILD,
    // 判断是否有仅本人数据权限
    hasSelfDataScope: (state) => state.dataScope === DATA_SCOPE_TYPES.SELF,
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

            if (!user) {
              reject("获取用户信息失败，请重新登录");
              return;
            }

            // 设置用户信息
            this.userInfo = user;
            // 设置角色
            this.roles = user.roles || [];
            // 设置权限
            this.permissions = user.permissions || [];
            // 设置数据权限
            this.dataScope = user.dataScope || DATA_SCOPE_TYPES.SELF;
            // 设置自定义权限部门列表
            this.deptIds = user.deptIds || [];

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
      // 清除用户信息
      this.userInfo = {};
      // 清除角色
      this.roles = [];
      // 清除权限
      this.permissions = [];
      // 清除数据权限
      this.dataScope = DATA_SCOPE_TYPES.SELF;
      // 清除自定义权限部门列表
      this.deptIds = [];
      // 清除本地存储的token
      removeToken();
      // 清除路由
      const permissionStore = usePermissionStore();
      permissionStore.clearRoutes();
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

        // 清除数据权限信息
        this.dataScope = "5";
        this.deptIds = [];

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
