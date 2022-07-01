// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);

module.exports = (() => {
    const defaultConfig = getDefaultConfig(__dirname);
    defaultConfig.resolver.assetExts.push("cjs");
    const { assetExts } = defaultConfig.resolver;
    return {
        resolver: {
        // Add .bin to assetExts.
        assetExts: [...assetExts, 'bin'],
        },
    };
})();