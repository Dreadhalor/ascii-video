import { chunk } from 'lodash';
import { containAspectRatio, coverAspectRatio } from './algorithms';
import { draw_margin } from './main';

export class VideoCamera {
  constraints = { audio: false, video: { facingMode: 'user' } };

  private video: HTMLVideoElement;
  private stream: MediaStream;
  private canvas: HTMLCanvasElement;
  private video_container: HTMLDivElement;

  private pixels = [[]];

  constructor() {
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream: MediaStream) => {
        this.constructDivs();
        this.stream = stream;
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => this.formatVideoFeed();
      })
      .catch((err) => alert(err));
  }

  constructDivs() {
    this.video_container = document.createElement('div');
    this.canvas = document.createElement('canvas');
    this.video = document.createElement('video');
    this.video.playsInline = true;
    this.video_container.append(this.video);
    this.video_container.style.position = 'absolute';
    this.video_container.style.visibility = 'hidden';
    this.video_container.style.height = '0px';
    this.video_container.style.width = '0px';
    this.video_container.style.overflow = 'hidden';
    document.body.append(this.video_container);
  }
  formatVideoFeed() {
    let constraints = this.getMaxDimensionsConstraints();
    this.getVideoTrack().applyConstraints(constraints);
    this.canvas.width = constraints.width;
    this.canvas.height = constraints.height;
    return this.video.play();
  }

  getVideoTrack = () => this.stream?.getVideoTracks()?.[0];
  getCapabilities = () => this.getVideoTrack()?.getCapabilities();
  getMaxHeight = () => this.getCapabilities()?.height.max;
  getMaxWidth = () => this.getCapabilities()?.width.max;
  getMaxDimensions = () => [this.getMaxWidth(), this.getMaxHeight()];
  getMaxDimensionsConstraints = () => {
    return { width: this.getMaxWidth(), height: this.getMaxHeight() };
  };
  getDimensions = () => {
    return { width: this.getWidth(), height: this.getHeight() };
  };
  getWidth = () => this.getVideoTrack()?.getSettings()?.width;
  getHeight = () => this.getVideoTrack()?.getSettings()?.height;

  getPixels = (max_width: number, max_height: number) => {
    if (this.video) {
      let ctx = this.canvas.getContext('2d');
      let pixelation = 100;
      let scaled = this.coverCanvasToDimensions(max_width, max_height, this.video);
      let cropped = this.cropCanvasToDimensions(max_width, max_height, scaled);
      let pixelated = this.containCanvasToDimensions(pixelation, pixelation, cropped);
      let [w, h] = [pixelated.width, pixelated.height];
      this.canvas.width = w;
      this.canvas.height = h;
      let frame = pixelated.getContext('2d').getImageData(0, 0, w, h);
      let pre_rotation = chunk(chunk(frame.data, 4), w);
      pre_rotation = pre_rotation.map((row) => row.reverse());
      this.pixels = pre_rotation[0].map((_, colIndex) => pre_rotation.map((row) => row[colIndex]));
    }
    return this.pixels;
  };

  getCanvasImageSourceDimensions(src: HTMLVideoElement | HTMLCanvasElement) {
    return [src.width || src.offsetWidth, src.height || src.offsetHeight];
  }
  containCanvasToDimensions(
    max_width: number,
    max_height: number,
    src: HTMLVideoElement | HTMLCanvasElement
  ) {
    let [w, h] = this.getCanvasImageSourceDimensions(src);
    let result = document.createElement('canvas');
    let ratio = containAspectRatio(w, h, max_width, max_height);
    let [w_new, h_new] = [w * ratio, h * ratio];
    result.width = w_new;
    result.height = h_new;
    let ctx = result.getContext('2d');
    ctx.drawImage(src, 0, 0, w_new, h_new);
    return result;
  }
  coverCanvasToDimensions(
    max_width: number,
    max_height: number,
    src: HTMLVideoElement | HTMLCanvasElement
  ) {
    let [w, h] = this.getCanvasImageSourceDimensions(src);
    let result = document.createElement('canvas');
    let ratio = coverAspectRatio(w, h, max_width, max_height);
    let [w_new, h_new] = [w * ratio, h * ratio];
    result.width = w_new;
    result.height = h_new;
    // console.log(
    //   `(${w.toFixed(0)},${h.toFixed(0)}) scaled to (${w_new.toFixed(0)},${h_new.toFixed(0)})`
    // );
    let [x_delta, y_delta] = [(w_new - max_width) / 2, (h_new - max_height) / 2];
    // console.log('offset: [' + x_delta.toFixed(0) + ',' + y_delta.toFixed(0) + ']');
    let ctx = result.getContext('2d');
    ctx.drawImage(src, 0, 0, w_new, h_new);
    return result;
  }

  cropCanvasToDimensions(
    max_width: number,
    max_height: number,
    src: HTMLVideoElement | HTMLCanvasElement
  ) {
    let [w, h] = this.getCanvasImageSourceDimensions(src);
    let result = document.createElement('canvas');
    result.width = max_width;
    result.height = max_height;
    // console.log(
    //   `(${w.toFixed(0)},${h.toFixed(0)}) scaled to (${w_new.toFixed(0)},${h_new.toFixed(0)})`
    // );
    let [x_delta, y_delta] = [(w - max_width) / 2, (h - max_height) / 2];
    // console.log('offset: [' + x_delta.toFixed(0) + ',' + y_delta.toFixed(0) + ']');
    let ctx = result.getContext('2d');
    ctx.drawImage(src, x_delta, y_delta, max_width, max_height, 0, 0, max_width, max_height);
    return result;
  }

  constrainPixelsToDimensions(max_width: number, max_height: number) {
    let w = this.video.offsetWidth,
      h = this.video.offsetHeight;
    // console.log('video w,h: ' + w + ',' + h);
    let ratio = containAspectRatio(w, h, max_width, max_height);
    return [w * ratio, h * ratio, ratio];
  }
  constrainPixelsToPixelCount(width: number, height: number, max: number) {
    let ratio = containAspectRatio(width, height, max, max);
    return [width * ratio, height * ratio, ratio];
  }
}

export const getStreamVideoTrack = (stream: MediaStream) => {
  return stream?.getVideoTracks()?.[0];
};
export const getStreamCapabilities = (stream: MediaStream) => {
  let track = getStreamVideoTrack(stream);
  return track?.getCapabilities();
};
export const getStreamMaxDimensionsConstraints = (stream: MediaStream) => {
  let capabilities = getStreamCapabilities(stream);
  return { width: capabilities?.width.max, height: capabilities?.height.max };
};
