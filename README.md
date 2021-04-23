# paella-slide-plugins

A set of plugins to handle slides for Paella Player

## Usage

**Step 1:** Import the plugin context and add it to the Paella Player initialization parameters:

```javascript
...
import getSlidePluginsContext from 'paella-slide-plugins';

let paella = new Paella('player-container', {
    customPluginContext: [
        getSlidePluginsContext()
    ]
});
...
```

**Step 2:** Configure the plugins you want to use in the paella player configuration.

```json
{
    "plugins": {
        ...
        "es.upv.paella.frameControlButtonPlugin": {
            "enabled": true,
            "side": "right",
            "order": 0
        }
        ... other plugin settings
    }
}
```

## Included plugins

Under construction
