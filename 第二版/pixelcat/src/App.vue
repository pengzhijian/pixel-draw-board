<template>
  <div class="top_box">
    <!-- 调色板 -->
    <div id="color_board_dad">
      <div id="color_board">
        <el-color-picker  v-model="colors_data.color" show-alpha @active-change='colorChange' ></el-color-picker>
      </div>
      r:{{colors_data.m_red}}<el-slider :max='255' :min='0' :step='1' v-model="colors_data.m_red" input-size='mini' @change='sliderChange()'></el-slider>
      g:{{colors_data.m_green}}<el-slider :max='255' :min='0' :step='1' v-model="colors_data.m_green" input-size='mini' @change='sliderChange()'></el-slider>
      b:{{colors_data.m_blue}}<el-slider :max='255' :min='0' :step='1' v-model="colors_data.m_blue" input-size='mini' @change='sliderChange()'></el-slider>
      a:{{colors_data.m_t}}<el-slider :max='1' :min='0' :step='0.01' v-model="colors_data.m_t" input-size='mini' @change='sliderChange()'></el-slider>
    </div>
    <!-- 导出框 -->
    <div id='export_board'>
      <el-button type='primary'  style="margin-bottom:20px;" @click="exportClick()">导出</el-button>
      <el-input  type="textarea" :autosize='{ minRows: 10, maxRows: 10 }' v-model="style"></el-input>
    </div>
    <!-- 预览作品列表 -->
    <div class="pixel_list">
      <el-table :data='init_data.value' max-height='360'>
        <el-table-column prop='name' label='作品名'></el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-button  @click="handleEdit(scope.row)">预览</el-button>
            <el-button  type="danger"  @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 画板选项 -->
  宽: <el-input-number size='small' v-model="board_data.h_width" controls-position="right" @change='huaBanChange()'  :min="1" :max="100"></el-input-number>
  高：<el-input-number size='small' v-model="board_data.h_height" controls-position="right" @change='huaBanChange()' :min="1" :max="100"></el-input-number>
  像素大小：<el-input style="width:50px;"  v-model="board_data.g_size"></el-input>
  <!-- <el-button type='primary' size='mini' @click="huaBanChange()">修改</el-button> -->
  <el-button type='primary'  @click="clear()">清空</el-button>

  <div id="bans" style="display: flex;">
    <!-- 画板 -->
    <div id="hua_ban" v-if="bg_arr.length > 0 " @mousedown="">
      <div class="ge_zi" :style="'background-color:' + ((bg_arr[index] !== undefined) ? bg_arr[index].bg_color : '') + ';'" @mouseenter="mouseColor(index)" @click="pointColor(index)" v-for="(item, index) in bg_num" :key="index"></div>
    </div>

    <!-- 预览画版 -->
    <div id="cat" v-if="style" :style="style.split('#cat')[1].replace('{', '').replace('}', '')">
      {{style.split('#cat')[1]}}
      <div class="cat_box" :style="style.split('#cat')[2].replace('{', '').replace('}', '')"></div>
    </div>
  </div>

  <!-- 弹出框 -->
  <el-dialog title="请输出保存的名字" v-model="is_dialog_show" width="30%">
    作品名：<el-input size='small' v-model="save_name"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button size='small' @click="is_dialog_show = false">取 消</el-button>
        <el-button size='small' type="primary" @click="exportStyle(save_name)">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
  import { ref, reactive, computed } from 'vue'
  import { savePixel, initPixel, deletePixel } from './request/pixel.js'
  import { useStore } from 'vuex'
  import { ElMessage } from 'element-plus'

  export default {
    mounted() {
      this.initData()
      console.log('m_store', this.$store)
    },
    methods: {
      handleEdit(row) {
        this.style = row.css
      },
      handleDelete(row) {
        console.log(row)
        deletePixel({'c_id': row.c_id}).then(res => {
          ElMessage('删除成功')
        })
        this.initData()
      },
    },
    setup(props) {
      const store = useStore()
      const init_data = reactive([])

      console.log('mutation', store.commit('testMutations'))
      console.log('state', store.state.test)
      console.log('mutation', store.commit('color/colorChange'))
      console.log('state', store.state.color.color_test)
      function initData() {
        initPixel().then(res => {
          console.log('res',res)
          init_data.value = res.data
        })
      }

      // 色板属性
      const colors_data = reactive({
        m_red: 100,
        m_green: 100,
        m_blue: 100,
        m_t: 10,
        color: 'rgba(19, 206, 102, 0.8)',
      })


      // 调色板改变
      function colorChange(c) {
        colors_data.color = c
        let a = c.replace(/rgba\(/,'').replace(/\)/, '')
        let rgba = a.split(',')
        colors_data.m_red = parseInt(rgba[0])
        colors_data.m_green = parseInt(rgba[1])
        colors_data.m_blue = parseInt(rgba[2])
        colors_data.m_t = parseFloat(rgba[3])
      }
      // 滑动条改变
      function sliderChange() {
        colors_data.color = `rgba(${colors_data.m_red},${colors_data.m_green},${colors_data.m_blue},${colors_data.m_t})`
      }

      // 画板属性
      const board_data = reactive({
        h_width: 20, // 画板宽度
        h_height: 20, // 画板高度
        g_size: 30, // 像素大小
      })
      
      let css_h_width = computed(() => {
        return board_data.h_width * board_data.g_size + 'px'
      })
      let css_h_height = computed(() => {
        return board_data.h_height * board_data.g_size + 'px'
      })
      let css_g_size = computed(() => {
        return board_data.g_size + 'px'
      })

      // 画板改变
      let bg_num = computed(() => {
        return (board_data.h_width * board_data.h_height)
      })
      let bg_arr = reactive([]) // 画板格子数
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
          bg_arr[index].bg_color = `rgba(${colors_data.m_red}, ${colors_data.m_green}, ${colors_data.m_blue}, ${colors_data.m_t})` // 颜色
          bg_arr[index].row = parseInt(index) % board_data.h_width // x位置
          bg_arr[index].col = Math.floor(index / board_data.h_width) // y位置
        }
      }

      // 画笔模式
      let is_hua_hua = ref(false) // 是否是画笔模式
      let isMouseDown = ref(false) // 鼠标是否按下
      function mouseColor (index) {
  
      }

      // 清空颜色
      function clear () {
        bg_arr.splice(0,bg_arr.length - 1)
        huaBanChange()
      }

      // 导出保存样式
      let style = ref('')
      let save_name = ref('')
      function exportStyle () {
        let box_shadow = ''
        for (let i = 0; i < bg_arr.length; i++) {
          if (bg_arr[i].bg_color) {
            box_shadow += `${ board_data.g_size * (bg_arr[i].row + 1)}px ${ board_data.g_size * (bg_arr[i].col + 1)}px 0 ${bg_arr[i].bg_color},`
          }
        }
        box_shadow = box_shadow.replace(/\,$/, '')
        style.value = 
        `
        #cat {
          position: relative;
          width: ${board_data.g_size * board_data.h_width}px;
          height: ${board_data.g_size * board_data.h_height}px;
          border: 1px solid black;
        }
        #cat::after {
          content:'';position: absolute;
          top: -${board_data.g_size}px;
          left: -${board_data.g_size}px;
          width: ${board_data.g_size}px;
          height: ${board_data.g_size}px;
          box-shadow: ${box_shadow};
        }
        `
        // 将样式加入style标签
        console.log('styleeeeeee', style.value.split('#cat')[1])
        // 清除大于1个的空格
        style.value = style.value.replace(/\s{2,}/g,"")
        // 存储到服务器
        savePixel({css: style.value, name: save_name.value, width: board_data.h_width, height: board_data.h_height, size: board_data.g_size}).then(res => {
          console.log('成功',res)
          initData()
          is_dialog_show.value = false
        }).catch(err => {
          console.log('失败', err)
          is_dialog_show.value = false
        })
        // sass的形式，更直观，但是用户需要改scss
        // style = `
        // $size: ${g_size}px; // 1像素的宽度
        // $board_width: ${h_width};
        // $board_height: ${h_height};
        // #cat {
        //   position: relative;
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

      // 弹出框
      let is_dialog_show = ref(false)
      function exportClick() {
        is_dialog_show.value = true
      }
      return {
        init_data,
        initData,
        colorChange,
        sliderChange,
        colors_data,
        board_data,
        css_h_width,
        css_h_height,
        css_g_size,
        bg_arr,
        bg_num,
        pointColor,
        mouseColor,
        style,
        save_name,
        exportStyle,
        huaBanChange,
        clear,
        is_dialog_show,
        exportClick
      }
    }
  }

</script>

<style lang="scss">
  .top_box {
    width: 100%;
    display: flex;
  }
  // 预览列表
  .pixel_list {
    width: 500px;
  }
  // 导出框
  #export_board {
    margin-right: 50px;
    min-width: 200px;
  }
  .el-color-picker__trigger {
    width: 100px;
    height: 50px;
    opacity: 0;
  }
  // 调色板
  $red: v-bind('colors_data.m_red');
  $green: v-bind('colors_data.m_green');
  $blue: v-bind('colors_data.m_blue');

  #color_board_dad {
    width: 300px;
    .el-slider {
      width: 150px;
    }
    #color_board {
      $t: v-bind('colors_data.m_t');
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
    flex-shrink: 0;
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
  #cat {
    flex-shrink: 0;
  }

</style>
