module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Оставь, если используешь Reanimated
      '@babel/plugin-proposal-export-namespace-from',
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './',
          },
        },
      ],
    ],
  };
};