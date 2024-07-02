<script setup lang="ts">
import { drawRulers } from '@/utils/draw';
import { onMounted, ref, type Ref, reactive } from "vue";
import { useBaseSettingsStore } from '@/stores/counter';
const bgCanvas: Ref<HTMLCanvasElement | null> = ref(null);
const mainCanvas: Ref<HTMLCanvasElement | null> = ref(null);
const baseSettingStore = useBaseSettingsStore();

const leftMenuShow = ref(true);
const rightMenuShow = ref(true);
type CanvasSetting = {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
};
/**
 * 绘制内容
 * @param canvas 画布
 * @param canvasSetting 画布设置
 * @param canvasSetting.translateX 平移的x轴距离
 * @param canvasSetting.translateY 平移的y轴距离
 * @param canvasSetting.scaleX 缩放的x轴比例
 * @param canvasSetting.scaleY 缩放的y轴比例
 */
function drawContent(
  canvas: HTMLCanvasElement,
  canvasSetting: CanvasSetting = {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
  }
) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const { translateX, translateY, scaleX, scaleY } = canvasSetting;
  // 先清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  // 保存当前画布状态
  ctx.save();
  // 设置平移和缩放
  ctx.translate(translateX, translateY);
  ctx.scale(scaleX, scaleY);

  // 进行一些绘画操作
  drawBaseBoard(canvas, baseSettingStore.baseBoardSetting);

  // 还原画布状态
  ctx.restore();
}


/**
 * 基础画板，保存只会显示基础画板中的内容
 */
type BaseBoardSetting = {
  width: number; // 画布宽度
  height: number; // 画布高度
  x: number; // 画布x轴坐标
  y: number; // 画布y轴坐标
}
function drawBaseBoard(canvas: HTMLCanvasElement, baseBoardSetting: BaseBoardSetting) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
  const { x, y, width, height } = baseBoardSetting;
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

/**
 * 绘制画板
 */
function drawBoard(canvas: HTMLCanvasElement) {

}

function drawAll(canvas: HTMLCanvasElement) {
  if (canvas) {
    // 基础画板始终显示在中间
    baseSettingStore.baseBoardSetting.x = Math.floor(canvas.width / 2) - baseSettingStore.baseBoardSetting.width / 2;
    drawContent(canvas, {
      translateX: baseSettingStore.baseSetting.translateX + 25, // 这个25是标尺的宽度，如果标尺宽度改变这个也变
      translateY: baseSettingStore.baseSetting.translateY + 25,
      scaleX: baseSettingStore.baseSetting.scaleX,
      scaleY: baseSettingStore.baseSetting.scaleY,
    });
    drawRulers(canvas, {
      translateX: baseSettingStore.baseSetting.translateX - baseSettingStore.baseBoardSetting.x,
      translateY: baseSettingStore.baseSetting.translateY - baseSettingStore.baseBoardSetting.y,
      unitLength: 10,
      majorTickLength: 10,
      minorTickLength: 5,
      globalAlpha: 1,
    });
  }
}

function setMouseFun(canvas: HTMLCanvasElement) {
  if (canvas) {
    drawAll(canvas);
    let startX: number, startY: number;
    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 1) {
        // 1表示中键,检测鼠标中键按下
        baseSettingStore.baseSetting.isCenterBtnOn = true;
        startX = e.clientX - baseSettingStore.baseSetting.translateX;
        startY = e.clientY - baseSettingStore.baseSetting.translateY;
        // 更改光标样式
        canvas.style.cursor = "grabbing";
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      // 检测鼠标中建按下，拖动画布
      if (baseSettingStore.baseSetting.isCenterBtnOn) {
        baseSettingStore.baseSetting.translateX = e.clientX - startX;
        baseSettingStore.baseSetting.translateY = e.clientY - startY;
        drawAll(canvas);
      }
    });

    canvas.addEventListener("mouseup", (e) => {
      // 鼠标抬起中键松开
      baseSettingStore.baseSetting.isCenterBtnOn = false;
      // 恢复光标样式
      canvas.style.cursor = "default";
    });

    canvas.addEventListener("mouseleave", (e) => {
      // 鼠标离开画板中键松开
      baseSettingStore.baseSetting.isCenterBtnOn = false;
    });

    // 检测滚轮事件
    canvas.addEventListener("wheel", (e) => {
      console.log(e.deltaY);
      const scaleBaseValue = 0.1; // 缩放的基数
      // 鼠标滚轮实现放大缩小
      if (e.deltaY < 0) {
        // 放大
        baseSettingStore.baseSetting.scaleX += scaleBaseValue;
        baseSettingStore.baseSetting.scaleY += scaleBaseValue;
      } else {
        // 缩小
        baseSettingStore.baseSetting.scaleX -= scaleBaseValue;
        baseSettingStore.baseSetting.scaleY -= scaleBaseValue;
      }
      drawAll(canvas);
    });
  }
}

onMounted(() => {
  if (bgCanvas.value) {
    setMouseFun(bgCanvas.value);
  }
});
</script>

<template>
  <div class="main-layout">
    <div class="top-bar">
      <el-button type="primary" @click="$router.push('/application')">正式程序</el-button>
      <el-button type="primary" @click="$router.push('/drawBoardBase')">01绘制画板demo</el-button>
      <el-button type="primary" @click="$router.push('/pixelDrawBoard')">02像素画demo</el-button>
    </div>
    <div class="bottom-box">
      <div class="left-bar" :class="{ 'left-menu-show': !leftMenuShow }">
        <div class="left-content">
          bbbbbbbbbbccccccccdddddddd
        </div>
        <div class="menu-toggle-bar" :class="{ 'menu-toggle-no-bar': !leftMenuShow }"
          @click="leftMenuShow = !leftMenuShow">
          <div class="menu-toggle-bar-top"></div>
          <div class="menu-toggle-bar-bottom"></div>
        </div>
      </div>
      <div class="main-content">
        <div class="bg-canvas-box" v-canvas-resize="drawAll">
          <canvas ref="bgCanvas" class="canvas-bg design-stage-grid"></canvas>
        </div>
      </div>
      <div class="right-bar" :class="{ 'right-menu-show': !rightMenuShow }">
        aaaaaaaaaaaaaaaaaaaa
        <div class="menu-toggle-bar" :class="{ 'menu-toggle-no-bar': !rightMenuShow }"
          @click="rightMenuShow = !rightMenuShow">
          <div class="menu-toggle-bar-top"></div>
          <div class="menu-toggle-bar-bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin left-menu-toggle-bar-style {
  .menu-toggle-bar {
    z-index: 999;
    position: absolute;
    right: 0;
    top: 45%;
    transform: translate(100%, 0);
    cursor: pointer;
    width: 20px;
    height: 80px;

    .menu-toggle-bar-top {
      position: absolute;
      background-color: gray;
      width: 4px;
      border-radius: 2px;
      height: 38px;
      left: 9px;
      transition: all 0.3s;
    }

    .menu-toggle-bar-bottom {
      position: absolute;
      background-color: gray;
      width: 4px;
      border-radius: 2px;
      height: 38px;
      left: 9px;
      top: 34px;
      transition: all 0.3s;
    }

    &:hover .menu-toggle-bar-top {
      transform: rotate(12deg) scale(1.15) translateY(-2px);
    }

    &:hover .menu-toggle-bar-bottom {
      transform: rotate(-12deg) scale(1.15) translateY(2px);
    }
  }

  .menu-toggle-no-bar {
    .menu-toggle-bar-top {
      transform: rotate(-12deg) scale(1.15) translateY(-2px) !important;
    }

    .menu-toggle-bar-bottom {
      transform: rotate(12deg) scale(1.15) translateY(2px) !important;
    }
  }
}

@mixin right-menu-toggle-bar-style {
  .menu-toggle-bar {
    z-index: 999;
    position: absolute;
    left: 0;
    top: 45%;
    transform: translate(-100%, 0);
    cursor: pointer;
    width: 20px;
    height: 80px;

    .menu-toggle-bar-top {
      position: absolute;
      background-color: gray;
      width: 4px;
      border-radius: 2px;
      height: 38px;
      left: 9px;
      transition: all 0.3s;
    }

    .menu-toggle-bar-bottom {
      position: absolute;
      background-color: gray;
      width: 4px;
      border-radius: 2px;
      height: 38px;
      left: 9px;
      top: 34px;
      transition: all 0.3s;
    }

    &:hover .menu-toggle-bar-top {
      transform: rotate(-12deg) scale(1) translateY(2px);
    }

    &:hover .menu-toggle-bar-bottom {
      transform: rotate(12deg) scale(1) translateY(-2px);
    }
  }

  .menu-toggle-no-bar {
    .menu-toggle-bar-top {
      transform: rotate(12deg) scale(1) translateY(2px) !important;
    }

    .menu-toggle-bar-bottom {
      transform: rotate(-12deg) scale(1) translateY(-2px) !important;
    }
  }
}

.main-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .top-bar {
    height: 50px;
    background-color: antiquewhite;
  }

  .bottom-box {
    display: flex;
    justify-content: space-between;
    height: calc(100vh - 50px);

    .left-bar {
      z-index: 10;
      position: relative;
      transition: all 0.3s;
      transform: translate(0);
      width: 300px;
      background-color: aqua;
      @include left-menu-toggle-bar-style;

      .left-content {
        width: 100%;
        overflow: hidden;
      }
    }

    .left-menu-show {
      // transform: translate(-100%);
      width: 0;
    }

    .main-content {
      background-color: rgb(241, 241, 241);
      flex: 1;
    }

    .right-bar {
      position: relative;
      transition: all 0.2s ease-in;
      width: 200px;
      transform: translate(0);
      background-color: burlywood;
      @include right-menu-toggle-bar-style;
    }

    .right-menu-show {
      width: 0;
    }
  }
}

.bg-canvas-box {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
}

.canvas-bg {
  border: 1px solid rgb(21, 172, 33);
  margin-left: 5px;
  width: 100%;
  height: 100%;
}

// 网格背景
.design-stage-grid {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  --color: #dedcdc;
  background-image: linear-gradient(45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0),
    linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY),
    calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>
