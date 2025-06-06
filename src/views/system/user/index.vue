<template>
  <div class="user-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button
            type="primary"
            @click="handleAdd"
            v-permission="'system:user:add'"
            >新增用户</el-button
          >
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
        <el-table-column
          label="角色"
          align="center"
          width="180"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <el-tag
              v-for="role in scope.row.roles"
              :key="role"
              size="small"
              class="role-tag-item"
            >
              {{ role }}
            </el-tag>
            <span v-if="!scope.row.roles || scope.row.roles.length === 0">
              未分配
            </span>
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
              v-permission="'system:user:alter'"
            >
              <el-icon><Edit /></el-icon> 修改
            </el-button>
            <el-button
              type="success"
              link
              @click="handleRoleAssign(scope.row)"
              v-permission="'system:user:assign'"
            >
              <el-icon><Connection /></el-icon> 分配角色
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(scope.row)"
              v-permission="'system:user:delete'"
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
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
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

    <!-- 角色分配对话框 -->
    <el-dialog
      title="分配角色"
      v-model="roleAssignVisible"
      width="500px"
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="roleAssignFormRef"
        :model="roleAssignForm"
        label-width="100px"
      >
        <el-form-item label="用户名称">
          <span>{{ roleAssignForm.username }}</span>
        </el-form-item>
        <el-form-item label="已分配角色" prop="roleIds">
          <el-select
            v-model="roleAssignForm.roleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
            :disabled="roleAssignForm.username === 'admin'"
          >
            <el-option
              v-for="role in roleOptions"
              :key="role.roleId"
              :label="role.roleName"
              :value="role.roleId"
              :disabled="role.status === '1'"
            >
              <span>{{ role.roleName }}</span>
            </el-option>
          </el-select>
          <div class="role-info" v-if="selectedRoles.length > 0">
            <p class="role-info-title">已选角色权限说明：</p>
            <el-tag
              v-for="role in selectedRoles"
              :key="role.roleId"
              class="role-tag"
              :type="role.status === '0' ? '' : 'info'"
            >
              {{ role.roleName }}
              <el-tooltip :content="role.remark || '无说明'" placement="top">
                <el-icon class="role-info-icon"><InfoFilled /></el-icon>
              </el-tooltip>
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleAssignVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitRoleAssign"
            :loading="submitLoading"
            :disabled="roleAssignForm.username === 'admin'"
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
  InfoFilled,
} from "@element-plus/icons-vue";
import {
  listUsers,
  listRoles,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
  assignUserRoles,
  getUserRoles,
} from "@/api/user";
import { formRules } from "@/utils/validate";
import { useUserStore } from "@/store";
import { checkPermission } from "@/utils/permission";

// 加载状态
const loading = ref(false);
// 提交状态
const submitLoading = ref(false);
// 用户列表数据
const userList = ref([]);
// 总条数
const total = ref(0);
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
});

// 用户表单数据
const userForm = reactive({
  userId: undefined,
  username: "",
  nickname: "",
  password: "",
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
  roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
});

// 根据数据权限过滤后的用户列表
const filteredUserList = computed(() => userList.value);

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

// 获取角色列表
const getRoleOptions = async () => {
  try {
    const res = await listRoles();
    if (res.data && res.data.list) {
      // 如果返回的是分页格式，取出list
      roleOptions.value = res.data.list;
    } else if (Array.isArray(res.data)) {
      // 如果直接返回的是数组
      roleOptions.value = res.data;
    } else {
      // 其他情况设为空数组
      roleOptions.value = [];
      console.error("获取角色列表格式不正确:", res);
    }
  } catch (error) {
    roleOptions.value = [];
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
// 重置表单
const resetForm = () => {
  userFormRef.value?.resetFields();
  Object.assign(userForm, {
    userId: undefined,
    username: "",
    nickname: "",
    password: "",
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
  getRoleOptions(); // 获取角色列表
};

// 修改用户按钮操作
const handleEdit = (row) => {
  resetForm();
  dialogTitle.value = "修改用户";

  dialogVisible.value = true;
  getRoleOptions(); // 获取角色列表

  // 填充表单数据
  Object.assign(userForm, {
    userId: row.userId,
    username: row.username,
    nickname: row.nickname,
    phone: row.phone,
    email: row.email,
    status: row.status,
    roleIds: row.roleIds,
    avatar: row.avatar || "",
  });
};

// 角色分配对话框可见性
const roleAssignVisible = ref(false);
// 角色分配表单引用
const roleAssignFormRef = ref(null);
// 角色分配表单数据
const roleAssignForm = reactive({
  userId: undefined,
  username: "",
  roleIds: [],
});

// 计算已选择的角色详细信息
const selectedRoles = computed(() => {
  if (!roleOptions.value || !Array.isArray(roleOptions.value)) {
    return [];
  }
  return roleOptions.value.filter((role) =>
    roleAssignForm.roleIds.includes(role.roleId)
  );
});

// 分配角色按钮操作
const handleRoleAssign = async (row) => {
  roleAssignForm.userId = row.userId;
  roleAssignForm.username = row.username;
  roleAssignForm.roleIds = row.roleIds || [];

  submitLoading.value = true;

  try {
    // 确保获取角色列表数据
    if (!roleOptions.value || roleOptions.value.length === 0) {
      await getRoleOptions();
    }

    // 获取用户的角色信息
    if (!row.roleIds || row.roleIds.length === 0) {
      try {
        const res = await getUserRoles(row.userId);
        if (res.data && res.data.user && res.data.user.roleIds) {
          roleAssignForm.roleIds = res.data.user.roleIds;
        }
      } catch (error) {
        console.error("获取用户角色信息失败:", error);
      }
    }

    roleAssignVisible.value = true;
  } catch (error) {
    ElMessage.error("获取角色列表失败");
    console.error(error);
  } finally {
    submitLoading.value = false;
  }
};

// 提交角色分配
const submitRoleAssign = async () => {
  submitLoading.value = true;
  try {
    // 构建提交数据
    const submitData = {
      userId: roleAssignForm.userId,
      roleIds: roleAssignForm.roleIds,
    };

    // 更新用户角色
    const res = await assignUserRoles(submitData);

    // 刷新用户列表
    getUserList();

    ElMessage.success(res.msg || "角色分配成功");
    roleAssignVisible.value = false;
  } catch (error) {
    ElMessage.error(error.message || "角色分配失败");
  } finally {
    submitLoading.value = false;
  }
};

// 删除用户按钮操作
const handleDelete = (row) => {
  // 不允许删除管理员账号
  if (row.username === "admin") {
    ElMessage.warning("系统管理员账号不能删除");
    return;
  }

  ElMessageBox.confirm(`确认删除用户 ${row.username} 吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const res = await deleteUser(row.userId);
        if (res.code === 200) {
          getUserList();
          ElMessage.success(res.msg || "删除成功");
        } else {
          ElMessage.error(res.msg || "删除失败");
        }
      } catch (error) {
        ElMessage.error(error.message || "删除失败");
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
        // 构建提交数据
        const submitData = {
          ...userForm,
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

onMounted(() => {
  getUserList();
  getRoleOptions();
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

  .role-info {
    margin-top: 10px;
    border-top: 1px dashed #dcdfe6;
    padding-top: 10px;

    .role-info-title {
      font-size: 12px;
      color: #606266;
      margin-bottom: 8px;
    }

    .role-tag {
      margin-right: 8px;
      margin-bottom: 8px;
      display: inline-flex;
      align-items: center;

      .role-info-icon {
        margin-left: 5px;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }

  .role-tag-item {
    margin-right: 4px;
    margin-bottom: 4px;
  }
}
</style>
