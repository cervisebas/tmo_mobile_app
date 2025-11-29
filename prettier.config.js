module.exports = {
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
  printWidth: 80,
  bracketSameLine: false,
  endOfLine: 'auto',

  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindAttributes: ['className'],
};
