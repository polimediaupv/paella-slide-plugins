import { Paella } from 'paella-core';
import getSlidePluginsContext from './index';

import slideIcon from './icons/slidesIcon.svg';

const initParams = {
	customPluginContext: [
		getSlidePluginsContext()
	]
};

let paella = new Paella('player-container', initParams);

paella.loadManifest()
	.then(() => {
		paella.addCustomPluginIcon("es.upv.paella.frameControlButtonPlugin","photoIcon",slideIcon);
	})
	.catch(e => console.error(e));
