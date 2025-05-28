import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { getToken } from "@/utils/auth";
import { useUserStore } from "@/store";

// 创建axios实例
const baseURL = "https://m1.apifoxmock.com/m1/6409600-6106818-default";

const service = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加token到请求头
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 如果返回的状态码不是200，则认为是错误
    if (res.code !== 200) {
      ElMessage({
        message: res.message || "请求失败",
        type: "error",
        duration: 5 * 1000,
      });

      // 401: 未登录或token过期
      if (res.code === 401) {
        // 询问用户是否重新登录
        ElMessageBox.confirm("登录状态已过期，请重新登录", "系统提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          const userStore = useUserStore();
          userStore.resetToken().then(() => {
            // 刷新页面
            location.reload();
          });
        });
      }

      return Promise.reject(new Error(res.message || "请求失败"));
    } else {
      return res;
    }
  },
  (error) => {
    console.error("响应错误:", error);

    // 根据不同的HTTP状态码显示不同的错误信息
    let message = "请求失败";
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 400:
          message = "请求错误";
          break;
        case 401:
          message = "未授权，请登录";
          // 处理未授权情况，清除token并跳转到登录页
          {
            const userStore = useUserStore();
            userStore.resetToken().then(() => {
              location.href = "/login";
            });
          }
          break;
        case 403:
          message = "拒绝访问";
          break;
        case 404:
          message = "请求地址出错";
          break;
        case 408:
          message = "请求超时";
          break;
        case 500:
          message = "服务器内部错误";
          break;
        case 501:
          message = "服务未实现";
          break;
        case 502:
          message = "网关错误";
          break;
        case 503:
          message = "服务不可用";
          break;
        case 504:
          message = "网关超时";
          break;
        case 505:
          message = "HTTP版本不受支持";
          break;
        default:
          message = `未知错误(${status})`;
      }
    } else if (error.message.includes("timeout")) {
      message = "请求超时";
    } else if (error.message.includes("Network")) {
      message = "网络连接异常";
    } else {
      message = error.message;
    }

    ElMessage({
      message,
      type: "error",
      duration: 5 * 1000,
    });

    return Promise.reject(error);
  }
);

// 封装请求方法
const request = {
  get(url, params, config = {}) {
    return service.get(url, { params, ...config });
  },
  post(url, data, config = {}) {
    return service.post(url, data, config);
  },
  put(url, data, config = {}) {
    return service.put(url, data, config);
  },
  delete(url, params, config = {}) {
    return service.delete(url, { params, ...config });
  },
};

export default request;
