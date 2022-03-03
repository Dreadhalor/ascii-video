import { BodyPix } from '@tensorflow-models/body-pix';
import {
  containCanvasToDimensions,
  coverCanvasToDimensions,
  cropCanvasToDimensions,
  getCanvasImageData,
  getCanvasPixels,
  mirrorCanvasHorizontally,
  putImageDataToCanvas,
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
  private mask_frame: HTMLCanvasElement;
  private processing = false;
  private pixelation = 100;

  private freezeframe = true;

  private container_style = {
    position: 'absolute',
    visibility: 'hidden',
    height: '0px',
    width: '0px',
    overflow: 'hidden',
  };

  constructor() {
    let max_dimension = Math.min(document.body.offsetWidth, document.body.offsetHeight);
    let potential_pixelation = Math.floor(max_dimension / 5);
    if (potential_pixelation < this.pixelation) this.pixelation = potential_pixelation;
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
        if (this.processing && this.freezeframe) {
          return this.pixels;
        }
        this.pixels = this.getFrame(max_width, max_height);
      } catch (e) {
        this.pixels = [[]];
      }
    } else this.pixels = [[]];
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
    this.processMask(cropped);
    let masked = this.maskCanvas(this.mask_frame);
    return this.finishProcessing(masked);
  }
  getCroppedVideoCanvas(max_width: number, max_height: number) {
    let scaled = coverCanvasToDimensions(this.video, max_width, max_height);
    let cropped = cropCanvasToDimensions(scaled, max_width, max_height);
    let mirrored = mirrorCanvasHorizontally(cropped);
    return mirrored;
  }
  // getProcessedVideoCanvas(max_width: number, max_height: number) {
  //   let scaled = coverCanvasToDimensions(this.video, max_width, max_height);
  //   let cropped = cropCanvasToDimensions(scaled, max_width, max_height);
  //   if (this.bp) this.processMask(cropped);
  //   if (this.freezeframe) return this.finishProcessing()
  //   let masked =
  //     this.mask_image_data && this.freezeframe ? this.maskCanvas(this.mask_frame) : cropped;
  //   let pixelated = containCanvasToDimensions(masked, this.pixelation, this.pixelation);
  //   let mirrored = mirrorCanvasHorizontally(pixelated);
  //   return mirrored;
  // }
  finishProcessing(frame_canvas: HTMLCanvasElement) {
    let pixelated = containCanvasToDimensions(frame_canvas, this.pixelation, this.pixelation);
    let mirrored = mirrorCanvasHorizontally(pixelated);
    return mirrored;
  }
  maskCanvas(canvas: HTMLCanvasElement) {
    let data = getCanvasImageData(canvas);
    let composite = this.maskImageData(data, this.mask_id);
    return putImageDataToCanvas(composite);
  }
  async processMask(canvas: HTMLCanvasElement) {
    if (this.processing) return;
    this.mask_frame = canvas;
    this.processing = true;
    let mask_data = await maskPerson(this.bp, canvas);
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
      let [r, g, b, a] = [i, i + 1, i + 2, i + 3];
      let alpha = 255 - mask.data[a];
      // mask.data[r] = d.data[r];
      // mask.data[g] = d.data[g];
      // mask.data[b] = d.data[b];
      d.data[a] = alpha;
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
