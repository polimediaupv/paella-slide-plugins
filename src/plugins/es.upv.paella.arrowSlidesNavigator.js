import { Events, EventLogPlugin, createElementWithHtmlText } from 'paella-core';

import "../styles/arrowSlidesNavigator.css";
import arrowLeft from '../icons/arrow-left.svg';
import arrowRight from '../icons/arrow-right.svg';

async function next() {
    const { videoContainer } = this.player;
    // Convert all to untrimmed time
    const initOffset = videoContainer.isTrimEnabled ? videoContainer.trimStart : 0;
    const max = initOffset + Math.trunc(await videoContainer.duration());
    const current = initOffset + Math.trunc(await videoContainer.currentTime());
    let frame = null;
    this.frames.some(f => {
        if (f.time>current && f.time<max) {
            frame = f;
        }
        return frame !== null;
    });

    if (frame) {
        await this.player.videoContainer.setCurrentTime(frame.time - initOffset);
    }
}

async function prev() {
    const { videoContainer } = this.player;
    const initOffset = videoContainer.isTrimEnabled ? videoContainer.trimStart : 0;
    const current = Math.trunc(await videoContainer.currentTime()) + initOffset;
    let frame = null;
    this.frames.some(f => {
        if (f.time<current) {
            frame = f;
        }
        return f.time>=current;
    });

    if (frame) {
        const seekTime = frame.time<initOffset ? initOffset : frame.time;
        await this.player.videoContainer.setCurrentTime(seekTime - initOffset);
    }
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
                evt.stopPropagation();
                await prev.apply(this);
            });

            const rightButton = createElementWithHtmlText(`
            <button class="button-next"><i>${arrowRight}</i></button>
            `, mainContainer);
            rightButton.addEventListener("click", async evt => {
                evt.stopPropagation();
                await next.apply(this);
            });
        }
        else {
            console.warn("No matching stream content or frames found for arrow slides navigator plugin");
        }
    }
}