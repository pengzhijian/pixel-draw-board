const express = require('express')
const router = require('./router.js')
const bodyParser = require('body-parser')
// 跨域 https://www.jianshu.com/p/c3d7e73d37e5
const cors = require('cors');
const app = express()
// 解决跨域中间件
app.use(cors());

// body中间件 用post就要这个
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)

app.listen(8000, () => {
  console.log('服务器启动')
})

module.exports = app
