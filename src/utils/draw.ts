/**
 * 初始化画布
 * @constructor
 * @params { HTMLCanvasElement } canvas 画布对象
 * @params { number } width 画布宽度
 * @params { number } height 画布高度
 * @params { number } gridPerPx 每个格子的像素大小
 * @params { string } lineColor 线条颜色
 * @params { boolean } showLine 是否显示间隔线条
*/
export function initMap(canvas: HTMLCanvasElement,setting: { width: number, height: number, gridPerPx: number, lineColor: string, lineShow: boolean}) {
  if (!canvas) return;
  const { width, height, gridPerPx, lineColor, lineShow } = setting;
  canvas.width = width;
  canvas.height = height;
  if (!lineShow) return;
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
  // 开始路径并绘制线条
  ctx.beginPath();
  
  // 格子数不一定能被整除，所以要补上缺的宽高使其能整除
  const widthLineNum = canvas.width / gridPerPx - 1; // 横向线条数量
  if (canvas.width % gridPerPx == 0) {
    canvas.width += widthLineNum
  } else {
    canvas.width += widthLineNum + (gridPerPx - (canvas.width % gridPerPx));
  }
  // 竖向线条数量
  const heightLineNum = canvas.height / gridPerPx - 1;
  if (canvas.height % gridPerPx == 0) {
    canvas.height += heightLineNum;
  } else {
    canvas.height += heightLineNum + (gridPerPx - (canvas.height % gridPerPx));
  }

  // 设置线条样式
  ctx.lineWidth = 1;
  ctx.strokeStyle = lineColor;
  ctx.fillStyle = lineColor;
  // 开始绘制横线
  for (let i = 0; i < heightLineNum; i++) {
    // 注意要算线的宽度，也就是后面那个+i
    ctx.moveTo(0, gridPerPx * (i + 1) + i);
    ctx.lineTo(canvas.width, gridPerPx * (i + 1) + i);
    ctx.stroke();
  }
  // 开始绘制竖线
  for (let i = 0; i < widthLineNum; i++) {
    ctx.moveTo(gridPerPx * (i + 1) + i, 0);
    ctx.lineTo(gridPerPx * (i + 1) + i, canvas.height);
    ctx.stroke();
  }

  return {
    widthLineNum: widthLineNum,
    heightLineNum: heightLineNum
  }
}

/**
 * 画板注册画笔事件，添加绘画功能
 * @constructor
 * @params { HTMLCanvasElement } canvas 画布对象
 * @params { 'line' | 'pixel' } mode 画笔类型，线条或像素
 * @params { number } gridPerPx 每个格子的像素大小
 * 
*/
export function drawLineHandler(canvas: HTMLCanvasElement, setting: {gridPerPx: number, lineColor: string}) {
  if (!canvas) return;
  const { gridPerPx, lineColor } = setting;
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
    ctx.lineWidth = gridPerPx;
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
 * @params { number } gridPerPx 每个格子的像素大小
 * @params { string } lineColor 线条颜色
 * 
*/
export function drawPixelHandler(canvas: HTMLCanvasElement, setting: { hasLine: boolean, gridPerPx: number, pixelColor: string}) {
  const { hasLine, gridPerPx, pixelColor } = setting;
  let startMove = false; // 鼠标是否按下
  let lastX = 0; // 鼠标按下时的横坐标
  let lastY = 0; // 鼠标按下时的纵坐标
  const reactArr: {x:number, y:number}[] = [] // 用来存储本次落笔画了的格子
  const onMouseDownFun = (e: MouseEvent) => {
    // 记录按下时的坐标
    startMove = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    const [gridX, gridY] = mouseToGrid({x:lastX, y:lastY, gridPerPx, hasLine});
    reactArr.push({x:gridX, y:gridY})
    drawRect(canvas, {hasLine, x: gridX, y: gridY, gridPerPx, color:pixelColor});
  }
  canvas.addEventListener("mousedown", onMouseDownFun)

  const onMouseMoveFun = (e: MouseEvent) => {
    if (startMove) {
      const [gridX, gridY] = mouseToGrid({x:e.offsetX, y:e.offsetY, gridPerPx, hasLine});
      if (!reactArr.some(item => item.x === gridX && item.y === gridY)) {
        reactArr.push({x:gridX, y:gridY})
        drawRect(canvas, {hasLine, x: gridX, y: gridY, gridPerPx, color:pixelColor});
      }
    }
  }
  canvas.addEventListener("mousemove", onMouseMoveFun)

  const onMouseUpFun = (e: MouseEvent) => {
    startMove = false;
  }
  canvas.addEventListener("mouseup", onMouseUpFun)

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
 * @params { string } color 矩形颜色
 * 
*/
export function drawRect(canvas: HTMLCanvasElement, setting: { hasLine: boolean, x:number, y:number, gridPerPx:number, color:string}) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
  const { hasLine, x, y, gridPerPx, color } = setting;
  ctx.fillStyle = color;
  if (hasLine) {
    ctx.fillRect(
      (gridPerPx + 1) * (x - 1),
      (gridPerPx + 1) * (y - 1),
      gridPerPx - 1,
      gridPerPx - 1
    );
  } else {
    ctx.fillRect(
      (gridPerPx) * (x - 1),
      (gridPerPx) * (y - 1),
      gridPerPx,
      gridPerPx
    );
  }
}

/**
 * 将鼠标坐标转化为画板上的格子坐标
 * @constructor
 * @params { number } x 鼠标横坐标
 * @params { number } y 鼠标纵坐标
 * @params { number } gridPerPx 每个格子的像素大小
*/
export function mouseToGrid(setting:{hasLine: boolean, x: number, y: number, gridPerPx: number}) {
  const { x, y, gridPerPx, hasLine } = setting;
  console.log(setting)
  if (!hasLine) {
    return [
      Math.floor(x / gridPerPx) + 1,
      Math.floor(y / gridPerPx) + 1,
    ];
  } else {
    return [
      Math.floor(x / (gridPerPx + 1)) + 1,
      Math.floor(y / (gridPerPx + 1)) + 1,
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
