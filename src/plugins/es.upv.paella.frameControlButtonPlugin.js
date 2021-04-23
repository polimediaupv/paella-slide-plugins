import { 
    createElementWithHtmlText,
    PopUpButtonPlugin 
} from 'paella-core';

import photoIcon from '../icons/photo.svg';
import arrowLeftIcon from '../icons/arrow-left.svg';
import arrowRightIcon from '../icons/arrow-right.svg';
import '../styles/FrameControlButton.css';

export default class FrameControlButtonPlugin extends PopUpButtonPlugin {
    get popUpType() { return "timeline"; }

    async isEnabled() {
        const enabled = await super.isEnabled();
        this.frames = this.player.videoManifest?.frameList;
        this.frames.sort((a,b) => {
            return a.time - b.time;
        });
        return enabled && this.frames
    }

    async getContent() {
        const content = createElementWithHtmlText('<div class="frame-control-plugin-container"></div>');
        const imageContainer = createElementWithHtmlText('<div class="image-list"></div>',content);
        const leftButton = createElementWithHtmlText(`<button class="btn-left"><i class="button-icon">${ arrowLeftIcon }</i></button>`,content);
        const rightButton = createElementWithHtmlText(`<button class="btn-right"><i class="button-icon">${ arrowRightIcon }</i></button>`,content);

        this.frames.forEach(frameData => {
            const frameElement = createElementWithHtmlText(`
                <a><img src="${ frameData.thumb }" alt="${ frameData.id }"/></a>
            `, imageContainer);
            frameElement.__data = frameData;
            frameElement.addEventListener("click", async evt => {
                const { time } = evt.currentTarget.__data;
                await this.player.videoContainer.setCurrentTime(time);
            });
        });

        const displacement = () => imageContainer.offsetWidth * 20 / 100;
        leftButton.addEventListener('click', () => {
            imageContainer.scrollLeft -= displacement();
        });

        rightButton.addEventListener('click', () => {
            imageContainer.scrollLeft += displacement();
        });

        return content;
    }

    async load() {
        this.icon = photoIcon;
    }
}
