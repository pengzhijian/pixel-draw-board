const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/pixel_cat')

// 像素图存储格式
const pixelSchema = mongoose.Schema({
  // 生成的css代码
  css: String,
  // 作品名字
  name: String,
  // 作品画布高度
  height: Number || String,
  // 作品画布宽度
  width: Number || String,
  // 作品像素大小
  size: Number || String
})

const pixels = mongoose.model('pixels', pixelSchema)

module.exports.pixelSchema = pixelSchema

module.exports = pixels