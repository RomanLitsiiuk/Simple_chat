module.exports = {
  src: {
    scripts: 'src/**/*.js',
    html: 'src/**/*.html',
    images: 'src/img/**/*.{jpg,png,gif}',
    styles: 'src/scss/styles.scss',
    fonts: 'src/fonts/**/*.*'
  },
  dist: {
    scripts: 'dist/',
    html: 'dist/',
    images: 'dist/img/',
    styles: 'dist/css/',
    fonts: 'dist/fonts/'
  },
  watch: {
    scripts: 'src/**/*.js',
    html: 'src/**/*.html',
    images: 'src/img/**/*.{jpg,png,gif}',
    styles: 'src/**/*.scss'
  }
};
