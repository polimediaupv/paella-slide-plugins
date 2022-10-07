import { CanvasButtonPlugin } from "paella-core";
import { checkSlides, previousSlide } from "../js/SlideNavigation";

import DefaultArrowLeftIcon from '../icons/arrow-left.svg';

export default class PrevSlideNavigatorButton extends CanvasButtonPlugin {

    getAriaLabel() {
        return this.getDescription();
    }

    getDescription() {
        return "Seek video to the previous slide";
    }

    async isEnabled() {
        const enabled = await super.isEnabled();
        return enabled && checkSlides(this.player);
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || DefaultArrowLeftIcon;
    }

    async action() {
        await previousSlide(this.player);
    }
}