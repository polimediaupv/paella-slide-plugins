import { 
    createElementWithHtmlText,
    PopUpButtonPlugin 
} from 'paella-core';

import photoIcon from '../icons/photo.svg';

export default class FrameControlButtonPlugin extends PopUpButtonPlugin {
    get popUpType() { return "timeline"; }

    async getContent() {
        const content = createElementWithHtmlText('<p>Pop Up Button plugin content</p>');
        return content;
    }

    async load() {
        this.icon = photoIcon;
    }
}
