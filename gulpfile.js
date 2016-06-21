var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var $ = require('gulp-load-plugins')({lazy:true});
var port = process.env.PORT || config.defaultPort;

gulp.task('vet', function(){
    log('Analyzing source with JSHint and JSCS');
    gulp.src(config.alljs)
            .pipe($.if(args.verbose, $.print())) //condition comes from command line, so we use args
            .pipe($.jscs())
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {verbose : true}))
            .pipe($.jshint.reporter('fail'));
});


gulp.task('styles', ['clean-styles'], function(){
    log('Compiling Less --> CSS');

    return gulp
            .src(config.less)
            .pipe($.plumber())
            .pipe($.less())           
            .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
            .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function(){    
    var files = config.temp + '**/*.css';
    clean(files);
});

gulp.task('less-watcher', function(){
    gulp.watch([config.less], ['styles']);
});


gulp.task('wiredep', function(){
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
            .src(config.index)
            .pipe(wiredep(options))
            .pipe($.inject(gulp.src(config.js)))
            .pipe(gulp.dest(config.client));
});


gulp.task('inject', ['wiredep', 'styles'], function(){
    log('Wire up the app css into the html, and call wiredep');  

    return gulp
            .src(config.index)            
            .pipe($.inject(gulp.src(config.css)))
            .pipe(gulp.dest(config.client));
});

gulp.task('serve-dev',['inject'], function(){
    
    var isDev = true;

    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
            .on('restart', ['vet'], function(ev){
                log('*** nodemon restarted ***');
                log('files changed on restart: \n' + ev);
            })
            .on('start', function(){
                log('*** nodemon strated ***');
            })
            .on('crash', function(){
                log('*** nodemon crashed: script crasehd for some reason ***');
            })
            .on('exit', function(){
                log('*** nodemon exited cleanly ***');
            });

});


///////////

function errorLogger(error){
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}

function clean(path){
    log('Cleaning: ' + $.util.colors.blue(path));
    return del(path).then(log('delete done'));
}

function log(msg){
    if(typeof(msg) === 'object'){
        for(var item in msg){
            if(msg.hasOwnProperty(item)){
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    }else{
        $.util.log($.util.colors.blue(msg));
    }
}