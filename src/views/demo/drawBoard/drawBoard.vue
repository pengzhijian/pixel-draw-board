<script setup lang="ts">
// 画板原型
import { onMounted, ref, type Ref, reactive } from 'vue';
import { initMap, drawLineHandler, drawPixelHandler, exportCanvasToImg, uploadImgToCanvas, changeImageDataToPixel } from '@/utils/draw'
import { type ReactPositionInfo } from '@/type/draw.type'
const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const settingData = reactive({
  width: 500, // 画板宽度
  height: 500, // 画板高度
  gridWidth: 20, // 画板网格宽度
  gridHeight: 20, // 画板网格高度
  splitLineShow: true, // 是否显示间隔线 默认1px
  color: "rgba(255, 215, 0, 1)", // 画笔颜色
  splitLineColor: "rgba(222, 222, 222)", // 间隔线颜色
  drawMode: 'pixel', // 画笔模式 默认像素
  uploadImgFile: [] as any // 上传的图片
})
// 存储已画了的格子信息,只处理像素模式，线条模式不存储
let rectPosArr: ReactPositionInfo[][] = []
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

// 初始化画板
function initBoard() {
  if (canvas.value) {
    initMap(canvas.value, {
      width: settingData.width,
      height: settingData.height,
      gridWidth: settingData.gridWidth,
      gridHeight: settingData.gridHeight,
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
        gridWidth: settingData.gridWidth,
        gridHeight: settingData.gridHeight,
        pixelColor: settingData.color,
        rectPosArr: rectPosArr
      })
    } else if (mode === 'line') {
      handle = drawLineHandler(canvas.value, {
        lineColor: settingData.color,
        gridWidth: settingData.gridWidth
      })
    }
    handleList.push(handle)
  }
}

/**
 * 清空画布
 */
function cleanBoard() {
  if (canvas.value) {
    initMap(canvas.value, {
      width: settingData.width,
      height: settingData.height,
      gridHeight: settingData.gridHeight,
      gridWidth: settingData.gridWidth,
      lineColor: settingData.splitLineColor,
      lineShow: settingData.splitLineShow
    })
    initDrawPan()
  }
}

/**
 * 导入图片后处理画布,将像素信息设置并重画画板
 */
function changePixelData() {
  if (canvas.value) {
    // 将图片信息转为像素信息
    const pixelData = changeImageDataToPixel(canvas.value, { gap: 6, gridWidth: 8, gridHeight: 2 });
    // 先改基础配置
    settingData.width = pixelData.width;
    settingData.height = pixelData.height;
    settingData.gridWidth = pixelData.gridWidth;
    settingData.gridHeight = pixelData.gridHeight;
    settingData.splitLineShow = false;
    rectPosArr = pixelData.rectPosArr;
    // 重画画板
    initBoard();
    // 清空上传文件
    settingData.uploadImgFile = []
  }
}

/**
 * 像素格宽高度改变时重新计算画布大小，以避免出现画布超出边界
 */
function gridWidthChange(newValue: any, beforeValue: any) {
  if (newValue > beforeValue) {
    settingData.width = settingData.width * (newValue / beforeValue)
  }
  initBoard()
}
function gridHeightChange(newValue: any, beforeValue: any) {
  if (newValue > beforeValue) {
    settingData.height = settingData.height * (newValue / beforeValue)
  }
  initBoard()
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
    <el-tabs class="tool-bar">
      <el-tab-pane label="像素绘画">
        <div class="btns-box">
          <el-button size="small" class="export-btn" type="primary" @click="exportCanvasToImg(canvas as HTMLCanvasElement)">导出图片</el-button>
          <el-button size="small" class="export-btn" type="danger" @click="cleanBoard">清空画布</el-button>
        </div>
        <el-form>
          <el-form-item label="画板宽度:" title="不计入间隔线宽度">
            <el-input-number v-model="settingData.width" :min="1" @change="initBoard" :controls="false" />
          </el-form-item>
          <el-form-item label="画板高度:" title="不计入间隔线宽度">
            <el-input-number v-model="settingData.height" :min="1" @change="initBoard" :controls="false" />
          </el-form-item>
          <el-form-item label="像素格宽度:">
            <el-input-number v-model="settingData.gridWidth" :min="1" :max="2000" @change="gridWidthChange" :controls="false" />
          </el-form-item>
          <el-form-item label="像素格高度:">
            <el-input-number v-model="settingData.gridHeight" :min="1" :max="2000" @change="gridHeightChange" :controls="false" />
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
      </el-tab-pane>
      <el-tab-pane label="图像处理">
        <el-upload
          :limit="2"
          v-model:file-list="settingData.uploadImgFile"
          accept="image/*"
          :http-request="(e:any) => uploadImgToCanvas(e, canvas as HTMLCanvasElement, changePixelData)"
        >
          <el-button size="small" class="export-btn" type="primary">导入图片</el-button>
        </el-upload>
      </el-tab-pane>
    </el-tabs>
    <!-- 不套这一层不知道为什么会导致画布高度不对，和flex有冲突 -->
    <div class="canvas-wrap">
      <canvas ref="canvas" id="myCanvas"></canvas>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.draw-board {
  display: flex;
  flex: none;
  .export-btn {
    margin-bottom: 10px;
    margin-left: 8px;
  }
  .tool-bar {
    width: 170px;
    border: 1px solid rgb(101, 212, 156);
    margin-right: 10px;
    padding: 10px;
    // height: 100%;
    .btns-box {
      width: 100%;
      flex-wrap: wrap;
      display: flex;
    }
  }
  #myCanvas {
    border: 1px solid rgb(101, 212, 156);
    border-color: v-bind('settingData.splitLineColor');
    flex: none
  }
}
</style>
