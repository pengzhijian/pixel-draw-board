import request from "../until/request";

// 保存图形  参数 css, name width height size
export const savePixel = data => request({
  url: '/save_css',
  method: 'post',
  data: data
})

// 获取图形列表
export const initPixel = data => request({
  url: '/get_all_css',
  method: 'get',
  params: data
})

// 删除单个图形 参数c_id
export const deletePixel = data => request({
  url: '/delete_css',
  method: 'get',
  params: data
})