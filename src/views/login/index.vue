<template>
  <div class="login-container">
    <el-form
      class="login-form"
      :model="loginForm"
      :rules="loginRules"
      ref="loginFormRef"
    >
      <div class="title-container">
        <h3 class="title">用户管理系统</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="用户名"
          type="text"
          prefix-icon="User"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="密码"
          type="password"
          prefix-icon="Lock"
          show-password
        />
      </el-form-item>

      <div class="remember-container">
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="handleLogin"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const loginFormRef = ref(null);
const loading = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
  rememberMe: false,
});

const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

// 处理登录
const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // 调用store的登录方法
        await userStore.login(loginForm);
        ElMessage.success("登录成功");

        // 获取重定向地址
        const redirect = route.query.redirect || "/";
        router.push({ path: redirect });
      } catch (error) {
        ElMessage.error(error.message || "登录失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

// 页面加载时，尝试加载保存的用户信息
onMounted(() => {
  const savedUserInfo = userStore.loadSavedUserInfo();
  if (savedUserInfo) {
    loginForm.username = savedUserInfo.username;
    loginForm.password = savedUserInfo.password;
    loginForm.rememberMe = savedUserInfo.rememberMe;
  }
});
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;

  .login-form {
    width: 350px;
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

    .remember-container {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
