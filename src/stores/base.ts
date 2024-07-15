import { defineStore } from "pinia";
import { drawRulers, drawContent, drawBaseBoard, exportCanvasToImg } from '@/utils/draw';
import { deepCopy } from "@/utils/util";
export const useBaseSettingsStore = defineStore("baseSetting",{
  state: () => ({
    // 通用画板设置
    baseBoardSetting: {
      canvas: null as HTMLCanvasElement | null,  // 画布对象
      isCenterBtnOn: false, // 是否中键按下
      translateX: 0, // 平移的x轴距离
      translateY: 0, // 平移的y轴距离
      scaleX: 1, // 缩放的x轴比例
      scaleY: 1, // 缩放的y轴比例
      isRulersShow: true, // 是否显示标尺
      width: 600, // 画布宽度
      height: 700, // 画布高度
      left: 400, // 画布左上角x位置
      top: 100, // 画布左上角y位置
      backgroundColor: 'white', // 画板的默认颜色
    },
    baseBoardSettingStart: {
      canvas: null as HTMLCanvasElement | null,  // 画布对象
    }
  }),
  actions: {
    /**
     * 渲染画板
     *  */
    renderAll() {
      const canvas = this.baseBoardSetting.canvas;
      if (canvas) {
        // 基础画板始终显示在中间
        this.baseBoardSetting.left = Math.floor((canvas.width - this.baseBoardSetting.width * this.baseBoardSetting.scaleX) / 2 / this.baseBoardSetting.scaleX);
        
        // 画内容
        drawContent(canvas, {
          translateX: this.baseBoardSetting.translateX,
          translateY: this.baseBoardSetting.translateY,
          scaleX: this.baseBoardSetting.scaleX,
          scaleY: this.baseBoardSetting.scaleY,
        }, this.draw);

        // 画标尺
        if (this.baseBoardSetting.isRulersShow) {
          drawRulers(canvas, {
            startX: (- this.baseBoardSetting.left - this.baseBoardSetting.translateX / this.baseBoardSetting.scaleX) * this.baseBoardSetting.scaleX,
            // startX: -100,
            startY: (- this.baseBoardSetting.top - this.baseBoardSetting.translateY / this.baseBoardSetting.scaleY) * this.baseBoardSetting.scaleY,
            unitLength: 10,
            majorTickLength: 10,
            minorTickLength: 5,
            globalAlpha: 1,
            ruleWidth: 25
          });
          // console.log('真实left', (this.baseBoardSetting.left + this.baseBoardSetting.translateX / this.baseBoardSetting.scaleX) * this.baseBoardSetting.scaleX);
        }
      }
    },
    /**
     * 在此进行绘画操作
     *  */
    draw(canvas: HTMLCanvasElement) {
      drawBaseBoard(canvas, this.baseBoardSetting);
    },
    /**
     * 重置所有基本属性
     * */
    resetAll() {
      this.baseBoardSetting = deepCopy(this.baseBoardSettingStart) as any;
      this.baseBoardSetting.canvas = this.baseBoardSettingStart.canvas;
      this.renderAll();
    },
    /**
     * 将画布导出为图片
     * */
    exportImage() {
      const { canvas,width, height, left, top } = this.baseBoardSetting;
      if (canvas) {
        // 因为有可能画板部分宽高大于画布宽高，所以需要在画布上创建一个临时的画布，将画板绘制在临时画布上，再导出临时画布为图片
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = width + left; // 临时画布宽高为画布宽高加上画板左上角坐标
        tempCanvas.height = height + top;
        this.draw(tempCanvas);
        exportCanvasToImg(tempCanvas, {
          left: left,
          top: top,
          width: width,
          height: height
        });
      }
    }
  }
});

