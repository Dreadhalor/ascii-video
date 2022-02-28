import p5 from 'p5';
import { chunk } from 'lodash';
import { aspectRatioMaxClamp, aspectRatioMinClampRatio, fillAspectRatio } from './algorithms';
// const density = '@WÑ$9806532bac47?1=!;-:,.   ';
const density = '@WÑ$9806532bac47?1=~"-;:,.   ';
// const density = 'ヰ,ヂ,グ,ョ,ヵ,ン,ャ,ヶ,ォ,ィ,ト,ヿ,ニ,ー,・';
// const density =
//   'ヂズグヴザガビヺジヅヹホサバセゾキミクテベネヱツルオプヰンヲワモナフャヶォヵョェニトィ゠ー・';

let loading_density = 5;
const black = true;
const gradient = false;

export const sketch = (p5: p5) => {
  let video: any;
  // let canvas: any;

  // p5.preload = () => {};

  p5.setup = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    video = p5.createCapture(p5.VIDEO, () => cropVideo(loading_density));
    video.hide();
    // canvas = p5.createCanvas(width, height);
    p5.createCanvas(width, height);
  };

  function resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    p5.resizeCanvas(width, height);
  }

  window.addEventListener('resize', resize);

  function cropVideo(d: number) {
    let target = 100;
    if (d && target < d) return;
    if (d) target = d;
    let [w, h] = aspectRatioMaxClamp(video.width, video.height, target);
    // console.log('normalized video pixels: ' + Math.floor(w) + ', ' + Math.floor(h));
    video.size(Math.floor(w), Math.floor(h));
    setTimeout(() => cropVideo(target + 5), 250);
  }

  // const m: [number, number] = [100, 100];

  p5.draw = () => {
    // let w = window.innerWidth / 1.1,
    //   h = window.innerHeight / 1.1;
    let w = window.innerWidth,
      h = window.innerHeight;
    // console.log('w,h: ' + w + ',' + h);
    let margin: [number, number] = [(window.innerWidth - w) / 2, (window.innerHeight - h) / 2];
    // let margin: [number, number] = [0, 0];
    // console.log(margin);
    p5.translate(...margin);
    drawVideo(p5, w, h);
    // drawBoundingBox(p5, w, h, margin);
  };

  // function drawBoundingBox(p5: p5, w: number, h: number, margin: [number, number]) {
  //   p5.resetMatrix();
  //   p5.translate(...margin);
  //   p5.noFill();
  //   p5.stroke(255, 255, 255);
  //   p5.rect(0, 0, w, h);
  // }

  function drawVideo(p5: p5, _w: number, _h: number) {
    p5.clear(0, 0, 0, 0);
    if (black) p5.background(0);
    else p5.background(255);
    video.loadPixels();
    let [w, h] = fillAspectRatio(video.width, video.height, _w, _h);
    // let w = video.width,
    //   h = video.height;
    let size = Math.min(w, h);
    // console.log('_w, _h: ' + _w + ', ' + _h);
    // console.log('video w,h: ' + video.width + ', ' + video.height);
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
