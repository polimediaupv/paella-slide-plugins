
import { ProgressIndicatorPlugin } from 'paella-core';

export default class MyProgressIndicatorPlugin extends ProgressIndicatorPlugin {
    async load() {
        const duration = await this.player.videoContainer.duration();
        this._frames = this.player.videoManifest.frameList.map(frame => {
            return frame.time / duration;
        });
    }

    drawForeground(context, width, height, isHover) {
        context.strokeStyle = isHover ? "#A9A9A9" : "#0A0A0A";
        context.lineWidth = 3;
        this._frames.forEach(x => {
            const left = x * width;
            context.beginPath();
            context.moveTo(left, 0);
            context.lineTo(left, height);
            context.stroke();
        });
    }
}