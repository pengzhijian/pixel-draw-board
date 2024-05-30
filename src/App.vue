<script setup lang="ts">

</script>

<template>
  <!-- <div class="demo-btns">
    <el-button type="primary" @click="$router.push('/application')">正式程序</el-button>
    <el-button type="primary" @click="$router.push('/drawBoardBase')">01绘制画板demo</el-button>
    <el-button type="primary" @click="$router.push('/pixelDrawBoard')">02像素画demo</el-button>
  </div> -->
  <router-view></router-view>
</template>

<style lang="scss" scoped>
.demo-btns {
  margin-bottom: 10px;
}
</style>
