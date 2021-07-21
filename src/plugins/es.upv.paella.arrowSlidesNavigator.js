import { Events, EventLogPlugin, createElementWithHtmlText } from 'paella-core';

import "../styles/arrowSlidesNavigator.css";
import arrowLeft from '../icons/arrow-left.svg';
import arrowRight from '../icons/arrow-right.svg';

async function next() {
    const duration = Math.trunc(await this.player.videoContainer.duration());
    const current = Math.trunc(await this.player.videoContainer.currentTime());
    const min = this.player.videoContainer.isTrimEnabled ? this.player.videoContainer.trimStart : 0;
    const max = this.player.videoContainer.isTrimEnabled ? this.player.videoContainer.trimEnd : duration;
    let frame = null;
    this.frames.some(f => {
        if (f.time>current) {
            frame = f;
        }
        return frame !== null;
    });

    if (frame.time<max) {
        console.log(frame);
        await this.player.videoContainer.setCurrentTime(frame.time);
    }
}

async function prev() {
    const duration = await this.player.videoContainer.duration();
    const min = this.player.videoContainer.isTrimEnabled ? this.player.videoContainer.trimStart : 0;
    const max = this.player.videoContainer.isTrimEnabled ? this.player.videoContainer.trimEnd : duration;
    this.frames.some(frame => {
        console.log(frame);
    })
}

export default class ArrowSlidesNavigatorPlugin extends EventLogPlugin {

    get events() {
        return [
            Events.PLAYER_LOADED
        ];
    }

    async onEvent(event) {
        console.debug("Loading arrow slides navigation plugin");
        const targets = Array.isArray(this.config.target) ? this.config.target : [this.config.target];
        const streams = this.player.videoContainer.streamProvider.streams;
        const target = targets.find(t => {
            return streams[t] !== null
        });

        const stream = streams[target];

        this.frames = this.player.videoManifest?.frameList;
        this.frames?.sort((a,b) => {
            return a.time - b.time;
        });

        if (stream && this.frames?.length) {
            const mainContainer = createElementWithHtmlText(`<div class="arrow-slides-navigator"></div>`, stream.canvas.userArea);
            const leftButton = createElementWithHtmlText(`
            <button class="button-prev"><i>${arrowLeft}</i></button>
            `, mainContainer);
            leftButton.addEventListener("click", async evt => {
                await prev.apply(this);
                evt.stopPropagation();
            });

            const rightButton = createElementWithHtmlText(`
            <button class="button-next"><i>${arrowRight}</i></button>
            `, mainContainer);
            rightButton.addEventListener("click", async evt => {
                await next.apply(this);
                evt.stopPropagation();
            });
        }
        else {
            console.warn("No matching stream content or frames found for arrow slides navigator plugin");
        }
    }
}