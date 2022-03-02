import {
  containCanvasToDimensions,
  coverCanvasToDimensions,
  cropCanvasToDimensions,
  getCanvasPixels,
} from './algorithms';

export class VideoCamera {
  constraints = { audio: false, video: { facingMode: 'user' } };

  private video: HTMLVideoElement;
  private stream: MediaStream;
  private video_container: HTMLDivElement;

  private pixels = [[]];
  private pixelation = 100;

  private container_style = {
    position: 'absolute',
    visibility: 'hidden',
    height: '0px',
    width: '0px',
    overflow: 'hidden',
  };

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

  getPixels = (max_width: number, max_height: number) => {
    if (this.video && max_width > 0 && max_height > 0) {
      try {
        this.pixels = this.getFrame(max_width, max_height);
      } catch (e) {
        this.pixels = [[]];
      }
    } else this.pixels = [[]];
    return this.pixels;
  };
  getFrame(max_width: number, max_height: number) {
    let pixelated = this.getProcessedVideoCanvas(max_width, max_height);
    return this.getMirroredPixels(pixelated);
  }
  getProcessedVideoCanvas(max_width: number, max_height: number) {
    let scaled = coverCanvasToDimensions(this.video, max_width, max_height);
    let cropped = cropCanvasToDimensions(scaled, max_width, max_height);
    return containCanvasToDimensions(cropped, this.pixelation, this.pixelation);
  }
  getMirroredPixels(canvas: HTMLCanvasElement) {
    let pixels = getCanvasPixels(canvas);
    return pixels.reverse();
  }
}
