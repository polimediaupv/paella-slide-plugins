
import { ProgressIndicatorPlugin } from 'paella-core';
import SlidePluginsModule from './SlidePluginsModule';

export default class MyProgressIndicatorPlugin extends ProgressIndicatorPlugin {
    getPluginModuleInstance() {
        return SlidePluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.slideMapProgressBarPlugin";
    }

    async isEnabled() {
        const enabled = await super.isEnabled();
        return enabled && this.player.frameList?.frames?.length > 0;
    }

    async load() {
        this._drawBackground = this.config.drawBackground || false;
        this.strokeOut = this.config.markColor?.mouseOut || "#0A0A0A";
        this.strokeHover = this.config.markColor?.mouseHover || "#A9A9A9";
        this.strokeWidth = this.config.markWidth || 3;
        const duration = await this.player.videoContainer.duration();
        this._frames = this.player.frameList.frames.map(frame => {
            return frame.time / duration;
        });
    }

    drawForeground(context, width, height, isHover) {
        if (!this._drawBackground) {
            context.strokeStyle = isHover ? this.strokeHover : this.strokeOut;
            context.lineWidth = this.strokeWidth;
            this._frames.forEach(x => {
                const left = x * width;
                context.beginPath();
                context.moveTo(left, 0);
                context.lineTo(left, height);
                context.stroke();
            });
        }
    }

    drawBackground(context, width, height, isHover) {
        if (this._drawBackground) {
            context.strokeStyle = isHover ? this.strokeHover : this.strokeOut;
            context.lineWidth = this.strokeWidth;
            this._frames.forEach(x => {
                const left = x * width;
                context.beginPath();
                context.moveTo(left, 0);
                context.lineTo(left, height);
                context.stroke();
            });
        }
    }
}
