import p5 from 'p5';
import { chunk } from 'lodash';
const density = '@WÑ$98065432bac7?1=!+;-:,.   ';
// const density = 'ヰ,ヂ,グ,ョ,ヵ,ン,ャ,ヶ,ォ,ィ,ト,ヿ,ニ,ー,・';

let loading_density = 5;

export const sketch = (p5: p5) => {
  let video: any;
  let width: number, height: number;
  // let canvas: any;

  // p5.preload = () => {};

  p5.setup = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    video = p5.createCapture(p5.VIDEO, () => cropVideo(loading_density));
    video.hide();
    // canvas = p5.createCanvas(width, height);
    p5.createCanvas(width, height);
  };

  function cropVideo(d: number) {
    let target = 100;
    if (d && target < d) return;
    if (d) target = d;
    let width_ratio = target / video.width,
      height_ratio = target / video.height;
    let max_ratio = Math.max(width_ratio, height_ratio);
    video.size(Math.floor(max_ratio * video.width), Math.floor(max_ratio * video.height));
    setTimeout(() => cropVideo(target + 5), 250);
  }

  p5.draw = () => {
    drawVideo(p5, window.innerWidth, window.innerHeight);
    // drawLetters(p5);
  };

  // let letter_results: any = [];
  // let start = 0x30a0;
  // let end = start + 96;
  // function drawLetters(p5: p5) {
  //   let pixel_size = 100;
  //   let x = 200,
  //     y = 200;
  //   let rgb = [0, 0, 0];
  //   p5.fill(255, 255, 255);
  //   p5.rect(0, 0, window.innerWidth, window.innerHeight);
  //   // p5.square(x - 40, y - 40, pixel_size + 2 * 40);
  //   p5.fill(0, 0, 0);
  //   p5.textSize(pixel_size);
  //   p5.textAlign(p5.CENTER, p5.CENTER);
  //   p5.text(String.fromCharCode(start), x + pixel_size / 2, y + pixel_size / 2);
  //   let cap = canvas.get(x - 40, y - 40, pixel_size + 2 * 40, pixel_size + 2 * 40);
  //   cap.loadPixels();
  //   canvas.loadPixels();
  //   let pixels: number[][] = chunk(cap.pixels, 4);
  //   for (let [r, g, b] of pixels) {
  //     rgb[0] += r < 255 ? r : 0;
  //     rgb[1] += g < 255 ? g : 0;
  //     rgb[2] += b < 255 ? b : 0;
  //   }
  //   let to_add = { letter: String.fromCharCode(start), darkness: rgb[0] };
  //   letter_results.push(to_add);
  //   start++;
  //   if (start === end + 1) {
  //     letter_results.sort((a: any, b: any) => b.darkness - a.darkness);
  //     for (let { letter, darkness } of letter_results) {
  //       console.log(letter);
  //       console.log(darkness);
  //     }
  //   }
  // }

  function drawVideo(p5: p5, _w: number, _h: number) {
    p5.clear(0, 0, 0, 0);
    p5.background(0);
    // p5.background(255);
    video.loadPixels();
    let w = video.width,
      h = video.height;
    let size = Math.max(_w, _h);
    // console.log(size);
    let pixel_size = Math.floor(size / video.width);
    let draw_width = pixel_size * video.width;
    // let draw_height = pixel_size * video.height;
    p5.scale(_w / draw_width);
    let pixels: number[][] = chunk(video.pixels, 4);

    p5.fill(255, 255, 255);
    // p5.fill(0, 0, 0);
    // p5.rect(0, 0, pixel_size * w, pixel_size * h);
    // p5.image(video, 0, 0, pixel_size * w, pixel_size * h);
    for (let i = 0; i < w; i++)
      for (let j = 0; j < h; j++) {
        let [r, g, b] = pixels[i + j * w];
        let avg = Math.floor((r + g + b) / 3);
        p5.noStroke();
        // p5.fill(avg, avg, avg);
        let x = i * pixel_size,
          y = j * pixel_size;
        // p5.square(x, y, pixel_size);
        p5.textSize(pixel_size);
        p5.textAlign(p5.CENTER, p5.CENTER);
        let len = density.length;
        let char_index = density.length - Math.floor((avg / 255) * len);
        // let char_index = Math.floor((avg / 255) * len);
        p5.text(density[char_index], x + pixel_size * 0.5, y + pixel_size * 0.5);
      }
  }
};
