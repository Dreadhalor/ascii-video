import './style.css';
import p5 from 'p5';
import { sketch } from './sketch';

// const app = document.querySelector<HTMLDivElement>('#app')!;
// app.innerHTML = ``;

export const draw_margin: [number, number] = [50, 50];

new p5(sketch, document.body);

document.body.onclick = () => {
  // feature detect
  // if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  //   DeviceOrientationEvent.requestPermission()
  //     .then((permissionState) => {
  //       if (permissionState === 'granted') {
  //         window.addEventListener('deviceorientation', () => {});
  //       }
  //     })
  //     .catch(console.error);
  // } else {
  //   // handle regular non iOS 13+ devices
  // }
  // test2();
};
