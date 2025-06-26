module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']
    })
  ]
};
