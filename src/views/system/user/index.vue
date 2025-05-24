<template>
  <div class="user-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="用户名/昵称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="queryParams.email"
            placeholder="请输入邮箱"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="用户状态"
            clearable
            style="width: 120px"
          >
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-select
            v-model="queryParams.deptId"
            placeholder="请选择部门"
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="dept in deptOptions"
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleQuery">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <el-table
        :data="filteredUserList"
        style="width: 100%"
        v-loading="loading"
        border
        stripe
        highlight-current-row
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="用户编号"
          prop="userId"
          width="80"
          align="center"
        />
        <el-table-column
          label="用户名称"
          prop="username"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="用户昵称"
          prop="nickname"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="部门"
          prop="deptName"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="手机号码"
          prop="phone"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="邮箱"
          prop="email"
          :show-overflow-tooltip="true"
          min-width="150"
        />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'0'"
              :inactive-value="'1'"
              @change="handleStatusChange(scope.row)"
              v-data-perm="{ resource: scope.row, action: 'edit' }"
            />
            <span v-if="!hasPermission(scope.row, 'edit')">
              {{ scope.row.status === "0" ? "正常" : "停用" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="数据权限"
          align="center"
          width="120"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.dataScope === '1'" type="success"
              >全部</el-tag
            >
            <el-tag v-else-if="scope.row.dataScope === '2'" type="warning"
              >自定义</el-tag
            >
            <el-tag v-else-if="scope.row.dataScope === '3'" type="info"
              >本部门</el-tag
            >
            <el-tag v-else-if="scope.row.dataScope === '4'" type="primary"
              >本部门及以下</el-tag
            >
            <el-tag v-else-if="scope.row.dataScope === '5'" type="danger"
              >仅本人</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="160"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" align="center" width="300">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="handleEdit(scope.row)"
              v-data-perm="{ resource: scope.row, action: 'edit' }"
            >
              <el-icon><Edit /></el-icon> 修改
            </el-button>
            <el-button
              type="success"
              link
              @click="handleRoleAssign(scope.row)"
              v-data-perm="{ resource: scope.row, action: 'edit' }"
            >
              <el-icon><Connection /></el-icon> 分配角色
            </el-button>
            <el-button
              type="warning"
              link
              @click="handleDataScope(scope.row)"
              v-data-perm="{ resource: scope.row, action: 'edit' }"
            >
              <el-icon><Key /></el-icon> 数据权限
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(scope.row)"
              v-data-perm="{ resource: scope.row, action: 'delete' }"
            >
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :small="false"
        />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户头像" prop="avatar">
              <el-upload
                class="avatar-uploader"
                :action="''"
                :http-request="handleAvatarUpload"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="userForm.avatar"
                  :src="userForm.avatar"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input
                v-model="userForm.username"
                placeholder="请输入用户名称"
                :disabled="userForm.userId !== undefined"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input
                v-model="userForm.nickname"
                placeholder="请输入用户昵称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <el-select
                v-model="userForm.deptId"
                placeholder="请选择部门"
                style="width: 100%"
              >
                <el-option
                  v-for="dept in deptOptions"
                  :key="dept.deptId"
                  :label="dept.deptName"
                  :value="dept.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password" v-if="!userForm.userId">
              <el-input
                v-model="userForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户状态" prop="status">
              <el-radio-group v-model="userForm.status">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色" prop="roleIds">
              <el-select
                v-model="userForm.roleIds"
                multiple
                placeholder="请选择角色"
                style="width: 100%"
              >
                <el-option
                  v-for="role in roleOptions"
                  :key="role.roleId"
                  :label="role.roleName"
                  :value="role.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :loading="submitLoading"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 数据权限设置对话框 -->
    <el-dialog
      title="数据权限设置"
      v-model="dataScopeVisible"
      width="500px"
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="dataScopeFormRef"
        :model="dataScopeForm"
        label-width="100px"
      >
        <el-form-item label="用户名称">
          <span>{{ dataScopeForm.username }}</span>
        </el-form-item>
        <el-form-item label="部门">
          <span>{{ dataScopeForm.deptName }}</span>
        </el-form-item>
        <el-form-item label="数据权限" prop="dataScope">
          <el-select
            v-model="dataScopeForm.dataScope"
            placeholder="请选择数据权限"
            style="width: 100%"
          >
            <el-option label="全部数据权限" value="1" />
            <el-option label="自定义数据权限" value="2" />
            <el-option label="本部门数据权限" value="3" />
            <el-option label="本部门及以下数据权限" value="4" />
            <el-option label="仅本人数据权限" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限部门" v-if="dataScopeForm.dataScope === '2'">
          <el-select
            v-model="dataScopeForm.deptIds"
            multiple
            placeholder="请选择部门"
            style="width: 100%"
          >
            <el-option
              v-for="dept in deptOptions"
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dataScopeVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitDataScope"
            :loading="submitLoading"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Edit,
  Delete,
  Connection,
  Plus,
  Key,
} from "@element-plus/icons-vue";
import {
  listUsers,
  changeUserStatus,
  listDepartments,
  listRoles,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
} from "@/api/user";
import { formRules } from "@/utils/validate";
import { useUserStore } from "@/store";
import {
  checkDataPermission,
  filterDataByPermission,
  DATA_SCOPE_TYPES,
} from "@/utils/permission";

// 加载状态
const loading = ref(false);
// 提交状态
const submitLoading = ref(false);
// 用户列表数据
const userList = ref([]);
// 总条数
const total = ref(0);
// 部门选项
const deptOptions = ref([]);
// 角色选项
const roleOptions = ref([]);
// 查询表单引用
const queryFormRef = ref(null);
// 用户表单引用
const userFormRef = ref(null);
// 对话框可见性
const dialogVisible = ref(false);
// 对话框标题
const dialogTitle = ref("");
// 用户store
const userStore = useUserStore();

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: "",
  phone: "",
  email: "",
  status: "",
  deptId: undefined,
});

// 用户表单数据
const userForm = reactive({
  userId: undefined,
  username: "",
  nickname: "",
  password: "",
  deptId: undefined,
  phone: "",
  email: "",
  status: "0",
  roleIds: [],
  avatar: "",
});

// 用户表单验证规则
const userRules = reactive({
  username: formRules.username,
  password: formRules.password,
  phone: formRules.phone,
  email: formRules.email,
  nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  deptId: [{ required: true, message: "请选择部门", trigger: "change" }],
  roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
});

// 根据数据权限过滤后的用户列表
const filteredUserList = computed(() => {
  // 如果是管理员，显示所有数据
  if (userStore.roles.includes("admin")) {
    return userList.value;
  }

  // 根据数据权限过滤用户列表
  return filterDataByPermission(userList.value);
});

// 检查是否有指定资源的操作权限
const hasPermission = (resource, action) => {
  return checkDataPermission(resource, action);
};

// 获取用户列表
const getUserList = async () => {
  loading.value = true;
  try {
    const res = await listUsers(queryParams);
    userList.value = res.data.list;
    total.value = res.data.total;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 获取部门列表
const getDeptList = async () => {
  try {
    const res = await listDepartments();
    deptOptions.value = res.data;
  } catch (error) {
    console.error("获取部门列表失败:", error);
  }
};

// 获取角色列表
const getRoleList = async () => {
  try {
    const res = await listRoles();
    roleOptions.value = res.data;
  } catch (error) {
    console.error("获取角色列表失败:", error);
  }
};

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageNum = 1;
  getUserList();
};

// 重置按钮操作
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 每页条数改变
const handleSizeChange = (val) => {
  queryParams.pageSize = val;
  getUserList();
};

// 当前页改变
const handleCurrentChange = (val) => {
  queryParams.pageNum = val;
  getUserList();
};

// 处理用户状态变更
const handleStatusChange = async (row) => {
  try {
    await changeUserStatus(row.userId, row.status);
    ElMessage.success(`${row.username} 状态修改成功`);
  } catch (error) {
    // 状态改变失败，恢复原状态
    row.status = row.status === "0" ? "1" : "0";
    ElMessage.error("状态修改失败");
  }
};

// 重置表单
const resetForm = () => {
  userFormRef.value?.resetFields();
  Object.assign(userForm, {
    userId: undefined,
    username: "",
    nickname: "",
    password: "",
    deptId: undefined,
    phone: "",
    email: "",
    status: "0",
    roleIds: [],
    avatar: "",
  });
};

// 新增用户按钮操作
const handleAdd = () => {
  resetForm();
  dialogTitle.value = "添加用户";
  dialogVisible.value = true;
  getRoleList(); // 获取角色列表
};

// 修改用户按钮操作
const handleEdit = (row) => {
  resetForm();
  dialogTitle.value = "修改用户";
  dialogVisible.value = true;
  getRoleList(); // 获取角色列表

  // 填充表单数据
  Object.assign(userForm, {
    userId: row.userId,
    username: row.username,
    nickname: row.nickname,
    deptId: row.deptId,
    phone: row.phone,
    email: row.email,
    status: row.status,
    roleIds: row.roleIds,
    avatar: row.avatar || "",
  });
};

// 分配角色按钮操作
const handleRoleAssign = (row) => {
  ElMessage.success(`分配角色：${row.username}`);
};

// 删除用户按钮操作
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除用户 ${row.username} 吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteUser(row.userId);
        getUserList();
        ElMessage.success("删除成功");
      } catch (error) {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("上传头像图片只能是 JPG 或 PNG 格式!");
  }
  if (!isLt2M) {
    ElMessage.error("上传头像图片大小不能超过 2MB!");
  }
  return isJPG && isLt2M;
};

// 处理头像上传
const handleAvatarUpload = async (options) => {
  try {
    const res = await uploadAvatar(options.file);
    userForm.avatar = res.data.url;
    ElMessage.success("上传成功");
  } catch (error) {
    ElMessage.error("上传失败");
  }
};

// 提交表单
const submitForm = () => {
  userFormRef.value?.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        // 获取部门名称
        const dept = deptOptions.value.find(
          (item) => item.deptId === userForm.deptId
        );
        const deptName = dept ? dept.deptName : "未分配";

        // 获取角色名称列表
        const roles = userForm.roleIds
          .map((roleId) => {
            const role = roleOptions.value.find(
              (item) => item.roleId === roleId
            );
            return role ? role.roleName : "";
          })
          .filter(Boolean);

        // 构建提交数据
        const submitData = {
          ...userForm,
          deptName,
          roles,
        };

        if (userForm.userId) {
          // 更新用户
          await updateUser(submitData);
          ElMessage.success("修改成功");
        } else {
          // 创建用户
          await createUser(submitData);
          ElMessage.success("创建成功");
        }

        dialogVisible.value = false;
        getUserList(); // 刷新列表
      } catch (error) {
        ElMessage.error(error.message || "操作失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 数据权限对话框可见性
const dataScopeVisible = ref(false);
// 数据权限表单引用
const dataScopeFormRef = ref(null);
// 数据权限表单数据
const dataScopeForm = reactive({
  userId: undefined,
  username: "",
  deptName: "",
  dataScope: "5", // 默认仅本人
  deptIds: [],
});

// 处理数据权限设置
const handleDataScope = (row) => {
  dataScopeForm.userId = row.userId;
  dataScopeForm.username = row.username;
  dataScopeForm.deptName = row.deptName;
  dataScopeForm.dataScope = row.dataScope || "5";
  dataScopeForm.deptIds = row.deptIds || [];

  dataScopeVisible.value = true;
};

// 提交数据权限设置
const submitDataScope = async () => {
  submitLoading.value = true;
  try {
    // 构建提交数据
    const submitData = {
      userId: dataScopeForm.userId,
      dataScope: dataScopeForm.dataScope,
      deptIds: dataScopeForm.dataScope === "2" ? dataScopeForm.deptIds : [],
    };

    // 更新用户数据权限
    await updateUser(submitData);

    // 刷新用户列表
    getUserList();

    ElMessage.success("数据权限设置成功");
    dataScopeVisible.value = false;
  } catch (error) {
    ElMessage.error(error.message || "数据权限设置失败");
  } finally {
    submitLoading.value = false;
  }
};

onMounted(() => {
  getUserList();
  getDeptList();
});
</script>

<style lang="scss" scoped>
.user-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination-container {
    margin-top: 15px;
    text-align: right;
  }

  .avatar-uploader {
    display: flex;
    justify-content: center;

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
    }

    &:hover {
      .avatar-uploader-icon {
        border-color: #409eff;
      }
    }
  }
}
</style>
