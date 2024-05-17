import { type ReactPositionInfo } from '@/type/draw.type.ts'
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
export function initMap(canvas: HTMLCanvasElement,setting: { width: number, height: number, gridWidth: number, gridHeight: number, lineColor: string, lineShow: boolean, rectPosArr?: ReactPositionInfo[][] }) {
  if (!canvas) return;
  const { width, height, lineColor, lineShow, rectPosArr, gridWidth, gridHeight } = setting;
  canvas.width = width;
  canvas.height = height;
  if (lineShow) {
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
    // 开始路径并绘制线条
    ctx.beginPath();
    
    // 格子数不一定能被整除，所以要补上缺的宽高使其能整除
    const widthLineNum = canvas.width / gridWidth - 1; // 横向线条数量
    if (canvas.width % gridWidth == 0) {
      canvas.width += widthLineNum
    } else {
      canvas.width += widthLineNum + (gridWidth - (canvas.width % gridWidth));
    }
    // 竖向线条数量
    const heightLineNum = canvas.height / gridHeight - 1;
    if (canvas.height % gridHeight == 0) {
      canvas.height += heightLineNum;
    } else {
      canvas.height += heightLineNum + (gridHeight - (canvas.height % gridHeight));
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
    rectPosArr.forEach(item => {
      if (item) {
        item.forEach(rect => {
          if (rect) {
            drawRect(canvas, {hasLine: lineShow, x: rect.x, y: rect.y, gridWidth: gridWidth, gridHeight: gridHeight, color: rect.color});
          }
        })
      }
    })
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
export function drawLineHandler(canvas: HTMLCanvasElement, setting: {gridWidth: number, lineColor: string}) {
  if (!canvas) return;
  const { lineColor, gridWidth } = setting;
  let startMove = false; // 鼠标是否按下
  let lastX = 0; // 鼠标按下时的横坐标
  let lastY = 0; // 鼠标按下时的纵坐标
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
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
  }
  canvas.addEventListener("mousedown", onMouseDownFun)
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
  }
  canvas.addEventListener("mousemove", onMouseMoveFun)
  const onMouseUpFun = (e: MouseEvent) => {
    startMove = false;
  }
  canvas.addEventListener("mouseup", onMouseUpFun)

  // 将注册事件返回，方便清除事件
  return {
    onMouseDownFun,
    onMouseMoveFun,
    onMouseUpFun
  }
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
export function drawPixelHandler(canvas: HTMLCanvasElement, setting: { hasLine: boolean, gridWidth: number, gridHeight: number, pixelColor: string, rectPosArr: (ReactPositionInfo | null)[][] }) {
  const { hasLine, pixelColor, rectPosArr, gridWidth, gridHeight } = setting;
  let startMove = false; // 鼠标是否按下
  let lastX = 0; // 鼠标按下时的横坐标
  let lastY = 0; // 鼠标按下时的纵坐标
  let reactArr: {x:number, y:number}[] = [] // 用来存储本次落笔画了的格子
  const onMouseDownFun = (e: MouseEvent) => {
    // 记录按下时的坐标
    startMove = true;
    reactArr = []
    lastX = e.offsetX;
    lastY = e.offsetY;
    const [gridX, gridY] = mouseToGrid({x:lastX, y:lastY, gridHeight, gridWidth, hasLine});
    // 将坐标信息存储到数组中
    if (!rectPosArr[gridX]) {
      rectPosArr[gridX] = []
    }
    // 单点如果点击的位置已经有颜色，且和之前的相同，则清除
    if (rectPosArr[gridX][gridY]?.color === pixelColor) {
      rectPosArr[gridX][gridY] = null
      clearRect(canvas, {hasLine, x: gridX, y: gridY, gridWidth, gridHeight, color:pixelColor});
    } else {
      rectPosArr[gridX][gridY] = {x:gridX, y:gridY, color:pixelColor }
      reactArr.push({x:gridX, y:gridY})
      drawRect(canvas, {hasLine, x: gridX, y: gridY, gridWidth, gridHeight, color:pixelColor});
    }

  }
  canvas.addEventListener("mousedown", onMouseDownFun)

  const onMouseMoveFun = (e: MouseEvent) => {
    if (startMove) {
      const [gridX, gridY] = mouseToGrid({x:e.offsetX, y:e.offsetY, gridHeight, gridWidth, hasLine});

      if (!reactArr.some(item => item.x === gridX && item.y === gridY)) {
        // 将坐标信息存储到数组中
        if (!rectPosArr[gridX]) {
          rectPosArr[gridX] = []
        }
        rectPosArr[gridX][gridY] = {x:gridX, y:gridY, color:pixelColor}
        reactArr.push({x:gridX, y:gridY})
        drawRect(canvas, {hasLine, x: gridX, y: gridY, gridWidth, gridHeight, color:pixelColor});
      }
    }
  }
  canvas.addEventListener("mousemove", onMouseMoveFun, true)

  const onMouseUpFun = (e: MouseEvent) => {
    startMove = false;
  }
  canvas.addEventListener("mouseup", onMouseUpFun)

  // 将注册事件返回，方便清除事件
  return {
    onMouseDownFun,
    onMouseMoveFun,
    onMouseUpFun
  }
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
export function drawRect(canvas: HTMLCanvasElement, setting: { hasLine: boolean, x:number, y:number, gridWidth:number, gridHeight:number, color:string}) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
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
      (gridWidth) * (x - 1),
      (gridHeight) * (y - 1),
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
export function clearRect(canvas: HTMLCanvasElement, setting: { hasLine: boolean, x:number, y:number, gridWidth:number, gridHeight:number, color:string}) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
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
      (gridWidth) * (x - 1),
      (gridHeight) * (y - 1),
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
export function mouseToGrid(setting:{hasLine: boolean, x: number, y: number, gridWidth: number, gridHeight: number}) {
  const { x, y, hasLine, gridWidth, gridHeight } = setting;
  if (!hasLine) {
    return [
      Math.floor(x / gridWidth) + 1,
      Math.floor(y / gridHeight) + 1,
    ];
  } else {
    return [
      Math.floor(x / (gridWidth + 1)) + 1,
      Math.floor(y / (gridHeight + 1)) + 1,
    ];
  }
}



/**
 * 将canvas导出为图片
 * @param canvas 
 */
export function exportCanvasToImg(canvas: HTMLCanvasElement) {
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

/**
 * 上传图片，将其转化为canvas 
*/
export function uploadImgToCanvas(e: any, canvas: HTMLCanvasElement, callback: Function) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (e.file) {
    const reader = new FileReader();
    reader.onload = function() {
      const image = new Image()
      image.src = reader.result as string;
      image.onload = function() {
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        if (callback) {
          callback()
        }
      }
    }
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
 */
export function changeImageDataToPixel(canvas: HTMLCanvasElement, setting: { gap: number , gridWidth: number, gridHeight: number } = { gap: 3, gridWidth: 1, gridHeight: 1 }) {
  const { gap, gridWidth, gridHeight } = setting
  const ctx:CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
  const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rectPosArr: ReactPositionInfo[][] = []
  for (let i = 0; i < imageData.height; i += gap) {
    rectPosArr[i] = []
    for (let j = 0; j < imageData.width; j += gap) {
      // console.log(111)
      // 当前点位置信息，之所以*4是因为rgba分量是4个字节
      const position = (imageData.width * i + j) * 4;
      const color = `rgba(${imageData.data[position]}, ${imageData.data[position + 1]}, ${imageData.data[position + 2]}, ${imageData.data[position + 3] / 255})`
      rectPosArr[i].push({
        x: Math.floor(j / gridWidth),
        y: Math.floor(i / gridHeight),
        color: color,
        width: gridWidth,
        height: gridHeight
      })
    }
  }
  return {rectPosArr, width: imageData.width , height: imageData.height , gridWidth: gridWidth, gridHeight: gridHeight}
}