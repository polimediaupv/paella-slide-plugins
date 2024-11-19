
import { ProgressIndicatorPlugin } from 'paella-core';
import SlidePluginsModule from './SlidePluginsModule';

const drawFunctions = {
    bar: function(context, width, height, isHover, drawFirstMark) {
        const barHeight = document.querySelector(`.progress-indicator-container .progress-indicator-content`)?.offsetHeight ?? height;
        const top = (height - barHeight) / 2;
    
        context.strokeStyle = isHover ? this.strokeHover : this.strokeOut;
        context.lineWidth = this.strokeWidth;
        this._frames.forEach((x,i) => {
            if (!drawFirstMark && i === 0) {
                return;
            }
            const left = x * width;
            context.beginPath();
            context.moveTo(left, top);
            context.lineTo(left, top + barHeight);
            context.stroke();
        });
    },

    dot: function(context, width, height, isHover, drawFirstMark) {
        const barHeight = document.querySelector(`.progress-indicator-container .progress-indicator-content`)?.offsetHeight ?? height;
        const top = (height - barHeight) / 2;
    
        context.fillStyle = isHover ? this.strokeHover : this.strokeOut;
        context.lineWidth = this.strokeWidth;
        this._frames.forEach((x, i) => {
            if (!drawFirstMark && i === 0) {
                return;
            }
            const left = x * width;
            context.beginPath();
            context.arc(left, top + barHeight / 2, this.strokeWidth, 0, 2 * Math.PI);
            context.fill();
        });
    },

    diamond: function(context, width, height, isHover, drawFirstMark) {
        const barHeight = document.querySelector(`.progress-indicator-container .progress-indicator-content`)?.offsetHeight ?? height;
        const top = (height - barHeight) / 2;
    
        context.fillStyle = isHover ? this.strokeHover : this.strokeOut;
        context.lineWidth = this.strokeWidth;
        this._frames.forEach((x,i) => {
            if (!drawFirstMark && i === 0) {
                return;
            }
            const left = x * width;
            context.beginPath();
            context.moveTo(left, top + barHeight / 2);
            context.lineTo(left + this.strokeWidth, top);
            context.lineTo(left + this.strokeWidth * 2, top + barHeight / 2);
            context.lineTo(left + this.strokeWidth, top + barHeight);
            context.closePath();
            //context.arc(left, top + barHeight / 2, this.strokeWidth, 0, 2 * Math.PI);
            context.fill();
        });
    }
};

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
        this.strokeWidth = this.config.markWidth || 4;
        this.markStyle = this.config.markStyle || "bar";
        this.drawFirstMark = this.config.drawFirstMark !== undefined ? this.config.drawFirstMark : true;
        const duration = await this.player.videoContainer.duration();
        this._frames = this.player.frameList.frames.map(frame => {
            return frame.time / duration;
        });
    }

    drawMark(context, width, height, isHover) {
        const fn = drawFunctions[this.markStyle];
        if (fn) {
            fn.apply(this, [context, width, height, isHover, this.drawFirstMark]);
        }
        else if (!fn) {
            console.error(`Invalid mark style: ${this.markStyle}. Valid options are ` + Object.keys(drawFunctions).join(", "));
        }
    }

    drawForeground(context, width, height, isHover) {
        if (!this._drawBackground) {
            this.drawMark(context, width, height, isHover);
        }
    }

    drawBackground(context, width, height, isHover) {
        if (this._drawBackground) {
            this.drawMark(context, width, height, isHover);
        }
    }

    drawBar(context, width, height, isHover) {
        const barHeight = document.querySelector(`.progress-indicator-container .progress-indicator-content`)?.offsetHeight ?? height;
        const top = (height - barHeight) / 2;
    
        context.strokeStyle = isHover ? this.strokeHover : this.strokeOut;
        context.lineWidth = this.strokeWidth;
        this._frames.forEach(x => {
            const left = x * width;
            context.beginPath();
            context.moveTo(left, top);
            context.lineTo(left, top + barHeight);
            context.stroke();
        });
    }

    drawDot(context, width, height, isHover) {
        const barHeight = document.querySelector(`.progress-indicator-container .progress-indicator-content`)?.offsetHeight ?? height;
        const top = (height - barHeight) / 2;
    
        context.fillStyle = isHover ? this.strokeHover : this.strokeOut;
        context.lineWidth = this.strokeWidth;
        this._frames.forEach(x => {
            const left = x * width;
            context.beginPath();
            context.arc(left, top + barHeight / 2, this.strokeWidth, 0, 2 * Math.PI);
            context.fill();
        });
    }

    drawDiamond(context, width, height, isHover) {
        const barHeight = document.querySelector(`.progress-indicator-container .progress-indicator-content`)?.offsetHeight ?? height;
        const top = (height - barHeight) / 2;
    
        context.fillStyle = isHover ? this.strokeHover : this.strokeOut;
        context.lineWidth = this.strokeWidth;
        this._frames.forEach(x => {
            const left = x * width;
            context.beginPath();
            context.moveTo(left, top + barHeight / 2);
            context.lineTo(left + this.strokeWidth, top);
            context.lineTo(left + this.strokeWidth * 2, top + barHeight / 2);
            context.lineTo(left + this.strokeWidth, top + barHeight);
            context.closePath();
            //context.arc(left, top + barHeight / 2, this.strokeWidth, 0, 2 * Math.PI);
            context.fill();
        });
    }
}
