
import { ProgressIndicatorPlugin } from 'paella-core';

export default class MyProgressIndicatorPlugin extends ProgressIndicatorPlugin {
    async load() {
        this._drawBackground = this.config.drawBackground || false;
        this.strokeOut = this.config.markColor?.mouseOut || "#0A0A0A";
        this.strokeHover = this.config.markColor?.mouseHover || "#A9A9A9";
        this.strokeWidth = this.config.markWidth || 3;
        const duration = await this.player.videoContainer.duration();
        this._frames = this.player.videoManifest.frameList.map(frame => {
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