module.exports = function (api) {
  api.cache(true);
  const plugins = [
    'react-native-reanimated/plugin',
    ["inline-import", { "extensions": [".sql"] }],
  ];

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxImportSource: 'nativewind'
        }
      ],
      'nativewind/babel',
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
    plugins,
  };
};
