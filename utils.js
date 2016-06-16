var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var chalk = require('chalk');
var ngParseModule = require('ng-parse-module');
var jsonFile = require('jsonfile');
var appPath = 'app';
try {
    fs.accessSync('./bower.json', fs.F_OK);
    appPath = (jsonFile.readFileSync('./bower.json', {throws:false}) || {appPath:'app'}).appPath;
} catch (e) {
    var appPath = 'app';
}

module.exports.JS_MARKER           = "<!-- Add Javascript Above -->";
module.exports.JS_PARTIAL_MARKER   = "<!-- Add Partials Above -->";
module.exports.JS_MODAL_MARKER     = "<!-- Add Modals Above -->";
module.exports.JS_DIRECTIVE_MARKER = "<!-- Add Directives Above -->";
module.exports.JS_SERVICE_MARKER   = "<!-- Add Services Above -->";
module.exports.JS_FILTER_MARKER    = "<!-- Add Filters Above -->";

module.exports.LESS_MARKER           = "/* Add Component LESS Above */";
module.exports.LESS_PARTIAL_MARKER   = "/* Add Partial LESS Above */";
module.exports.LESS_MODAL_MARKER     = "/* Add Modal LESS Above */";
module.exports.LESS_DIRECTIVE_MARKER = "/* Add Directive LESS Above */";
module.exports.LESS_SERVICE_MARKER   = "/* Add Service LESS Above */";
module.exports.LESS_FILTER_MARKER    = "/* Add Filter LESS Above */";

module.exports.ROUTE_MARKER = "/* Add New Routes Above */";
module.exports.STATE_MARKER = "/* Add New States Above */";

module.exports.copyTpl = (type, tplPath, name, that) => {
    that.fs.copyTpl(that.templatePath(tplPath), that.destinationPath(that.dir, name), that);

    module.exports.inject(that.destinationPath(that.dir, name),that, that.module, type);
};

module.exports.inject = (filename,that,mod, type) => {
    //special case to skip unit tests
    if (_(filename).endsWith('-spec.js') ||
        _(filename).endsWith('_spec.js') ||
        _(filename).endsWith('-test.js') ||
        _(filename).endsWith('_test.js')) {
        return;
    }

    console.log(filename, mod.file);

    var ext = path.extname(filename);
    if (ext[0] === '.') {
        ext = ext.substring(1);
    }
    var config = that.config.get('inject')[ext];
    if (config) {
        var configFile = _.template(config.file)({module:path.basename(mod.file,'.js')});
        var injectFileRef = filename;
        if (configFile === 'index.html'){
            configFile = path.join(appPath,configFile);
            injectFileRef = path.relative(appPath,filename);
        }else if (config.relativeToModule) {
            configFile = path.join(path.dirname(mod.file),configFile);
            injectFileRef = path.relative(path.dirname(mod.file),filename);
        }
        injectFileRef = injectFileRef.replace(/\\/g,'/');
        var lineTemplate = _.template(config.template)({filename:injectFileRef});

        console.log(configFile, config.relativeToModule);

        module.exports.addToFile(configFile,lineTemplate,config[type + 'Marker'] || config.marker);
        that.log.writeln(chalk.green(' updating') + ' %s',path.basename(configFile));
    }
};

module.exports.addToFile = (filename,lineToAdd,beforeMarker) => {
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

module.exports.getParentModule = (dir) => {
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

    return module.exports.getParentModule(path.join(dir,'..'));
};

module.exports.askForModule = (type,that,cb) => {
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

    that.prompt(prompts).then(props => {

        var i = choices.indexOf(props.module);

        var mod;

        if (i === 0) {
            mod = mainModule;
        } else {
            mod = ngParseModule.parse(modules[i-1].file);
        }

        cb.bind(that)(mod);
    });
};

module.exports.askForDir = (type,that,mod,ownDir,cb) => {

    that.module = mod;
    that.appname = mod.name;
    that.dir = path.dirname(mod.file);

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
            validate: (dir) => {
                if (!mod.primary) {
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

    var dirPromptCallback = props => {

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
            }]).then(props => {
                if (props.isConfirmed){
                    cb();
                } else {
                    that.prompt(dirPrompt).then(dirPromptCallback);
                }
            });
        } else if (ownDir && fs.existsSync(that.dir)){
            //if the dir exists and this type of thing generally is inside its own dir, confirm it
            that.prompt([{
                name:'isConfirmed',
                type:'confirm',
                message:chalk.cyan(that.dir) + ' already exists.  Components of this type contain multiple files and are typically put inside directories of their own.  Continue?'
            }]).then(props => {
                if (props.isConfirmed){
                    cb();
                } else {
                    that.prompt(dirPrompt).then(dirPromptCallback);
                }
            });
        } else {
            cb();
        }

    };

    that.prompt(dirPrompt).then(dirPromptCallback);

};

module.exports.askForModuleAndDir = (type,that,ownDir,cb) => {
    that.name = that.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    module.exports.askForModule(type,that, (mod) => {
        module.exports.askForDir(type,that,mod,ownDir,cb);
    });
};

module.exports.getNameArg = (that,args) => {
    if (args.length > 0){
        that.name = args[0];
    }
};

module.exports.getCleanPath = (p, file) => {
    return path.join(p,file).replace(/\\/g,'/').replace(appPath + '/', '');
};

module.exports.getCleanRoute = (p, that) => {
    return path.join(p, '/').replace(/\\/g,'/').replace(appPath + '/' + that.config.get('partialDirectory') , '');
};

module.exports.addNamePrompt = (that,prompts,type) => {
    if (!that.name){
        prompts.splice(0,0,{
            name:'name',
            message: 'Enter a name for the ' + type + '.',
            validate: input => true
        });
    }
};

