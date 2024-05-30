<script setup lang="ts">
import { ref } from 'vue';

const leftMenuShow = ref(true);
const rightMenuShow = ref(true);
</script>

<template>
  <div class="main-layout">
    <div class="top-bar">
      
    </div>
    <div class="bottom-box">
      <div class="left-bar" :class="{'left-menu-show': !leftMenuShow}">
        <div class="left-content">
          bbbbbbbbbbccccccccdddddddd
        </div>
        <div class="menu-toggle-bar" :class="{'menu-toggle-no-bar': !leftMenuShow}" @click="leftMenuShow = !leftMenuShow">
          <div class="menu-toggle-bar-top"></div>
          <div class="menu-toggle-bar-bottom"></div>
        </div>
      </div>
      <div class="main-content">
       
      </div>
      <div class="right-bar" :class="{'right-menu-show': !rightMenuShow}">
        aaaaaaaaaaaaaaaaaaaa
        <div class="menu-toggle-bar" :class="{'menu-toggle-no-bar': !rightMenuShow}" @click="rightMenuShow = !rightMenuShow">
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
      background-color: aquamarine;
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
</style>
