'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var mkdirp = require('mkdirp');

var SdsAngularGenerator = module.exports = function SdsAngularGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

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
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SdsAngularGenerator, yeoman.generators.Base);

SdsAngularGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var prompts = [{
        name: 'appname',
        message: 'What would you like the angular app/module name to be?',
        default: path.basename(process.cwd())
    }];

    this.prompt(prompts, function (props) {
        this.appname = props.appname;
        cb();
    }.bind(this));
};

SdsAngularGenerator.prototype.askForAppPath = function askFor() {
    var cb = this.async();

    var prompts = [{
        name: 'appdir',
        message: 'Where do you want to put the app folder?',
        default: 'app'
    }];

    this.prompt(prompts, function (props) {
        this.appdir = props.appdir;
        var dist = props.appdir.split('/');
        dist.pop();
        dist.push('dist');
        this.distdir = dist.join('/');
        cb();
    }.bind(this));
};

SdsAngularGenerator.prototype.askForBootswatch = function askFor() {
    var cb = this.async();
    var themes = [
        'None', 'admin-lte',
        'amelia', 'cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly',
        'fonts', 'journal', 'lumen', 'paper', 'readable', 'sandstone',
        'simplex', 'slate', 'spacelab', 'superhero', 'united', 'yeti'
    ];

    var prompts = [{
        name: 'bootswatch',
        type: 'list',
        message: 'Which theme would you like to include?',
        default: 0,
        choices: themes
    }];

    this.prompt(prompts, function (props) {
        if (props.bootswatch === 'admin-lte'){
            this.adminlte = true;
        }else if (props.bootswatch !== 'None') {
            this.bootswatch = props.bootswatch;
        }
        cb();
    }.bind(this));
};

SdsAngularGenerator.prototype.askForUiRouter = function askFor() {
    var cb = this.async();

    var prompts = [{
        name: 'router',
        type:'list',
        message: 'Which router would you like to use?',
        default: 0,
        choices: ['Standard Angular Router','New Angular Router']
    }];

    this.prompt(prompts, function (props) {
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
};

SdsAngularGenerator.prototype.askForAuth = function askFor() {
    var cb = this.async();

    var prompts = [{
        name: 'router',
        type:'list',
        message: 'Do you want to include an oauth authentication starter?',
        default: 0,
        choices: ['No','Yes']
    }];

    this.prompt(prompts, function (props) {
        if (props.router === 'Yes') {
            this.hasAuth  = true;
        } else {
            this.hasAuth = false;
        }
        this.config.set('hasAuth',this.hasAuth);
        cb();
    }.bind(this));
};

SdsAngularGenerator.prototype.app = function app() {
    mkdirp.sync('./' + this.appdir);
    mkdirp.sync('./' + this.distdir);

    this.directory('skeleton/','./');
    this.directory('skeleton_app/','./' + this.appdir);
    if (this.hasAuth){
        this.directory('auth/','./' + this.appdir);
    }

    //move app dir to correct location
};

SdsAngularGenerator.prototype.afterApp = function app(){

    sdsUtils.dependencies(this);
};