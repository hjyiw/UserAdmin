<template>
  <div class="reset-container">
    <div class="reset-form">
      <div class="title-container">
        <h3 class="title">重置密码</h3>
      </div>

      <div v-if="!resetSuccess">
        <p class="tip-message">请设置您的新密码</p>

        <el-form
          ref="resetFormRef"
          :model="resetForm"
          :rules="resetRules"
          label-width="0"
        >
          <el-form-item prop="password">
            <el-input
              v-model="resetForm.password"
              placeholder="新密码"
              type="password"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="resetForm.confirmPassword"
              placeholder="确认新密码"
              type="password"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 20px"
            @click="handleResetPassword"
          >
            重置密码
          </el-button>
        </el-form>
      </div>

      <div v-else class="success-message">
        <el-result
          icon="success"
          title="密码已重置"
          sub-title="您的密码已成功重置，请使用新密码登录系统。"
        >
          <template #extra>
            <el-button type="primary" @click="goToLogin">前往登录</el-button>
          </template>
        </el-result>
      </div>

      <div v-if="!resetSuccess" class="back-container">
        <el-link type="primary" :underline="false" @click="goToLogin"
          >返回登录</el-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";

export default {
  name: "ResetPassword",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const resetFormRef = ref(null);
    const loading = ref(false);
    const resetSuccess = ref(false);
    const token = ref("");

    // 重置密码表单
    const resetForm = reactive({
      password: "",
      confirmPassword: "",
    });

    // 密码验证规则
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能小于6位"));
      } else {
        callback();
      }
    };

    // 确认密码验证规则
    const validateConfirmPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== resetForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };

    // 表单验证规则
    const resetRules = {
      password: [{ required: true, validator: validatePass, trigger: "blur" }],
      confirmPassword: [
        { required: true, validator: validateConfirmPass, trigger: "blur" },
      ],
    };

    // 重置密码
    const handleResetPassword = () => {
      resetFormRef.value.validate((valid) => {
        if (valid) {
          loading.value = true;

          const resetInfo = {
            token: token.value,
            password: resetForm.password,
            confirmPassword: resetForm.confirmPassword,
          };

          userStore
            .resetPassword(resetInfo)
            .then(() => {
              resetSuccess.value = true;
              ElMessage.success("密码重置成功");
            })
            .catch((error) => {
              ElMessage.error(error.message || "密码重置失败");
            })
            .finally(() => {
              loading.value = false;
            });
        }
      });
    };

    // 前往登录页
    const goToLogin = () => {
      router.push("/login");
    };

    // 获取URL中的token
    onMounted(() => {
      // 从路由参数中获取token
      token.value = route.params.token || "";

      // 验证token有效性
      if (!token.value) {
        ElMessage.error("无效的重置链接");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    });

    return {
      resetFormRef,
      resetForm,
      resetRules,
      loading,
      resetSuccess,
      handleResetPassword,
      goToLogin,
    };
  },
};
</script>

<style lang="scss" scoped>
.reset-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;

  .reset-form {
    width: 400px;
    padding: 35px 35px 15px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .title-container {
      margin-bottom: 30px;
      text-align: center;

      .title {
        font-size: 26px;
        color: #303133;
        margin: 0;
      }
    }

    .tip-message {
      margin-bottom: 20px;
      color: #606266;
      font-size: 14px;
      text-align: center;
    }

    .success-message {
      margin: 20px 0;
    }

    .back-container {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
