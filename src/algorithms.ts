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
