import { chunk } from 'lodash';
import {
  containCanvasToDimensions,
  coverCanvasToDimensions,
  cropCanvasToDimensions,
} from './algorithms';

export class VideoCamera {
  constraints = { audio: false, video: { facingMode: 'user' } };

  private video: HTMLVideoElement;
  private stream: MediaStream;
  private video_container: HTMLDivElement;

  private pixels = [[]];
  private pixelation = 100;

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
    if (this.video && max_width > 0 && max_height > 0) {
      try {
        let scaled = coverCanvasToDimensions(max_width, max_height, this.video);
        let cropped = cropCanvasToDimensions(max_width, max_height, scaled);
        let pixelated = containCanvasToDimensions(this.pixelation, this.pixelation, cropped);
        let [w, h] = [pixelated.width, pixelated.height];
        let frame = pixelated.getContext('2d').getImageData(0, 0, w, h);
        let pre_rotation = chunk(chunk(frame.data, 4), w);
        pre_rotation = pre_rotation.map((row) => row.reverse());
        this.pixels = pre_rotation[0].map((_, colIndex) =>
          pre_rotation.map((row) => row[colIndex])
        );
      } catch (e) {
        this.pixels = [[]];
      }
    } else this.pixels = [[]];
    return this.pixels;
  };
}
