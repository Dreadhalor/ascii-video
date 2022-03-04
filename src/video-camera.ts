export class VideoCamera {
  constraints = { audio: false, video: { facingMode: 'user' } };

  private video: HTMLVideoElement;
  private stream: MediaStream;
  private video_container: HTMLDivElement;

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
    // let scaled = this.getScaledDimensions(0.5);
    // let scaled = { width: 640, height: 480 };
    this.getVideoTrack().applyConstraints(constraints);
    return this.video.play();
  }

  getVideoTrack = () => this.stream?.getVideoTracks()?.[0];
  getCapabilities = () => this.getVideoTrack()?.getCapabilities();
  getSettings = () => this.getVideoTrack()?.getSettings();
  getScaledDimensions(ratio: number) {
    let { width, height } = this.getSettings();
    return { width: Math.floor(width * ratio), height: Math.floor(height * ratio) };
  }
  getMaxDimensionsConstraints = () => {
    let capabilities = this.getCapabilities();
    return { width: capabilities?.width.max, height: capabilities?.height.max };
  };

  getVideoElement() {
    return this.video;
  }
}
