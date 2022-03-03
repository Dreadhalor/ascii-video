import p5 from 'p5';
import { VideoCamera } from './video-camera';
import { draw_margin } from './main';
import { p5CropVideoCanvas } from './algorithms';

const density = '@WÑ$9806532ba4c7?1=~"-;:,.   ';
// const density =
//   'ヹヰガホヺセヱオザヂズモネルキヴミグビサヲテワプクヅバゾフベナンョォヵニャェヶトィー゠・';

let loading_density = 5;
const black = true;
const gradient = false;
const color = false;
const pixel_scale = 1.5;

let camera: VideoCamera;

export const sketch = (p5: p5) => {
  let canvas: p5.Renderer;

  let backgroundColor: [number, number, number];
  let fillColor: [number, number, number];

  if (black) document.body.style.backgroundColor = 'black';
  else document.body.style.backgroundColor = 'white';

  p5.setup = () => {
    camera = new VideoCamera();
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas = p5.createCanvas(width, height);
  };

  p5.draw = () => {
    let [w, h] = [document.body.offsetWidth, document.body.offsetHeight];
    if (camera) {
      p5.resizeCanvas(w, h);
      p5.clear(0, 0, 0, 255);
      if (black) {
        backgroundColor = [0, 0, 0];
        fillColor = [255, 255, 255];
      } else {
        backgroundColor = [255, 255, 255];
        fillColor = [0, 0, 0];
      }
      p5.background(backgroundColor);
      p5.fill(fillColor);
      let [draw_w, draw_h] = [w - draw_margin[0] * 2, h - draw_margin[1] * 2];
      let video = camera.getVideoElement();
      let cropped = camera.getCroppedFrame(draw_w, draw_h);
      if (cropped) p5.drawingContext.drawImage(cropped, 0, 0);
      // let cropped = p5CropVideoCanvas(p5, video);
      // p5.drawin
      let pixels = camera.getPixelatedPixels(draw_w, draw_h);
      // if (cropped && canvas) {
      // let ctx = canvas.
      // ctx.drawImage(cropped, 0, 0);
      // }
      if (pixels[0].length > 0) drawPixels(p5, pixels);
    }
  };

  function drawBoundingBox(p5: p5, w: number, h: number, margin: [number, number]) {
    p5.resetMatrix();
    p5.translate(...margin);
    p5.noFill();
    p5.stroke(255, 0, 0);
    p5.rect(0, 0, w - margin[0] * 2, h - margin[1] * 2);
    p5.resetMatrix();
  }

  function drawPixels(p5: p5, pixels: [number, number, number, number][][]) {
    p5.resetMatrix();
    // p5.clear(0, 0, 0, 255);

    let [w, h] = [pixels.length, pixels[0].length];
    let [draw_w, draw_h] = [p5.width - draw_margin[0] * 2, p5.height - draw_margin[1] * 2];
    let pixel_size = Math.min(draw_w / w, draw_h / h);
    let x_translate = (p5.width - pixel_size * w) / 2;
    let y_translate = (p5.height - pixel_size * h) / 2;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        let [r, g, b, a] = pixels[x][y];
        if (a > 0) {
          let avg = Math.floor((r + g + b) / 3);
          p5.noStroke();
          if (gradient) p5.fill(avg, avg, avg, a);
          else if (color) p5.fill(r, b, g, a);
          let start_x = x * pixel_size + x_translate,
            start_y = y * pixel_size + y_translate;
          // if (x % 10 === 0 || y % 10 === 0) p5.square(start_x, start_y, pixel_size);
          p5.fill(backgroundColor);
          p5.square(start_x, start_y, pixel_size);
          p5.fill(getFill([r, g, b, a]));
          let scaled_pixel_size = pixel_scale * pixel_size;
          p5.textSize(scaled_pixel_size);
          p5.textAlign(p5.CENTER, p5.CENTER);
          let len = density.length;
          let char_index;
          if (black) char_index = density.length - Math.floor((avg / 255) * len);
          else char_index = Math.floor((avg / 255) * len);
          p5.text(density[char_index], start_x + pixel_size * 0.5, start_y + pixel_size * 0.5);
        }
      }
    }
    // drawBoundingBox(p5, canvas.width, canvas.height, draw_margin);
  }
  function getFill([r, g, b, a]: [number, number, number, number]) {
    if (gradient) {
      let avg = Math.floor((r + g + b) / 3);
      return [avg, avg, avg, a];
    } else if (color) return [r, b, g, a];
    else return fillColor;
  }
};
