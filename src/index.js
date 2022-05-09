
import ArrowSlides from './plugins/es.upv.paella.arrowSlidesNavigator';
import FrameControlButton from './plugins/es.upv.paella.frameControlButtonPlugin';

export default function getSlidePluginsContext() {
    return require.context("./plugins", true, /\.js/)
}

export const ArrowSlidesPlugin = ArrowSlides
export const FrameControlButtonPlugin = FrameControlButton
