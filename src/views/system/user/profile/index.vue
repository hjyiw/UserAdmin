<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>
          <div class="text-center">
            <el-avatar
              :size="100"
              :src="
                userInfo.avatar ||
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
              "
            />
          </div>
          <ul class="list-group list-group-striped">
            <li class="list-group-item">
              <div class="user-info-label">用户名</div>
              <div class="user-info-value">{{ userInfo.username }}</div>
            </li>
            <li class="list-group-item">
              <div class="user-info-label">昵称</div>
              <div class="user-info-value">{{ userInfo.nickname }}</div>
            </li>
            <li class="list-group-item">
              <div class="user-info-label">邮箱</div>
              <div class="user-info-value">{{ userInfo.email }}</div>
            </li>
            <li class="list-group-item">
              <div class="user-info-label">角色</div>
              <div class="user-info-value">{{ userRoles }}</div>
            </li>
            <li class="list-group-item">
              <div class="user-info-label">创建时间</div>
              <div class="user-info-value">2023-01-01</div>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-tabs v-model="activeTab">
                <el-tab-pane label="基本资料" name="basic"
                  >基本资料</el-tab-pane
                >
                <el-tab-pane label="修改密码" name="password"
                  >修改密码</el-tab-pane
                >
              </el-tabs>
            </div>
          </template>

          <!-- 基本资料 -->
          <el-form
            v-if="activeTab === 'basic'"
            :model="profileForm"
            :rules="profileRules"
            ref="profileFormRef"
            label-width="100px"
          >
            <el-form-item label="用户昵称" prop="nickname">
              <el-input
                v-model="profileForm.nickname"
                placeholder="请输入用户昵称"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="profileForm.phone"
                placeholder="请输入手机号码"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="handleUpdateProfile"
                >保存</el-button
              >
            </el-form-item>
          </el-form>

          <!-- 修改密码 -->
          <password-form v-if="activeTab === 'password'" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";
import { updateProfile } from "@/api/user";
import PasswordForm from "./password.vue";

const userStore = useUserStore();
const activeTab = ref("basic");
const profileFormRef = ref(null);
const loading = ref(false);

// 用户信息
const userInfo = computed(() => userStore.userInfo);

// 用户角色
const userRoles = computed(() => {
  return userInfo.value.roles ? userInfo.value.roles.join(", ") : "";
});

// 个人资料表单
const profileForm = reactive({
  nickname: "",
  email: "",
  phone: "",
});

// 表单校验规则
const profileRules = {
  nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  phone: [
    { required: false, message: "请输入手机号码", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
};

// 初始化表单数据
onMounted(() => {
  if (userInfo.value) {
    profileForm.nickname = userInfo.value.nickname || "";
    profileForm.email = userInfo.value.email || "";
    profileForm.phone = userInfo.value.phone || "";
  }
});

// 更新个人资料
const handleUpdateProfile = () => {
  profileFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;

      // 调用API更新个人资料
      updateProfile({
        nickname: profileForm.nickname,
        email: profileForm.email,
        phone: profileForm.phone,
      })
        .then((response) => {
          ElMessage.success(response.msg || "个人资料修改成功");
        })
        .catch((error) => {
          ElMessage.error(error.message || "个人资料修改失败");
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.app-container {
  .box-card {
    margin-bottom: 20px;
  }

  .text-center {
    text-align: center;
    margin-bottom: 20px;
  }

  .list-group {
    padding: 0;
    margin: 0;
    list-style: none;

    .list-group-item {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      display: flex;

      &:last-child {
        border-bottom: none;
      }

      .user-info-label {
        color: #909399;
        width: 80px;
      }

      .user-info-value {
        flex: 1;
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
