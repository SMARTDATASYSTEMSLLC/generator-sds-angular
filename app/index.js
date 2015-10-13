'use strict';
var path = require('path');
var generators = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var mkdirp = require('mkdirp');
var lodash = require('lodash');
var jsonFile = require('jsonfile');
var chalk = require('chalk');

module.exports = generators.Base.extend({
    constructor: function (){
        generators.Base.apply(this, arguments);

        this.on('end', function () {
            this.config.set('partialDirectory','partial/');
            this.config.set('modalDirectory','partial/');
            this.config.set('directiveDirectory','directive/');
            this.config.set('filterDirectory','filter/');
            this.config.set('serviceDirectory','service/');
            var inject = {
                js: {
                    relativeToModule: true,
                    file: 'index.html',
                    marker: sdsUtils.JS_MARKER,
                    directiveMarker: sdsUtils.JS_DIRECTIVE_MARKER,
                    filterMarker: sdsUtils.JS_FILTER_MARKER,
                    modalMarker: sdsUtils.JS_MODAL_MARKER,
                    partialMarker: sdsUtils.JS_PARTIAL_MARKER,
                    serviceMarker: sdsUtils.JS_SERVICE_MARKER,
                    template: '<script src="<%= filename %>"></script>'
                },
                less: {
                    relativeToModule: true,
                    file: '<%= module %>.less',
                    marker: sdsUtils.LESS_MARKER,
                    directiveMarker: sdsUtils.LESS_DIRECTIVE_MARKER,
                    filterMarker: sdsUtils.LESS_FILTER_MARKER,
                    modalMarker: sdsUtils.LESS_MODAL_MARKER,
                    partialMarker: sdsUtils.LESS_PARTIAL_MARKER,
                    serviceMarker: sdsUtils.LESS_SERVICE_MARKER,
                    template: '@import "<%= filename %>";'
                }
            };
            this.config.set('inject',inject);
            this.config.save();

        });

        this.lodash = lodash;

        this.pkg = jsonFile.readFileSync(path.join(__dirname, '../package.json'), {throws:false});
    },
    askFor: function () {
        var cb = this.async();

        this.prompt({
            name: 'appname',
            message: 'What would you like the angular app/module name to be?',
            default: path.basename(process.cwd())
        }, function (props) {
            this.appname = props.appname;
            cb();
        }.bind(this));
    },
    askForAppPath: function() {
        var cb = this.async();

        this.prompt({
            name: 'appdir',
            message: 'Where do you want to put the app folder?',
            default: 'app'
        }, function (props) {
            this.appdir = props.appdir;
            var dist = props.appdir.split('/');
            dist.pop();
            dist.push('dist');
            this.distdir = dist.join('/');
            cb();
        }.bind(this));
    },
    askForBootswatch: function () {
        var cb = this.async();
        var themes = [
            'None', 'admin-lte',
            'amelia', 'cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly',
            'fonts', 'journal', 'lumen', 'paper', 'readable', 'sandstone',
            'simplex', 'slate', 'spacelab', 'superhero', 'united', 'yeti'
        ];

        this.prompt({
            name: 'bootswatch',
            type: 'list',
            message: 'Which theme would you like to include?',
            default: 0,
            choices: themes
        }, function (props) {
            if (props.bootswatch === 'admin-lte'){
                this.adminlte = true;
            }else if (props.bootswatch !== 'None') {
                this.bootswatch = props.bootswatch;
            }
            cb();
        }.bind(this));
    },
    askForUiRouter: function() {
        var cb = this.async();

        this.prompt({
            name: 'router',
            type:'list',
            message: 'Which router would you like to use?',
            default: 0,
            choices: ['Standard Angular Router','New Angular Router']
        }, function (props) {
            if (props.router === 'New Angular Router') {
                this.uirouter = true;

                this.routerModuleName = 'ngNewRouter';
                this.routerViewDirective = 'ng-viewport';
            } else {
                this.uirouter = false;

                this.routerModuleName = 'ngRoute';
                this.routerViewDirective = 'ng-view';
            }
            this.config.set('uirouter',this.uirouter);
            cb();
        }.bind(this));
    },
    askForAuth: function () {
        var cb = this.async();

        this.prompt({
            name: 'router',
            type:'list',
            message: 'Do you want to include an oauth authentication starter?',
            default: 0,
            choices: ['No','Yes']
        }, function (props) {
            this.hasAuth = props.router === 'Yes';
            this.config.set('hasAuth',this.hasAuth);
            cb();
        }.bind(this));
    },
    app: function() {
        var cb = this.async();
        mkdirp.sync('./' + this.appdir);
        mkdirp.sync('./' + this.distdir);

        this.fs.copy   (this.templatePath('skeleton/.bowerrc'),     this.destinationPath('.bowerrc'));
        this.fs.copy   (this.templatePath('skeleton/.editorconfig'),this.destinationPath('.editorconfig'));
        this.fs.copy   (this.templatePath('skeleton/.gitignore'),   this.destinationPath('.gitignore'));
        this.fs.copy   (this.templatePath('skeleton/.jshintrc'),    this.destinationPath('.jshintrc'));
        this.fs.copy   (this.templatePath('skeleton/.npmignore'),   this.destinationPath('.npmignore'));
        this.fs.copy   (this.templatePath('skeleton/Gruntfile.js'), this.destinationPath('Gruntfile.js'));
        this.fs.copyTpl(this.templatePath('skeleton/bower.json'),   this.destinationPath('bower.json'), this);
        this.fs.copyTpl(this.templatePath('skeleton/package.json'), this.destinationPath('package.json'), this);
        this.fs.copyTpl(this.templatePath('skeleton_app/'),this.destinationPath('./' + this.appdir), this);
        if (this.hasAuth){
            this.fs.copyTpl(this.templatePath('auth/'),    this.destinationPath('./' + this.appdir), this);
        }

        //move app dir to correct location

        this._writeFiles(cb)
    },
    npm: function(){
        this.npmInstall([
            "autoprefixer",
            "grunt",
            "grunt-angular-templates",
            "grunt-auto-install",
            "grunt-autoprefixer",
            "grunt-browser-output",
            "grunt-concurrent",
            "grunt-connect-proxy",
            "grunt-contrib-clean",
            "grunt-contrib-concat",
            "grunt-contrib-connect@~0.10",
            "grunt-contrib-copy",
            "grunt-contrib-cssmin",
            "grunt-contrib-htmlmin",
            "grunt-contrib-jshint",
            "grunt-contrib-less",
            "grunt-contrib-uglify",
            "grunt-contrib-watch",
            "grunt-dom-munger",
            "grunt-filerev",
            "grunt-karma",
            "grunt-ng-annotate",
            "grunt-usemin",
            "grunt-wiredep",
            "jshint-stylish",
            "karma",
            "karma-jasmine",
            "karma-mocha-reporter",
            "karma-phantomjs-launcher",
            "load-grunt-tasks",
            "lodash",
            "time-grunt"
        ], { 'saveDev': true });


        var packages = [
            "angular#~1",
            "angular-animate#~1",
            "angular-resource#~1",
            "angular-messages#~1",
            "angular-cookies#~1",
            "angular-mocks#~1",
            "angular-sanitize#~1",
            "angular-bootstrap#~0.13",
            "moment",
            "lodash",
            "bootstrap",
            "font-awesome",
            "blockui"
        ];

        if(this.uirouter) {
            packages.push("angular-router")
        } else {
            packages.push("angular-route")
        }
        if (this.hasAuth){
            packages.push("angular-jwt")
        }

        if (this.bootswatch){
            packages.push("bootswatch")
        }
        if (this.adminlte){
            packages.push("admin-lte")
        }

        this.bowerInstall(packages, {save: true}, function (err){
            if(err){
                console.log(chalk.red('There was an error running bower!'));
                console.log(chalk.red('You will need to manually check your dependency versions.'));
                console.log(chalk.red('To solve this error, please run the following commands:'));
                console.log();
                console.log('npm config set prefix /usr/local');
                console.log('npm install -g bower');
                console.log();
                jsonFile.spaces = 2;
                var bower= jsonFile.readFileSync(this.destinationPath('bower.json'), {throws:false});
                bower.dependencies = lodash.reduce(packages, function (r,pkg){
                    pkg = pkg.split('#');
                    r[pkg[0]] = pkg[1] || '*';
                    return r;
                }, {});
                jsonFile.writeFileSync(this.destinationPath('bower.json'), bower);

            }
        });
    }
});

