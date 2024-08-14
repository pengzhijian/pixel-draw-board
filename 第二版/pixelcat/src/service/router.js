const express = require('express')
const router = express.Router()
const pixels = require('./db.js')

// 统一结构
// 成功结构
const success_data = {
  data: {},
  state: 'SUCCESS'
}
// 失败结构
const false_data = {
  data: {},
  msg: '',
  state: 'NO'
}

// 测试接口
router.all('/', function (req, res) {
  res.send('all request to homepage')
})

// 存储接口 存储单个像素画到数据库   参数：css,name
router.post('/save_css', function (req, res) {
  // 错误处理
  if (!req.body.css) {
    false_data.msg = '没传css参数'
    res.send(false_data)
  } else if (!req.body.name) {
    false_data.msg = '没传name参数'
    res.send(false_data)
  } else {
    // 成功
    let a = new pixels({
      css: req.body.css,
      name: req.body.name,
      width: req.body.width,
      height: req.body.height,
      size: req.body.size
    })
    console.log(req.body)
    // 存到数据库
    a.save().then(res2 => {
      success_data.data.css = req.body.css
      success_data.data.name = req.body.name
      success_data.data.size = req.body.size
      success_data.data.width = req.body.width
      success_data.data.height = req.body.height
      res.send(success_data)
    }).catch(err => {
      false_data.msg = '保存到数据库失败！'
      res.send(false_data)
    })
  }
})


// 查询数据库 获取单个像素画  参数 c_id
// 结构
// {
//   c_id: xx,
//   css: xx,
//   name: xx
// }
router.get('/get_css', function (req, res) {
  // 错误处理
  if (!req.query.c_id) {
    false_data.msg = '没传c_id'
    res.send(req.query)
  } else {
    // 成功
    pixels.findById(req.query.c_id).then(res2 => {
      success_data.data = res2
      res.send(success_data)
    }).catch(err => {
      false_data.msg = '不存在该数据'
      res.send(false_data)
    })
  }
})

// 删除数据库 删除单个像素画 参数 c_id
router.get('/delete_css', function (req, res) {
  // 错误处理
  if (!req.query.c_id) {
    false_data.msg = '没传c_id'
    res.send(req.query)
  } else {
    pixels.findByIdAndDelete(req.query.c_id).then(res2 => {
      if (!!res2) {
        success_data.data = '删除成功'
        res.send(success_data)
      } else {
        false_data.msg = '删除失败，数据不存在'
        res.send(false_data)
      }
    }).catch(err => {
      false_data.msg = '删除失败'
      res.send(false_data)
    })
  }
})

// 读取数据库 获取所有像素画列表
router.get('/get_all_css', function (req, res) {
  pixels.find().then(res2 => {
    let a = []
    res2.forEach((item, index) => {
      a[index] = {}
      a[index].name = item.name
      a[index].css = item.css
      a[index].width = item.width
      a[index].height = item.height
      a[index].size = item.size
      a[index].c_id = item._id
    })
    success_data.data = a
    res.send(success_data)
  }).catch(err => {
    false_data.msg = '不存在该数据'
    res.send(false_data)
  })
})

// 图片测试
router.get('/get_img', function (req, res) {
  res.send('123')
})


module.exports = router
