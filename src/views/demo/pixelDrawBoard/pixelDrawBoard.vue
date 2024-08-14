<script setup lang="ts">
// 画板原型
import { onMounted, ref, type Ref, reactive } from "vue";
import {
  initMap,
  drawLineHandler,
  drawPixelHandler,
  exportCanvasToImg,
  uploadImgToCanvas,
  changeImageDataToPixel,
  changeImageToGray,
  changeImageToMode
} from "@/utils/draw";
import { type ReactPositionInfo } from "@/type/draw.type";
const canvas: Ref<HTMLCanvasElement | null> = ref(null);
// 图像处理的基准图，用作展示给用户知道操作的原图是什么，像素绘画操作会修改基准图
const canvasImgResource: Ref<HTMLImageElement | null> = ref(null);
const settingData = reactive({
  width: 500, // 画板宽度
  height: 500, // 画板高度
  gridWidth: 20, // 画板网格宽度
  gridHeight: 20, // 画板网格高度
  splitLineShow: false, // 是否显示间隔线 默认1px
  color: "rgba(255, 215, 0, 1)", // 画笔颜色
  splitLineColor: "rgba(222, 222, 222)", // 间隔线颜色
  drawMode: "pixel", // 画笔模式 默认像素
  uploadImgFile: [] as any, // 上传的图片
  gap: 6, // 每隔几个像素检测一次，值越大越快，画的像素点越少
  imageData: null as any, // 上传的图片数据,作为图片处理的基准图
  rectPosArr: [] as ReactPositionInfo[][], // 存储已画了的格子信息,只处理像素模式，线条模式不存储
});

// 颜色预定义
const predefineColors = ref([
  "rgba(0, 0, 0, 1)",
  "rgba(255, 255, 255, 1)",
  "rgba(222, 222, 222)",
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);
const handleList: any[] = [];

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
      rectPosArr: settingData.rectPosArr,
    });
    initDrawPan();
  }
}

// 初始化画笔
function initDrawPan() {
  if (canvas.value) {
    // 先清除之前的注册事件
    removeHandler(canvas.value);
    const mode = settingData.drawMode;
    let handle: any;
    if (mode === "pixel") {
      // 注册画笔事件
      handle = drawPixelHandler(canvas.value, {
        hasLine: settingData.splitLineShow,
        gridWidth: settingData.gridWidth,
        gridHeight: settingData.gridHeight,
        pixelColor: settingData.color,
        rectPosArr: settingData.rectPosArr,
      });
    } else if (mode === "line") {
      handle = drawLineHandler(canvas.value, {
        lineColor: settingData.color,
        gridWidth: settingData.gridWidth,
      });
    }
    handleList.push(handle);
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
      lineShow: settingData.splitLineShow,
    });
    initDrawPan();
  }
}

/**
 * 导入图片后处理画布,将像素信息设置并重画画板
 */
function changePixelData() {
  if (canvas.value) {
    // 如果有上传图片，则先清空存储的图片信息
    // 这两步操作是为了后续处理的图片都是一开始上传的图片数据，而不是在处理过后的canvas数据上继续处理
    if (settingData.uploadImgFile.length > 0) {
      settingData.imageData = null;
      settingData.gap = 6;
      settingData.gridWidth = 3;
      settingData.gridHeight = 3;
    }
    // 将图片信息转为像素信息
    let pixelData = changeImageDataToPixel(canvas.value, {
      gap: settingData.gap,
      gridWidth: settingData.gridWidth,
      gridHeight: settingData.gridHeight,
      imgPixelData: settingData.imageData,
    });
    // 清空上传文件
    if (settingData.uploadImgFile.length > 0) {
      // 然后再将图片数据保存，后续就是用这个数据进行图片处理
      settingData.imageData = pixelData.imageData;
      settingData.uploadImgFile = [];
      // 设置基准图
      setBaseImage(canvas.value);
      settingData.gap = 4;
      settingData.gridWidth = 2;
      settingData.gridHeight = 2;
    }
    // 先改基础配置
    settingData.width = pixelData.width;
    settingData.height = pixelData.height;
    settingData.gridWidth = pixelData.gridWidth;
    settingData.gridHeight = pixelData.gridHeight;
    settingData.splitLineShow = false;
    settingData.rectPosArr = pixelData.rectPosArr;
    // 重画画板
    initBoard();
  }
}

/**
 * 像素格宽高度改变时重新计算画布大小，以避免出现画布超出边界
 */
function gridWidthChange(newValue: any, beforeValue: any) {
  if (newValue > beforeValue) {
    settingData.width = settingData.width * (newValue / beforeValue);
  }
  initBoard();
}
function gridHeightChange(newValue: any, beforeValue: any) {
  if (newValue > beforeValue) {
    settingData.height = settingData.height * (newValue / beforeValue);
  }
  initBoard();
}

/**
 * 删除注册了的鼠标事件
 */
function removeHandler(canvas: HTMLCanvasElement) {
  handleList.forEach((handle) => {
    canvas.removeEventListener("mousedown", handle.onMouseDownFun);
    canvas.removeEventListener("mousemove", handle.onMouseMoveFun);
    canvas.removeEventListener("mouseup", handle.onMouseUpFun);
  });
}

/**
 * 将当前画布图像设为基准图
 */
function setBaseImage(canvas: HTMLCanvasElement) {
  if (canvasImgResource.value) {
    const toDataURL = canvas.toDataURL("image/png");
    canvasImgResource.value.src = toDataURL;
    settingData.gap = 1;
    settingData.gridWidth = 1;
    settingData.gridHeight = 1;
  }
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  settingData.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rectPosArr: ReactPositionInfo[][] = [];
  const { imageData, gap, gridWidth, gridHeight } = settingData;
  for (let i = 0; i < imageData.height; i += gap) {
    rectPosArr[i] = [];
    for (let j = 0; j < imageData.width; j += gap) {
      // 当前点位置信息，之所以*4是因为rgba分量是4个字节
      const position = (imageData.width * i + j) * 4;
      const color = `rgba(${imageData.data[position]}, ${imageData.data[position + 1]
        }, ${imageData.data[position + 2]}, ${imageData.data[position + 3] / 255
        })`;
      rectPosArr[i].push({
        x: Math.floor(j / gridWidth),
        y: Math.floor(i / gridHeight),
        color: color,
        width: gridWidth,
        height: gridHeight,
      });
    }
  }
  settingData.rectPosArr = rectPosArr;
  initBoard();
}

function changeTab(e: any) {
  settingData.splitLineShow = false;
  if (e.props.label === "图像处理") {
    // settingData.gap = 2;
    // settingData.gridWidth = 1;
    // settingData.gridHeight = 1;
  }
  initBoard();
}

onMounted(() => {
  initBoard();
});
</script>

<template>
  <div class="draw-board">
    <el-tabs class="tool-bar" @tab-click="changeTab">
      <el-tab-pane label="像素绘画">
        <div class="btns-box">
          <el-button size="small" class="export-btn" type="primary"
            @click="exportCanvasToImg(canvas as HTMLCanvasElement)">导出图片</el-button>
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
            <el-input-number v-model="settingData.gridWidth" :min="1" :max="2000" @change="gridWidthChange"
              :controls="false" />
          </el-form-item>
          <el-form-item label="像素格高度:">
            <el-input-number v-model="settingData.gridHeight" :min="1" :max="2000" @change="gridHeightChange"
              :controls="false" />
          </el-form-item>
          <el-form-item label="显示间隔线:">
            <el-switch v-model="settingData.splitLineShow" @change="initBoard" />
          </el-form-item>
          <el-form-item label="间隔线颜色:">
            <el-color-picker v-model="settingData.splitLineColor" show-alpha :predefine="predefineColors"
              @change="initBoard()" />
          </el-form-item>
          <el-form-item label="画笔颜色:">
            <el-color-picker v-model="settingData.color" show-alpha :predefine="predefineColors"
              @change="initDrawPan()" />
          </el-form-item>
          <el-form-item label="画笔模式:">
            <el-select v-model="settingData.drawMode" placeholder="Select" @change="initDrawPan()">
              <el-option label="像素" value="pixel" />
              <el-option label="直线" value="line" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="图像处理">
        <el-upload :limit="2" v-model:file-list="settingData.uploadImgFile" accept="image/*"
          :http-request="(e: any) => uploadImgToCanvas(e, canvas as HTMLCanvasElement, changePixelData)">
          <el-button size="small" class="export-btn" type="primary">导入图片</el-button>
        </el-upload>
        <el-form>
          <el-form-item label="检测间隔:">
            <el-input-number v-model="settingData.gap" :min="1" controls-position="right" @change="changePixelData()" />
          </el-form-item>
          <el-form-item>
            <el-slider :min="1" :max="100" class="slider" v-model="settingData.gap" @change="changePixelData()" />
          </el-form-item>
          <el-form-item label="像素宽度:">
            <el-input-number v-model="settingData.gridWidth" :min="1" controls-position="right"
              @change="changePixelData()" />
          </el-form-item>
          <el-form-item>
            <el-slider :min="1" :max="100" class="slider" v-model="settingData.gridWidth" @change="changePixelData()" />
          </el-form-item>
          <el-form-item label="像素高度:">
            <el-input-number v-model="settingData.gridHeight" :min="1" controls-position="right"
              @change="changePixelData()" />
          </el-form-item>
          <el-form-item>
            <el-slider :min="1" :max="100" class="slider" v-model="settingData.gridHeight"
              @change="changePixelData()" />
          </el-form-item>
          <el-form-item>
            <el-button @click="changeImageToGray(canvas as HTMLCanvasElement)">设为灰度图</el-button>
            <el-button @click="changeImageToMode(canvas as HTMLCanvasElement, 'Hue')">设为色相变换图</el-button>
            <el-button @click="changeImageToMode(canvas as HTMLCanvasElement, 'Saturation')">设为饱和度变换图</el-button>
            <el-button @click="changeImageToMode(canvas as HTMLCanvasElement, 'Lightness')">设为亮度变换图</el-button>
            <el-button @click="changeImageToMode(canvas as HTMLCanvasElement, 'brightness')">设为明度变换图</el-button>
            <el-button @click="changeImageToMode(canvas as HTMLCanvasElement, 'Grayscale')">设为灰度变换图</el-button>
            <el-button @click="changeImageToMode(canvas as HTMLCanvasElement, 'other')">设为冷暖色变换图</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <div>
        会重置检测间隔,像素宽度，像素高度为1，然后将画布设为基准图（卡住了等会就好）：<el-button type="primary"
          @click="setBaseImage(canvas as HTMLCanvasElement)">设为基准图</el-button>
      </div>
      <div>
        图像处理的基准图，在此图基础上进行图片处理操作
        <img ref="canvasImgResource" id="myCanvasImgResource" />
      </div>
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
    width: 250px;
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
    border-color: v-bind("settingData.splitLineColor");
    flex: none;
  }

  #myCanvasImgResource {
    width: 100%;
  }
}

.slider {
  padding: 0 10px 10px 10px;
  border-bottom: 1px solid #ccc;
}
</style>
