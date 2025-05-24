// 部门管理相关API
import { DATA_SCOPE_TYPES } from "@/utils/permission";
import { mockDeptData, flatDeptData, mockUserData } from "@/api/mockData";

// 模拟当前用户权限数据
const currentUserPermissions = {
  roles: ["admin"],
  dataScope: DATA_SCOPE_TYPES.ALL,
  deptId: 1,
  deptIds: [],
};

/**
 * 获取部门用户列表
 * @param {number} deptId - 部门ID
 * @returns {Promise} - 返回部门用户列表
 */
export function listDepartmentUsers(deptId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据部门ID筛选用户
      let users = [];

      if (deptId) {
        // 确保deptId是数字类型
        const numDeptId = typeof deptId === "string" ? Number(deptId) : deptId;

        // 如果指定了部门ID，筛选该部门的用户
        users = mockUserData.filter((user) => user.deptId === numDeptId);
      } else {
        // 否则返回所有用户
        users = [...mockUserData];
      }

      resolve({
        code: 200,
        data: users,
        msg: "获取成功",
      });
    }, 300);
  });
}

/**
 * 获取部门列表
 * @param {Object} params - 查询参数
 * @param {Object} userInfo - 用户权限信息，可选，用于权限过滤
 * @returns {Promise} - 返回部门列表数据
 */
export function listDepartment(params, userInfo = currentUserPermissions) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { deptName, status } = params || {};

      // 深拷贝原始数据
      let result = JSON.parse(JSON.stringify(mockDeptData));

      // 如果有查询条件，则进行过滤
      if (deptName || (status !== undefined && status !== "")) {
        // 使用扁平化数据进行过滤
        let filtered = flatDeptData;

        if (deptName) {
          filtered = filtered.filter((dept) =>
            dept.deptName.toLowerCase().includes(deptName.toLowerCase())
          );
        }

        if (status !== undefined && status !== "") {
          filtered = filtered.filter((dept) => dept.status === status);
        }

        // 重建树形结构
        result = buildDeptTree(filtered);
      }

      // 应用数据权限过滤
      if (!userInfo.roles.includes("admin")) {
        const dataScope = userInfo.dataScope || DATA_SCOPE_TYPES.SELF;
        const userDeptId = userInfo.deptId;

        if (dataScope === DATA_SCOPE_TYPES.DEPT) {
          // 本部门数据权限
          result = filterDeptByDeptId(result, userDeptId);
        } else if (dataScope === DATA_SCOPE_TYPES.DEPT_AND_CHILD) {
          // 本部门及以下数据权限
          result = filterDeptByDeptIdAndChild(result, userDeptId);
        } else if (dataScope === DATA_SCOPE_TYPES.CUSTOM) {
          // 自定义数据权限
          const deptIds = userInfo.deptIds || [];
          result = filterDeptByDeptIds(result, deptIds);
        } else if (dataScope === DATA_SCOPE_TYPES.SELF) {
          // 仅本人数据权限 - 对于部门管理，通常没有"本人"的概念，这里可以限制为空
          result = [];
        }
        // DATA_SCOPE_TYPES.ALL 不需要过滤
      }

      resolve({
        code: 200,
        data: result,
        msg: "查询成功",
      });
    }, 300);
  });
}

/**
 * 根据部门ID获取部门信息
 * @param {number} deptId - 部门ID
 * @returns {Promise} - 返回部门信息
 */
export function getDepartment(deptId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dept = flatDeptData.find((item) => item.deptId === deptId);

      if (dept) {
        resolve({
          code: 200,
          data: dept,
          msg: "获取成功",
        });
      } else {
        reject({
          code: 404,
          message: "部门不存在",
        });
      }
    }, 300);
  });
}

/**
 * 创建部门
 * @param {Object} deptData - 部门数据
 * @returns {Promise} - 返回创建结果
 */
export function createDepartment(deptData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成新的部门ID
      const newDeptId =
        Math.max(...flatDeptData.map((dept) => dept.deptId)) + 1;

      // 构建新部门对象
      const newDept = {
        deptId: newDeptId,
        deptName: deptData.deptName,
        parentId: deptData.parentId || 0,
        orderNum: deptData.orderNum || 1,
        leader: deptData.leader || "",
        phone: deptData.phone || "",
        email: deptData.email || "",
        status: deptData.status || "0",
        createTime: new Date().toLocaleString(),
      };

      // 将新部门添加到扁平化数据中
      flatDeptData.push(newDept);

      // 如果是顶级部门，直接添加到mockDeptData
      if (newDept.parentId === 0) {
        mockDeptData.push(newDept);
      } else {
        // 否则，找到父部门并添加到其children中
        addChildDept(mockDeptData, newDept);
      }

      resolve({
        code: 200,
        data: newDept,
        msg: "创建成功",
      });
    }, 500);
  });
}

/**
 * 更新部门信息
 * @param {Object} deptData - 部门数据
 * @returns {Promise} - 返回更新结果
 */
export function updateDepartment(deptData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = flatDeptData.findIndex(
        (item) => item.deptId === deptData.deptId
      );

      if (index !== -1) {
        // 获取更新前的部门信息
        const oldDeptData = { ...flatDeptData[index] };

        // 更新扁平化数据中的部门信息
        flatDeptData[index] = { ...flatDeptData[index], ...deptData };

        // 更新树形结构中的部门信息
        updateDeptInTree(mockDeptData, deptData);

        // 如果部门名称发生变化，需要更新用户数据中的部门名称
        if (deptData.deptName && deptData.deptName !== oldDeptData.deptName) {
          // 查找所有属于该部门的用户
          const affectedUsers = mockUserData.filter(
            (user) => user.deptId === deptData.deptId
          );

          // 更新用户的部门名称
          affectedUsers.forEach((user) => {
            user.deptName = deptData.deptName;
          });

          console.log(
            `已更新${affectedUsers.length}个用户的部门名称为"${deptData.deptName}"`
          );
        }

        resolve({
          code: 200,
          data: flatDeptData[index],
          msg: "更新成功",
        });
      } else {
        reject({
          code: 404,
          message: "部门不存在",
        });
      }
    }, 500);
  });
}

/**
 * 删除部门
 * @param {number} deptId - 部门ID
 * @returns {Promise} - 返回删除结果
 */
export function deleteDepartment(deptId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查是否有子部门
      const hasChildren = flatDeptData.some((item) => item.parentId === deptId);

      if (hasChildren) {
        reject({
          code: 400,
          message: "存在下级部门，不允许删除",
        });
        return;
      }

      // 从扁平化数据中删除
      const index = flatDeptData.findIndex((item) => item.deptId === deptId);

      if (index !== -1) {
        // 获取被删除部门的信息
        const deletedDept = flatDeptData[index];

        // 从扁平化数据中删除部门
        flatDeptData.splice(index, 1);

        // 从树形结构中删除部门
        deleteDeptFromTree(mockDeptData, deptId);

        // 更新用户数据中的部门信息
        // 查找所有属于被删除部门的用户
        const affectedUsers = mockUserData.filter(
          (user) => user.deptId === deptId
        );

        // 更新这些用户的部门信息为总公司部门（默认部门）
        affectedUsers.forEach((user) => {
          user.deptId = 1; // 设置为总公司部门
          user.deptName = "总公司"; // 更新部门名称
          user.deptPath = "0,1"; // 更新部门路径

          // 如果用户有自定义数据权限，也需要更新
          if (
            user.dataScope === "2" &&
            user.deptIds &&
            user.deptIds.includes(deptId)
          ) {
            // 从自定义数据权限中移除被删除的部门
            user.deptIds = user.deptIds.filter((id) => id !== deptId);
          }
        });

        console.log(
          `已将${affectedUsers.length}个用户的部门从ID=${deptId}更新为总公司`
        );

        resolve({
          code: 200,
          data: null,
          msg: "删除成功",
        });
      } else {
        reject({
          code: 404,
          message: "部门不存在",
        });
      }
    }, 500);
  });
}

/**
 * 更新部门状态
 * @param {number} deptId - 部门ID
 * @param {string} status - 部门状态
 * @returns {Promise} - 返回操作结果
 */
export function changeDepartmentStatus(deptId, status) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dept = flatDeptData.find((item) => item.deptId === deptId);

      if (dept) {
        dept.status = status;

        // 更新树形结构中的状态
        updateDeptInTree(mockDeptData, { deptId, status });

        // 如果部门被停用(status="1")，需要处理该部门下的用户
        if (status === "1") {
          // 查找所有属于该部门的用户
          const affectedUsers = mockUserData.filter(
            (user) => user.deptId === deptId
          );

          // 记录处理的用户数量
          let processedCount = 0;

          // 如果用户所在部门被停用，将用户状态也设置为停用
          affectedUsers.forEach((user) => {
            if (user.status === "0") {
              user.status = "1"; // 设置用户为停用状态
              processedCount++;
            }
          });

          if (processedCount > 0) {
            console.log(`已将${processedCount}个用户随部门一起停用`);
          }
        }

        resolve({
          code: 200,
          data: null,
          msg: "状态修改成功",
        });
      } else {
        reject({
          code: 404,
          message: "部门不存在",
        });
      }
    }, 300);
  });
}

/**
 * 构建部门选择器数据
 * @param {Array} depts - 部门数据
 * @param {number} level - 层级
 * @returns {Array} - 部门选择器数据
 */
function buildDeptOptions(depts, level = 0) {
  const options = [];

  depts.forEach((dept) => {
    // 构建选项 - 去掉所有前缀符号
    const prefix = "";

    const option = {
      value: dept.deptId,
      label: prefix + dept.deptName,
      // 研发部门设置为禁用状态
      disabled: dept.deptName === "研发部门",
    };

    if (dept.children && dept.children.length > 0) {
      option.children = buildDeptOptions(dept.children, level + 1);
    }

    options.push(option);
  });

  return options;
}

/**
 * 获取部门选择器数据（用于下拉选择）
 * @returns {Promise} - 返回部门选择器数据
 */
export function listDepartmentSelector() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 构建部门选择器数据（树形结构）
      const deptOptions = buildDeptOptions(mockDeptData);

      resolve({
        code: 200,
        data: deptOptions,
        msg: "获取成功",
      });
    }, 300);
  });
}

/**
 * 构建部门树形结构
 * @param {Array} depts - 扁平化的部门数据
 * @returns {Array} - 树形结构的部门数据
 */
function buildDeptTree(depts) {
  const deptMap = {};
  const result = [];

  // 创建映射
  depts.forEach((dept) => {
    deptMap[dept.deptId] = { ...dept, children: [] };
  });

  // 构建树结构
  depts.forEach((dept) => {
    const parentId = dept.parentId;
    if (parentId === 0) {
      // 根节点
      result.push(deptMap[dept.deptId]);
    } else {
      // 子节点
      if (deptMap[parentId]) {
        deptMap[parentId].children.push(deptMap[dept.deptId]);
      }
    }
  });

  return result;
}

/**
 * 将子部门添加到树形结构中
 * @param {Array} depts - 部门数据
 * @param {Object} childDept - 子部门
 */
function addChildDept(depts, childDept) {
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].deptId === childDept.parentId) {
      if (!depts[i].children) {
        depts[i].children = [];
      }
      depts[i].children.push(childDept);
      return true;
    }

    if (depts[i].children && depts[i].children.length > 0) {
      if (addChildDept(depts[i].children, childDept)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 更新树形结构中的部门信息
 * @param {Array} depts - 部门数据
 * @param {Object} deptData - 部门更新数据
 */
function updateDeptInTree(depts, deptData) {
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].deptId === deptData.deptId) {
      depts[i] = { ...depts[i], ...deptData };
      return true;
    }

    if (depts[i].children && depts[i].children.length > 0) {
      if (updateDeptInTree(depts[i].children, deptData)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 从树形结构中删除部门
 * @param {Array} depts - 部门数据
 * @param {number} deptId - 部门ID
 */
function deleteDeptFromTree(depts, deptId) {
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].deptId === deptId) {
      depts.splice(i, 1);
      return true;
    }

    if (depts[i].children && depts[i].children.length > 0) {
      if (deleteDeptFromTree(depts[i].children, deptId)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 根据部门ID过滤部门树
 * @param {Array} depts - 部门树
 * @param {Number} deptId - 部门ID
 * @returns {Array} - 过滤后的部门树
 */
function filterDeptByDeptId(depts, deptId) {
  return depts.filter((dept) => {
    if (dept.deptId === deptId) {
      return true;
    }
    return false;
  });
}

/**
 * 根据部门ID及其子部门过滤部门树
 * @param {Array} depts - 部门树
 * @param {Number} deptId - 部门ID
 * @returns {Array} - 过滤后的部门树
 */
function filterDeptByDeptIdAndChild(depts, deptId) {
  const result = [];

  // 递归查找指定部门及其子部门
  function findDeptAndChildren(departments, targetDeptId) {
    for (const dept of departments) {
      if (dept.deptId === targetDeptId) {
        // 找到目标部门，添加到结果中
        result.push(JSON.parse(JSON.stringify(dept)));
        return true;
      }

      // 在子部门中查找
      if (dept.children && dept.children.length > 0) {
        const found = findDeptAndChildren(dept.children, targetDeptId);
        if (found) {
          return true;
        }
      }
    }
    return false;
  }

  findDeptAndChildren(depts, deptId);
  return result;
}

/**
 * 根据多个部门ID过滤部门树
 * @param {Array} depts - 部门树
 * @param {Array} deptIds - 部门ID数组
 * @returns {Array} - 过滤后的部门树
 */
function filterDeptByDeptIds(depts, deptIds) {
  if (!deptIds || deptIds.length === 0) {
    return [];
  }

  const result = [];

  // 递归查找指定部门
  deptIds.forEach((deptId) => {
    const filteredDepts = filterDeptByDeptIdAndChild(depts, deptId);
    result.push(...filteredDepts);
  });

  return result;
}

// 导出部门数据，供其他模块使用
export { flatDeptData as departmentData };
