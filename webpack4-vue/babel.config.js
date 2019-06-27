module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        "corejs": 2
      }
    ]
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import'
  ]
}