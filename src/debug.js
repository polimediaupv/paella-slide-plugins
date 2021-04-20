import { Paella } from 'paella-core';
import getSlidePluginsContext from './index';

const initParams = {
	customPluginContext: [
		getSlidePluginsContext()
	]
};

let paella = new Paella('player-container', initParams);

paella.loadManifest()
	.then(() => console.log("done"))
	.catch(e => console.error(e));
