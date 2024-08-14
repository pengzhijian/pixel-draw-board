import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  // baseURL: 'http://120.25.150.213:8000/',
  baseURL: 'http://127.0.0.1:8000/',
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(
config => {
  // 在发送请求之前做些什么
  console.log('config', config)
  // config.url = config.url + '?pzj=123'
  return config
}, 
error => {
  console.log(error)
  // 对请求错误做些什么
  return Promise.reject(error)
}
)

// 添加响应拦截器
request.interceptors.response.use(
  response => {
    console.log('response', response)
    // 对响应数据做点什么
    if (response.data.state === 'SUCCESS') {
      return response.data;
    } else {
      ElMessage(response.data.msg)
      throw response.data
    }
  },
  error => {
    console.log('m_err',error)
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

const get = request.get
const post = request.post
export default request
export {
  request,
  get,
  post
}