<script setup lang="ts">
// 画板原型
import { onMounted, ref, type Ref, reactive } from 'vue';
import { initMap, drawLineHandler, drawPixelHandler, exportCanvasToImg} from '@/utils/draw'
import { type ReactPositionInfo } from '@/type/draw.type.ts'
const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const settingData = reactive({
  width: 500, // 画板宽度
  height: 500, // 画板高度
  splitLineShow: true, // 是否显示间隔线 默认1px
  gridPerPx: 20, // 像素格大小
  color: "rgba(255, 215, 0, 1)", // 画笔颜色
  splitLineColor: "rgba(222, 222, 222)", // 间隔线颜色
  drawMode: 'pixel', // 画笔模式 默认像素
})
// 颜色预定义
const predefineColors = ref([
  'rgba(0, 0, 0, 1)',
  'rgba(255, 255, 255, 1)',
  "rgba(222, 222, 222)",
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const handleList: any[] = []

// 存储已画了的格子信息,只处理像素模式，线条模式不存储
const rectPosArr: ReactPositionInfo[][] = []

// 初始化画板
function initBoard() {
  if (canvas.value) {
    initMap(canvas.value, {
      width: settingData.width,
      height: settingData.height,
      gridPerPx: settingData.gridPerPx,
      lineColor: settingData.splitLineColor,
      lineShow: settingData.splitLineShow,
      rectPosArr: rectPosArr
    })
    initDrawPan()
  }
}

// 初始化画笔
function initDrawPan() {
  if (canvas.value) {
    // 先清除之前的注册事件
    removeHandler(canvas.value)
    const mode = settingData.drawMode
    let handle: any;
    if (mode === 'pixel') {
      // 注册画笔事件
      handle = drawPixelHandler(canvas.value, {
        hasLine: settingData.splitLineShow,
        gridPerPx: settingData.gridPerPx,
        pixelColor: settingData.color,
        rectPosArr: rectPosArr
      })
    } else if (mode === 'line') {
      handle = drawLineHandler(canvas.value, {
        gridPerPx: settingData.gridPerPx,
        lineColor: settingData.color
      })
    }
    handleList.push(handle)
  }
}

function cleanBoard() {
  if (canvas.value) {
    initMap(canvas.value, {
      width: settingData.width,
      height: settingData.height,
      gridPerPx: settingData.gridPerPx,
      lineColor: settingData.splitLineColor,
      lineShow: settingData.splitLineShow
    })
    initDrawPan()
  }
}

/**
 * 删除注册了的鼠标事件
 */
function removeHandler(canvas: HTMLCanvasElement) {
  handleList.forEach(handle => {
    canvas.removeEventListener("mousedown", handle.onMouseDownFun)
    canvas.removeEventListener("mousemove", handle.onMouseMoveFun)
    canvas.removeEventListener("mouseup", handle.onMouseUpFun)
  })
}
onMounted(() => {
  initBoard()
})
</script>

<template>
  <div class="draw-board">
    <div class="tool-bar">
      <el-button class="export-btn" type="primary" @click="exportCanvasToImg(canvas as HTMLCanvasElement)">导出图片</el-button>
      <el-button class="export-btn" type="danger" @click="cleanBoard">清空画布</el-button>
      <el-form>
        <el-form-item label="画板宽度:" title="不计入间隔线宽度">
          <el-input-number v-model="settingData.width" :min="2" :max="2000" @change="initBoard" :controls="false" />
        </el-form-item>
        <el-form-item label="画板高度:" title="不计入间隔线宽度">
          <el-input-number v-model="settingData.height" :min="2" :max="2000" @change="initBoard" :controls="false" />
        </el-form-item>
        <el-form-item label="像素格大小:">
          <el-input-number v-model="settingData.gridPerPx" :min="2" :max="2000" @change="initBoard" :controls="false" />
        </el-form-item>
        <el-form-item label="显示间隔线:">
          <el-switch v-model="settingData.splitLineShow" @change="initBoard" />
        </el-form-item>
        <el-form-item label="间隔线颜色:">
          <el-color-picker v-model="settingData.splitLineColor" show-alpha :predefine="predefineColors" @change="initBoard()" />
        </el-form-item>
        <el-form-item label="画笔颜色:">
          <el-color-picker v-model="settingData.color" show-alpha :predefine="predefineColors" @change="initDrawPan()" />
        </el-form-item>
        <el-form-item label="画笔模式:">
          <el-select
            v-model="settingData.drawMode"
            placeholder="Select"
            @change="initDrawPan()"
          >
            <el-option label="像素" value="pixel"/>
            <el-option label="直线" value="line"/>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <canvas ref="canvas" id="myCanvas"></canvas>
  </div>
</template>

<style lang="scss" scoped>
.draw-board {
  display: flex;
  .export-btn {
    margin-bottom: 10px;
    margin-left: 12px;
  }
  .tool-bar {
    width: 150px;
    border: 1px solid rgb(101, 212, 156);
    margin-right: 10px;
    padding: 10px;
    height: 100%;
  }
  #myCanvas {
    border: 1px solid rgb(101, 212, 156);
    border-color: v-bind('settingData.splitLineColor');
  }
}
</style>
