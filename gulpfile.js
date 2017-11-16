
var config = {
	buildFilesFoldersRemove:[
		'build/scss/',
		'build/js/!(*.min.js)',
		'build/bower.json',
		'build/bower_components/',
		'build/maps/'
	]
};


////////////////////////// required //////////////////////////

var gulp = require('gulp'),
	uglify = require('gulp-uglify'), // minifikuje .js
	browserSync = require('browser-sync'), //synchronizuje prehliadače
	reload = browserSync.reload, //realtime reload browseru
	compass = require('gulp-compass'), //konvertuje scss na css
	// useref = require('gulp-useref'); // spája css subory do jednhéo
	del = require('del'),
	rename = require('gulp-rename'); // doplni k minifikovanynm suborom napr .min.css
  sass = require('gulp-ruby-sass'); // kompiluje sass na css


////////////////////////// required end //////////////////////////



////////////////////////// tasks //////////////////////////

// Script tasks //
gulp.task('scripts', function() {
 gulp.src(['app/js/**/*.js', '!app/js/**/*min.js'])
 	.pipe(rename({suffix:'.min'}))
 	.pipe(uglify())
 	.pipe(gulp.dest('app/js'));
});


// Compass / sass tasks - prekompiluje scss na css //
// gulp.task('compass', function() {
// 	gulp.src('app/scss/*.scss')
// 	.pipe(compass({
// 		config_file: './config.rb', // v configu sa nastavuje compressed pre minifikáciu alebo expanded
// 		css: 'app/css',
// 		sass: 'app/scss',
// 		require: ['susy']
//
// 	}))
// 	.pipe(gulp.dest('app/css/scssToCss/'))
// 	.pipe(reload({stream:true}));
//
// });

// html task //
gulp.task('html', function(){
    gulp.src('app/**/*.html')
    .pipe(reload({stream:true}));
});

// browser-sync task //
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./app/"
        }
    });
});

//watch for css and sass changes
gulp.task('css', function() {
    gulp.src('app/css/**/**.css')
		.pipe(reload({stream:true}));
});


// kompiluje sass na css
var paths = {
    sassSrcPath: ['app/sass/**/*.sass'],
    sassDestPath: 'app/css/sassToCss/',
    sassImportsPath: ['app/sass/**/*.sass']
};
gulp.task('sass', function () {
    return sass(paths.sassSrcPath, {
            style: 'expanded',
            loadPath: [paths.sassImportsPath]
        })
				.pipe(rename({suffix:'.compiled'}))
        .pipe(gulp.dest(paths.sassDestPath));
});

// watch tasks //
gulp.task('watch', function() {
	gulp.watch('app/js/**/*.js', ['scripts']);
	// gulp.watch('app/scss/**/*.scss', ['compass']);
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/*.html', ['html']);
	gulp.watch('app/css/**/**.css', ['css'])
});



// default task //
gulp.task('default', ['scripts', 'sass', 'html', 'browser-sync', 'watch']);

////////////////////////// tasks //////////////////////////

////////////////////////// final_build tasks //////////////////////////

// zmaže všetky súbory z final_build
gulp.task('build:cleanfolder', function (cb) {
	del([
		'build/**'
	], cb());
});


// zoberie všetky veci z /app a skopiruje ich do zložky final_build
gulp.task('build:copy', ['build:cleanfolder'], function(){
    return gulp.src('app/**/*/')
    .pipe(gulp.dest('build/'));
});

// remove unwanted build files / treba sem vložiť všetky adresa z ktorych chceme vymazať subory pre finalny export buildu
gulp.task('build:remove', ['build:copy'], function (cb) {
	del(config.buildFilesFoldersRemove, cb);
});

gulp.task('build', ['build:copy', 'build:remove'], function() {
  /* The .on('end', callback) above ensures that the "build" task has fully completed. It's
     now safe to use "dist/abc.xyz". */
});

////////////////////////// final_build tasks //////////////////////////
