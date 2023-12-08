var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Decoder from './decoder.js';
import Fetcher from './fetcher.js';
import Player from './player.js';
import Renderer from './renderer.js';
import Timer from './timer.js';
import WebAudioPlayer from './webaudio.js';
const extractFirstAndLastSilentRegions = (audioData, duration) => {
    const minValue = 0.01;
    const minSilenceDuration = 0.1;
    const scale = duration / audioData.length;
    const silentRegions = [];
    // Find all silent regions longer than minSilenceDuration
    let start = 0;
    let end = 0;
    let isSilent = false;
    for (let i = 0; i < audioData.length; i++) {
        if (audioData[i] < minValue) {
            if (!isSilent) {
                start = i;
                isSilent = true;
            }
        }
        else if (isSilent) {
            end = i;
            isSilent = false;
            if (scale * (end - start) > minSilenceDuration) {
                silentRegions.push({
                    end_position: end,
                    start: scale * start,
                    end: scale * end,
                });
            }
        }
    }
    console.log('firstSilentRegion', silentRegions);
    // Find the first and last silent regions
    return silentRegions[0] || null;
};
// 提取音频数据中的最后一个连续静音区域
const extractEndSilentRegion = (audioData, duration) => {
    // 设置阈值和最小静音时长
    const minValue = 0.01;
    const minSilenceDuration = 0.1;
    // 计算音频数据的缩放比例
    const scale = duration / audioData.length;
    // 用于存储静音区域的数组
    const silentRegions = [];
    let start = 0;
    let end = 0;
    let isSilent = false;
    // 从音频数据的末尾开始，逐个检查每个值是否小于阈值
    for (let i = audioData.length - 1; i > 0; i--) {
        // 如果当前值小于阈值，且当前状态不是静音，则将当前索引标记为静音区域的开始
        if (audioData[i] < minValue && !isSilent) {
            start = i;
            isSilent = true;
        }
        // 如果当前值不小于阈值，且当前状态是静音，则将当前索引标记为静音区域的结束
        if (audioData[i] >= minValue && isSilent) {
            end = i;
            isSilent = false;
            // 如果静音区域的持续时间超过最小静音时长，则将其添加到静音区域数组中
            if (scale * (start - end) > minSilenceDuration) {
                silentRegions.push({
                    start_position: end,
                    start: scale * end,
                    end: scale * start,
                });
            }
        }
    }
    // 从静音区域数组中返回第一个静音区域（即音频数据中的最后一个静音区域）
    return silentRegions[0] || null;
};
const getAudioSilentSideRegions = (audioBuffer) => {
    const audioData = audioBuffer.getChannelData(0);
    const regions1 = extractFirstAndLastSilentRegions(audioData, audioBuffer.duration);
    const regions2 = extractEndSilentRegion(audioData, audioBuffer.duration);
    let start_time = 0; //开始时间
    let end_time = (audioBuffer.duration / audioData.length) * (audioData.length - 1); //结束时间
    if (regions1) {
        start_time = regions1.end;
    }
    if (regions2) {
        end_time = regions2.start;
    }
    const total_grids_num = audioBuffer.length; //总格子数
    const region_start_grid_index = (regions1 === null || regions1 === void 0 ? void 0 : regions1.end_position) || 0;
    const region_end_grid_index = (regions2 === null || regions2 === void 0 ? void 0 : regions2.start_position) || total_grids_num;
    console.log({
        region_start_grid_index,
        region_end_grid_index,
        total_grids_num,
    });
    console.log({ start_time, end_time });
    return {
        start_time,
        end_time,
        region_start_grid_index,
        region_end_grid_index,
        total_grids_num,
    };
};
const defaultOptions = {
    waveColor: '#999',
    progressColor: '#555',
    cursorWidth: 1,
    minPxPerSec: 0,
    fillParent: true,
    interact: true,
    dragToSeek: false,
    autoScroll: true,
    autoCenter: true,
    sampleRate: 8000,
};
class WaveSurfer extends Player {
    /** Create a new WaveSurfer instance */
    static create(options) {
        return new WaveSurfer(options);
    }
    /** Create a new WaveSurfer instance */
    constructor(options) {
        const media = options.media ||
            (options.backend === 'WebAudio' ? new WebAudioPlayer() : undefined);
        super({
            media,
            mediaControls: options.mediaControls,
            autoplay: options.autoplay,
            playbackRate: options.audioRate,
        });
        this.plugins = [];
        this.decodedData = null;
        this.subscriptions = [];
        this.mediaSubscriptions = [];
        this.options = Object.assign({}, defaultOptions, options);
        this.timer = new Timer();
        const audioElement = media ? undefined : this.getMediaElement();
        this.renderer = new Renderer(this.options, audioElement);
        this.initPlayerEvents();
        this.initRendererEvents();
        this.initTimerEvents();
        this.initPlugins();
        // Load audio if URL or an external media with an src is passed,
        // of render w/o audio if pre-decoded peaks and duration are provided
        const url = this.options.url || this.getSrc() || '';
        if (url || (this.options.peaks && this.options.duration)) {
            this.load(url, this.options.peaks, this.options.duration);
        }
    }
    getProgress(currentTime) {
        var _a, _b, _c, _d, _e, _f, _g;
        console.log("renderProgress", this.getDuration(), (_a = this.decodedData) === null || _a === void 0 ? void 0 : _a.duration);
        if (super.getDuration() !== ((_b = this.decodedData) === null || _b === void 0 ? void 0 : _b.duration) && ((_c = this.decodedData) === null || _c === void 0 ? void 0 : _c.duration)) {
            const gap = super.getDuration() - ((_d = this.decodedData) === null || _d === void 0 ? void 0 : _d.duration);
            if (gap) {
                const t = currentTime - gap;
                if (t < 0) {
                    return 0;
                }
                else {
                    console.log({ gap }, t, currentTime, (_e = this.decodedData) === null || _e === void 0 ? void 0 : _e.duration, t / ((_f = this.decodedData) === null || _f === void 0 ? void 0 : _f.duration));
                    return t / ((_g = this.decodedData) === null || _g === void 0 ? void 0 : _g.duration);
                }
            }
            else {
                return currentTime / this.getDuration();
            }
        }
        else {
            return currentTime / this.getDuration();
        }
    }
    initTimerEvents() {
        // The timer fires every 16ms for a smooth progress animation
        this.subscriptions.push(this.timer.on('tick', () => {
            const currentTime = this.getCurrentTime();
            console.log("renderProgress tick", currentTime);
            const progress = this.getProgress(currentTime);
            this.renderer.renderProgress(progress, true);
            this.emit('timeupdate', currentTime);
            this.emit('audioprocess', currentTime);
        }));
    }
    initPlayerEvents() {
        if (this.isPlaying()) {
            this.emit('play');
            this.timer.start();
        }
        this.mediaSubscriptions.push(this.onMediaEvent('timeupdate', () => {
            const currentTime = this.getCurrentTime();
            this.renderer.renderProgress(this.getProgress(currentTime), this.isPlaying());
            this.emit('timeupdate', currentTime);
        }), this.onMediaEvent('play', () => {
            this.emit('play');
            this.timer.start();
        }), this.onMediaEvent('pause', () => {
            this.emit('pause');
            this.timer.stop();
        }), this.onMediaEvent('emptied', () => {
            this.timer.stop();
        }), this.onMediaEvent('ended', () => {
            this.emit('finish');
        }), this.onMediaEvent('seeking', () => {
            this.emit('seeking', this.getCurrentTime());
        }));
    }
    initRendererEvents() {
        this.subscriptions.push(
        // Seek on click
        this.renderer.on('click', (relativeX, relativeY) => {
            if (this.options.interact) {
                this.seekTo(relativeX);
                this.emit('interaction', relativeX * this.getDuration());
                this.emit('click', relativeX, relativeY);
            }
        }), 
        // Double click
        this.renderer.on('dblclick', (relativeX, relativeY) => {
            this.emit('dblclick', relativeX, relativeY);
        }), 
        // Scroll
        this.renderer.on('scroll', (startX, endX) => {
            const duration = this.getDuration();
            this.emit('scroll', startX * duration, endX * duration);
        }), 
        // Redraw
        this.renderer.on('render', () => {
            this.emit('redraw');
        }));
        // Drag
        {
            let debounce;
            this.subscriptions.push(this.renderer.on('drag', (relativeX) => {
                if (!this.options.interact)
                    return;
                // Update the visual position
                this.renderer.renderProgress(relativeX);
                // Set the audio position with a debounce
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    this.seekTo(relativeX);
                }, this.isPlaying() ? 0 : 200);
                this.emit('interaction', relativeX * this.getDuration());
                this.emit('drag', relativeX);
            }));
        }
    }
    initPlugins() {
        var _a;
        if (!((_a = this.options.plugins) === null || _a === void 0 ? void 0 : _a.length))
            return;
        this.options.plugins.forEach((plugin) => {
            this.registerPlugin(plugin);
        });
    }
    unsubscribePlayerEvents() {
        this.mediaSubscriptions.forEach((unsubscribe) => unsubscribe());
        this.mediaSubscriptions = [];
    }
    /** Set new wavesurfer options and re-render it */
    setOptions(options) {
        this.options = Object.assign({}, this.options, options);
        this.renderer.setOptions(this.options);
        if (options.audioRate) {
            this.setPlaybackRate(options.audioRate);
        }
        if (options.mediaControls != null) {
            this.getMediaElement().controls = options.mediaControls;
        }
    }
    /** Register a wavesurfer.js plugin */
    registerPlugin(plugin) {
        plugin.init(this);
        this.plugins.push(plugin);
        // Unregister plugin on destroy
        this.subscriptions.push(plugin.once('destroy', () => {
            this.plugins = this.plugins.filter((p) => p !== plugin);
        }));
        return plugin;
    }
    /** For plugins only: get the waveform wrapper div */
    getWrapper() {
        return this.renderer.getWrapper();
    }
    /** Get the current scroll position in pixels */
    getScroll() {
        return this.renderer.getScroll();
    }
    /** Get all registered plugins */
    getActivePlugins() {
        return this.plugins;
    }
    loadAudio(url, blob, channelData, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('load', url);
            if (!this.options.media && this.isPlaying())
                this.pause();
            this.decodedData = null;
            // Fetch the entire audio as a blob if pre-decoded data is not provided
            if (!blob && !channelData) {
                const onProgress = (percentage) => this.emit('loading', percentage);
                blob = yield Fetcher.fetchBlob(url, onProgress, this.options.fetchParams);
            }
            // Set the mediaelement source
            this.setSrc(url, blob);
            // Wait for the audio duration
            // It should be a promise to allow event listeners to subscribe to the ready and decode events
            const audioDuration = (yield Promise.resolve(duration || this.getDuration())) ||
                (yield new Promise((resolve) => {
                    this.onceMediaEvent('loadedmetadata', () => resolve(this.getDuration()));
                }));
            // Decode the audio data or use user-provided peaks
            if (channelData) {
                this.decodedData = Decoder.createBuffer(channelData, audioDuration || 0);
            }
            else if (blob) {
                const arrayBuffer = yield blob.arrayBuffer();
                this.decodedData = yield Decoder.decode(arrayBuffer, this.options.sampleRate);
            }
            if (this.decodedData) {
                const res = getAudioSilentSideRegions(this.decodedData);
                console.log("decodedData", this.decodedData, res);
                const audioContext = new AudioContext({ sampleRate: this.options.sampleRate });
                const audioBuffer = this.decodedData;
                // this.setTimeDelta(res.start_time)
                const sampleRate = audioBuffer.sampleRate;
                const startSampleIndex = Math.floor(res.start_time * sampleRate);
                const endSampleIndex = Math.floor(res.end_time * sampleRate);
                const totalSampleIndex = Math.floor(audioBuffer.duration * sampleRate);
                console.log("=====>", { numberOfChannels: audioBuffer.numberOfChannels, startSampleIndex, endSampleIndex, totalSampleIndex, sampleRate, duration: audioBuffer.duration, sampleRateOptions: this.options.sampleRate });
                //
                const trimmedBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, endSampleIndex - startSampleIndex, this.options.sampleRate);
                for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
                    const originalData = audioBuffer.getChannelData(channel);
                    const trimmedData = trimmedBuffer.getChannelData(channel);
                    trimmedData.set(originalData.slice(startSampleIndex, endSampleIndex));
                }
                console.log(trimmedBuffer);
                console.log("duration0: ", this.decodedData.duration, this.getDuration());
                this.decodedData = yield Decoder.createBuffer([trimmedBuffer.getChannelData(0)], trimmedBuffer.duration);
                console.log("duration1: ", this.decodedData.duration, this.getDuration());
                this.emit('decode', this.getDuration());
                this.renderer.render(this.decodedData);
            }
            this.emit('ready', this.getDuration());
        });
    }
    /** Load an audio file by URL, with optional pre-decoded audio data */
    load(url, channelData, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadAudio(url, undefined, channelData, duration);
        });
    }
    /** Load an audio blob */
    loadBlob(blob, channelData, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadAudio('blob', blob, channelData, duration);
        });
    }
    /** Zoom the waveform by a given pixels-per-second factor */
    zoom(minPxPerSec) {
        if (!this.decodedData) {
            throw new Error('No audio loaded');
        }
        this.renderer.zoom(minPxPerSec);
        this.emit('zoom', minPxPerSec);
    }
    /** Get the decoded audio data */
    getDecodedData() {
        return this.decodedData;
    }
    /** Get decoded peaks */
    exportPeaks({ channels = 2, maxLength = 8000, precision = 10000 } = {}) {
        if (!this.decodedData) {
            throw new Error('The audio has not been decoded yet');
        }
        const maxChannels = Math.min(channels, this.decodedData.numberOfChannels);
        const peaks = [];
        for (let i = 0; i < maxChannels; i++) {
            const channel = this.decodedData.getChannelData(i);
            const data = [];
            const sampleSize = Math.round(channel.length / maxLength);
            for (let i = 0; i < maxLength; i++) {
                const sample = channel.slice(i * sampleSize, (i + 1) * sampleSize);
                let max = 0;
                for (let x = 0; x < sample.length; x++) {
                    const n = sample[x];
                    if (Math.abs(n) > Math.abs(max))
                        max = n;
                }
                data.push(Math.round(max * precision) / precision);
            }
            peaks.push(data);
        }
        return peaks;
    }
    /** Get the duration of the audio in seconds */
    getDuration() {
        let duration = super.getDuration() || 0;
        // Fall back to the decoded data duration if the media duration is incorrect
        if ((duration === 0 || duration === Infinity) && this.decodedData) {
            duration = this.decodedData.duration;
        }
        return duration;
    }
    /** Toggle if the waveform should react to clicks */
    toggleInteraction(isInteractive) {
        this.options.interact = isInteractive;
    }
    /** Seek to a percentage of audio as [0..1] (0 = beginning, 1 = end) */
    seekTo(progress) {
        const time = this.getDuration() * progress;
        this.setTime(time);
    }
    /** Play or pause the audio */
    playPause() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.isPlaying() ? this.pause() : this.play();
        });
    }
    /** Stop the audio and go to the beginning */
    stop() {
        this.pause();
        this.setTime(0);
    }
    /** Skip N or -N seconds from the current position */
    skip(seconds) {
        this.setTime(this.getCurrentTime() + seconds);
    }
    /** Empty the waveform */
    empty() {
        this.load('', [[0]], 0.001);
    }
    /** Set HTML media element */
    setMediaElement(element) {
        this.unsubscribePlayerEvents();
        super.setMediaElement(element);
        this.initPlayerEvents();
    }
    exportImage(format = 'image/png', quality = 1, type = 'dataURL') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.renderer.exportImage(format, quality, type);
        });
    }
    /** Unmount wavesurfer */
    destroy() {
        this.emit('destroy');
        this.plugins.forEach((plugin) => plugin.destroy());
        this.subscriptions.forEach((unsubscribe) => unsubscribe());
        this.unsubscribePlayerEvents();
        this.timer.destroy();
        this.renderer.destroy();
        super.destroy();
    }
}
export default WaveSurfer;
