import{l as N,p as O}from"./vendor.7b0d4df6.js";const k=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const e of o.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&s(e)}).observe(document,{childList:!0,subtree:!0});function a(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(t){if(t.ep)return;t.ep=!0;const o=a(t);fetch(t.href,o)}};k();const g="@W\xD1$98065432bac7?1=!+;-:,.   ";let z=5;const C=n=>{let i,a,s;n.setup=()=>{a=window.innerWidth,s=window.innerHeight,i=n.createCapture(n.VIDEO,()=>t(z)),i.hide(),n.createCanvas(a,s)};function t(e){let r=100;if(e&&r<e)return;e&&(r=e);let u=r/i.width,d=r/i.height,h=Math.max(u,d);i.size(Math.floor(h*i.width),Math.floor(h*i.height)),setTimeout(()=>t(r+5),250)}n.draw=()=>{o(n,window.innerWidth,window.innerHeight)};function o(e,r,u){e.clear(0,0,0,0),e.background(0),i.loadPixels();let d=i.width,h=i.height,w=Math.max(r,u),l=Math.floor(w/i.width),m=l*i.width;e.scale(r/m);let y=N.exports.chunk(i.pixels,4);e.fill(255,255,255);for(let c=0;c<d;c++)for(let f=0;f<h;f++){let[x,p,M]=y[c+f*d],b=Math.floor((x+p+M)/3);e.noStroke();let v=c*l,E=f*l;e.textSize(l),e.textAlign(e.CENTER,e.CENTER);let _=g.length,L=g.length-Math.floor(b/255*_);e.text(g[L],v+l*.5,E+l*.5)}}};new O(C,document.body);
