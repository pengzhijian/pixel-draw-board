import { defineStore } from "pinia";
import { drawRulers, drawContent, drawBaseBoard } from '@/utils/draw';
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
          translateX: this.baseBoardSetting.translateX + 25, // 这个25是标尺的宽度，如果标尺宽度改变这个也变
          translateY: this.baseBoardSetting.translateY + 25,
          scaleX: this.baseBoardSetting.scaleX,
          scaleY: this.baseBoardSetting.scaleY,
        }, this.draw);

        // 画标尺
        if (this.baseBoardSetting.isRulersShow) {
          drawRulers(canvas, {
            translateX: (this.baseBoardSetting.translateX - this.baseBoardSetting.left) * this.baseBoardSetting.scaleX,
            translateY: (this.baseBoardSetting.translateY - this.baseBoardSetting.top) * this.baseBoardSetting.scaleY,
            unitLength: 10,
            majorTickLength: 10,
            minorTickLength: 5,
            globalAlpha: 1,
            scaleX: this.baseBoardSetting.scaleX
          });
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
      this.baseBoardSetting = this.baseBoardSettingStart as any;
      this.renderAll();
    }
  }
});

