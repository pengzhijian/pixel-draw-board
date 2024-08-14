<script setup lang="ts">
import { exportCanvasToImg } from "@/utils/draw";
import { onMounted, ref, type Ref, reactive } from "vue";
const canvas: Ref<HTMLCanvasElement | null> = ref(null);

type RulerSetting = {
  unitLength: number;
  majorTickLength: number;
  minorTickLength: number;
  globalAlpha: number;
  translateX: number;
  translateY: number;
};
/**
 * 绘制标尺
 * @param canvas 画布
 * @param setting 标尺设置
 * @param setting.unitLength 每个单位的长度
 * @param setting.majorTickLength 主要刻度的长度
 * @param setting.minorTickLength 次要刻度的长度
 * @param setting.globalAlpha 透明度
 * @param setting.translateX 平移的x轴距离
 * @param setting.translateY 平移的y轴距离
 */
function drawRulers(
  canvas: HTMLCanvasElement,
  setting: RulerSetting = {
    unitLength: 10,
    majorTickLength: 10,
    minorTickLength: 5,
    globalAlpha: 1,
    translateX: 0,
    translateY: 0,
  }
) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const {
    unitLength,
    majorTickLength,
    minorTickLength,
    globalAlpha,
    translateX,
    translateY,
  } = setting;
  // 设置透明度
  ctx.globalAlpha = globalAlpha;
  // 设置标尺属性
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#000";
  ctx.font = "10px Arial";

  // 绘制水平标尺
  for (let i = translateX % unitLength; i < canvas.width; i += unitLength) {
    // 绘制刻度
    const nowPos = Math.floor((i + translateX) / unitLength);
    ctx.beginPath();
    ctx.moveTo(i, 0);
    if (nowPos % 10 === 0) {
      ctx.lineTo(i, majorTickLength);
      ctx.stroke();
      ctx.fillText(nowPos * 10 + "", i + 2, majorTickLength + 10);
    } else {
      ctx.lineTo(i, minorTickLength);
      ctx.stroke();
    }
  }

  // 绘制垂直标尺
  for (let i = translateY % unitLength; i < canvas.height; i += unitLength) {
    // 绘制刻度
    const nowPos = Math.floor((i + translateY) / unitLength);
    ctx.beginPath();
    ctx.moveTo(0, i);
    if (nowPos % 10 === 0) {
      ctx.lineTo(majorTickLength, i);
      ctx.stroke();
      ctx.fillText(nowPos * 10 + "", majorTickLength + 10, i + 2);
    } else {
      ctx.lineTo(minorTickLength, i);
      ctx.stroke();
    }
  }
}

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
  ctx.fillStyle = "#007BFF";
  ctx.fillRect(0, 0, 200, 150);
  ctx.beginPath();
  ctx.arc(400, 75, 50, 0, 2 * Math.PI);
  ctx.stroke();

  // 还原画布状态
  ctx.restore();
}

const baseSetting = reactive({
  isCenterBtnOn: false, // 是否中键按下
  translateX: 0, // 平移的x轴距离
  translateY: 0, // 平移的y轴距离
  scaleX: 1, // 缩放的x轴比例
  scaleY: 1, // 缩放的y轴比例
});

function drawAll() {
  if (canvas.value) {
    drawContent(canvas.value, {
      translateX: baseSetting.translateX,
      translateY: baseSetting.translateY,
      scaleX: baseSetting.scaleX,
      scaleY: baseSetting.scaleY,
    });
    drawRulers(canvas.value, {
      translateX: baseSetting.translateX,
      translateY: baseSetting.translateY,
      unitLength: 10,
      majorTickLength: 10,
      minorTickLength: 5,
      globalAlpha: 1,
    });
  }
}

onMounted(() => {
  if (canvas.value) {
    const mainCanvas: HTMLCanvasElement = canvas.value;
    drawAll();
    let startX: number, startY: number;
    mainCanvas.addEventListener("mousedown", (e) => {
      if (e.button === 1) {
        // 1表示中键,检测鼠标中键按下
        baseSetting.isCenterBtnOn = true;
        startX = e.clientX - baseSetting.translateX;
        startY = e.clientY - baseSetting.translateY;
        // 更改光标样式
        mainCanvas.style.cursor = "grabbing";
      }
    });

    mainCanvas.addEventListener("mousemove", (e) => {
      // 检测鼠标中建按下，拖动画布
      if (baseSetting.isCenterBtnOn) {
        baseSetting.translateX = e.clientX - startX;
        baseSetting.translateY = e.clientY - startY;
        drawAll();
      }
    });

    mainCanvas.addEventListener("mouseup", (e) => {
      // 鼠标抬起中键松开
      baseSetting.isCenterBtnOn = false;
      // 恢复光标样式
      mainCanvas.style.cursor = "default";
    });

    mainCanvas.addEventListener("mouseleave", (e) => {
      // 鼠标离开画板中键松开
      baseSetting.isCenterBtnOn = false;
    });

    // 检测滚轮事件
    mainCanvas.addEventListener("wheel", (e) => {
      console.log(e.deltaY);
      const scaleBaseValue = 0.1; // 缩放的基数
      // 鼠标滚轮实现放大缩小
      if (e.deltaY < 0) {
        // 放大
        baseSetting.scaleX += scaleBaseValue;
        baseSetting.scaleY += scaleBaseValue;
      } else {
        // 缩小
        baseSetting.scaleX -= scaleBaseValue;
        baseSetting.scaleY -= scaleBaseValue;
      }
      drawAll();
    });
  }
});
</script>

<template>
  <canvas ref="canvas" id="myCanvas" width="800" height="600"></canvas>
</template>

<style lang="scss" scoped>
#myCanvas {
  border: 1px solid rgb(101, 212, 156);
  flex: none;
}
</style>
