<template>
  <div class="forget-container">
    <div class="forget-form">
      <div class="title-container">
        <h3 class="title">忘记密码</h3>
      </div>

      <div v-if="!emailSent">
        <p class="tip-message">
          请输入您注册时使用的电子邮箱，我们将向该邮箱发送密码重置链接。
        </p>

        <el-form
          ref="emailFormRef"
          :model="emailForm"
          :rules="emailRules"
          label-width="0"
        >
          <el-form-item prop="email">
            <el-input
              v-model="emailForm.email"
              placeholder="请输入邮箱"
              type="email"
              prefix-icon="Message"
            />
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 20px"
            @click="handleSendResetEmail"
          >
            发送重置链接
          </el-button>
        </el-form>
      </div>

      <div v-else class="success-message">
        <el-result
          icon="success"
          title="邮件已发送"
          sub-title="密码重置链接已发送到您的邮箱，请查收邮件并按照指示进行操作。"
        >
          <template #extra>
            <el-button type="primary" @click="backToLogin">返回登录</el-button>
          </template>
        </el-result>
      </div>

      <div class="back-container">
        <el-link type="primary" :underline="false" @click="backToLogin"
          >返回登录</el-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";

export default {
  name: "ForgetPassword",
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const emailFormRef = ref(null);
    const loading = ref(false);
    const emailSent = ref(false);

    // 邮箱表单
    const emailForm = reactive({
      email: "",
    });

    // 邮箱验证规则
    const emailRules = {
      email: [
        { required: true, message: "请输入邮箱地址", trigger: "blur" },
        { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
      ],
    };

    // 发送重置邮件
    const handleSendResetEmail = () => {
      emailFormRef.value.validate((valid) => {
        if (valid) {
          loading.value = true;

          userStore
            .sendResetEmail(emailForm.email)
            .then(() => {
              // 模拟环境下，生成一个重置链接供演示
              const resetToken = "reset-" + Date.now();
              const resetLink = `${window.location.origin}/reset-password/${resetToken}`;

              console.log("重置链接（仅演示用）:", resetLink);

              emailSent.value = true;
              ElMessage.success("重置密码邮件已发送，请查收");
            })
            .catch((error) => {
              ElMessage.error(error.message || "发送重置邮件失败");
            })
            .finally(() => {
              loading.value = false;
            });
        }
      });
    };

    // 返回登录页
    const backToLogin = () => {
      router.push("/login");
    };

    return {
      emailFormRef,
      emailForm,
      emailRules,
      loading,
      emailSent,
      handleSendResetEmail,
      backToLogin,
    };
  },
};
</script>

<style lang="scss" scoped>
.forget-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;

  .forget-form {
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
