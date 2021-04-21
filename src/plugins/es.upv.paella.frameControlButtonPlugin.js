import { 
    createElementWithHtmlText,
    PopUpButtonPlugin 
} from 'paella-core';

import photoIcon from '../icons/photo.svg';
import '../styles/FrameControlButton.css';

export default class FrameControlButtonPlugin extends PopUpButtonPlugin {
    get popUpType() { return "timeline"; }

    async isEnabled() {
        const enabled = await super.isEnabled();
        this.frames = this.player.videoManifest?.frameList;
        this.frames.sort((a,b) => {
            return a.time - b.time;
        });
        // TODO: remove this
        this.frames = [
            ...this.frames, 
            ...this.frames, 
            ...this.frames,
            ...this.frames,
            ...this.frames,
            ...this.frames
        ];
        return enabled && this.frames
    }

    async getContent() {
        const content = createElementWithHtmlText('<div class="frame-control-plugin-container"></div>');
        const leftButton = createElementWithHtmlText(`<button class="btn-left">a</button>`,content);
        const imageContainer = createElementWithHtmlText('<div class="image-list"></div>',content);
        const rightButton = createElementWithHtmlText(`<button class="btn-right">d</button>`,content);

        this.frames.forEach(frameData => {
            const frameElement = createElementWithHtmlText(`
            <a>
                <img src="${ frameData.thumb }" alt="${ frameData.id }"/>
            </a>
            `, imageContainer);
            frameElement.__data = frameData;
            frameElement.addEventListener("click", async evt => {
                console.log(evt.currentTarget.__data);
                const { time } = evt.currentTarget.__data;
                await this.player.videoContainer.setCurrentTime(time);
            });
        })
        return content;
    }

    async load() {
        this.icon = photoIcon;
    }
}
