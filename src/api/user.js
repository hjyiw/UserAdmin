// 用户管理相关API

// 导出用户数据，供其他模块使用
import { mockUserData } from "./mockData";
import request from "@/utils/request";
/**
 * 获取用户列表
 * @param {Object} params - 查询参数，包括pageNum、pageSize、username、phone、email、status
 * @returns {Promise} - 返回用户列表数据
 */
export function listUsers(params) {
  return new Promise((resolve) => {
    request
      .get("/user/list", {
        params,
      })
      .then((res) => {
        resolve(res);
      });
    // setTimeout(() => {
    //   const {
    //     pageNum = 1,
    //     pageSize = 10,
    //     username,
    //     phone,
    //     email,
    //     status,
    //   } = params || {};

    // // 过滤数据
    // let filteredData = [...mockUserData];

    // // 按用户名筛选
    // if (username) {
    //   filteredData = filteredData.filter(
    //     (item) =>
    //       item.username.toLowerCase().includes(username.toLowerCase()) ||
    //       item.nickname.toLowerCase().includes(username.toLowerCase())
    //   );
    // }

    // // 按手机号筛选
    // if (phone) {
    //   filteredData = filteredData.filter((item) =>
    //     item.phone.includes(phone)
    //   );
    // }

    // // 按状态筛选
    // if (status !== "" && status !== undefined) {
    //   filteredData = filteredData.filter((item) => item.status === status);
    // }

    // // 按邮箱筛选
    // if (email) {
    //   filteredData = filteredData.filter((item) =>
    //     item.email.toLowerCase().includes(email.toLowerCase())
    //   );
    // }

    // // 计算总数
    // const total = filteredData.length;

    // // 分页
    // const startIndex = (pageNum - 1) * pageSize;
    // const endIndex = Math.min(startIndex + pageSize, total);
    // const pagedData = filteredData.slice(startIndex, endIndex);

    // // 格式化数据以匹配API返回格式
    // const formattedData = pagedData.map((user) => ({
    //   userId: user.userId,
    //   username: user.username,
    //   nickname: user.nickname,
    //   phone: user.phone,
    //   email: user.email,
    //   status: user.status,
    //   createTime: user.createTime,
    //   roleIds: user.roleIds || [],
    //   roles: user.roles || [],
    // }));

    // resolve({
    //   code: 200,
    //   msg: "查询成功",
    //     data: {
    //       total,
    //       list: formattedData,
    //     },
    //   });
    // }, 300); // 模拟网络延迟
  });
}

/**
 * 获取用户详情
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回用户详情
 */
export function getUserInfo(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUserData.find((item) => item.userId === userId);
      if (user) {
        resolve({
          code: 200,
          data: user,
          msg: "获取成功",
        });
      } else {
        reject({
          code: 404,
          message: "用户不存在",
        });
      }
    }, 300);
  });
}

/**
 * 更新用户状态
 * @param {number} userId - 用户ID
 * @param {string} status - 用户状态
 * @returns {Promise} - 返回操作结果
 */
export function changeUserStatus(userId, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: null,
        msg: "状态修改成功",
      });
    }, 300);
  });
}

/**
 * 获取角色列表
 * @returns {Promise} - 返回角色列表
 */
export function listRoles() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从角色API导入数据
      import("./role").then(({ listRoles }) => {
        listRoles().then((res) => {
          resolve(res);
        });
      });
    }, 300);
  });
}

/**
 * 创建用户
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回创建结果
 */
export function createUser(userData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟创建用户，生成新的用户ID
      const newUserId = mockUserData.length + 1;

      // 构建新用户对象
      const newUser = {
        userId: newUserId,
        username: userData.username,
        nickname: userData.nickname,
        deptName: userData.deptName || "未分配",
        deptId: userData.deptId,
        phone: userData.phone,
        email: userData.email,
        status: userData.status || "0",
        createTime: new Date().toLocaleString(),
        roleIds: userData.roleIds || [],
        roles: userData.roles || [],
        avatar: userData.avatar || "",
      };

      // 将新用户添加到模拟数据中
      mockUserData.push(newUser);

      resolve({
        code: 200,
        data: newUser,
        msg: "创建成功",
      });
    }, 500);
  });
}

/**
 * 更新用户信息
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回更新结果
 */
export function updateUser(userData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockUserData.findIndex(
        (item) => item.userId === userData.userId
      );

      if (index !== -1) {
        // 更新用户信息
        mockUserData[index] = {
          ...mockUserData[index],
          ...userData,
        };

        resolve({
          code: 200,
          data: mockUserData[index],
          msg: "更新成功",
        });
      } else {
        reject({
          code: 404,
          message: "用户不存在",
        });
      }
    }, 500);
  });
}

/**
 * 分配用户角色
 * @param {Object} data - 包含用户ID和角色ID数组的数据
 * @returns {Promise} - 返回操作结果
 */
export function assignUserRoles(data) {
  return new Promise((resolve, reject) => {
    request
      .post("/user/assignRoles", data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 删除用户
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回删除结果
 */
export function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    request
      .delete(`/user/${userId}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 上传用户头像
 * @param {File} file - 头像文件
 * @returns {Promise} - 返回上传结果
 */
export function uploadAvatar(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟文件上传，返回随机头像URL
      const avatarUrls = [
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      ];

      const randomAvatar =
        avatarUrls[Math.floor(Math.random() * avatarUrls.length)];

      resolve({
        code: 200,
        data: {
          url: randomAvatar,
          filename: file.name,
        },
        msg: "上传成功",
      });
    }, 1000); // 模拟上传延迟
  });
}

/**
 * 更新个人资料
 * @param {Object} profileData - 个人资料数据
 * @returns {Promise} - 返回更新结果
 */
export function updateProfile(profileData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 获取当前登录用户ID（通常从store或localStorage获取）
      // 这里模拟从store获取
      import("@/store").then(({ useUserStore }) => {
        const userStore = useUserStore();
        const userId = userStore.userInfo.userId;

        if (!userId) {
          reject({
            code: 401,
            message: "未登录或登录已过期",
          });
          return;
        }

        // 查找用户
        const index = mockUserData.findIndex((item) => item.userId === userId);

        if (index !== -1) {
          // 更新用户信息
          mockUserData[index] = {
            ...mockUserData[index],
            ...profileData,
          };

          // 同步更新store中的用户信息
          userStore.userInfo = {
            ...userStore.userInfo,
            ...profileData,
          };

          resolve({
            code: 200,
            data: mockUserData[index],
            msg: "个人资料更新成功",
          });
        } else {
          reject({
            code: 404,
            message: "用户不存在",
          });
        }
      });
    }, 500);
  });
}

/**
 * 获取用户角色信息
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回用户角色信息
 */
export function getUserRoles(userId) {
  return new Promise((resolve, reject) => {
    request
      .get(`/user/info`, {
        params: {
          userId,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
