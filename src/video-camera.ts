import { chunk } from 'lodash';
import { containAspectRatio } from './algorithms';

export class VideoCamera {
  constraints = { audio: false, video: { facingMode: 'user' } };

  private video: HTMLVideoElement;
  private stream: MediaStream;
  private canvas: HTMLCanvasElement;
  private video_container: HTMLDivElement;

  constructor() {
    this.video_container = document.createElement('div');
    // this.video_container.style.width
    this.canvas = document.createElement('canvas');
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream: MediaStream) => {
        this.video = document.createElement('video');
        // this.video.setAttribute('playsinline', '');
        this.video.playsInline = true;
        this.video_container.append(this.video);
        this.video_container.style.position = 'absolute';
        this.video_container.style.visibility = 'hidden';
        this.video_container.style.height = '0px';
        this.video_container.style.width = '0px';
        this.video_container.style.overflow = 'hidden';
        document.body.append(this.video_container);
        // this.video.style.display = 'none';
        // this.video.style.position = 'absolute';
        // this.video.style.visibility = 'hidden';
        this.stream = stream;
        this.video.srcObject = stream;
        return (this.video.onloadedmetadata = (e) => {
          let constraints = this.getMaxDimensionsConstraints();
          // console.log(constraints);
          // console.log('aspect ratio: ' + constraints.width / constraints.height);
          this.getVideoTrack().applyConstraints(constraints);
          this.canvas.width = constraints.width;
          this.canvas.height = constraints.height;
          return this.video.play();
        });
      })
      .catch(function (err) {
        /* handle the error */
        console.log('uh it didnt work');
        alert(err);
      });
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

  private pixels = [[]];
  getPixels = (max_width: number, max_height: number) => {
    if (this.video) {
      let w = this.video.offsetWidth,
        h = this.video.offsetHeight;
      // console.log('video w,h: ' + w + ',' + h);
      let uhhh = 100;
      this.canvas.width = w;
      this.canvas.height = h;
      let ratio1 = containAspectRatio(w, h, max_width, max_height);
      w *= ratio1;
      h *= ratio1;
      // console.log('video w,h after fitted: ' + w + ',' + h);
      let ratio2 = containAspectRatio(w, h, uhhh, uhhh);
      // ratio = ratio !== Infinity ? ratio : 0;
      w *= ratio2;
      h *= ratio2;
      // console.log('video w,h: after pixelated: ' + w + ',' + h);
      // console.log('w: ' + w);
      let ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.video, 0, 0, w, h);
      let frame = ctx.getImageData(0, 0, w, h);
      let pre_rotation = chunk(chunk(frame.data, 4), w);
      pre_rotation = pre_rotation.map((row) => row.reverse());
      this.pixels = pre_rotation[0].map((_, colIndex) => pre_rotation.map((row) => row[colIndex]));
    }
    return this.pixels;
  };
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
