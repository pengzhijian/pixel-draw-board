<script setup>
import { ref } from 'vue';
import { useBaseSettingsStore } from '@/stores/base';

const baseSettingsStore = useBaseSettingsStore();

</script>

<template>
  <div class="right-bar">
    <div class="right-bar-box">
      画布设置
      <el-button type="text" @click="baseSettingsStore.exportImage">导出图片</el-button>
    </div>
    <div class="right-bar-box">
      <el-button type="primary" style="width: 100%;" @click="baseSettingsStore.resetAll">还原画布设置</el-button>
    </div>
    <div class="right-bar-box">
      显示标尺：<el-switch v-model="baseSettingsStore.baseBoardSetting.isRulersShow" @change="baseSettingsStore.renderAll" />
    </div>
    <div class="right-bar-box">
      <div class="bar-item">
        宽度：  
        <el-input-number
          v-model="baseSettingsStore.baseBoardSetting.width"
          class="bar-item-input"
          :min="50"
          :max="5000"
          :controls="false"
          size="small"
          @change="baseSettingsStore.renderAll"
        />
      </div>
      <div class="bar-item">
        高度：  
        <el-input-number
          v-model="baseSettingsStore.baseBoardSetting.height"
          class="bar-item-input"
          :min="50"
          :max="5000"
          :controls="false"
          size="small"
          @change="baseSettingsStore.renderAll"
        />
      </div>
    </div>
    <div class="right-bar-box">
      <div class="bar-item">
        left：  
        <el-input-number
          v-model="baseSettingsStore.baseBoardSetting.left"
          class="bar-item-input"
          :controls="false"
          size="small"
          @change="baseSettingsStore.renderAll"
        />
      </div>
      <div class="bar-item">
        top：  
        <el-input-number
          v-model="baseSettingsStore.baseBoardSetting.top"
          class="bar-item-input"
          :controls="false"
          size="small"
          @change="baseSettingsStore.renderAll"
        />
      </div>
    </div>
    <div class="right-bar-box">
      <div class="bar-item">
        x缩放：  
        <el-input-number
          v-model="baseSettingsStore.baseBoardSetting.scaleX"
          class="bar-item-input"
          :precision="2"
          :controls="false"
          size="small"
          @change="baseSettingsStore.renderAll"
        />
      </div>
      <div class="bar-item">
        y缩放：  
        <el-input-number
          v-model="baseSettingsStore.baseBoardSetting.scaleY"
          class="bar-item-input"
          :precision="2"
          :controls="false"
          size="small"
          @change="baseSettingsStore.renderAll"
        />
      </div>
    </div>
    <div class="right-bar-box">
      <div class="bar-item">
        x平移：  
        <el-input-number
          v-model="baseSettingsStore.baseBoardSetting.translateX"
          class="bar-item-input"
          :precision="0"
          :controls="false"
          size="small"
          @change="baseSettingsStore.renderAll"
        />
      </div>
      <div class="bar-item">
        y平移：  
        <el-input-number
          v-model="baseSettingsStore.baseBoardSetting.translateY"
          class="bar-item-input"
          :precision="0"
          :controls="false"
          size="small"
          @change="baseSettingsStore.renderAll"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.right-bar {
  box-sizing: border-box;
  padding: 10px;
  .right-bar-box {
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px dotted #ccc;
    .bar-item {
      flex: 1;
      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .bar-item-input {
        width: 60px;
        flex: 1;
      }
    }
  }
}
</style>
