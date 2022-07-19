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

### Frame control button plugin

Displays a list of available slides, and allows you to navigate to the corresponding time instant with each slide.

When the user hovers the mouse cursor over the slide thumbnails, the slide is displayed in full size over one of the videos. The video where the slide is displayed is the one whose `content` attribute matches the `targetContent` attribute of the plugin configuration.

```json
{
    "es.upv.paella.frameControlButtonPlugin": {
        "enabled": true,
        "targetContent": "presentation"
    },
    ...
}
```

**Exported as** `FrameControlButtonPlugin`.

**Icon customization data:**

- Plugin identifier: `es.upv.paella.frameControlButtonPlugin`
- Icon names:
    * `photoIcon`: icon in the button bar.
    * `arrowLeftIcon`: arrow left, in slides panel.
    * `arrowRightIcon`: arrow right, in slides panel.

### Arrow slide navigator

It allows you to add forward and backward navigation controls over one of the videos, allowing you to jump to the next and previous slide's time snapshot, respectively.

The video where the arrow buttons are placed is the one whose `content` attribute matches the `target` attibute in the configuration. This attribute is a list, where we will place the content tags in order. In this way, if in the current video there is no stream corresponding to the first tag, the corresponding video with the second tag will be used, and so on.

```json
{
    "es.upv.paella.arrowSlidesNavigator": {
        "enabled": true,
        "target": [
            "presentation",
            "presenter"
        ]
    },
    ...
}
```

**Exported as** `ArrowslidesPlugin`.
**Icon customization data:**

- Plugin identifier: `es.upv.paella.frameControlButtonPlugin`
- Icon names:
    * `arrowLeftIcon`: arrow left, in slides panel.
    * `arrowRightIcon`: arrow right, in slides panel.


### Slide Map Progress Bar Plugin

Displays a mark in the progress indicator where there is a slide. It is possible to customize the color of the marks when the mouse is over the bar or outside the bar, and the width of the marks. You can also customize whether the marks are drawn above the progress indicator or below it.

```json
{
    "es.upv.paella.slideMapProgressBarPlugin": {
        "enabled": true,
        "markColor": {
            "mouseOut": "#0A0A0A",
            "mouseHover": "#A9A9A9"
        },
        "markWidth": 3,
        "drawBackground": true
    },
    ...
}
```

**Exported as** `SlideMapProgressBarPlugin`
