import { Events, EventLogPlugin, createElementWithHtmlText } from 'paella-core';

import "../styles/arrowSlidesNavigator.css";

export default class ArrowSlidesNavigatorPlugin extends EventLogPlugin {
    get events() {
        return [
            Events.PLAYER_LOADED
        ];
    }

    async onEvent(event) {
        console.log("Loading arrow slides navigation plugin");
        const targets = Array.isArray(this.config.target) ? this.config.target : [this.config.target];
        const streams = this.player.videoContainer.streamProvider.streams;
        const target = targets.find(t => {
            return streams[t] !== null
        });

        const stream = streams[target];

        if (stream) {
            console.log(`TODO: Implement arrow slides navigator plugin on target "${ target }"`);
            const leftButton = createElementWithHtmlText(`
            <button class="arrow-slides-navigator button-prev">pev</button>
            `, stream.canvas.userArea);
            leftButton.addEventListener("click", (evt) => {
                alert("Prev")
                evt.stopPropagation();
            });

            const rightButton = createElementWithHtmlText(`
            <button class="arrow-slides-navigator button-next">next</button>
            `, stream.canvas.userArea);
            rightButton.addEventListener("click", (evt) => {
                alert("Next");
                evt.stopPropagation();
            });
        }
        else {
            console.warn("No matching stream content found for arrow slides navigator plugin");
        }
    }
}