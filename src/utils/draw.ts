import { type ReactPositionInfo } from "@/type/draw.type";
/**
 * 初始化画布
 * @constructor
 * @params { HTMLCanvasElement } canvas 画布对象
 * @params { number } width 画布宽度
 * @params { number } height 画布高度
 * @params { number } gridWidth 格子宽度
 * @params { number } gridHeight 格子高度
 * @params { string } lineColor 线条颜色
 * @params { boolean } showLine 是否显示间隔线条
 * @params { string } pixelColor 像素颜色
 * @params { number[][] } rectPosArr 存储格子坐标信息
 */
export function initMap(
  canvas: HTMLCanvasElement,
  setting: {
    width: number;
    height: number;
    gridWidth: number;
    gridHeight: number;
    lineColor: string;
    lineShow: boolean;
    rectPosArr?: ReactPositionInfo[][];
  }
) {
  if (!canvas) return;
  const {
    width,
    height,
    lineColor,
    lineShow,
    rectPosArr,
    gridWidth,
    gridHeight,
  } = setting;
  canvas.width = width;
  canvas.height = height;
  if (lineShow) {
    const ctx: CanvasRenderingContext2D = canvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    // 开始路径并绘制线条
    ctx.beginPath();

    // 格子数不一定能被整除，所以要补上缺的宽高使其能整除
    const widthLineNum = canvas.width / gridWidth - 1; // 横向线条数量
    if (canvas.width % gridWidth == 0) {
      canvas.width += widthLineNum;
    } else {
      canvas.width += widthLineNum + (gridWidth - (canvas.width % gridWidth));
    }
    // 竖向线条数量
    const heightLineNum = canvas.height / gridHeight - 1;
    if (canvas.height % gridHeight == 0) {
      canvas.height += heightLineNum;
    } else {
      canvas.height +=
        heightLineNum + (gridHeight - (canvas.height % gridHeight));
    }

    // 设置线条样式
    ctx.lineWidth = 1;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    // 开始绘制横线
    for (let i = 0; i < heightLineNum; i++) {
      // 注意要算线的宽度，也就是后面那个+i
      ctx.moveTo(0, gridHeight * (i + 1) + i);
      ctx.lineTo(canvas.width, gridHeight * (i + 1) + i);
      ctx.stroke();
    }
    // 开始绘制竖线
    for (let i = 0; i < widthLineNum; i++) {
      ctx.moveTo(gridWidth * (i + 1) + i, 0);
      ctx.lineTo(gridWidth * (i + 1) + i, canvas.height);
      ctx.stroke();
    }
  }

  // 如果有传格子的坐标信息，则绘制格子
  if (rectPosArr) {
    rectPosArr.forEach((item) => {
      if (item) {
        item.forEach((rect) => {
          if (rect) {
            drawRect(canvas, {
              hasLine: lineShow,
              x: rect.x,
              y: rect.y,
              gridWidth: gridWidth,
              gridHeight: gridHeight,
              color: rect.color,
            });
          }
        });
      }
    });
  }
}

/**
 * 画板注册画笔事件，添加绘画功能
 * @constructor
 * @params { HTMLCanvasElement } canvas 画布对象
 * @params { 'line' | 'pixel' } mode 画笔类型，线条或像素
 * @params { number } gridWidth 每个格子的像素大小
 * @params { string } lineColor 线条颜色
 * @params { boolean } hasLine 是否显示间隔线条
 *
 *
 */
export function drawLineHandler(
  canvas: HTMLCanvasElement,
  setting: { gridWidth: number; lineColor: string }
) {
  if (!canvas) return;
  const { lineColor, gridWidth } = setting;
  let startMove = false; // 鼠标是否按下
  let lastX = 0; // 鼠标按下时的横坐标
  let lastY = 0; // 鼠标按下时的纵坐标
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const onMouseDownFun = (e: MouseEvent) => {
    // 记录按下时的坐标
    startMove = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    // 原处画一个点
    ctx.beginPath();
    ctx.lineWidth = gridWidth;
    ctx.strokeStyle = lineColor;
    ctx.lineCap = "round"; // 线条两端为圆角
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(lastX, lastY);
    ctx.stroke();
  };
  canvas.addEventListener("mousedown", onMouseDownFun);
  const onMouseMoveFun = (e: MouseEvent) => {
    // 如果鼠标按下了，则绘制线条
    if (startMove) {
      const newX = e.offsetX;
      const newY = e.offsetY;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(newX, newY);
      ctx.stroke();
      lastX = newX;
      lastY = newY;
    }
  };
  canvas.addEventListener("mousemove", onMouseMoveFun);
  const onMouseUpFun = (e: MouseEvent) => {
    startMove = false;
  };
  canvas.addEventListener("mouseup", onMouseUpFun);

  // 将注册事件返回，方便清除事件
  return {
    onMouseDownFun,
    onMouseMoveFun,
    onMouseUpFun,
  };
}

/**
 * 画板注册画笔事件，添加绘画像素功能
 * @constructor
 * @params { HTMLCanvasElement } canvas 画布对象
 * @params { number } gridWidth 每个格子的像素宽度
 * @params { number } gridHeight 每个格子的像素高度
 * @params { string } lineColor 线条颜色
 * @params { boolean } hasLine 是否显示间隔线条
 * @params { string } pixelColor 像素颜色
 * @params { number[][] } rectPosArr 存储格子坐标信息
 *
 */
export function drawPixelHandler(
  canvas: HTMLCanvasElement,
  setting: {
    hasLine: boolean;
    gridWidth: number;
    gridHeight: number;
    pixelColor: string;
    rectPosArr: (ReactPositionInfo | null)[][];
  }
) {
  const { hasLine, pixelColor, rectPosArr, gridWidth, gridHeight } = setting;
  let startMove = false; // 鼠标是否按下
  let lastX = 0; // 鼠标按下时的横坐标
  let lastY = 0; // 鼠标按下时的纵坐标
  let reactArr: { x: number; y: number }[] = []; // 用来存储本次落笔画了的格子
  const onMouseDownFun = (e: MouseEvent) => {
    // 记录按下时的坐标
    startMove = true;
    reactArr = [];
    lastX = e.offsetX;
    lastY = e.offsetY;
    const [gridX, gridY] = mouseToGrid({
      x: lastX,
      y: lastY,
      gridHeight,
      gridWidth,
      hasLine,
    });
    // 将坐标信息存储到数组中
    if (!rectPosArr[gridX]) {
      rectPosArr[gridX] = [];
    }
    // 单点如果点击的位置已经有颜色，且和之前的相同，则清除
    if (rectPosArr[gridX][gridY]?.color === pixelColor) {
      rectPosArr[gridX][gridY] = null;
      clearRect(canvas, {
        hasLine,
        x: gridX,
        y: gridY,
        gridWidth,
        gridHeight,
        color: pixelColor,
      });
    } else {
      rectPosArr[gridX][gridY] = { x: gridX, y: gridY, color: pixelColor };
      reactArr.push({ x: gridX, y: gridY });
      drawRect(canvas, {
        hasLine,
        x: gridX,
        y: gridY,
        gridWidth,
        gridHeight,
        color: pixelColor,
      });
    }
  };
  canvas.addEventListener("mousedown", onMouseDownFun);

  const onMouseMoveFun = (e: MouseEvent) => {
    if (startMove) {
      const [gridX, gridY] = mouseToGrid({
        x: e.offsetX,
        y: e.offsetY,
        gridHeight,
        gridWidth,
        hasLine,
      });

      if (!reactArr.some((item) => item.x === gridX && item.y === gridY)) {
        // 将坐标信息存储到数组中
        if (!rectPosArr[gridX]) {
          rectPosArr[gridX] = [];
        }
        rectPosArr[gridX][gridY] = { x: gridX, y: gridY, color: pixelColor };
        reactArr.push({ x: gridX, y: gridY });
        drawRect(canvas, {
          hasLine,
          x: gridX,
          y: gridY,
          gridWidth,
          gridHeight,
          color: pixelColor,
        });
      }
    }
  };
  canvas.addEventListener("mousemove", onMouseMoveFun, true);

  const onMouseUpFun = (e: MouseEvent) => {
    startMove = false;
  };
  canvas.addEventListener("mouseup", onMouseUpFun);

  // 将注册事件返回，方便清除事件
  return {
    onMouseDownFun,
    onMouseMoveFun,
    onMouseUpFun,
  };
}

/**
 * 在第几格第几列画一个矩形
 * @constructor
 * @params { HTMLCanvasElement } canvas 画布对象
 * @params { number } x 第几格
 * @params { number } y 第几列
 * @params { number } gridWidth 每个格子的像素宽度
 * @params { number } gridHeight 每个格子的像素高度
 * @params { string } color 矩形颜色
 *
 */
export function drawRect(
  canvas: HTMLCanvasElement,
  setting: {
    hasLine: boolean;
    x: number;
    y: number;
    gridWidth: number;
    gridHeight: number;
    color: string;
  }
) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const { hasLine, x, y, gridWidth, gridHeight, color } = setting;
  ctx.fillStyle = color;
  if (hasLine) {
    ctx.fillRect(
      (gridWidth + 1) * (x - 1),
      (gridHeight + 1) * (y - 1),
      gridWidth - 1,
      gridHeight - 1
    );
  } else {
    ctx.fillRect(
      gridWidth * (x - 1),
      gridHeight * (y - 1),
      gridWidth,
      gridHeight
    );
  }
}

/**
 * 在第几格第几列清除一个矩形
 * @constructor
 * @params { HTMLCanvasElement } canvas 画布对象
 * @params { number } x 第几格
 * @params { number } y 第几列
 * @params { string } color 矩形颜色
 *
 */
export function clearRect(
  canvas: HTMLCanvasElement,
  setting: {
    hasLine: boolean;
    x: number;
    y: number;
    gridWidth: number;
    gridHeight: number;
    color: string;
  }
) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const { hasLine, x, y, color, gridWidth, gridHeight } = setting;
  ctx.fillStyle = color;
  if (hasLine) {
    ctx.clearRect(
      (gridWidth + 1) * (x - 1),
      (gridHeight + 1) * (y - 1),
      gridWidth - 1,
      gridHeight - 1
    );
  } else {
    ctx.clearRect(
      gridWidth * (x - 1),
      gridHeight * (y - 1),
      gridWidth,
      gridHeight
    );
  }
}

/**
 * 将鼠标坐标转化为画板上的格子坐标
 * @constructor
 * @params { number } x 鼠标横坐标
 * @params { number } y 鼠标纵坐标
 * @params { number } gridWidth 每个格子的像素宽度
 * @params { number } gridHeight 每个格子的像素高度
 */
export function mouseToGrid(setting: {
  hasLine: boolean;
  x: number;
  y: number;
  gridWidth: number;
  gridHeight: number;
}) {
  const { x, y, hasLine, gridWidth, gridHeight } = setting;
  if (!hasLine) {
    return [Math.floor(x / gridWidth) + 1, Math.floor(y / gridHeight) + 1];
  } else {
    return [
      Math.floor(x / (gridWidth + 1)) + 1,
      Math.floor(y / (gridHeight + 1)) + 1,
    ];
  }
}

/**
 * 将canvas中指定位置大小的方块区域导出为图片
 * @param canvas
 * @param canvasSetting 导出区域设置
 */
export function exportCanvasToImg(canvas: HTMLCanvasElement, canvasSetting?: {
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  if (!canvasSetting) {
    canvasSetting = {
      left: 0,
      top: 0,
      width: canvas.width,
      height: canvas.height,
    };
  }
  const { left, top, width, height } = canvasSetting;

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.resetTransform();
  // 创建一个临时的canvas，将指定区域的canvas内容导出为图片
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
  const imageData = ctx.getImageData(left, top, width, height);
  tempCtx.putImageData(imageData, 0, 0);

  // 将临时canvas内容导出为图片
  const dataURL = tempCanvas.toDataURL("image/png"); // 可以替换为 'image/jpeg' 等格式

  // 创建一个链接元素
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "canvas_image.png"; // 设置下载的文件名

  // 将链接元素添加到页面，并模拟点击触发下载
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a); // 下载完成后移除链接元素
}

/**
 * 上传图片，将其转化为canvas
 */
export function uploadImgToCanvas(
  e: any,
  canvas: HTMLCanvasElement,
  callback: Function
) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  if (e.file) {
    const reader = new FileReader();
    reader.onload = function () {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        if (callback) {
          callback();
        }
      };
    };
    reader.readAsDataURL(e.file);
  }
}

/**
 * 将图片数据转换为像素数据
 * @param canvas 画布
 * @param setting 转换设置
 * @param gap 每隔几个像素检测一次，值越大越快，画的像素点越少
 * @param gridWidth 画的像素宽度
 * @param gridHeight 画的像素高度
 * @param imgPixelData 图片像素数据
 * @returns { rectPosArr, width, height, gridWidth, gridHeight, imageData }
 */
export function changeImageDataToPixel(
  canvas: HTMLCanvasElement,
  setting: {
    gap: number;
    gridWidth: number;
    gridHeight: number;
    imgPixelData?: ImageData;
  } = { gap: 3, gridWidth: 1, gridHeight: 1 }
) {
  const { gap, gridWidth, gridHeight, imgPixelData } = setting;
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  let imageData: ImageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  // 如果是二次修改图片，图片用的是直接传过来的数据
  if (imgPixelData) {
    imageData = imgPixelData;
  }
  const rectPosArr: ReactPositionInfo[][] = [];
  for (let i = 0; i < imageData.height; i += gap) {
    rectPosArr[i] = [];
    for (let j = 0; j < imageData.width; j += gap) {
      // console.log(111)
      // 当前点位置信息，之所以*4是因为rgba分量是4个字节
      const position = (imageData.width * i + j) * 4;
      const color = `rgba(${imageData.data[position]}, ${
        imageData.data[position + 1]
      }, ${imageData.data[position + 2]}, ${
        imageData.data[position + 3] / 255
      })`;
      rectPosArr[i].push({
        x: Math.floor(j / gridWidth),
        y: Math.floor(i / gridHeight),
        color: color,
        width: gridWidth,
        height: gridHeight,
      });
    }
  }
  return {
    rectPosArr,
    width: imageData.width,
    height: imageData.height,
    gridWidth: gridWidth,
    gridHeight: gridHeight,
    imageData: imageData,
  };
}
/**
 * 将图片数据转换为灰度图
 */
export function changeImageToGray(canvas: HTMLCanvasElement) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const imageData: ImageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  const data = imageData.data;
  // 遍历所有像素，将颜色转换为灰度值
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // 使用加权平均法计算灰度值
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;
    // 将RGB值设置为相同的灰度值
    data[i] = gray; // 红色通道
    data[i + 1] = gray; // 绿色通道
    data[i + 2] = gray; // 蓝色通道
  }
  // 将处理后的图像数据放回Canvas
  ctx.putImageData(imageData, 0, 0);
}

/**
 * 将图片数据转换为灰度图
 */
export function changeImageToMode(canvas: HTMLCanvasElement, modeName: string) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const imageData: ImageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  const data = imageData.data;
  // 遍历所有像素，将颜色转换为灰度值
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    let colorValue = Math.max(r, g, b) + Math.min(r, g, b);
    const sortArr = [r, g, b].sort();
    const max = sortArr[2];
    const min = sortArr[0];
    const center = sortArr[1];
    if (modeName === 'Hue') {
      // 色相（度）=原色色相（RGB最大值色相）+（-）（中间值-最小值）*60/（最大值-最小值）
      colorValue = max + ((center - min) * 60 / (max - min));
    } else if (modeName === 'Saturation') {
      // 饱和度=[（最大值-最小值）/最大值]*100%
      colorValue = (max - min) / max * 100;
    } else if (modeName === 'Lightness') {
      // 亮度=(最大值 /255)*100%
      colorValue = max / 255 * 100;
    } else if (modeName === 'brightness') {
      // 明度：30%*R+59%*G+11%*B
      colorValue = 0.3 * r + 0.59 * g + 0.11 * b;
    } else if (modeName === 'Grayscale') {
      // 灰度=（最大值+最小值）/2
      colorValue = (max + min) / 2;
    } else if (modeName === 'other') {
      // RGB颜色模型 （r+g）/2 - b 这个值越大就越暖，越小就越冷
      colorValue = ((r + g) / 2 - b) * 100;
    }
    // 将RGB值设置为相同的灰度值
    data[i] = colorValue; // 红色通道
    data[i + 1] = colorValue; // 绿色通道
    data[i + 2] = colorValue; // 蓝色通道
  }
  // 将处理后的图像数据放回Canvas
  ctx.putImageData(imageData, 0, 0);
}


type RulerSetting = {
  unitLength: number;
  majorTickLength: number;
  minorTickLength: number;
  globalAlpha: number;
  startX: number;
  startY: number;
  ruleWidth: number;
};
/**
 * 绘制标尺
 * @param canvas 画布
 * @param setting 标尺设置
 * @param setting.unitLength 每个单位的长度
 * @param setting.majorTickLength 主要刻度的长度
 * @param setting.minorTickLength 次要刻度的长度
 * @param setting.globalAlpha 透明度
 * @param setting.startX 起始横坐标
 * @param setting.startY 起始纵坐标
 * @param setting.ruleWidth 标尺宽度
 */
export function drawRulers(
  canvas: HTMLCanvasElement,
  setting: RulerSetting = {
    unitLength: 10,
    majorTickLength: 10,
    minorTickLength: 5,
    globalAlpha: 1,
    startX: 0,
    startY: 0,
    ruleWidth: 25
  }
) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const {
    unitLength,
    majorTickLength,
    minorTickLength,
    globalAlpha,
    // scaleX,
    startX,
    startY,
    ruleWidth
  } = setting;

  // 设置透明度
  ctx.globalAlpha = globalAlpha;
  // 设置标尺属性
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.strokeStyle = "#000";
  ctx.fillRect(0, 0, ruleWidth, canvas.height);
  ctx.fillRect(0, 0, canvas.width, ruleWidth);
  ctx.lineWidth = 1;
  ctx.fillStyle = "#000";
  ctx.font = "10px Arial";
  // 平移画布

  const startIndex = (startX % unitLength + ruleWidth);
  // 绘制水平标尺
  for (let i = startIndex; i < canvas.width; i += unitLength) {
    // 绘制刻度
    const nowPos = Math.floor((i + startX) / unitLength);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(i, ruleWidth);
    if (nowPos % 10 === 0) {
      ctx.lineTo(i, ruleWidth - majorTickLength);
      ctx.stroke();
      ctx.fillText(parseInt((nowPos * unitLength) + '') + "", i, 10);
    } else {
      ctx.lineTo(i, ruleWidth - minorTickLength);
      ctx.stroke();
    }
    ctx.restore();
  }

  const startIndexY = (startY % unitLength + ruleWidth);
  // 绘制垂直标尺
  for (let i = startIndexY; i < canvas.height; i += unitLength) {
    // 绘制刻度
    const nowPos = Math.floor((i + startY) / unitLength);
    ctx.beginPath();
    ctx.moveTo(ruleWidth, i);
    if (nowPos % 10 === 0) {
      ctx.lineTo(ruleWidth - majorTickLength, i);
      ctx.stroke();
      // 保存当前状态
      ctx.save();
      // 移动画布原点到字符绘制位置
      ctx.translate(10, i + 2);
      // 旋转画布坐标系90度（逆时针）
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(parseInt((nowPos * unitLength) + '') + "", 0, 0);
      // 恢复到之前的状态
      ctx.restore();
    } else {
      ctx.lineTo(ruleWidth - minorTickLength, i);
      ctx.stroke();
    }
  }

}


type CanvasSetting = {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
};
/**
 * 绘制内容
 * @param canvas 画布
 * @param canvasSetting 画布设置
 * @param canvasSetting.translateX 平移的x轴距离
 * @param canvasSetting.translateY 平移的y轴距离
 * @param canvasSetting.scaleX 缩放的x轴比例
 * @param canvasSetting.scaleY 缩放的y轴比例
 */
export function drawContent(
  canvas: HTMLCanvasElement,
  canvasSetting: CanvasSetting = {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
  },
  callback: Function
) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const { translateX, translateY, scaleX, scaleY } = canvasSetting;
  // 先清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  // 保存当前画布状态
  ctx.save();
  // 设置平移和缩放
  ctx.translate(translateX, translateY);
  ctx.translate(0, 0);
  ctx.scale(scaleX, scaleY);

  // 进行一些绘画操作
  callback(canvas);

  // 还原画布状态
  ctx.restore();
}

/**
 * 基础画板，保存只会显示基础画板中的内容
 */
type BaseBoardSetting = {
  width: number; // 画布宽度
  height: number; // 画布高度
  left: number; // 画布x轴坐标
  top: number; // 画布y轴坐标
  backgroundColor: string; // 画布背景色
}
export function drawBaseBoard(canvas: HTMLCanvasElement, baseBoardSetting: BaseBoardSetting) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
  const { left, top, width, height, backgroundColor } = baseBoardSetting;
  ctx.save();
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(left, top, width, height);
  ctx.restore();
}