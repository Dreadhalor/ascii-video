import { chunk, unzip } from 'lodash';

export function coverAspectRatio(src_w: number, src_h: number, dest_w: number, dest_h: number) {
  return Math.max(dest_w / src_w, dest_h / src_h);
}
export function containAspectRatio(src_w: number, src_h: number, dest_w: number, dest_h: number) {
  return Math.min(dest_w / src_w, dest_h / src_h);
}
//redundant, lodash 'unzip' does the same thing
export function transposeMatrix(m: any[][]) {
  // return matrix[0].map((_, col_index) => matrix.map((row) => row[col_index]));
  return m[0].map((_, i) => m.map((x) => x[i]));
}

export function getCanvasPixels(canvas: HTMLCanvasElement) {
  let frame = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  let pre_transposed = chunk(chunk(frame.data, 4), frame.width);
  return unzip(pre_transposed);
}

const getCanvasImageSourceDimensions = (src: HTMLVideoElement | HTMLCanvasElement) => {
  return [src.width || src.offsetWidth, src.height || src.offsetHeight];
};
export function containCanvasToDimensions(
  max_width: number,
  max_height: number,
  src: HTMLVideoElement | HTMLCanvasElement
) {
  let [w, h] = getCanvasImageSourceDimensions(src);
  let result = document.createElement('canvas');
  let ratio = containAspectRatio(w, h, max_width, max_height);
  let [w_new, h_new] = [w * ratio, h * ratio];
  result.width = w_new;
  result.height = h_new;
  let ctx = result.getContext('2d');
  ctx.drawImage(src, 0, 0, w_new, h_new);
  return result;
}
export function coverCanvasToDimensions(
  max_width: number,
  max_height: number,
  src: HTMLVideoElement | HTMLCanvasElement
) {
  let [w, h] = getCanvasImageSourceDimensions(src);
  let result = document.createElement('canvas');
  let ratio = coverAspectRatio(w, h, max_width, max_height);
  let [w_new, h_new] = [w * ratio, h * ratio];
  result.width = w_new;
  result.height = h_new;
  let ctx = result.getContext('2d');
  ctx.drawImage(src, 0, 0, w_new, h_new);
  return result;
}
export function cropCanvasToDimensions(
  max_width: number,
  max_height: number,
  src: HTMLVideoElement | HTMLCanvasElement
) {
  let [w, h] = getCanvasImageSourceDimensions(src);
  let result = document.createElement('canvas');
  result.width = max_width;
  result.height = max_height;
  let [x_delta, y_delta] = [(w - max_width) / 2, (h - max_height) / 2];
  let ctx = result.getContext('2d');
  ctx.drawImage(src, x_delta, y_delta, max_width, max_height, 0, 0, max_width, max_height);
  return result;
}
