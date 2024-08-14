<template>
  <!-- 导出框 -->
  <div id='export_board'>
    <el-button type='primary' size='mini' style="margin-bottom:20px;" @click="exportClick()">导出</el-button>
    <el-input  type="textarea" :autosize='{ minRows: 10, maxRows: 10 }' v-model="style"></el-input>
  </div>
  <!-- 弹出框 -->
  <el-dialog title="请输出保存的名字" v-model="is_dialog_show" width="30%">
    作品名：<el-input size='small' v-model="save_name"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button size='small' @click="is_dialog_show = false">取 消</el-button>
        <el-button size='small' type="primary" @click="exportStyle(save_name)">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { savePixel, initPixel } from './request/pixel.js'
export default {
  props: {
    is_dialog_show: {
      Type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>