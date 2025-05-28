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
import request from "@/utils/request";

// 模拟API调用
const mockLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 导入用户数据
      import("@/api/mockData").then(({ mockUserData }) => {
        // 查找用户
        const user = mockUserData.find(
          (u) => u.username === username && u.status === "0"
        );

        if (!user) {
          reject({ code: 401, message: "用户名不存在或已被禁用" });
          return;
        }

        // 这里简单模拟密码验证，实际应用中应该进行加密比对
        // 为了演示方便，假设所有用户的初始密码都是123456
        if (password !== "123456") {
          reject({ code: 401, message: "密码错误" });
          return;
        }

        // 登录成功
        resolve({
          code: 200,
          data: {
            token: `${username}-token-${new Date().getTime()}`,
            userId: user.userId,
          },
          msg: "登录成功",
        });
      });
    }, 500);
  });
};
// 登录请求
// body请求参数 ： password,username
// 方式：post
// 地址：/auth/login
// 返回参数：
// {
//     "code": 200,
//     "msg": "登录成功",
//     "data": {
//         "token": "admin-token-1234567890",
//         "userId": 1
//     }
// }

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    request
      .post("/auth/login", {
        username,
        password,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 模拟获取用户信息API调用
const mockGetUserInfo = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 从token中获取用户名
      const token = getToken();
      if (!token) {
        reject({ code: 401, message: "未登录或登录已过期" });
        return;
      }

      // 解析token中的用户名
      const username = token.split("-")[0];

      // 导入用户数据
      import("@/api/mockData").then(({ mockUserData }) => {
        // 查找用户
        const user = mockUserData.find((u) => u.username === username);

        if (!user) {
          reject({ code: 404, message: "用户不存在" });
          return;
        }

        // 获取成功
        resolve({
          code: 200,
          data: {
            user: {
              id: user.userId,
              userId: user.userId,
              username: user.username,
              nickname: user.nickname,
              avatar:
                "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
              email: user.email,
              roles: user.roles, // 用户角色
              permissions: user.roleIds.includes(3)
                ? ["system:user:list", "system:role:list"] // 开发人员权限
                : user.roleIds.includes(1)
                ? ["system:user:list", "system:role:list", "system:dept:list"] // 管理员权限
                : ["system:user:list"], // 其他角色权限
            },
          },
          msg: "获取成功",
        });
      });
    }, 500);
  });
};

// 获取用户信息
// 方式：get
// 地址：/user/info
// 请求参数：query: username
// 返回参数：
// {
//     "code": 200,
//     "msg": "获取成功",
//     "data": {
//         "user": {
//             "userId": 1,
//             "username": "admin",
//             "nickname": "管理员",
//             "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
//             "email": "admin@example.com",
//             "roles": [
//                 "管理员"
//             ],
//             "permissions": [
//                 "system:user:list",
//                 "system:role:list",
//                 "system:dept:list"
//             ]
//         }
//     }
// }
// 改成异步处理
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    // 从token中获取用户名
    const token = getToken();
    if (!token) {
      reject({ code: 401, message: "未登录或登录已过期" });
      return;
    }

    // 解析token中的用户名
    const username = token.split("-")[0];
    console.log("username: ", username);
    request
      .get("/user/info", {
        params: {
          username: username,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
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

// 退出登录
// 方式：post
// 地址：/auth/logout
// 请求参数：header：Authorization
// 返回参数：
//{
// "code": 200,
// "msg": "退出成功",
// "data": null
// }
const logout = () => {
  return new Promise((resolve, reject) => {
    request
      .post("/auth/logout", {
        headers: {
          Authorization: getToken(),
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
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
    token: getToken(), // 获取token
    userInfo: {}, // 用户信息
    roles: [], // 用户角色
    roleIds: [], // 用户角色ID
    permissions: [], // 用户权限
    rememberMe: getRememberMe() || false, // 记住我状态
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
      // 解构用户信息
      const { username, password, rememberMe = false } = userInfo;
      return new Promise((resolve, reject) => {
        login(username, password)
          .then((response) => {
            const { data } = response;
            // 设置token
            setToken(data.token);
            this.token = data.token;

            // 更新记住我状态
            this.rememberMe = rememberMe;
            // 设置记住我Cookie状态
            setRememberMe(rememberMe);

            // 如果记住我，保存用户名和密码到Cookie
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
        getUserInfo()
          .then((response) => {
            const { data } = response;
            const { user } = data; // 用户对象

            if (!user) {
              reject("获取用户信息失败，请重新登录");
              return;
            }

            // 设置用户信息
            this.userInfo = user;
            // 设置角色
            this.roles = user.roles || [];
            // 设置角色ID
            this.roleIds = user.roleIds || [];
            // 设置权限
            this.permissions = user.permissions || [];

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
        logout()
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
