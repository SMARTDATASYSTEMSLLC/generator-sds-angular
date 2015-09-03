var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var chalk = require('chalk');
_.str = require('underscore.string');
_.mixin(_.str.exports());
var ngParseModule = require('ng-parse-module');
var appExists = fs.existsSync('./.yo-rc.json') && fs.existsSync('./bower.json');
var appPath = (appExists && JSON.parse(fs.readFileSync('./bower.json')).appPath) || 'app';

exports.JS_MARKER           = "<!-- Add Javascript Above -->";
exports.JS_PARTIAL_MARKER   = "<!-- Add Partials Above -->";
exports.JS_MODAL_MARKER     = "<!-- Add Modals Above -->";
exports.JS_DIRECTIVE_MARKER = "<!-- Add Directives Above -->";
exports.JS_SERVICE_MARKER   = "<!-- Add Services Above -->";
exports.JS_FILTER_MARKER    = "<!-- Add Filters Above -->";

exports.LESS_MARKER           = "/* Add Component LESS Above */";
exports.LESS_PARTIAL_MARKER   = "/* Add Partial LESS Above */";
exports.LESS_MODAL_MARKER     = "/* Add Modal LESS Above */";
exports.LESS_DIRECTIVE_MARKER = "/* Add Directive LESS Above */";
exports.LESS_SERVICE_MARKER   = "/* Add Service LESS Above */";
exports.LESS_FILTER_MARKER    = "/* Add Filter LESS Above */";

exports.ROUTE_MARKER = "/* Add New Routes Above */";
exports.STATE_MARKER = "/* Add New States Above */";

exports.addToFile = function(filename,lineToAdd,beforeMarker){
	try {
		var fullPath = path.resolve(process.cwd(),filename);
		var fileSrc = fs.readFileSync(fullPath,'utf8');

		var indexOf = fileSrc.indexOf(beforeMarker);
        var lineStart = fileSrc.substring(0,indexOf).lastIndexOf('\n') + 1;
        var indent = fileSrc.substring(lineStart,indexOf);
		fileSrc = fileSrc.substring(0,indexOf) + lineToAdd + "\n" + indent + fileSrc.substring(indexOf);

		fs.writeFileSync(fullPath,fileSrc);
	} catch(e) {
		throw e;
	}
};

exports.processTemplates = function(name,dir,type,that,defaultDir,configName,module){
    var styleType = that.config.get("cssExt");
    console.log('styletype', styleType);

    if (!defaultDir) {
        defaultDir = 'templates'
    }
    if (!configName) {
        configName = type + 'Templates';
    }

    var templateDirectory = path.join(path.dirname(that.resolved),defaultDir);
    if(that.config.get(configName)){
        templateDirectory = path.join(process.cwd(),that.config.get(configName));
    }
    _.chain(fs.readdirSync(templateDirectory))
        .filter(function(template){
            return template[0] !== '.';
        })
        .each(function(template){
            var customTemplateName = template.replace(type,name);
            var templateFile = path.join(templateDirectory,template);

            // Handle renaming less/sass/css
            if (styleType && customTemplateName.slice(-5) === '.less'){
                customTemplateName = customTemplateName.replace('.less', styleType);
            }

            //create the file
            that.template(templateFile,path.join(dir,customTemplateName));
            //inject the file reference into index.html/app.less/etc as appropriate

            console.log('dir', dir);
            console.log('customTemplateName', customTemplateName);
            exports.inject(path.join(dir,customTemplateName),that,module, type);
        });
};

exports.inject = function(filename,that,module, type) {
    //special case to skip unit tests
    if (_(filename).endsWith('-spec.js') ||
        _(filename).endsWith('_spec.js') ||
        _(filename).endsWith('-test.js') ||
        _(filename).endsWith('_test.js')) {
        return;
    }

    console.log(filename, module.file);

    var ext = path.extname(filename);
    if (ext[0] === '.') {
        ext = ext.substring(1);
    }
    var config = that.config.get('inject')[ext];
    if (config) {
        var configFile = _.template(config.file)({module:path.basename(module.file,'.js')});
        var injectFileRef = filename;
        if (configFile === 'index.html'){
            configFile = path.join(appPath,configFile);
            injectFileRef = path.relative(appPath,filename);
        }else if (config.relativeToModule) {
            configFile = path.join(path.dirname(module.file),configFile);
            injectFileRef = path.relative(path.dirname(module.file),filename);
        }
        injectFileRef = injectFileRef.replace(/\\/g,'/');
        var lineTemplate = _.template(config.template)({filename:injectFileRef});

        console.log(configFile, config.relativeToModule);

        exports.addToFile(configFile,lineTemplate,config[type + 'Marker'] || config.marker);
        that.log.writeln(chalk.green(' updating') + ' %s',path.basename(configFile));
    }
};

exports.injectRoute = function(moduleFile,uirouter,name,route,routeUrl,that){

    routeUrl = routeUrl.replace(/\\/g,'/');

    if (uirouter){
        var code = '$stateProvider.state(\''+name+'\', {\n        url: \''+route+'\',\n        templateUrl: \''+routeUrl+'\'\n    });';
        exports.addToFile(moduleFile,code,exports.STATE_MARKER);
    } else {
        exports.addToFile(moduleFile,'$routeProvider.when(\''+route+'\',{\n' +
        '        templateUrl: \''+routeUrl+'\',\n' +
        '        controllerAs: \'vm\',\n' +
        '        controller: \'' + _.camelize(_.classify(name)) + 'Ctrl\'\n' +
        '});',exports.ROUTE_MARKER);
    }

    that.log.writeln(chalk.green(' updating') + ' %s',path.basename(moduleFile));

};

exports.getParentModule = function(dir){
    //starting this dir, find the first module and return parsed results
    if (fs.existsSync(dir)) {
        var files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
            if (path.extname(files[i]) !== '.js') {
                continue;
            }
            var results = ngParseModule.parse(path.join(dir,files[i]));
            if (results) {
                return results;
            }
        }
    }

    if (fs.existsSync(path.join(dir,'.yo-rc.json'))) {
        //if we're in the root of the project then bail
        return;
    }

    return exports.getParentModule(path.join(dir,'..'));
};

exports.askForModule = function(type,that,cb){
    var modules = that.config.get('modules');
    var mainModule = ngParseModule.parse(appPath + '/app.js');
    mainModule.primary = true;

    if (!modules || modules.length === 0) {
        cb.bind(that)(mainModule);
        return;
    }

    var choices = _.pluck(modules,'name');
    choices.unshift(mainModule.name + ' (Primary Application Module)');

    var prompts = [
        {
            name:'module',
            message:'Which module would you like to place the new ' + type + '?',
            type: 'list',
            choices: choices,
            default: 0
        }
    ];

    that.prompt(prompts, function (props) {

        var i = choices.indexOf(props.module);

        var module;

        if (i === 0) {
            module = mainModule;
        } else {
            module = ngParseModule.parse(modules[i-1].file);
        }

        cb.bind(that)(module);
    }.bind(that));

};

exports.askForDir = function(type,that,module,ownDir,cb){

    that.module = module;
    that.appname = module.name;
    that.dir = path.dirname(module.file);

    var configedDir = that.config.get(type + 'Directory');
    if (!configedDir){
        configedDir = '.';
    }
    var defaultDir = path.join(that.dir,configedDir,'/');
    defaultDir = path.relative(process.cwd(),defaultDir);

    if (ownDir) {
        defaultDir = path.join(defaultDir,that.name);
    }

    defaultDir = path.join(defaultDir,'/');

    var dirPrompt = [
        {
            name:'dir',
            message:'Where would you like to create the '+type+' files?',
            default: defaultDir,
            validate: function(dir){
                if (!module.primary) {
                    //ensure dir is in module dir or subdir of it
                    dir = path.resolve(dir);
                    if (path.relative(that.dir,dir).substring(0,2) === '..') {
                        return 'Files must be placed inside the module directory or a subdirectory of the module.'
                    }
                }
                return true;
            }
        }
    ];

    var dirPromptCallback = function (props) {

        that.dir = path.join(props.dir,'/');
        var dirToCreate = that.dir;
        if (ownDir){
            dirToCreate = path.join(dirToCreate, '..');
        }

        if (!fs.existsSync(dirToCreate)) {
            that.prompt([{
                name:'isConfirmed',
                type:'confirm',
                message:chalk.cyan(dirToCreate) + ' does not exist.  Create it?'
            }],function(props){
                if (props.isConfirmed){
                    cb();
                } else {
                    that.prompt(dirPrompt,dirPromptCallback);
                }
            });
        } else if (ownDir && fs.existsSync(that.dir)){
            //if the dir exists and this type of thing generally is inside its own dir, confirm it
            that.prompt([{
                name:'isConfirmed',
                type:'confirm',
                message:chalk.cyan(that.dir) + ' already exists.  Components of this type contain multiple files and are typically put inside directories of their own.  Continue?'
            }],function(props){
                if (props.isConfirmed){
                    cb();
                } else {
                    that.prompt(dirPrompt,dirPromptCallback);
                }
            });
        } else {
            cb();
        }

    };

    that.prompt(dirPrompt,dirPromptCallback);

};

exports.askForModuleAndDir = function(type,that,ownDir,cb) {
    that.name = that.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    exports.askForModule(type,that,function(module){
        exports.askForDir(type,that,module,ownDir,cb);
    });
};

exports.getNameArg = function(that,args){
    if (args.length > 0){
        that.name = args[0];
    }
};

exports.getCleanPath = function (p, file){
    return path.join(p,file).replace(/\\/g,'/').replace(appPath + '/', '');
};

exports.getCleanRoute = function (p, that){
    return path.join(p, '/').replace(/\\/g,'/').replace(appPath + '/' + that.config.get('partialDirectory') , '');
};

exports.addNamePrompt = function(that,prompts,type){

    if (!that.name){
        prompts.splice(0,0,{
            name:'name',
            message: 'Enter a name for the ' + type + '.',
            validate: function(input){
                return true;
            }
        });
    }
};

exports.dependencies = function (that){
    that.npmInstall([
        "autoprefixer@^4.0.0",
        "grunt@~0.4",
        "grunt-angular-templates@~0.5",
        "grunt-auto-install@^0.2.2",
        "grunt-autoprefixer@^2.0.0",
        "grunt-browser-output@0.1.0",
        "grunt-concurrent@^1.0.0",
        "grunt-connect-proxy@^0.1.11",
        "grunt-contrib-clean@~0.5",
        "grunt-contrib-concat@~0.3",
        "grunt-contrib-connect@~0.6",
        "grunt-contrib-copy@~0.5",
        "grunt-contrib-cssmin@~0.7",
        "grunt-contrib-htmlmin@~0.1",
        "grunt-contrib-jshint@~0.10",
        "grunt-contrib-less@~0.8",
        "grunt-contrib-uglify@~0.6",
        "grunt-contrib-watch@~0.6",
        "grunt-dom-munger@~3.4",
        "grunt-filerev@^2.1.2",
        "grunt-google-cdn@^0.4.3",
        "grunt-karma@~0.8.3",
        "grunt-ng-annotate@~0.5",
        "grunt-usemin@^2.6.2",
        "jldevries/grunt-usemin-list",
        "grunt-wiredep@~1.9",
        "jshint-stylish@^1.0.0",
        "karma@~0.12.6",

        "load-grunt-tasks@~0.2",
        "lodash@^2.4.1",
        "time-grunt@^1.0.0",
        "zeparser@0.0.7"
    ], { 'saveDev': true }, function (){
        that.npmInstall(["karma-chrome-launcher@~0.1.3",
            "karma-cli@0.0.4",
            "karma-firefox-launcher@~0.1.3",
            "karma-jasmine@~0.1.5",
            "karma-mocha-reporter@~0.2.5",
            "karma-phantomjs-launcher@~0.1.4"
        ], { 'saveDev': true });

    });
    //
    //that.bowerInstall([
    //        "angular#~1.4",
    //        "angular-animate#~1.4",
    //        "angular-resource#~1.4",
    //        "angular-messages#~1.4",
    //        "angular-cookies#~1.4",
    //        "angular-mocks#~1.4",
    //        "angular-sanitize#~1.4",
    //        "angular-ui-utils#~0.1",
    //        "angular-bootstrap#~0.11",
    //        "moment#~2",
    //        "font-awesome#~4",
    //        "blockui#*",
    //        "lodash#~3",
    //        "bootstrap#~3"
    //    ], {save: true}
    //);
    //
    //if (that.uirouter){
    //    that.bowerInstall("angular/router", {save: true});
    //}else{
    //    that.bowerInstall("angular-route#~1", {save: true});
    //}
    //
    //if(that.hasAuth){
    //    that.bowerInstall("angular-jwt#~0.0.7", {save: true});
    //}
    //
    //if(that.bootswatch){
    //    that.bowerInstall("bootswatch#~3", {save: true});
    //}
    //
    //if(that.adminlte){
    //    that.bowerInstall("admin-lte#~2", {save: true});
    //}

};
