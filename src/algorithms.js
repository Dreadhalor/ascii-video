export function aspectRatioMaxClamp(w, h, clamp) {
    let ratio = Math.min(clamp / w, clamp / h);
    return [w * ratio, h * ratio];
}
export function coverAspectRatio(src_w, src_h, dest_w, dest_h) {
    return Math.max(dest_w / src_w, dest_h / src_h);
}
export function containAspectRatio(src_w, src_h, dest_w, dest_h) {
    return Math.min(dest_w / src_w, dest_h / src_h);
}
export function aspectRatioMinClamp(w, h, clamp) {
    let ratio = Math.max(clamp / w, clamp / h);
    return [w * ratio, h * ratio];
}
export function aspectRatioMinClampRatio(w, h, clamp) {
    return Math.max(clamp / w, clamp / h);
}
//# sourceMappingURL=algorithms.js.map