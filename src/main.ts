import './style.css';
import p5 from 'p5';
import { sketch } from './sketch';

// const app = document.querySelector<HTMLDivElement>('#app')!;
// app.innerHTML = ``;

new p5(sketch, document.body);
