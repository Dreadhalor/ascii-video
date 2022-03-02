import p5 from 'p5';
import { chunk } from 'lodash';
import {
  aspectRatioMaxClamp,
  aspectRatioMinClampRatio,
  containAspectRatio,
  coverAspectRatio,
} from './algorithms';
import {
  getStreamMaxDimensionsConstraints,
  getStreamVideoTrack,
  VideoCamera,
} from './video-camera';
const density = '@WÑ$9806532ba4c7?1=~"-;:,.   ';
// const density =
//   'ヹヰガホヺセヱオザヂズモネルキヴミグビサヲテワプクヅバゾフベナンョォヵニャェヶトィー゠・';

let loading_density = 5;
const black = true;
const gradient = false;
const color = false;
const pixel_scale = 1.5;
let canvas = document.createElement('canvas');

var video: any = null;
let camera: VideoCamera;
let stream: MediaStream;
let drawCamera = true;

export const test2 = () => {
  camera = new VideoCamera();
  // document.body.append(canvas);
};

export const sketch = (p5: p5) => {
  let canvas: any;

  if (black) document.body.style.backgroundColor = 'black';
  else document.body.style.backgroundColor = 'white';
  // p5.preload = () => {};

  p5.setup = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    // video = p5.createCapture(p5.VIDEO, (stream) => cropVideo(stream, loading_density));
    // video = p5.createCapture(p5.VIDEO);
    // video.hide();

    canvas = p5.createCanvas(width, height);

    test2();
    // p5.createCanvas(width, height);
    // p5.noCanvas();
  };

  function resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    // console.log('widht: ' + width);
    // camera.constrainDimensions(width, height);
    // p5.resizeCanvas(width, height);
  }

  // window.onload = () => {
  //   window.addEventListener('deviceorientation', switchOrientation);
  // };

  // p5.deviceTurned = () => {
  //   if (p5.turnAxis === 'Z') {
  //     console.log(p5.turnAxis);
  //     let w = video.width;
  //     let h = video.height;
  //     video.width = h;
  //     video.height = w;
  //     console.log('switched to ' + p5.deviceOrientation);
  //   }
  // };

  // function switchOrientation() {

  // }

  window.addEventListener('resize', resize);

  function cropVideo(_stream: MediaStream, d: number) {
    if (_stream) {
      stream = _stream;
      let { width, height } = getStreamMaxDimensionsConstraints(stream);
      // getStreamVideoTrack(stream).applyConstraints({ width, height });
      // video.width = width;
      // video.height = height;
      console.log({ width, height });
    }
    d = d + 1;
    let target = 100;
    // if (d && target < d) return;
    // if (d) target = d;
    let [w, h] = aspectRatioMaxClamp(video.width, video.height, target);
    // console.log('normalized video pixels: ' + Math.floor(w) + ', ' + Math.floor(h));
    video.size(Math.floor(w), Math.floor(h));
    // setTimeout(() => cropVideo(target + 5), 250);
  }

  // const m: [number, number] = [100, 100];

  p5.draw = () => {
    // if (camera) {
    //   camera.getPixels().then((pixels) => {
    //     drawPixels(p5, pixels);
    //   });
    // }
    if (camera && drawCamera) {
      let view = window.visualViewport;
      // let [w, h] = [view.width, view.height];
      // let [w, h] = [view.width * view.scale, view.height * view.scale];
      let [w, h] = [document.body.offsetWidth, document.body.offsetHeight];
      // let [w, h] = [window.innerWidth, window.innerHeight];
      console.log('setting canvas to ' + w + ',' + h);
      p5.resizeCanvas(w, h);
      p5.clear(0, 0, 0, 255);
      // console.log(view);
      let pixels = camera.getPixels(w, h);
      drawPixels(p5, pixels);
    }
    // if (video) console.log(video.width);
    // console.log(video);
    // let vw = video.width,
    //   vh = video.height;
    // console.log(p5.deviceOrientation);
    // if (p5.deviceOrientation === 'portrait') {
    //   video.width = Math.min(vw, vh);
    //   video.height = Math.max(vw, vh);
    // } else if (p5.deviceOrientation === 'landscape') {
    //   video.width = Math.max(vw, vh);
    //   video.height = Math.min(vw, vh);
    // }
    // let w = window.innerWidth / 1.1,
    //   h = window.innerHeight / 1.1;
    let w = window.innerWidth / 2,
      h = window.innerHeight / 2;
    // console.log('w,h: ' + w + ',' + h);
    let margin: [number, number] = [(window.innerWidth - w) / 2, (window.innerHeight - h) / 2];
    // let margin: [number, number] = [0, 0];
    // console.log(margin);
    p5.translate(...margin);
    // drawVideo(p5, w, h);
    // drawBoundingBox(p5, w, h, margin);
    // drawRawVideo(p5);
  };

  function drawBoundingBox(p5: p5, w: number, h: number, margin: [number, number]) {
    p5.resetMatrix();
    p5.translate(...margin);
    p5.noFill();
    p5.stroke(255, 255, 255);
    p5.rect(0, 0, w, h);
  }

  function drawPixels(p5: p5, pixels: [number, number, number, number][][]) {
    // console.log(pixels);
    p5.resetMatrix();
    p5.clear(0, 0, 0, 255);
    if (black) p5.background(0);
    else p5.background(255);
    if (black) p5.fill(255, 255, 255);
    else p5.fill(0, 0, 0);
    let w = pixels.length;
    let h = pixels[0].length;
    // console.log(window.innerHeight);
    let ratio = containAspectRatio(w, h, canvas.width, canvas.height);
    let ww = w * ratio,
      hh = h * ratio;
    let pixel_size = Math.min(ww / w, hh / h);
    let x_translate = (canvas.width - pixel_size * w) / 2;
    let y_translate = (canvas.height - pixel_size * h) / 2;
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        let [r, g, b, a] = pixels[i][j];
        let avg = Math.floor((r + g + b) / 3);
        p5.noStroke();
        if (gradient) p5.fill(avg, avg, avg, a);
        else if (color) p5.fill(r, b, g, a);
        let x = i * pixel_size + x_translate,
          y = j * pixel_size + y_translate;
        // p5.square(x, y, pixel_size);
        let scaled_pixel_size = pixel_scale * pixel_size;
        p5.textSize(scaled_pixel_size);
        p5.textAlign(p5.CENTER, p5.CENTER);
        let len = density.length;
        let char_index;
        if (black) char_index = density.length - Math.floor((avg / 255) * len);
        else char_index = Math.floor((avg / 255) * len);
        p5.text(density[char_index], x + pixel_size * 0.5, y + pixel_size * 0.5);
      }
    }
  }

  function drawRawVideo(p5: p5) {
    p5.resetMatrix();
    let w = window.innerWidth,
      h = window.innerHeight;
    let ratio = containAspectRatio(video.width, video.height, w, h);
    // console.log(ratio);
    // console.log(w);
    console.log('video width: ' + video.width + ', video height: ' + video.height);
    // console.log('video scaled width: ' + video.width * ratio);
    console.log('window width: ' + w + ', window height: ' + h);
    let vw = video.width * ratio,
      vh = video.height * ratio;
    // let x_translate = accountForScale(video.width, w, 1);
    // let y_translate = accountForScale(video.height, h, 1);
    let x_translate = (w - vw) / 2;
    let y_translate = (h - vh) / 2;
    console.log(
      'x_translate: ' + x_translate.toFixed(2) + ', y-translate: ' + y_translate.toFixed(2)
    );
    // p5.scale(ratio);
    console.log('bout to draw');
    console.log(video.tag);
    p5.image(video, x_translate, y_translate, vw, vh);
  }
  function accountForScale(v1: number, v2: number, ratio: number) {
    return (v2 / ratio - v1) / 2;
  }

  function drawVideo(p5: p5, _w: number, _h: number) {
    cropVideo(stream, 0);
    p5.clear(0, 0, 0, 0);
    if (black) p5.background(0);
    else p5.background(255);
    video.loadPixels();
    let cover_ratio = coverAspectRatio(video.width, video.height, _w, _h);
    let [w, h] = [video.width * cover_ratio, video.height * cover_ratio];
    // let w = video.width,
    //   h = video.height;
    let size = Math.min(w, h);
    // console.log('_w, _h: ' + _w + ', ' + _h);
    console.log('video w,h: ' + video.width + ', ' + video.height);
    // console.log('w, h: ' + w + ', ' + h);
    // console.log('size: ' + size);
    let pixel_size = Math.max(Math.floor(size / video.width), Math.floor(size / video.height));
    // console.log('pixel size: ' + pixel_size);
    let draw_width = pixel_size * video.width;
    let draw_height = pixel_size * video.height;
    // p5.translate(-draw_width / 2, 0);
    let ratio = aspectRatioMinClampRatio(draw_width, draw_height, size);
    // console.log(ratio);
    // console.log(video);
    // console.log('pixel_size*video.width: ' + pixel_size * video.width);
    let x_translate = (_w - pixel_size * video.width * ratio) / 2;
    let y_translate = (_h - pixel_size * video.height * ratio) / 2;
    // console.log('x_translate: ' + x_translate);
    // console.log('y_translate: ' + y_translate);
    p5.translate(x_translate, y_translate);
    p5.scale(ratio);
    let pixels: number[][] = chunk(video.pixels, 4);

    if (black) p5.fill(255, 255, 255);
    else p5.fill(0, 0, 0);
    // p5.rect(0, 0, pixel_size * w, pixel_size * h);
    // p5.image(video, 0, 0, pixel_size * w, pixel_size * h);
    // console.log('pixel count: ' + pixels.length);
    for (let i = 0; i < video.width; i++)
      for (let j = 0; j < video.height; j++) {
        let index = video.width - 1 - i + j * video.width;
        // console.log('index: ' + index);
        // console.log('pixel: ' + pixels[index]);
        let [r, g, b] = pixels[index];
        let avg = Math.floor((r + g + b) / 3);
        p5.noStroke();
        if (gradient) p5.fill(avg, avg, avg);
        let x = i * pixel_size,
          y = j * pixel_size;
        // p5.square(x, y, pixel_size);
        p5.textSize(pixel_size);
        p5.textAlign(p5.CENTER, p5.CENTER);
        let len = density.length;
        let char_index;
        if (black) char_index = density.length - Math.floor((avg / 255) * len);
        else char_index = Math.floor((avg / 255) * len);
        p5.text(density[char_index], x + pixel_size * 0.5, y + pixel_size * 0.5);
      }
  }
};
