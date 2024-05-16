<script setup lang="ts">
// 画板原型
import { onMounted, ref, type Ref, reactive } from 'vue';
import { initMap, drawLineHandler, drawPixelHandler } from '@/utils/draw'
const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const settingData = reactive({
  width: 500, // 画板宽度
  height: 500, // 画板高度
  splitLineShow: true, // 是否显示间隔线 默认1px
  gridPerPx: 20, // 像素格大小
})

const handleList: any[] = []

function initBoard() {
  if (canvas.value) {
    initMap(canvas.value, {
      width: settingData.width,
      height: settingData.height,
      gridPerPx: settingData.gridPerPx,
      lineColor: "rgba(222, 222, 222)",
      lineShow: settingData.splitLineShow
    })
    // drawLineHandler(canvas.value, {
    //   gridPerPx: 80,
    //   lineColor: "rgba(101, 212, 156)"
    // })
    removeHandler(canvas.value)
    const handle = drawPixelHandler(canvas.value, {
      hasLine: settingData.splitLineShow,
      gridPerPx: settingData.gridPerPx,
      pixelColor: "yellow"
    })
    handleList.push(handle)
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
      <el-form>
        <el-form-item label="画板宽度:" title="不计入间隔线宽度">
          <el-input-number v-model="settingData.width" :min="1" :max="2000" @change="initBoard" :controls="false" />
        </el-form-item>
        <el-form-item label="画板高度:" title="不计入间隔线宽度">
          <el-input-number v-model="settingData.height" :min="1" :max="2000" @change="initBoard" :controls="false" />
        </el-form-item>
        <el-form-item label="像素格大小:">
          <el-input-number v-model="settingData.gridPerPx" :min="1" :max="2000" @change="initBoard" :controls="false" />
        </el-form-item>
        <el-form-item label="显示间隔线:">
          <el-switch v-model="settingData.splitLineShow" @change="initBoard" />
        </el-form-item>
      </el-form>
    </div>
    <canvas ref="canvas" id="myCanvas"></canvas>
  </div>
</template>

<style lang="scss" scoped>
.draw-board {
  display: flex;
  .tool-bar {
    width: 150px;
    border: 1px solid rgb(101, 212, 156);
    margin-right: 10px;
    padding: 10px;
    height: 100%;
  }
}
#myCanvas {
  border: 1px solid rgb(101, 212, 156);
}
</style>
