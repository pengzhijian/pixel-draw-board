<template>
  <div class="top_box">
    <!-- 调色板 -->
    <div id="color_board_dad">
      <div id="color_board">
        <el-color-picker  v-model="color" show-alpha @active-change='colorChange' ></el-color-picker>
      </div>
      r:{{m_red}}<el-slider :max='255' :min='0' :step='1' v-model="m_red" input-size='mini' @change='sliderChange()'></el-slider>
      g:{{m_green}}<el-slider :max='255' :min='0' :step='1' v-model="m_green" input-size='mini' @change='sliderChange()'></el-slider>
      b:{{m_blue}}<el-slider :max='255' :min='0' :step='1' v-model="m_blue" input-size='mini' @change='sliderChange()'></el-slider>
      a:{{m_t}}<el-slider :max='1' :min='0' :step='0.01' v-model="m_t" input-size='mini' @change='sliderChange()'></el-slider>
    </div>
    <div>
      <el-button type='primary' size='mini' style="margin-bottom:20px;" @click="exportStyle()">导出</el-button>
      <el-input  type="textarea" :autosize='{ minRows: 10, maxRows: 10 }' v-model="style"></el-input>
    </div>
  </div>
  <!-- 画板选项 -->
  宽: <el-input-number size='small' v-model="h_width" controls-position="right" @change='huaBanChange()'  :min="1" :max="100"></el-input-number>
  高：<el-input-number size='small' v-model="h_height" controls-position="right" @change='huaBanChange()' :min="1" :max="100"></el-input-number>
  像素大小：<el-input style="width:50px;" size='mini' v-model="g_size"></el-input>
  <!-- <el-button type='primary' size='mini' @click="huaBanChange()">修改</el-button> -->
  <el-button type='primary' size='mini' @click="clear()">清空</el-button>
  <!-- 画板 -->
  <div id="hua_ban" v-if="bg_arr.length > 0 " @mousedown="">
    <div class="ge_zi" :style="'background-color:' + ((bg_arr[index] !== undefined) ? bg_arr[index].bg_color : '') + ';'" @mouseenter="mouseColor(index)" @click="pointColor(index)" v-for="(item, index) in bg_num" :key="index"></div>
  </div>
</template>

<script>
  import { ref, reactive, computed } from 'vue'
  import { savePixel } from './request/pixel.js'
  export default {
  mounted() {

  },
    setup(props) {

      let { m_red, m_green, m_blue, m_t, color, colorChange, sliderChange } = huaBanColorSet()

      let { h_width, h_height, g_size, css_h_width, css_h_height, css_g_size, bg_num, bg_arr,is_hua_hua,isMouseDown, huaBanChange, pointColor, clear, mouseColor } = huaBanSet(m_red,m_green,m_blue,m_t)
     

      // 导出样式
      let style = ref('')
      function exportStyle () {
        let box_shadow = ''
        for (let i = 0; i < bg_arr.length; i++) {
          if (bg_arr[i].bg_color) {
            box_shadow += `${ g_size.value * (bg_arr[i].row + 1)}px ${ g_size.value * (bg_arr[i].col + 1)}px 0 ${bg_arr[i].bg_color},`
          }
        }
        box_shadow = box_shadow.replace(/\,$/, '')
        style.value = 
        `
        #cat {
          width: ${g_size.value * h_width.value}px;
          height: ${g_size.value * h_height.value}px;
          border: 1px solid black;
        }
        #cat::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: ${g_size.value}px;
          height: ${g_size.value}px;
          box-shadow: ${box_shadow};
        }
        `
        // 清除大于1个的空格
        style.value = style.value.replace(/\s{2,}/g,"")
        savePixel({css: style.value}).then(res => {
          console.log('成功',res)
        }).catch(err => {
          console.log('失败', err)
        })
        // sass的形式，更直观，但是用户需要改scss
        // style = `
        // $size: ${g_size}px; // 1像素的宽度
        // $board_width: ${h_width};
        // $board_height: ${h_height};
        // #cat {
        //   width: $board_width * $size;
        //   height: $board_height * $size;
        //   border: 1px solid black;
        //   &::after {
        //     content: '';
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     width: $size;
        //     height: $size;
        //     box-shadow: $size * $row $size * $col 0 red,$size $size * 2 0 green ;
        //   }
        // }
        // `
      }
      let a = 5
      return {
        colorChange,
        color,
        sliderChange,
        m_red,
        m_green,
        m_blue,
        m_t,
        h_width,
        h_height,
        g_size,
        css_h_width,
        css_h_height,
        css_g_size,
        a,
        bg_arr,
        bg_num,
        pointColor,
        mouseColor,
        style,
        exportStyle,
        huaBanChange,
        clear
      }
    }
  }

  // 调色板
  function huaBanColorSet() {
      // 色板属性
      let m_red = ref(100)
      let m_green = ref(100)
      let m_blue = ref(100)
      let m_t = ref(10)
      let color = ref('rgba(19, 206, 102, 0.8)');
      // 调色板改变
      function colorChange(c) {
        console.log('颜色', c)
        color.value = c
        let a = c.replace(/rgba\(/,'').replace(/\)/, '')
        let rgba = a.split(',')
        m_red.value = parseInt(rgba[0])
        m_green.value = parseInt(rgba[1])
        m_blue.value = parseInt(rgba[2])
        m_t.value = parseFloat(rgba[3])
      }
      // 滑动条改变
      function sliderChange() {
        color.value = `rgba(${m_red.value},${m_green.value},${m_blue.value},${m_t.value})`
      }
      return {
        m_red,m_green,m_blue,m_t,color,
        colorChange,
        sliderChange
      }
  }
  
  function huaBanSet (m_red,m_green,m_blue,m_t) {
    
      // 画板属性
      let h_width = ref(20) // 画板宽度
      let h_height = ref(20) // 画板高度
      let g_size = ref(30) // 像素大小
      
      let css_h_width = computed(() => {
        return h_width.value * g_size.value + 'px'
      })
      let css_h_height = computed(() => {
        return h_height.value * g_size.value + 'px'
      })
      let css_g_size = computed(() => {
        return g_size.value + 'px'
      })

      // 画板改变
      let bg_num = computed(() => {
        return (h_width.value * h_height.value)
      })
      let bg_arr = reactive([]) // 画板格子数
      // 画板改变格子数改变
      function huaBanChange() {
        // bg_arr.splice(0,bg_arr.length - 1)
        for (let i = 0; i < bg_num.value; i ++ ) {
          bg_arr.push({})
        }
      }
      huaBanChange()

      // 点击改颜色
      function pointColor (index) {
        // 有颜色就擦除，没有就写上
        if (bg_arr[index].bg_color) {
          bg_arr[index].bg_color = ''
        } else {
          bg_arr[index].bg_color = `rgba(${m_red.value}, ${m_green.value}, ${m_blue.value}, ${m_t.value})` // 颜色
          bg_arr[index].row = parseInt(index) % h_width.value // x位置
          bg_arr[index].col = Math.floor(index / h_width.value) // y位置
          console.log(bg_arr[index].bg_color,index,'第')
        }
      }

      // 画笔模式
      let is_hua_hua = ref(false) // 是否是画笔模式
      let isMouseDown = ref(false) // 鼠标是否按下
      function mouseColor (index) {
        console.log(index)
      }

      // 清空颜色
      function clear () {
        bg_arr.splice(0,bg_arr.length - 1)
        huaBanChange()
      }
      return {
        h_width,h_height,g_size,css_h_width,css_h_height,css_g_size,bg_num,bg_arr,is_hua_hua,isMouseDown,
        huaBanChange,pointColor,clear,mouseColor
      }
  }
</script>

<style lang="scss">
  .top_box {
    display: flex;
  }
  .el-color-picker__trigger {
    width: 100px;
    height: 50px;
    opacity: 0;
  }
  // 调色板
  $red: v-bind(m_red);
  $green: v-bind(m_green);
  $blue: v-bind(m_blue);
  #color_board_dad {
    width: 300px;
    .el-slider {
      width: 150px;
    }
    #color_board {
      $t: v-bind(m_t);
      width: 100px;
      height: 50px;
      background-color: #{'rgba(#{$red},#{$green},#{$blue},#{$t})'}
    }
  }

  // 画图板
  $g_size: v-bind(css_g_size);
  $h_width: v-bind(css_h_width);
  $h_height: v-bind(css_h_height);
  #hua_ban {
    display: flex;
    flex-wrap: wrap;
    width: $h_width;
    height: $h_height;
    border: 1px solid black;
    .ge_zi {
      box-sizing: border-box;
      border: 1px solid rgb(170, 221, 229);
      width: $g_size;
      height: $g_size;
    }
  }

  $b: 10;
  @for $var from 1 to $b {
    .box#{$var} {
      width: 100px;
      height: 100px;
      background-color: red;
    }
  }
</style>
