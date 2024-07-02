import { defineStore } from "pinia";

export const useBaseSettingsStore = defineStore("baseSetting",{
  state: () => ({
    baseSetting: {
      isCenterBtnOn: false, // 是否中键按下
      translateX: 0, // 平移的x轴距离
      translateY: 0, // 平移的y轴距离
      scaleX: 1, // 缩放的x轴比例
      scaleY: 1, // 缩放的y轴比例
    },
    baseBoardSetting: {
      width: 600,
      height: 700,
      x: 400,
      y: 100,
    }
  })
});
