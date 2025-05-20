<template>
  <el-form
    ref="passwordFormRef"
    :model="passwordForm"
    :rules="passwordRules"
    label-width="100px"
  >
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="passwordForm.oldPassword"
        placeholder="请输入旧密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="passwordForm.newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password
        @input="validateConfirmPassword"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="passwordForm.confirmPassword"
        placeholder="请确认新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="handleUpdatePassword"
        >保存</el-button
      >
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";

export default {
  name: "PasswordForm",
  setup() {
    const userStore = useUserStore();
    const passwordFormRef = ref(null);
    const loading = ref(false);

    // 密码表单
    const passwordForm = reactive({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // 验证确认密码
    const validateConfirmPassword = () => {
      if (passwordForm.confirmPassword) {
        passwordFormRef.value?.validateField("confirmPassword").catch(() => {
          // 捕获验证错误，但不做任何处理
          // 这是为了防止错误被抛出到控制台
        });
      }
    };

    // 密码表单验证规则
    const passwordRules = {
      oldPassword: [
        { required: true, message: "请输入旧密码", trigger: "blur" },
      ],
      newPassword: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
      ],
      confirmPassword: [
        { required: true, message: "请再次输入密码", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value === "") {
              callback(new Error("请再次输入密码"));
            } else if (value !== passwordForm.newPassword) {
              callback(new Error("两次输入密码不一致"));
            } else {
              callback();
            }
          },
          trigger: "blur",
        },
      ],
    };

    // 提交修改密码
    const handleUpdatePassword = () => {
      if (!passwordFormRef.value) {
        ElMessage.error("表单引用不存在");
        return;
      }

      passwordFormRef.value
        .validate()
        .then((valid) => {
          if (valid) {
            loading.value = true;

            // 调用更新密码API
            return userStore
              .updatePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
              })
              .then(() => {
                ElMessage.success("密码修改成功");
                resetForm();
              })
              .catch((error) => {
                ElMessage.error(error.message || "密码修改失败");
              })
              .finally(() => {
                loading.value = false;
              });
          }
        })
        .catch(() => {
          // 捕获验证错误但不处理
          // 表单会自动显示验证错误信息
        });
    };

    // 重置表单
    const resetForm = () => {
      if (passwordFormRef.value) {
        passwordFormRef.value.resetFields();
      }
    };

    return {
      passwordFormRef,
      passwordForm,
      passwordRules,
      loading,
      handleUpdatePassword,
      resetForm,
      validateConfirmPassword,
    };
  },
};
</script>
