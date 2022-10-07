
import ArrowSlides from './plugins/es.upv.paella.arrowSlidesNavigator';
import FrameControlButton from './plugins/es.upv.paella.frameControlButtonPlugin';
import SlideMapProgressBar from './plugins/es.upv.paella.slideMapProgressBarPlugin';
import NextSlideNavigatorButton from './plugins/es.upv.paella.nextSlideNavigatorButton';
import PrevSlideNavigatorButton from './plugins/es.upv.paella.prevSlideNavigatorButton';

import { nextSlide, getFrames, previousSlide, checkSlides } from './js/SlideNavigation';

export default function getSlidePluginsContext() {
    return require.context("./plugins", true, /\.js/)
}

export const ArrowSlidesPlugin = ArrowSlides
export const FrameControlButtonPlugin = FrameControlButton
export const SlideMapProgressBarPlugin = SlideMapProgressBar
export const NextSlideNavigatorButtonPlugin = NextSlideNavigatorButton;
export const PrevSlideNavigatorButtonPlugin = PrevSlideNavigatorButton

export const utils = {
    nextSlide,
    previousSlide,
    checkSlides,
    getFrames
}
