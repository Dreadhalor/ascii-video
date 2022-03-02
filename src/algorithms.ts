export function aspectRatioMaxClamp(w: number, h: number, clamp: number) {
  let ratio = Math.min(clamp / w, clamp / h);
  return [w * ratio, h * ratio];
}
export function coverAspectRatio(src_w: number, src_h: number, dest_w: number, dest_h: number) {
  return Math.max(dest_w / src_w, dest_h / src_h);
}
export function containAspectRatio(src_w: number, src_h: number, dest_w: number, dest_h: number) {
  return Math.min(dest_w / src_w, dest_h / src_h);
}
export function aspectRatioMinClamp(w: number, h: number, clamp: number) {
  let ratio = Math.max(clamp / w, clamp / h);
  return [w * ratio, h * ratio];
}
export function aspectRatioMinClampRatio(w: number, h: number, clamp: number) {
  return Math.max(clamp / w, clamp / h);
}

export function scaleImageData(imageData: ImageData, scale: number, ctx: CanvasRenderingContext2D) {
  var scaled = ctx.createImageData(imageData.width * scale, imageData.height * scale);
  var subLine = ctx.createImageData(scale, 1).data;
  for (var row = 0; row < imageData.height; row++) {
    for (var col = 0; col < imageData.width; col++) {
      var sourcePixel = imageData.data.subarray(
        (row * imageData.width + col) * 4,
        (row * imageData.width + col) * 4 + 4
      );
      for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x * 4);
      for (var y = 0; y < scale; y++) {
        var destRow = row * scale + y;
        var destCol = col * scale;
        scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4);
      }
    }
  }

  return scaled;
}
