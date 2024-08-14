<script setup>

</script>

<template>
  <!-- <div class="choose-box">
    <div class="pixel-button">
    </div>
  </div> -->
  <div class="content-box">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
$leftWidth: 142px;
.choose-box {
  position: fixed;
  width: $leftWidth;
  height: 100vh;
  // border: 1px solid black;
}
.pixel-button {
  width: $leftWidth;
  height: 321px;
  background: url('./assets/imgs/像素画-像素版.png');
  // border: 1px solid black;
}
.pixel-button:hover {
  cursor: pointer;
  filter: brightness(90%);
}
.pixel-button:active {
  cursor: pointer;
  filter: brightness(80%);
}
.content-box {
  // border: 1px solid red;
  margin-left: $leftWidth;
  height: 100vh;
}
</style>
