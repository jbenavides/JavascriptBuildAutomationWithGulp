module.exports = function(){

    var client = './src/client/';
    var clientApp = client + 'app/';
    var server = './src/server/';
    var temp = './.tmp/';

    var config = {
        temp: temp,
        
        //all js to vet
        alljs: [
                './src/**/*.js',
           	    './*.js'
        ],
        build: './build/',
        client: client,
        css: temp + 'styles.css',
        fonts: './bower_components/font-awesome/fonts/**/*.*',
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js' //exclude
        ],

        less: client + 'styles/styles.less',
        server: server,
        browserReloadDelay: 1000,

        /* Bower and npm locations */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        /*Node settings */
        defaultPort: 7203,
        nodeServer: './src/server/app.js'
    };

    config.getWiredepDefaultOptions = function(){
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    return config;
};