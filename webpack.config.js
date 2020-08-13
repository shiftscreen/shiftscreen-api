module.exports = function(options) {
  return {
    ...options,
    module: {
      rules: [
        ...options.module.rules,
        {
          test: /\.txt$/i,
          use: 'raw-loader',
        },
      ],
    }
  }
};
