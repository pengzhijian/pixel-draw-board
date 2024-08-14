const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const express = require('express')
// 跨域 https://www.jianshu.com/p/c3d7e73d37e5
const cors = require('cors');

const app = express()
// 解决跨域中间件
app.use(cors());
// 手动
// app.use((req, res, next) => {
// res.header('Access-Control-Allow-Origin', '*')
// res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
// res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
// res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
// next();
// });

// body中间件 用post就要这个
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/pixel_cat')

// 像素图存储格式
const pixelSchema = mongoose.Schema({
  css: String,
  name: String
})

const pixels = mongoose.model('pixels', pixelSchema)

app.all('/', function (req, res) {
  res.send('all request to homepage')
})

const success_data = {
  data: {},
  state: 'SUCCESS'
}
const false_data = {
  data: {},
  msg: '',
  state: 'NO'
}
// 统一结构
// res {
//   data: {},
//   state: 'SUCCESS'
// }
// 参数 css: ''
app.post('/save_css', function (req, res) {
  // 错误处理
  if (!req.body.css) {
    false_data.msg = '没传css参数'
    res.send(false_data)
  } else if (!req.body.name) {
    false_data.msg = '没传name参数'
    res.send(false_data)
  } else {
    // 成功
    success_data.data.css = req.body.css
    success_data.data.name = req.body.name
    let a = new pixels({
      css: req.body.css,
      name: req.body.name
    })
    a.save().then(res => {
      console.log('保存成功', res)
    }).catch(err => {
      console.log('保存失败', err)
    })
    res.send(success_data)
  }
})

// 读取css
app.get('/get_css', function (req, res) {
  // 错误处理
  if (!req.query.name) {
    false_data.msg = '没传name参数'
    res.send(req.hostname)
  } else {
    // 成功
    success_data.data.css = req.query.css
    success_data.data.name = req.query.name
    pixels.find({name: req.query.name}).then(res2 => {
      if (!!res2) {
       res.send(res2[0].css)
      }
      console.log('成功了')
      console.log(res2[0])
    }).catch(err => {
      console.log('失败了')
      success_data.msg = '不存在该数据'
      res.send(success_data)
    })
  }
})

app.listen(8000, () => {
  console.log('服务器启动')
})