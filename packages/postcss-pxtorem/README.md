# @tnnevol/postcss-pxtorem

这是一个 [postcss](https://www.npmjs.com/package/postcss) 插件。[px2rem-postcss](https://github.com/songsiqi/px2rem-postcss)因为长期未做更新，导致 [postcss](https://www.npmjs.com/package/postcss)@latest 中无法使用，所以改写一个。

## 使用方式

### Node

```
var postcss = require('postcss');
var px2rem = require('@tnnevol/postcss-pxtorem');
var originCssText = '...';
var newCssText = postcss().use(pxtorem({remUnit: 64})).process(originCssText).css;
```

### Gulp

```
npm install gulp-postcss
```

```
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var pxtorem = require('postcss-pxtorem');

gulp.task('default', function() {
  var processors = [pxtorem({remUnit: 75})];
  return gulp.src('./src/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'));
});
```

### Webpack

```
npm install postcss-loader
```

```
var pxtorem = require('postcss-pxtorem');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: function() {
    return [pxtorem({remUnit: 75})];
  }
}
```

### Grunt

```
npm install grunt-postcss
```

```
module.exports = function(grunt) {
  grunt.initConfig({
    postcss: {
      options: {
        processors: [
          pxtorem({remUnit: 75})
        ]
      },
      dist: {
        src: 'src/*.css',
        dest: 'build'
      }
    }
  });
  grunt.loadNpmTasks('grunt-postcss');
  grunt.registerTask('default', ['postcss']);
}
```

## License

MIT