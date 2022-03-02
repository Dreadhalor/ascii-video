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
import { draw_margin } from './main';

const density = '@WÑ$9806532ba4c7?1=~"-;:,.   ';
// const density =
//   'ヹヰガホヺセヱオザヂズモネルキヴミグビサヲテワプクヅバゾフベナンョォヵニャェヶトィー゠・';

let loading_density = 5;
const black = true;
const gradient = false;
const color = false;
const pixel_scale = 1;
let canvas = document.createElement('canvas');

var video: any = null;
let camera: VideoCamera;
let stream: MediaStream;
let drawCamera = true;

export const sketch = (p5: p5) => {
  let canvas: any;

  if (black) document.body.style.backgroundColor = 'black';
  else document.body.style.backgroundColor = 'white';
  // p5.preload = () => {};

  p5.setup = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas = p5.createCanvas(width, height);
    camera = new VideoCamera();
    // p5.noCanvas();
  };

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

  p5.draw = () => {
    let [w, h] = [document.body.offsetWidth, document.body.offsetHeight];
    if (camera && drawCamera) {
      let view = window.visualViewport;
      // let [w, h] = [view.width, view.height];
      // let [w, h] = [view.width * view.scale, view.height * view.scale];
      // let [w, h] = [window.innerWidth, window.innerHeight];
      // console.log('setting canvas to ' + w + ',' + h);
      p5.resizeCanvas(w, h);
      p5.clear(0, 0, 0, 255);
      let pixels = camera.getPixels(w - draw_margin[0] * 2, h - draw_margin[1] * 2);
      drawPixels(p5, pixels);
    }
    // drawBoundingBox(p5, w, h, margin);
  };

  function drawBoundingBox(p5: p5, w: number, h: number, margin: [number, number]) {
    p5.resetMatrix();
    p5.translate(...margin);
    p5.noFill();
    p5.stroke(255, 255, 255);
    p5.rect(0, 0, w - margin[0] * 2, h - margin[1] * 2);
    p5.resetMatrix();
  }

  function drawPixels(p5: p5, pixels: [number, number, number, number][][]) {
    p5.resetMatrix();
    p5.clear(0, 0, 0, 255);
    if (black) p5.background(0);
    else p5.background(255);
    drawBoundingBox(p5, canvas.width, canvas.height, draw_margin);
    if (black) p5.fill(255, 255, 255);
    else p5.fill(0, 0, 0);

    let w = pixels.length;
    let h = pixels[0].length;
    let ratio = coverAspectRatio(
      w,
      h,
      canvas.width - draw_margin[0] * 2,
      canvas.height - draw_margin[1] * 2
    );
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
        // if (i % 10 === 0 || j % 10 === 0) p5.square(x, y, pixel_size);
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
};
