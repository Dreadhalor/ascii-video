import { BodyPix } from '@tensorflow-models/body-pix';
import { chunk } from 'lodash';
import {
  containCanvasToDimensions,
  coverCanvasToDimensions,
  cropCanvasToDimensions,
  getCanvasImageData,
  getCanvasPixels,
  mirrorCanvasHorizontally,
  putImageDataToCanvas,
  scaleCanvas,
} from './algorithms';
import { loadBodyPix, maskPerson } from './body-pix';

export class VideoCamera {
  constraints = { audio: false, video: { facingMode: 'user' } };

  private video: HTMLVideoElement;
  private stream: MediaStream;
  private video_container: HTMLDivElement;

  private bp: BodyPix;

  private pixels = [[]];
  private mask_id: ImageData;
  private processing = false;
  private pixelation = 100;

  private container_style = {
    position: 'absolute',
    visibility: 'hidden',
    height: '0px',
    width: '0px',
    overflow: 'hidden',
  };

  constructor() {
    this.initializeBodyPix();

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

  async initializeBodyPix() {
    this.bp = await loadBodyPix();
  }

  constructDivs() {
    this.video = document.createElement('video');
    this.video.playsInline = true;
    this.video_container = document.createElement('div');
    Object.assign(this.video_container.style, this.container_style);
    this.video_container.append(this.video);
    document.body.append(this.video_container);
  }
  formatVideoFeed() {
    let constraints = this.getMaxDimensionsConstraints();
    this.getVideoTrack().applyConstraints(constraints);
    return this.video.play();
  }

  getVideoTrack = () => this.stream?.getVideoTracks()?.[0];
  getCapabilities = () => this.getVideoTrack()?.getCapabilities();
  getMaxDimensionsConstraints = () => {
    let capabilities = this.getCapabilities();
    return { width: capabilities?.width.max, height: capabilities?.height.max };
  };

  getPixelatedPixels = (max_width: number, max_height: number) => {
    if (this.video && max_width > 0 && max_height > 0) {
      try {
        // if (this.processing) {
        //   return this.pixels;
        // }
        this.pixels = this.getFrame(max_width, max_height);
      } catch (e) {
        this.pixels = [[]];
      }
    } else this.pixels = [[]];
    // let data = getFrameImageData();
    // if (this.bp) perform2(this.bp, this.pixels);
    return this.pixels;
  };
  getCroppedPixels = (max_width: number, max_height: number) => {
    return this.getCroppedFrame(max_width, max_height);
  };
  getFrame(max_width: number, max_height: number) {
    let pixelated = this.getProcessedVideoCanvas(max_width, max_height);
    // return this.getMirroredPixels(pixelated);
    return getCanvasPixels(pixelated);
  }
  getCroppedFrame(max_width: number, max_height: number) {
    try {
      return this.getCroppedVideoCanvas(max_width, max_height);
    } catch {
      return null;
    }
  }
  getProcessedVideoCanvas(max_width: number, max_height: number) {
    let scaled = coverCanvasToDimensions(this.video, max_width, max_height);
    let cropped = cropCanvasToDimensions(scaled, max_width, max_height);
    if (this.bp) this.processMask(cropped);
    let masked = this.mask_id ? this.maskCanvas(cropped) : cropped;
    let pixelated = containCanvasToDimensions(masked, this.pixelation, this.pixelation);
    let mirrored = mirrorCanvasHorizontally(pixelated);
    return mirrored;
  }
  getCroppedVideoCanvas(max_width: number, max_height: number) {
    let scaled = coverCanvasToDimensions(this.video, max_width, max_height);
    let cropped = cropCanvasToDimensions(scaled, max_width, max_height);
    let mirrored = mirrorCanvasHorizontally(cropped);
    return mirrored;
  }
  maskCanvas(canvas: HTMLCanvasElement) {
    let data = getCanvasImageData(canvas);
    let composite = this.maskImageData(data, this.mask_id);
    return putImageDataToCanvas(composite);
  }
  async processMask(canvas: HTMLCanvasElement) {
    let scale = 0.5;
    if (this.processing) return;
    this.processing = true;
    // let scaled = scaleCanvas(canvas, scale);
    let data = getCanvasImageData(canvas);
    let mask_data = await maskPerson(this.bp, data);
    // let mask_canvas = putImageDataToCanvas(mask_data);
    // let normalized = scaleCanvas(mask_canvas, 1 / scale);
    // this.mask_id = getCanvasImageData(normalized);
    this.mask_id = mask_data;
    this.processing = false;
  }

  getMirroredPixels(canvas: HTMLCanvasElement) {
    let pixels = getCanvasPixels(canvas);
    return pixels.reverse();
  }
  maskImageData(d: ImageData, mask: ImageData) {
    // let image_pixels = chunk(d.data, 4);
    // let mask_pixels = chunk(mask.data, 4);
    // for (let i = 0; i < image_pixels.length; i++){
    //   let alpha = 255 - mask_pixels[i][3];
    //   image_pixels[i][3] = alpha;
    // }
    // d.data = ...image_pixels;
    for (let i = 0; i < d.data.length; i += 4) {
      let alpha = 255 - mask.data[i + 3];
      // console.log(d.data[i + 2]);
      d.data[i + 3] = alpha;
      // let ratio = alpha / 255;

      // d.data[i] = this.addAlphaToVal(d.data[i], ratio);
      // d.data[i + 1] = this.addAlphaToVal(d.data[i + 1], ratio);
      // d.data[i + 2] = this.addAlphaToVal(d.data[i + 2], ratio);
    }
    return d;
  }
  addAlphaToVal(val: number, alpha: number) {
    return Math.floor(val * alpha);
  }
  getVideoElement() {
    return this.video;
  }
}
