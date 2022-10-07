import { CanvasButtonPlugin } from "paella-core";
import { checkSlides, nextSlide } from "../js/SlideNavigation";

import DefaultArrowRightIcon from '../icons/arrow-right.svg';

export default class NextSlideNavigatorButton extends CanvasButtonPlugin {

    getAriaLabel() {
        return this.getDescription();
    }

    getDescription() {
        return "Seek video to the next slide";
    }

    async isEnabled() {
        const enabled = await super.isEnabled();
        return enabled && checkSlides(this.player);
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || DefaultArrowRightIcon;
    }

    async action() {
        await nextSlide(this.player);
    }
}