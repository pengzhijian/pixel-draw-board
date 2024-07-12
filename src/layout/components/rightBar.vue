<script setup>
import { ref } from 'vue';
import { useBaseSettingsStore } from '@/stores/base';

const baseSettingsStore = useBaseSettingsStore();

</script>

<template>
  <div class="right-bar">
    <div class="right-bar-box">
      显示标尺：<el-switch v-model="baseSettingsStore.baseBoardSetting.isRulersShow" @change="baseSettingsStore.renderAll" />
    </div>
    <div class="right-bar-box">
      画布宽度：  
      <el-input-number
        v-model="baseSettingsStore.baseBoardSetting.width"
        :min="50"
        :max="5000"
        :controls="false"
        size="small"
        @change="baseSettingsStore.renderAll"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.right-bar {
  padding: 10px;
  .right-bar-box {
    display: flex;
    align-items: center
  }
}
</style>
