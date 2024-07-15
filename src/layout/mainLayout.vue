<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { useBaseSettingsStore } from '@/stores/base';
import { deepCopy } from "@/utils/util";
import rightBar from './components/rightBar.vue';
const bgCanvas: Ref<HTMLCanvasElement | null> = ref(null);
const baseSettingStore = useBaseSettingsStore();

const renderAll = baseSettingStore.renderAll;

const leftMenuShow = ref(true);
const rightMenuShow = ref(true);

function setMouseFun(canvas: HTMLCanvasElement) {
  if (canvas) {
    renderAll();
    let startX: number, startY: number;
    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 1) {
        // 1表示中键,检测鼠标中键按下
        baseSettingStore.baseBoardSetting.isCenterBtnOn = true;
        startX = e.clientX - baseSettingStore.baseBoardSetting.translateX;
        startY = e.clientY - baseSettingStore.baseBoardSetting.translateY;
        // 更改光标样式
        canvas.style.cursor = "grabbing";
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      // 检测鼠标中建按下，拖动画布
      if (baseSettingStore.baseBoardSetting.isCenterBtnOn) {
        baseSettingStore.baseBoardSetting.translateX = e.clientX - startX;
        baseSettingStore.baseBoardSetting.translateY = e.clientY - startY;
        renderAll();
      }
    });

    canvas.addEventListener("mouseup", (e) => {
      // 鼠标抬起中键松开
      baseSettingStore.baseBoardSetting.isCenterBtnOn = false;
      // 恢复光标样式
      canvas.style.cursor = "default";
    });

    canvas.addEventListener("mouseleave", (e) => {
      // 鼠标离开画板中键松开
      baseSettingStore.baseBoardSetting.isCenterBtnOn = false;
    });

    // 检测滚轮事件
    canvas.addEventListener("wheel", (e) => {
      console.log(e.deltaY);
      const scaleBaseValue = 0.1; // 缩放的基数
      // 鼠标滚轮实现放大缩小
      if (e.deltaY < 0) {
        // 放大
        baseSettingStore.baseBoardSetting.scaleX += scaleBaseValue;
        baseSettingStore.baseBoardSetting.scaleY += scaleBaseValue;
      } else {
        // 缩小
        baseSettingStore.baseBoardSetting.scaleX -= scaleBaseValue;
        baseSettingStore.baseBoardSetting.scaleY -= scaleBaseValue;
      }
      renderAll();
    });
  }
}

onMounted(() => {
  if (bgCanvas.value) {
    baseSettingStore.baseBoardSetting.canvas = bgCanvas.value;
    // 备份初始化数据
    baseSettingStore.baseBoardSettingStart = deepCopy(baseSettingStore.baseBoardSetting);
    // canvas是dom元素，处理起来比较麻烦，所以直接赋值一下
    baseSettingStore.baseBoardSettingStart.canvas = bgCanvas.value;
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
        <div class="bg-canvas-box" v-canvas-resize="renderAll">
          <canvas ref="bgCanvas" class="canvas-bg design-stage-grid"></canvas>
        </div>
      </div>
      <div class="right-bar" :class="{ 'right-menu-show': !rightMenuShow }">
        <right-bar></right-bar>
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
      background-color: rgba(111, 111, 111, 0.4);
      width: 4px;
      border-radius: 2px;
      height: 38px;
      left: 9px;
      transition: all 0.3s;
    }

    .menu-toggle-bar-bottom {
      position: absolute;
      background-color: rgba(111, 111, 111, 0.4);
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
      background-color: rgba(111, 111, 111, 0.4);
      width: 4px;
      border-radius: 2px;
      height: 38px;
      left: 9px;
      transition: all 0.3s;
    }

    .menu-toggle-bar-bottom {
      position: absolute;
      background-color: rgba(111, 111, 111, 0.4);
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
      background-color: $backgroundColor;
      flex: 1;
    }

    .right-bar {
      position: relative;
      transition: all 0.2s ease-in;
      width: 250px;
      transform: translate(0);
      background-color: $backgroundColor;
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
