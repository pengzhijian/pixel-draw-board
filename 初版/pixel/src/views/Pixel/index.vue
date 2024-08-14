<script setup>
import { ref, onMounted } from 'vue'
let uploadedImage = ref(null)
let canvas = ref(null)
let ctx = null

const gap = ref(3)
const rectWidth = ref(1)
const rectHeight = ref(1)
const imgSrc = ref(null)
onMounted(() => {
    console.log()
    ctx = canvas.value.getContext("2d")
})

// 选择图片
function chooseImg(event) {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            changeImgToPx(reader.result, gap.value, rectWidth.value, rectHeight.value);
            imgSrc.value = reader.result;
        }
        reader.readAsDataURL(file);
    }
}


// 背景是否显示白色
const showBackgroundArr = [
    { value: false, label: '透明' },
    { value: true, label: '白色' },
];
const isShowBackground = ref(false);
// 转换图片为像素
// gap代表像素间距
// rectWidth代表绘制像素宽度
// rectHeight代表绘制像素高度
let isNewchange = 0;  // 用来判断是不是最后一次的更新，只有最后一次的更新才需要完全执行循环，用来提升代码效率
function changeImgToPx(src, gap = 3, rectWidth = 1, rectHeight = 1) {
    isNewchange ++;
    let isLastNum = isNewchange;
    // console.log(src, gap, rectWidth, rectHeight)
    if (!src) return;
    const image = new Image()
    image.src = src;
    image.onload = function() {
        canvas.value.width = image.width
        canvas.value.height = image.height
        ctx.drawImage(image, 0, 0, canvas.value.width, canvas.value.height)
        let imageData = ctx.getImageData(0,0,image.width,image.height).data;
        ctx.fillStyle = "#ffffff";
        if (isShowBackground.value) {
            ctx.fillRect(0,0,image.width,image.height);
        } else {
            ctx.clearRect(0, 0, image.width, image.height);
        }
        // console.log(imageData)
        let i = 0;
        for (let h = 0; h < image.height; h += gap) {
            for(let w = 0; w < image.width; w += gap) {
                if (isNewchange != isLastNum) {
                    return;
                } 
                // 因为是rgba数据，而不是rgb，所以这里是*4而不是3
                let position = (image.width * h + w) * 4;
                // console.log(position)
                let params = {
                    r: imageData[position],
                    g: imageData[position + 1],
                    b: imageData[position + 2],
                    rectWidth: rectWidth,
                    rectHeight: rectHeight,
                    w: w,
                    h: h
                }
                // console.log(6666666)
                drawRectBool(params, model.value, symbol.value, compareArr.value)
            }
        }
        // console.log(i)
        uploadedImage.value.src = src;
    };
}

// 画像素的条件
const textArr = ['r+g+b', 'r', 'g', 'b'];
// symbol 0 <=, 1 = ,2 >=
const symbolArr = [
    { value: 0, label: '<=' },
    { value: 1, label: '==' },
    { value: 2, label: '>=' },
    { value: 3, label: '不等于' },
    { value: 4, label: '不设置' },
];
const symbol = ref([0, 3, 3, 3]);
// model 1:和模式， 2：单值模式  3: 且模式 既要满足和又要满足单值
const modelArr = [
    { value: 1, label: '和模式' },
    { value: 2, label: '单值模式' },
    { value: 3, label: '且模式' },
    { value: 4, label: '自由模式' }
];
const model = ref(1);
const compareArr = ref([400, 0, 0, 0]);
// 导出像素的颜色
const colorModelArr = [
    { value: 0, label: '单色模式' },
    { value: 1, label: '原色模式' },
];
const pixelColor = ref('rgba(0, 0, 0, 1)'); 
const pixelColorModel = ref(0);
function drawRectBool(params, model = 1, symbol = [0, 3, 3, 3], compareArr = [300, 0, 0, 0]) {
    let isDraw = false;
    let isDrawNum = 0;
    // rgb和模式
    if (model == 1 || model == 3) {
        if (symbol[0] == 0) {
            if(params.r+params.g+params.b <= compareArr[0]) {
                isDraw = true;
                isDrawNum ++;
            }
        } else if (symbol[0] == 1) {
            if(params.r+params.g+params.b == compareArr[0]) {
                isDraw = true;
                isDrawNum ++;
            }
        } else if (symbol[0] == 2) {
            if(params.r+params.g+params.b >= compareArr[0]) {
                isDraw = true;
                isDrawNum ++;
            }
        } else if (symbol[0] == 3) {
            if(params.r+params.g+params.b != compareArr[0]) {
                isDraw = true;
                isDrawNum ++;
            }
        } else if (symbol[0] == 4) {
            isDraw = true;
            isDrawNum ++;
        }
    }

    // 单值模式 rgb都是单独的判断条件 即3次为true方为true
    if (model == 2 || model == 3) {
        let paramsArr = ['r', 'g', 'b']
        for (let i = 0; i < 3; i ++) {
            if (symbol[i + 1] == 0) {
                if(params[paramsArr[i]] <= compareArr[i + 1]){
                    isDrawNum ++;
                }
            } else if (symbol[i + 1] == 1) {
                if(params[paramsArr[i]] == compareArr[i + 1]){
                    isDrawNum ++;
                }
            } else if (symbol[i + 1] == 2) {
                if(params[paramsArr[i]] >= compareArr[i + 1]){
                    isDrawNum ++;
                }
            } else if (symbol[i + 1] == 3) {
                if(params[paramsArr[i]] != compareArr[i + 1]){
                    // console.log(777777777777777)
                    isDrawNum ++;
                }
            } else if (symbol[i + 1] == 4) {
                isDrawNum ++;
            }
        }
        if (isDrawNum == 3) {
            isDraw = true;
        }
    }

    // 且模式isDrawNum应该为4
    if (model == 3 && isDrawNum != 4) {
        isDraw = false;
    }

    // 自由模式
    if (model == 4) {

    }

    // console.log(isDraw)
    if (isDraw) {
        ctx.fillStyle = pixelColor.value;
        if (pixelColorModel.value == 1) {
            // 原色模式
            ctx.fillStyle = `rgb(${params.r},${params.g},${params.b})`;
        }
        ctx.fillRect(params.w,params.h,params.rectWidth,params.rectHeight);
    }
}
// 根据模式控制显示哪一个元素
function showByModel(index) {
    let isShow = false;
    if (model.value == 1) {
        if (index == 0) {
            isShow = true;
        }
    } else if (model.value == 2) {
        if (index == 1 || index == 2 || index == 3) {
            isShow = true;
        }
    } else if (model.value == 3) {
        if (index <= 3) {
            isShow = true;
        }
    }
    return isShow;
}

// 将canvas导出为图片
function exportImg(canvas) {
    // 导出 Canvas 为图片
    const dataURL = canvas.toDataURL('image/png'); // 可以替换为 'image/jpeg' 等格式

    // 创建一个链接元素
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas_image.png'; // 设置下载的文件名

    // 将链接元素添加到页面，并模拟点击触发下载
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // 下载完成后移除链接元素
}


// 像素生成模式 自由模式
// 左侧的 rgb列表，可手动填rgb,或者r+g+b之类的，提供+-*/%操作
const leftNumArr = ref(['r+g+b']);
// 中间的符号，固定就是这些 ['>', '=', '<', '>=', '<=', '!='],默认 <
const newSymbolArr = ['>', '=', '<', '>=', '<=', '!='];
const centerSymbolArr = ref(['<']);
// 右侧的手动输入值，默认400
const rightNumArr = ref([400]);
// 且 或条件,默认为且
const andOrArr = ref(['and']);
// 添加或减少条件
function addRemoveCondition(index, addOrRemove) {
    if (addOrRemove == 'add') {
        leftNumArr.value.push('r');
        centerSymbolArr.value.push('<');
        rightNumArr.value.push(255);
        andOrArr.value.push('and');
    } else {
        leftNumArr.value.splice(index, 1);
        centerSymbolArr.value.splice(index, 1);
        rightNumArr.value.splice(index, 1);
        andOrArr.value.splice(index, 1);
    }
}
function changeAndOr(index, andOr) {
    if (andOr == 'and') {
        andOrArr.value[index] = 'or';
    } else {
        andOrArr.value[index] = 'and';
    }
}

let drawerShow = ref(true);
</script>

<template>
    <canvas ref="canvas" id="canvas" width="625" height="399"></canvas>
    <div class="check-box">
        <div class="image-container">
            <label for="imageInput" class="upload-label">
                <input @change="chooseImg" type="file" id="imageInput" accept="image/*">
                <span>选择图片</span>
            </label>
            <div class="image-preview">
                <img ref="uploadedImage" id="uploadedImage" alt="Uploaded Image">
            </div>
            <label class="upload-label" @click="drawerShow = !drawerShow">
                <span>修改图片</span>
            </label>
            <label class="upload-label" @click="exportImg(canvas)">
                <span>导出图片</span>
            </label>
        </div>
    </div>
    <div class="setting-box" :class="{'setting-show': !drawerShow}">
        <div class="setting-title">
            图片设置
        </div>
        <div class="control-boxs">
            <!-- 每隔几px检测一次 -->
            <div class="control-box">
                <div class="control-slider">
                    <span class="slider-text">每隔几px检测一次:</span>
                    <el-input-number :min="1" v-model="gap" @change="changeImgToPx(imgSrc, $event, rectWidth, rectHeight)" />
                </div>
                <el-slider :min="1" class="slider" v-model="gap" @input="changeImgToPx(imgSrc, $event, rectWidth, rectHeight)" />
            </div>
            <!-- 像素宽度 -->
            <div class="control-box">
                <div class="control-slider">
                    <span class="slider-text">像素宽度:</span>
                    <el-input-number :min="1" v-model="rectWidth" @change="changeImgToPx(imgSrc, gap, $event, rectHeight)" />
                </div>
                <el-slider :min="1" class="slider" v-model="rectWidth" @input="changeImgToPx(imgSrc, gap, $event, rectHeight)" />
            </div>
            <!-- 像素高度 -->
            <div class="control-box">
                <div class="control-slider">
                    <span class="slider-text">像素高度:</span>
                    <el-input-number :min="1" v-model="rectHeight" @change="changeImgToPx(imgSrc, gap, rectWidth, $event)"/>
                </div>
                <el-slider :min="1" class="slider" v-model="rectHeight" @input="changeImgToPx(imgSrc, gap, rectWidth, $event)" />
            </div>
            <!-- 像素生成模式: -->
            <div class="control-box">
                <div class="control-slider">
                    <span class="slider-text">像素生成模式:</span>
                    <el-select v-model="model"  size="small"  @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)">
                        <el-option
                        v-for="item in modelArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </div>
                <!-- 固定的3个模式 -->
                <!-- <div v-if="model != 4"> -->
                    <div class="model-boxs" v-for="item, index in textArr">
                        <template v-if="showByModel(index)">
                            <div class="model-box">
                                <el-input :value="item" disabled placeholder="输入条件" />
                            </div>
                            <div class="model-box">
                                <el-select v-model="symbol[index]"  @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)">
                                    <el-option
                                        v-for="item in symbolArr"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </div>
                            <div class="model-box">
                                <el-input :min="0" :max="index == 0 ? 765 : 255" v-model.number="compareArr[index]" placeholder="输入条件" @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)" />
                                <el-slider :min="0" :max="index == 0 ? 765 : 255" class="slider" v-model.number="compareArr[index]" @input="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)" />
                                <span v-if="index == 0 && model != 1">且</span>
                            </div>
                        </template>
                    </div>
                <!-- </div> -->
                <!-- 自由模式 -->
                <div class="free-model-box" v-if="model == 4">
                    加减乘除余运算全部支持，分别为+-*/%，3个色值为rgb, 如 r+g/b
                    <div  v-for="item, index in leftNumArr">
                        <div class="model-boxs">
                            <div class="model-box">
                                <el-input v-model="leftNumArr[index]"/>
                                <div v-if="index != leftNumArr.length - 1">
                                    <div v-if="andOrArr[index] == 'and'" class="and-or-box" @click="changeAndOr(index, andOrArr[index])">且</div>
                                </div>
                            </div>
                            <div class="model-box">
                                <el-select v-model="centerSymbolArr[index]"  @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)">
                                    <el-option
                                        v-for="item in newSymbolArr"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    />
                                </el-select>
                            </div>
                            <div class="model-box">
                                <el-input v-model.number="rightNumArr[index]" placeholder="输入条件" @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)" />
                            </div>
                            <div>
                                <div class="add-reduce-box" v-if="index == leftNumArr.length - 1" @click="addRemoveCondition(index, 'add')">+</div>
                                <div class="add-reduce-box" v-else @click="addRemoveCondition(index, 'remove')">-</div>
                            </div>
                        </div>
                        <div v-if ="andOrArr[index] == 'or'"  class="or" @click="changeAndOr(index, andOrArr[index])">
                            <div class="and-or-box">或</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 颜色模式 -->
            <div class="control-box">
                <div class="control-slider">
                    <span class="slider-text">颜色模式:</span>
                    <el-select size="small" v-model="pixelColorModel"  @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)">
                        <el-option
                        v-for="item in colorModelArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </div>
                <div class="control-slider" v-if="pixelColorModel == 0">
                    <span class="slider-text">选择颜色:</span>
                    <el-color-picker v-model="pixelColor" show-alpha  @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)" />
                </div>
                <div class="control-slider">
                    <span class="slider-text">导出图片背景:</span>
                    <el-select size="small" v-model="isShowBackground"  @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)">
                        <el-option
                        v-for="item in showBackgroundArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </div>
            </div>
            <!-- <div class="control-box">
                加减乘除余运算全部支持，分别为+-*/%，运算符无优先级，统一从左到又计算，3个色值为rgb, 如 r+g/b，先计算r+g 后计算 r+g的和除以b，不支持括号
                <div  v-for="item, index in leftNumArr">
                    <div class="model-boxs">
                        <div class="model-box">
                            <el-input v-model="leftNumArr[index]"/>
                            <div v-if="index != leftNumArr.length - 1">
                                <div v-if="andOrArr[index] == 'and'" class="and-or-box" @click="changeAndOr(index, andOrArr[index])">且</div>
                            </div>
                        </div>
                        <div class="model-box">
                            <el-select v-model="centerSymbolArr[index]"  @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)">
                                <el-option
                                    v-for="item in newSymbolArr"
                                    :key="item"
                                    :label="item"
                                    :value="item"
                                />
                            </el-select>
                        </div>
                        <div class="model-box">
                            <el-input v-model.number="rightNumArr[index]" placeholder="输入条件" @change="changeImgToPx(imgSrc, gap, rectWidth, rectHeight)" />
                        </div>
                        <div>
                            <div class="add-reduce-box" v-if="index == leftNumArr.length - 1" @click="addRemoveCondition(index, 'add')">+</div>
                            <div class="add-reduce-box" v-else @click="addRemoveCondition(index, 'remove')">-</div>
                        </div>
                    </div>
                    <div v-if ="andOrArr[index] == 'or'"  class="or" @click="changeAndOr(index, andOrArr[index])">
                        <div class="and-or-box">或</div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
.check-box {
    z-index: 999999999;
    position: fixed;
    left: 0;
    top: 350px;
    .image-container {
        width: 145px;
        height: 150px;
        text-align: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        
    }
    .image-preview {
        margin-bottom: 10px;
    }
    .upload-label {
        height: 40px;
        display: inline-block;
        cursor: pointer;
        padding: 10px 20px;
        background-color: #3498db;
        color: #fff;
        border-radius: 5px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .upload-label input {
        display: none;
    }
}

body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}



.image-preview {
    margin-top: 20px;
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

#uploadedImage {
    max-width: 100%;
    max-height: 100%;
}
#canvas {
    border: 1px solid black;
}


.setting-box {
    transition: all 0.2s;
    padding: 20px;
    position: fixed;
    height: 100vh;
    right: 0;
    top: 0;
    overflow: auto;
    border: 1px solid rgb(200, 200, 200);
    box-shadow: 0 0 10px gray;
    .control-boxs {
        flex-wrap: wrap;
        width: 500px;
        .control-box {
            margin-bottom: 10px;
            padding: 5px;
            width: 100%;
            border: 1px solid gainsboro;
            border-radius: 3px;
            .control-slider {
                display: flex;
                // width: 240px;
                align-items: center;
                padding: 5px;
                .slider-text {
                    text-align: right;
                    margin-right: 20px;
                }
            }
            .slider {
                padding: 0 20px;
            }
        }
    }
}
.setting-show {
    right: -560px;
}


.model-boxs {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    .model-box {
        width: 28%;
        .and-or-box {
            padding: 5px;
            width: 30px;
            text-align: center;
            margin-top: 5px;
            // border: 1px sandybrown solid;
            border-radius: 25%;
            font-weight: bold;
            background-color: antiquewhite;
            cursor: pointer;
        }
    }
    .add-reduce-box {
        width: 30px;
        height: 30px;
        line-height: 100%;
        background-color: rgb(232, 240, 189);
        text-align: center;
        font-weight: bold;
        font-size: 24px;
        cursor: pointer;
    }
}
.or {
    // background-color: antiquewhite;
    cursor: pointer;
    padding-bottom: 10px;
    border-bottom: 2px solid red;
    border-top: 2px solid red;
    .and-or-box {
        padding: 5px;
        height: 30px;
        width: 30px;
        text-align: center;
        margin-top: 5px;
        // border: 1px sandybrown solid;
        border-radius: 25%;
        font-weight: bold;
        margin-left: 10px;
        background-color: antiquewhite;
        cursor: pointer;
    }
}
</style>