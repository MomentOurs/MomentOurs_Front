module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo', '@babel/preset-react'],
        plugins: [
            'react-native-reanimated/plugin',
            ['module:react-native-dotenv', {
                "moduleName": "@env",
                "path": ".env",
                "safe": true,
                "allowUndefined": false
            }]
        ],
    };
};
