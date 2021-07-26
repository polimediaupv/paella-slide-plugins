import { 
    createElementWithHtmlText,
    PopUpButtonPlugin,
    Events,
    bindEvent
} from 'paella-core';

import photoIcon from '../icons/photo.svg';
import arrowLeftIcon from '../icons/arrow-left.svg';
import arrowRightIcon from '../icons/arrow-right.svg';
import '../styles/frameControlButton.css';

function setSelected(item, allItems) {
    allItems?.forEach(e => e.classList.remove('selected'));
    item.classList.add('selected');
}

export default class FrameControlButtonPlugin extends PopUpButtonPlugin {
    get popUpType() { return "timeline"; }

    async isEnabled() {
        const enabled = await super.isEnabled();
        this.frames = this.player.videoManifest?.frameList;
        this.frames?.sort((a,b) => {
            return a.time - b.time;
        });
        return enabled && this.frames?.length;
    }

    async getContent() {
        const content = createElementWithHtmlText('<div class="frame-control-plugin-container"></div>');
        const imageContainer = createElementWithHtmlText('<div class="image-list"></div>',content);
        const leftButton = createElementWithHtmlText(`<button class="btn-left"><i class="button-icon">${ arrowLeftIcon }</i></button>`,content);
        const rightButton = createElementWithHtmlText(`<button class="btn-right"><i class="button-icon">${ arrowRightIcon }</i></button>`,content);
        const { videoContainer } = this.player;
        const duration = await videoContainer.duration();

        const start = videoContainer.isTrimEnabled ? videoContainer.trimStart : 0;
        const end = videoContainer.isTrimEnabled ? videoContainer.trimEnd : duration;

        this.frameElements = this.frames
            .filter((frameData,i) => {
                const nextFrame = this.frames[i + 1];
                return (nextFrame?.time>=start || frameData.time>=start) && frameData.time<=end;
            })
            .map(frameData => {    
                const frameElement = createElementWithHtmlText(`
                <a id="frame_${frameData.id}"><img src="${ frameData.thumb }" alt="${ frameData.id }"/></a>
                `, imageContainer);
                frameElement.__data = frameData;
                frameElement.addEventListener("click", async evt => {
                    const time = evt.currentTarget.__data.time - start;
                    await this.player.videoContainer.setCurrentTime(time>=0 ? time : 0);
                    setSelected(evt.currentTarget, this.frameElements);
                });
                return frameElement;
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
        const timeOffset = 3;

        bindEvent(this.player, Events.TIMEUPDATE, async params => {
            const start = this.player.videoContainer.isTrimEnabled ? this.player.videoContainer.trimStart : 0;
            // this.frameElements is not available until the content popup has been opened.
            let currentElement = this.frameElements && this.frameElements[0];
            this.frameElements?.some(elem => {
                if (elem.__data.time>Math.floor(params.currentTime + start + timeOffset)) {
                    return true;
                }
                currentElement = elem;
            });

            if (currentElement) {
                setSelected(currentElement, this.frameElements);
            }
        });

        bindEvent(this.player, Events.TRIMMING_CHANGED, (evt) => {
            this.refreshContent = true;
        });
    }
}
