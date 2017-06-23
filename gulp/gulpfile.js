const gulp = require('gulp'),
    concat = require('gulp-concat'), //- 多个文件合并为一个；  
    ugLify = require('gulp-uglify'), //压缩js  
    imageMin = require('gulp-imagemin'), //压缩图片  
    htmlMin = require('gulp-htmlmin'), //压缩html  
    changed = require('gulp-changed'), //检查改变状态  
    less = require('gulp-less'), //压缩合并less  
    minifyCSS = require('gulp-minify-css'),
    del = require('del'),
    pngquant = require('imagemin-pngquant'),
    babel = require("gulp-babel"),
    rev = require("gulp-rev"),
    revReplace = require('gulp-rev-replace'),
    revCollector = require('gulp-rev-collector'),
    browserSync = require("browser-sync").create(); //浏览器实时刷新  

//删除dist下的所有文件  
gulp.task('delete', function(cb) {
    return del(['dist/*', 'pages/*', 'rev/*'], cb);
})

// 压缩图片  
gulp.task('images', function() {
    return gulp.src('./app/images/*.*')
        .pipe(changed('dist/images', { hasChanged: changed.compareSha1Digest }))
        .pipe(imageMin({
            progressive: true, // 无损压缩JPG图片  
            svgoPlugins: [{ removeViewBox: false }], // 不移除svg的viewbox属性  
            interlaced: true,
            optimizationLevel: 5,
            multipass: true,
            accurate: true, //高精度模式
            quality: "high", //图像质量:low, medium, high and veryhigh;
            method: "smallfry", //网格优化:mpe, ssim, ms-ssim and smallfry;
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({ stream: true }));
});

//压缩css
gulp.task('css', function() {
    return gulp.src('./app/styleSheets/*.css')
        .pipe(changed('dist/styleSheets', { hasChanged: changed.compareSha1Digest }))
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest('dist/styleSheets')) //将会在css下生成main.css  
        .pipe(browserSync.reload({ stream: true }))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

//压缩js  
gulp.task("script", function() {
    return gulp.src('./app/javaScripts/**/*.js')
        .pipe(changed('dist/javaScripts', { hasChanged: changed.compareSha1Digest }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/javaScripts'))
        // .pipe(concat("all.js"))
        .pipe(rev())
        .pipe(ugLify())
        .pipe(gulp.dest('dist/javaScripts'))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
});

gulp.task('rev', ['script', 'css'], function(cb) {
    return gulp.src(['rev/**/*.json', 'app/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('pages'));
    cb();
});

//压缩html  
gulp.task('html', ['rev'], function() {
    var options = {
        removeComments: true, //清除HTML注释  
        collapseWhitespace: true, //压缩HTML  
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"  
        collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
        minifyJS: true, //压缩页面JS  
        minifyCSS: true, //压缩页面CSS  
    };

    return gulp.src('pages/**/*.html')
        .pipe(changed('dist', { hasChanged: changed.compareSha1Digest }))
        .pipe(rev())
        .pipe(revReplace({ replaceReved: true }))
        .pipe(htmlMin(options))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
});


//启动热更新  
gulp.task('serve', ['delete'], function() {
    gulp.start('html');
    4
    browserSync.init({
        port: 2016,
        server: {
            baseDir: ['dist']
        }
    });
    gulp.watch('./app/javaScripts/**/*.js', ['script']); //监控文件变化，自动更新  
    gulp.watch('./app/styleSheets/*.css', ['css']);
    gulp.watch('./app/**/*.html', ['html']);
    gulp.watch('./app/images/*.*', ['images']);
});

gulp.task('default', ['serve']);