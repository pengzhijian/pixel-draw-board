/**
 * 格子的坐标信息
 * @interface ReactPositionInfo
 * @property {number} x - 格子的横坐标
 * @property {number} y - 格子的纵坐标
 * @property {number} [width] - 格子的宽度
 * @property {number} [height] - 格子的高度
 * @property {string} [color] - 格子的颜色
 */
export interface ReactPositionInfo {
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
}