
export default function getSlidePluginsContext() {
    return require.context("./plugins", true, /\.js/)
}
