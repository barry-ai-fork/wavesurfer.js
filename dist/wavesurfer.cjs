"use strict";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function t(t,e,i,n){return new(i||(i=Promise))((function(s,o){function r(t){try{h(n.next(t))}catch(t){o(t)}}function a(t){try{h(n.throw(t))}catch(t){o(t)}}function h(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}h((n=n.apply(t,e||[])).next())}))}const e={decode:function(e,i){return t(this,void 0,void 0,(function*(){const t=new AudioContext({sampleRate:i});return t.decodeAudioData(e).finally((()=>t.close()))}))},createBuffer:function(t,e){return"number"==typeof t[0]&&(t=[t]),function(t){const e=t[0];if(e.some((t=>t>1||t<-1))){const i=e.length;let n=0;for(let t=0;t<i;t++){const i=Math.abs(e[t]);i>n&&(n=i)}for(const e of t)for(let t=0;t<i;t++)e[t]/=n}}(t),{duration:e,length:t[0].length,sampleRate:t[0].length/e,numberOfChannels:t.length,getChannelData:e=>null==t?void 0:t[e],copyFromChannel:AudioBuffer.prototype.copyFromChannel,copyToChannel:AudioBuffer.prototype.copyToChannel}}};const i={fetchBlob:function(e,i,n){return t(this,void 0,void 0,(function*(){const s=yield fetch(e,n);if(!s.ok)throw new Error(`Failed to fetch ${e}: ${s.status} (${s.statusText})`);return function(e,i){t(this,void 0,void 0,(function*(){if(!e.body||!e.headers)return;const n=e.body.getReader(),s=Number(e.headers.get("Content-Length"))||0;let o=0;const r=e=>t(this,void 0,void 0,(function*(){o+=(null==e?void 0:e.length)||0;const t=Math.round(o/s*100);i(t)})),a=()=>t(this,void 0,void 0,(function*(){let t;try{t=yield n.read()}catch(t){return}t.done||(r(t.value),yield a())}));a()}))}(s.clone(),i),s.blob()}))}};class n{constructor(){this.listeners={},this.on=this.addEventListener,this.un=this.removeEventListener}addEventListener(t,e,i){if(this.listeners[t]||(this.listeners[t]=new Set),this.listeners[t].add(e),null==i?void 0:i.once){const i=()=>{this.removeEventListener(t,i),this.removeEventListener(t,e)};return this.addEventListener(t,i),i}return()=>this.removeEventListener(t,e)}removeEventListener(t,e){var i;null===(i=this.listeners[t])||void 0===i||i.delete(e)}once(t,e){return this.on(t,e,{once:!0})}unAll(){this.listeners={}}emit(t,...e){this.listeners[t]&&this.listeners[t].forEach((t=>t(...e)))}}class s extends n{constructor(t){super(),this.isExternalMedia=!1,t.media?(this.media=t.media,this.isExternalMedia=!0):this.media=document.createElement("audio"),t.mediaControls&&(this.media.controls=!0),t.autoplay&&(this.media.autoplay=!0),null!=t.playbackRate&&this.onceMediaEvent("canplay",(()=>{null!=t.playbackRate&&(this.media.playbackRate=t.playbackRate)}))}onMediaEvent(t,e,i){return this.media.addEventListener(t,e,i),()=>this.media.removeEventListener(t,e)}onceMediaEvent(t,e){return this.onMediaEvent(t,e,{once:!0})}getSrc(){return this.media.currentSrc||this.media.src||""}revokeSrc(){const t=this.getSrc();t.startsWith("blob:")&&URL.revokeObjectURL(t)}setSrc(t,e){if(this.getSrc()===t)return;this.revokeSrc();const i=e instanceof Blob?URL.createObjectURL(e):t;this.media.src=i,this.media.load()}destroy(){this.media.pause(),this.isExternalMedia||(this.media.remove(),this.revokeSrc(),this.media.src="",this.media.load())}setMediaElement(t){this.media=t}play(){return this.media.play()}pause(){this.media.pause()}isPlaying(){return!this.media.paused&&!this.media.ended}setTime(t){this.media.currentTime=t}getDuration(){return this.media.duration}getCurrentTime(){return this.media.currentTime}getVolume(){return this.media.volume}setVolume(t){this.media.volume=t}getMuted(){return this.media.muted}setMuted(t){this.media.muted=t}getPlaybackRate(){return this.media.playbackRate}setPlaybackRate(t,e){null!=e&&(this.media.preservesPitch=e),this.media.playbackRate=t}getMediaElement(){return this.media}setSinkId(t){return this.media.setSinkId(t)}}class o extends n{constructor(t,e){super(),this.timeouts=[],this.isScrollable=!1,this.audioData=null,this.resizeObserver=null,this.isDragging=!1,this.options=t;const i=this.parentFromOptionsContainer(t.container);this.parent=i;const[n,s]=this.initHtml();i.appendChild(n),this.container=n,this.scrollContainer=s.querySelector(".scroll"),this.wrapper=s.querySelector(".wrapper"),this.canvasWrapper=s.querySelector(".canvases"),this.progressWrapper=s.querySelector(".progress"),this.cursor=s.querySelector(".cursor"),e&&s.appendChild(e),this.initEvents()}parentFromOptionsContainer(t){let e;if("string"==typeof t?e=document.querySelector(t):t instanceof HTMLElement&&(e=t),!e)throw new Error("Container not found");return e}initEvents(){const t=t=>{const e=this.wrapper.getBoundingClientRect(),i=t.clientX-e.left,n=t.clientX-e.left;return[i/e.width,n/e.height]};this.wrapper.addEventListener("click",(e=>{const[i,n]=t(e);this.emit("click",i,n)})),this.wrapper.addEventListener("dblclick",(e=>{const[i,n]=t(e);this.emit("dblclick",i,n)})),this.options.dragToSeek&&this.initDrag(),this.scrollContainer.addEventListener("scroll",(()=>{const{scrollLeft:t,scrollWidth:e,clientWidth:i}=this.scrollContainer,n=t/e,s=(t+i)/e;this.emit("scroll",n,s)}));const e=this.createDelay(100);this.resizeObserver=new ResizeObserver((()=>{e((()=>this.reRender()))})),this.resizeObserver.observe(this.scrollContainer)}initDrag(){!function(t,e,i,n,s=3,o=0){if(!t)return()=>{};let r=()=>{};const a=a=>{if(a.button!==o)return;a.preventDefault(),a.stopPropagation();let h=a.clientX,l=a.clientY,d=!1;const c=n=>{n.preventDefault(),n.stopPropagation();const o=n.clientX,r=n.clientY,a=o-h,c=r-l;if(h=o,l=r,d||Math.abs(a)>s||Math.abs(c)>s){const n=t.getBoundingClientRect(),{left:s,top:u}=n;d||(null==i||i(h-s,l-u),d=!0),e(a,c,o-s,r-u)}},u=()=>{d&&(null==n||n()),r()},p=t=>{d&&(t.stopPropagation(),t.preventDefault())},m=t=>{d&&t.preventDefault()};document.addEventListener("pointermove",c),document.addEventListener("pointerup",u),document.addEventListener("pointerout",u),document.addEventListener("pointercancel",u),document.addEventListener("touchmove",m,{passive:!1}),document.addEventListener("click",p,{capture:!0}),r=()=>{document.removeEventListener("pointermove",c),document.removeEventListener("pointerup",u),document.removeEventListener("pointerout",u),document.removeEventListener("pointercancel",u),document.removeEventListener("touchmove",m),setTimeout((()=>{document.removeEventListener("click",p,{capture:!0})}),10)}};t.addEventListener("pointerdown",a)}(this.wrapper,((t,e,i)=>{this.emit("drag",Math.max(0,Math.min(1,i/this.wrapper.getBoundingClientRect().width)))}),(()=>this.isDragging=!0),(()=>this.isDragging=!1))}getHeight(){return null==this.options.height?128:isNaN(Number(this.options.height))?"auto"===this.options.height&&this.parent.clientHeight||128:Number(this.options.height)}initHtml(){const t=document.createElement("div"),e=t.attachShadow({mode:"open"});return e.innerHTML=`\n      <style>\n        :host {\n          user-select: none;\n          min-width: 1px;\n        }\n        :host audio {\n          display: block;\n          width: 100%;\n        }\n        :host .scroll {\n          overflow-x: auto;\n          overflow-y: hidden;\n          width: 100%;\n          position: relative;\n        }\n        :host .noScrollbar {\n          scrollbar-color: transparent;\n          scrollbar-width: none;\n        }\n        :host .noScrollbar::-webkit-scrollbar {\n          display: none;\n          -webkit-appearance: none;\n        }\n        :host .wrapper {\n          position: relative;\n          overflow: visible;\n          z-index: 2;\n        }\n        :host .canvases {\n          min-height: ${this.getHeight()}px;\n        }\n        :host .canvases > div {\n          position: relative;\n        }\n        :host canvas {\n          display: block;\n          position: absolute;\n          top: 0;\n          image-rendering: pixelated;\n        }\n        :host .progress {\n          pointer-events: none;\n          position: absolute;\n          z-index: 2;\n          top: 0;\n          left: 0;\n          width: 0;\n          height: 100%;\n          overflow: hidden;\n        }\n        :host .progress > div {\n          position: relative;\n        }\n        :host .cursor {\n          pointer-events: none;\n          position: absolute;\n          z-index: 5;\n          top: 0;\n          left: 0;\n          height: 100%;\n          border-radius: 2px;\n        }\n      </style>\n\n      <div class="scroll" part="scroll">\n        <div class="wrapper" part="wrapper">\n          <div class="canvases"></div>\n          <div class="progress" part="progress"></div>\n          <div class="cursor" part="cursor"></div>\n        </div>\n      </div>\n    `,[t,e]}setOptions(t){if(this.options.container!==t.container){const e=this.parentFromOptionsContainer(t.container);e.appendChild(this.container),this.parent=e}t.dragToSeek&&!this.options.dragToSeek&&this.initDrag(),this.options=t,this.reRender()}getWrapper(){return this.wrapper}getScroll(){return this.scrollContainer.scrollLeft}destroy(){var t;this.container.remove(),null===(t=this.resizeObserver)||void 0===t||t.disconnect()}createDelay(t=10){const e={};return this.timeouts.push(e),i=>{e.timeout&&clearTimeout(e.timeout),e.timeout=setTimeout(i,t)}}convertColorValues(t){if(!Array.isArray(t))return t||"";if(t.length<2)return t[0]||"";const e=document.createElement("canvas"),i=e.getContext("2d").createLinearGradient(0,0,0,e.height),n=1/(t.length-1);return t.forEach(((t,e)=>{const s=e*n;i.addColorStop(s,t)})),i}renderBarWaveform(t,e,i,n){const s=t[0],o=t[1]||t[0],r=s.length,{width:a,height:h}=i.canvas,l=h/2,d=window.devicePixelRatio||1,c=e.barWidth?e.barWidth*d:1,u=e.barGap?e.barGap*d:e.barWidth?c/2:0,p=e.barRadius||0,m=a/(c+u)/r,g=p&&"roundRect"in i?"roundRect":"rect";i.beginPath();let v=0,f=0,b=0;for(let t=0;t<=r;t++){const r=Math.round(t*m);if(r>v){const t=Math.round(f*l*n),s=t+Math.round(b*l*n)||1;let o=l-t;"top"===e.barAlign?o=0:"bottom"===e.barAlign&&(o=h-s),i[g](v*(c+u),o,c,s,p),v=r,f=0,b=0}const a=Math.abs(s[t]||0),d=Math.abs(o[t]||0);a>f&&(f=a),d>b&&(b=d)}i.fill(),i.closePath()}renderLineWaveform(t,e,i,n){const s=e=>{const s=t[e]||t[0],o=s.length,{height:r}=i.canvas,a=r/2,h=i.canvas.width/o;i.moveTo(0,a);let l=0,d=0;for(let t=0;t<=o;t++){const o=Math.round(t*h);if(o>l){const t=a+(Math.round(d*a*n)||1)*(0===e?-1:1);i.lineTo(l,t),l=o,d=0}const r=Math.abs(s[t]||0);r>d&&(d=r)}i.lineTo(l,a)};i.beginPath(),s(0),s(1),i.fill(),i.closePath()}renderWaveform(t,e,i){if(i.fillStyle=this.convertColorValues(e.waveColor),e.renderFunction)return void e.renderFunction(t,i);let n=e.barHeight||1;if(e.normalize){const e=Array.from(t[0]).reduce(((t,e)=>Math.max(t,Math.abs(e))),0);n=e?1/e:1}e.barWidth||e.barGap||e.barAlign?this.renderBarWaveform(t,e,i,n):this.renderLineWaveform(t,e,i,n)}renderSingleCanvas(t,e,i,n,s,o,r,a){const h=window.devicePixelRatio||1,l=document.createElement("canvas"),d=t[0].length;l.width=Math.round(i*(o-s)/d),l.height=n*h,l.style.width=`${Math.floor(l.width/h)}px`,l.style.height=`${n}px`,l.style.left=`${Math.floor(s*i/h/d)}px`,r.appendChild(l);const c=l.getContext("2d");if(this.renderWaveform(t.map((t=>t.slice(s,o))),e,c),l.width>0&&l.height>0){const t=l.cloneNode(),i=t.getContext("2d");i.drawImage(l,0,0),i.globalCompositeOperation="source-in",i.fillStyle=this.convertColorValues(e.progressColor),i.fillRect(0,0,l.width,l.height),a.appendChild(t)}}renderChannel(t,e,i){const n=document.createElement("div"),s=this.getHeight();n.style.height=`${s}px`,this.canvasWrapper.style.minHeight=`${s}px`,this.canvasWrapper.appendChild(n);const r=n.cloneNode();this.progressWrapper.appendChild(r);const{scrollLeft:a,scrollWidth:h,clientWidth:l}=this.scrollContainer,d=t[0].length,c=d/h;let u=Math.min(o.MAX_CANVAS_WIDTH,l);if(e.barWidth||e.barGap){const t=e.barWidth||.5,i=t+(e.barGap||t/2);u%i!=0&&(u=Math.floor(u/i)*i)}const p=Math.floor(Math.abs(a)*c),m=Math.floor(p+u*c),g=m-p,v=(o,a)=>{this.renderSingleCanvas(t,e,i,s,Math.max(0,o),Math.min(a,d),n,r)},f=this.createDelay(),b=this.createDelay(),y=(t,e)=>{v(t,e),t>0&&f((()=>{y(t-g,e-g)}))},C=(t,e)=>{v(t,e),e<d&&b((()=>{C(t+g,e+g)}))};y(p,m),m<d&&C(m,m+g)}render(t){this.timeouts.forEach((t=>t.timeout&&clearTimeout(t.timeout))),this.timeouts=[],this.canvasWrapper.innerHTML="",this.progressWrapper.innerHTML="",null!=this.options.width&&(this.scrollContainer.style.width="number"==typeof this.options.width?`${this.options.width}px`:this.options.width);const e=window.devicePixelRatio||1,i=this.scrollContainer.clientWidth,n=Math.ceil(t.duration*(this.options.minPxPerSec||0));this.isScrollable=n>i;const s=this.options.fillParent&&!this.isScrollable,o=(s?i:n)*e;if(this.wrapper.style.width=s?"100%":`${n}px`,this.scrollContainer.style.overflowX=this.isScrollable?"auto":"hidden",this.scrollContainer.classList.toggle("noScrollbar",!!this.options.hideScrollbar),this.cursor.style.backgroundColor=`${this.options.cursorColor||this.options.progressColor}`,this.cursor.style.width=`${this.options.cursorWidth}px`,this.options.splitChannels)for(let e=0;e<t.numberOfChannels;e++){const i=Object.assign(Object.assign({},this.options),this.options.splitChannels[e]);this.renderChannel([t.getChannelData(e)],i,o)}else{const e=[t.getChannelData(0)];t.numberOfChannels>1&&e.push(t.getChannelData(1)),this.renderChannel(e,this.options,o)}this.audioData=t,this.emit("render")}reRender(){if(!this.audioData)return;const{scrollWidth:t}=this.scrollContainer,e=this.progressWrapper.clientWidth;if(this.render(this.audioData),this.isScrollable&&t!==this.scrollContainer.scrollWidth){const t=this.progressWrapper.clientWidth;this.scrollContainer.scrollLeft+=t-e}}zoom(t){this.options.minPxPerSec=t,this.reRender()}scrollIntoView(t,e=!1){const{clientWidth:i,scrollLeft:n,scrollWidth:s}=this.scrollContainer,o=s*t,r=i/2;if(o>n+(e&&this.options.autoCenter&&!this.isDragging?r:i)||o<n)if(this.options.autoCenter&&!this.isDragging){const t=r/20;o-(n+r)>=t&&o<n+i?this.scrollContainer.scrollLeft+=t:this.scrollContainer.scrollLeft=o-r}else if(this.isDragging){const t=10;this.scrollContainer.scrollLeft=o<n?o-t:o-i+t}else this.scrollContainer.scrollLeft=o;{const{scrollLeft:t}=this.scrollContainer,e=t/s,n=(t+i)/s;this.emit("scroll",e,n)}}renderProgress(t,e){if(isNaN(t))return;const i=100*t;this.canvasWrapper.style.clipPath=`polygon(${i}% 0, 100% 0, 100% 100%, ${i}% 100%)`,this.progressWrapper.style.width=`${i}%`,this.cursor.style.left=`${i}%`,this.cursor.style.marginLeft=100===Math.round(i)?`-${this.options.cursorWidth}px`:"",this.isScrollable&&this.options.autoScroll&&this.scrollIntoView(t,e)}exportImage(e,i,n){return t(this,void 0,void 0,(function*(){const t=this.canvasWrapper.querySelectorAll("canvas");if(!t.length)throw new Error("No waveform data");if("dataURL"===n){const n=Array.from(t).map((t=>t.toDataURL(e,i)));return Promise.resolve(n)}return Promise.all(Array.from(t).map((t=>new Promise(((n,s)=>{t.toBlob((t=>{t?n(t):s(new Error("Could not export image"))}),e,i)})))))}))}}o.MAX_CANVAS_WIDTH=4e3;class r extends n{constructor(){super(...arguments),this.unsubscribe=()=>{}}start(){this.unsubscribe=this.on("tick",(()=>{requestAnimationFrame((()=>{this.emit("tick")}))})),this.emit("tick")}stop(){this.unsubscribe()}destroy(){this.unsubscribe()}}class a extends n{constructor(t=new AudioContext){super(),this.bufferNode=null,this.autoplay=!1,this.playStartTime=0,this.playedDuration=0,this._muted=!1,this.buffer=null,this.currentSrc="",this.paused=!0,this.crossOrigin=null,this.audioContext=t,this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination)}load(){return t(this,void 0,void 0,(function*(){}))}get src(){return this.currentSrc}set src(t){this.currentSrc=t,fetch(t).then((t=>t.arrayBuffer())).then((t=>this.audioContext.decodeAudioData(t))).then((t=>{this.buffer=t,this.emit("loadedmetadata"),this.emit("canplay"),this.autoplay&&this.play()}))}_play(){var t;this.paused&&(this.paused=!1,null===(t=this.bufferNode)||void 0===t||t.disconnect(),this.bufferNode=this.audioContext.createBufferSource(),this.bufferNode.buffer=this.buffer,this.bufferNode.connect(this.gainNode),this.playedDuration>=this.duration&&(this.playedDuration=0),this.bufferNode.start(this.audioContext.currentTime,this.playedDuration),this.playStartTime=this.audioContext.currentTime,this.bufferNode.onended=()=>{this.currentTime>=this.duration&&(this.pause(),this.emit("ended"))})}_pause(){var t;this.paused||(this.paused=!0,null===(t=this.bufferNode)||void 0===t||t.stop(),this.playedDuration+=this.audioContext.currentTime-this.playStartTime)}play(){return t(this,void 0,void 0,(function*(){this._play(),this.emit("play")}))}pause(){this._pause(),this.emit("pause")}stopAt(t){var e,i;const n=t-this.currentTime;null===(e=this.bufferNode)||void 0===e||e.stop(this.audioContext.currentTime+n),null===(i=this.bufferNode)||void 0===i||i.addEventListener("ended",(()=>{this.bufferNode=null,this.pause()}),{once:!0})}setSinkId(e){return t(this,void 0,void 0,(function*(){return this.audioContext.setSinkId(e)}))}get playbackRate(){var t,e;return null!==(e=null===(t=this.bufferNode)||void 0===t?void 0:t.playbackRate.value)&&void 0!==e?e:1}set playbackRate(t){this.bufferNode&&(this.bufferNode.playbackRate.value=t)}get currentTime(){return this.paused?this.playedDuration:this.playedDuration+this.audioContext.currentTime-this.playStartTime}set currentTime(t){this.emit("seeking"),this.paused?this.playedDuration=t:(this._pause(),this.playedDuration=t,this._play()),this.emit("timeupdate")}get duration(){var t;return(null===(t=this.buffer)||void 0===t?void 0:t.duration)||0}get volume(){return this.gainNode.gain.value}set volume(t){this.gainNode.gain.value=t,this.emit("volumechange")}get muted(){return this._muted}set muted(t){this._muted!==t&&(this._muted=t,this._muted?this.gainNode.disconnect():this.gainNode.connect(this.audioContext.destination))}getGainNode(){return this.gainNode}}const h=t=>{const e=t.getChannelData(0),i=((t,e)=>{const i=e/t.length,n=[];let s=0,o=0,r=!1;for(let e=0;e<t.length;e++)t[e]<.01?r||(s=e,r=!0):r&&(o=e,r=!1,i*(o-s)>.1&&n.push({end_position:o,start:i*s,end:i*o}));return console.log("firstSilentRegion",n),n[0]||null})(e,t.duration),n=((t,e)=>{const i=e/t.length,n=[];let s=0,o=0,r=!1;for(let e=t.length-1;e>0;e--)t[e]<.01&&!r&&(s=e,r=!0),t[e]>=.01&&r&&(o=e,r=!1,i*(s-o)>.1&&n.push({start_position:o,start:i*o,end:i*s}));return n[0]||null})(e,t.duration);let s=0,o=t.duration/e.length*(e.length-1);i&&(s=i.end),n&&(o=n.start);const r=t.length,a=(null==i?void 0:i.end_position)||0,h=(null==n?void 0:n.start_position)||r;return console.log({region_start_grid_index:a,region_end_grid_index:h,total_grids_num:r}),console.log({start_time:s,end_time:o}),{start_time:s,end_time:o,region_start_grid_index:a,region_end_grid_index:h,total_grids_num:r}},l={waveColor:"#999",progressColor:"#555",cursorWidth:1,minPxPerSec:0,fillParent:!0,interact:!0,dragToSeek:!1,autoScroll:!0,autoCenter:!0,sampleRate:8e3};class d extends s{static create(t){return new d(t)}constructor(t){const e=t.media||("WebAudio"===t.backend?new a:void 0);super({media:e,mediaControls:t.mediaControls,autoplay:t.autoplay,playbackRate:t.audioRate}),this.plugins=[],this.decodedData=null,this.subscriptions=[],this.mediaSubscriptions=[],this.options=Object.assign({},l,t),this.timer=new r;const i=e?void 0:this.getMediaElement();this.renderer=new o(this.options,i),this.initPlayerEvents(),this.initRendererEvents(),this.initTimerEvents(),this.initPlugins();const n=this.options.url||this.getSrc()||"";(n||this.options.peaks&&this.options.duration)&&this.load(n,this.options.peaks,this.options.duration)}getProgress(t){var e,i,n,s,o,r,a;if(console.log("renderProgress",this.getDuration(),null===(e=this.decodedData)||void 0===e?void 0:e.duration),super.getDuration()!==(null===(i=this.decodedData)||void 0===i?void 0:i.duration)&&(null===(n=this.decodedData)||void 0===n?void 0:n.duration)){const e=super.getDuration()-(null===(s=this.decodedData)||void 0===s?void 0:s.duration);if(e){const i=t-e;return i<0?0:(console.log({gap:e},i,t,null===(o=this.decodedData)||void 0===o?void 0:o.duration,i/(null===(r=this.decodedData)||void 0===r?void 0:r.duration)),i/(null===(a=this.decodedData)||void 0===a?void 0:a.duration))}return t/this.getDuration()}return t/this.getDuration()}initTimerEvents(){this.subscriptions.push(this.timer.on("tick",(()=>{const t=this.getCurrentTime();console.log("renderProgress tick",t);const e=this.getProgress(t);this.renderer.renderProgress(e,!0),this.emit("timeupdate",t),this.emit("audioprocess",t)})))}initPlayerEvents(){this.isPlaying()&&(this.emit("play"),this.timer.start()),this.mediaSubscriptions.push(this.onMediaEvent("timeupdate",(()=>{const t=this.getCurrentTime();this.renderer.renderProgress(this.getProgress(t),this.isPlaying()),this.emit("timeupdate",t)})),this.onMediaEvent("play",(()=>{this.emit("play"),this.timer.start()})),this.onMediaEvent("pause",(()=>{this.emit("pause"),this.timer.stop()})),this.onMediaEvent("emptied",(()=>{this.timer.stop()})),this.onMediaEvent("ended",(()=>{this.emit("finish")})),this.onMediaEvent("seeking",(()=>{this.emit("seeking",this.getCurrentTime())})))}initRendererEvents(){this.subscriptions.push(this.renderer.on("click",((t,e)=>{this.options.interact&&(this.seekTo(t),this.emit("interaction",t*this.getDuration()),this.emit("click",t,e))})),this.renderer.on("dblclick",((t,e)=>{this.emit("dblclick",t,e)})),this.renderer.on("scroll",((t,e)=>{const i=this.getDuration();this.emit("scroll",t*i,e*i)})),this.renderer.on("render",(()=>{this.emit("redraw")})));{let t;this.subscriptions.push(this.renderer.on("drag",(e=>{this.options.interact&&(this.renderer.renderProgress(e),clearTimeout(t),t=setTimeout((()=>{this.seekTo(e)}),this.isPlaying()?0:200),this.emit("interaction",e*this.getDuration()),this.emit("drag",e))})))}}initPlugins(){var t;(null===(t=this.options.plugins)||void 0===t?void 0:t.length)&&this.options.plugins.forEach((t=>{this.registerPlugin(t)}))}unsubscribePlayerEvents(){this.mediaSubscriptions.forEach((t=>t())),this.mediaSubscriptions=[]}setOptions(t){this.options=Object.assign({},this.options,t),this.renderer.setOptions(this.options),t.audioRate&&this.setPlaybackRate(t.audioRate),null!=t.mediaControls&&(this.getMediaElement().controls=t.mediaControls)}registerPlugin(t){return t.init(this),this.plugins.push(t),this.subscriptions.push(t.once("destroy",(()=>{this.plugins=this.plugins.filter((e=>e!==t))}))),t}getWrapper(){return this.renderer.getWrapper()}getScroll(){return this.renderer.getScroll()}getActivePlugins(){return this.plugins}loadAudio(n,s,o,r){return t(this,void 0,void 0,(function*(){if(this.emit("load",n),!this.options.media&&this.isPlaying()&&this.pause(),this.decodedData=null,!s&&!o){const t=t=>this.emit("loading",t);s=yield i.fetchBlob(n,t,this.options.fetchParams)}this.setSrc(n,s);const t=(yield Promise.resolve(r||this.getDuration()))||(yield new Promise((t=>{this.onceMediaEvent("loadedmetadata",(()=>t(this.getDuration())))})));if(o)this.decodedData=e.createBuffer(o,t||0);else if(s){const t=yield s.arrayBuffer();this.decodedData=yield e.decode(t,this.options.sampleRate)}if(this.decodedData){const t=h(this.decodedData);console.log("decodedData",this.decodedData,t);const i=new AudioContext({sampleRate:this.options.sampleRate}),n=this.decodedData,s=n.sampleRate,o=Math.floor(t.start_time*s),r=Math.floor(t.end_time*s),a=Math.floor(n.duration*s);console.log("=====>",{numberOfChannels:n.numberOfChannels,startSampleIndex:o,endSampleIndex:r,totalSampleIndex:a,sampleRate:s,duration:n.duration,sampleRateOptions:this.options.sampleRate});const l=i.createBuffer(n.numberOfChannels,r-o,this.options.sampleRate);for(let t=0;t<n.numberOfChannels;t++){const e=n.getChannelData(t);l.getChannelData(t).set(e.slice(o,r))}console.log(l),console.log("duration0: ",this.decodedData.duration,this.getDuration()),this.decodedData=yield e.createBuffer([l.getChannelData(0)],l.duration),console.log("duration1: ",this.decodedData.duration,this.getDuration()),this.emit("decode",this.getDuration()),this.renderer.render(this.decodedData)}this.emit("ready",this.getDuration())}))}load(e,i,n){return t(this,void 0,void 0,(function*(){yield this.loadAudio(e,void 0,i,n)}))}loadBlob(e,i,n){return t(this,void 0,void 0,(function*(){yield this.loadAudio("blob",e,i,n)}))}zoom(t){if(!this.decodedData)throw new Error("No audio loaded");this.renderer.zoom(t),this.emit("zoom",t)}getDecodedData(){return this.decodedData}exportPeaks({channels:t=2,maxLength:e=8e3,precision:i=1e4}={}){if(!this.decodedData)throw new Error("The audio has not been decoded yet");const n=Math.min(t,this.decodedData.numberOfChannels),s=[];for(let t=0;t<n;t++){const n=this.decodedData.getChannelData(t),o=[],r=Math.round(n.length/e);for(let t=0;t<e;t++){const e=n.slice(t*r,(t+1)*r);let s=0;for(let t=0;t<e.length;t++){const i=e[t];Math.abs(i)>Math.abs(s)&&(s=i)}o.push(Math.round(s*i)/i)}s.push(o)}return s}getDuration(){let t=super.getDuration()||0;return 0!==t&&t!==1/0||!this.decodedData||(t=this.decodedData.duration),t}toggleInteraction(t){this.options.interact=t}seekTo(t){const e=this.getDuration()*t;this.setTime(e)}playPause(){return t(this,void 0,void 0,(function*(){return this.isPlaying()?this.pause():this.play()}))}stop(){this.pause(),this.setTime(0)}skip(t){this.setTime(this.getCurrentTime()+t)}empty(){this.load("",[[0]],.001)}setMediaElement(t){this.unsubscribePlayerEvents(),super.setMediaElement(t),this.initPlayerEvents()}exportImage(e="image/png",i=1,n="dataURL"){return t(this,void 0,void 0,(function*(){return this.renderer.exportImage(e,i,n)}))}destroy(){this.emit("destroy"),this.plugins.forEach((t=>t.destroy())),this.subscriptions.forEach((t=>t())),this.unsubscribePlayerEvents(),this.timer.destroy(),this.renderer.destroy(),super.destroy()}}module.exports=d;
