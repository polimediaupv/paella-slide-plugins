import { 
    createElementWithHtmlText,
    PopUpButtonPlugin,
    Events,
    bindEvent,
    utils
} from 'paella-core';

import defaultPhotoIcon from '../icons/photo.svg';
import defaultArrowLeftIcon from '../icons/arrow-left.svg';
import defaultArrowRightIcon from '../icons/arrow-right.svg';
import '../styles/frameControlButton.css';

function setSelected(item, allItems) {
    allItems?.forEach(e => e.classList.remove('selected'));
    item.classList.add('selected');
}

export default class FrameControlButtonPlugin extends PopUpButtonPlugin {
    getAriaLabel() {
        return "Show video slides";
    }

    getDescription() {
        return this.getAriaLabel();
    }

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
        const arrowLeftIcon = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || defaultArrowLeftIcon;
        const arrowRightIcon = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || defaultArrowRightIcon;

        const previewContent = this.config.targetContent || "presentation";
        const content = createElementWithHtmlText('<div class="frame-control-plugin-container"></div>');
        const imageContainer = createElementWithHtmlText('<div class="image-list"></div>',content);
        const leftButton = createElementWithHtmlText(`<button class="btn-left"><i class="button-icon">${ arrowLeftIcon }</i></button>`,content);
        const rightButton = createElementWithHtmlText(`<button class="btn-right"><i class="button-icon">${ arrowRightIcon }</i></button>`,content);
        const { videoContainer } = this.player;
        const duration = await videoContainer.duration();

        const start = videoContainer.isTrimEnabled ? videoContainer.trimStart : 0;
        const end = videoContainer.isTrimEnabled ? videoContainer.trimEnd : duration;

        const getTime = (t) => {
            t = this.player.videoContainer.isTrimEnabled ? t - this.player.videoContainer.trimStart : t;
            return utils.secondsToTime(t < 0 ? 0 : t);
        }

        this.frameElements = this.frames
            .filter((frameData,i) => {
                const nextFrame = this.frames[i + 1];
                return (nextFrame?.time>=start || frameData.time>=start) && frameData.time<=end;
            })
            .map(frameData => {    
                const description = `${ this.player.translate(`go to`) } ${ getTime(frameData.time) }`;
                const frameElement = createElementWithHtmlText(`
                <button id="frame_${frameData.id}" aria-label="${ description }" title="${ description }"><img src="${ frameData.thumb }" alt="${ frameData.id }"/></button>
                `, imageContainer);
                frameElement.__data = frameData;
                frameElement.addEventListener("click", async evt => {
                    const time = evt.currentTarget.__data.time - start;
                    await this.player.videoContainer.setCurrentTime(time>=0 ? time : 0);
                    setSelected(evt.currentTarget, this.frameElements);
                });
                frameElement.addEventListener("mouseover", async evt => {
                    if (this._currentFrame) {
                        this.player.videoContainer.removeChild(this._currentFrame);
                    }
                    const preview = document.createElement("img");
                    preview.className = "frame-control-preview";
                    preview.src = frameData.url;
                    const rect = this.player.videoContainer.getVideoRect(previewContent);
                    this._currentFrame = this.player.videoContainer.appendChild(preview, rect);
                });
                frameElement.addEventListener("mouseout", async evt => {
                    if (this._currentFrame) {
                        this.player.videoContainer.removeChild(this._currentFrame);
                        this._currentFrame = null;
                    }
                })
                return frameElement;
            });

        const displacement = () => imageContainer.offsetWidth * 20 / 100;
        leftButton.addEventListener('click', () => {
            imageContainer.scrollLeft -= displacement();
        });

        rightButton.addEventListener('click', () => {
            imageContainer.scrollLeft += displacement();
        });

        setTimeout(() => this.frameElements[0] && this.frameElements[0].focus(), 50);
        return content;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "photoIcon") || defaultPhotoIcon;
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

    async getDictionaries() {
		return {
			es: {
				"Show video slides": "Mostrar diapositivas del vídeo",
                "go to": "ir a"
			}
		}
	}
}
