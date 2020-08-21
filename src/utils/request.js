import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import Router from "../router/index";

// 创建axios实例
const service = axios.create({
  baseURL: 'http://192.168.0.196:8020', // api的base_url
  timeout: 500000000000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {

    config.headers.Authorization = "Bearer " + localStorage.getItem("Token")
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)



// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.success) {
      return res;
    } else {
      return res;
    }
  },
  error => {


    if (error.response) {
      if (error.response.status == 401) {
        MessageBox.confirm('你的登录已过期，请重新登录', '重新登录', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          localStorage.clear();
          Router.push({ path: "/login" });

        })
      }
    } else if (error.request) {
    } else {
    }
    Message({
      message: error.response.data.error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  },
)

export default service
