'use strict';
var generators = require('yeoman-generator');
var path = require('path');
var sdsUtils = require('../utils.js');
var chalk = require('chalk');
var lodash = require('lodash');
var jsonFile = require('jsonfile');
var appPath =(jsonFile.readFileSync('./bower.json', {throws:false}) || {appPath:'app'}).appPath;

module.exports =  class SDSAngularGenerator extends generators.Base {
    constructor() {
        super(...arguments);
        this.lodash = lodash;
        this.uirouter = this.config.get('uirouter');
        this.routerModuleName = this.uirouter ? 'ui.router' : 'ngRoute';

        sdsUtils.getNameArg(this, arguments[0]);
    }

    askFor() {
        var cb = this.async();
        var that = this;

        var prompts = [
            {
                name:'dir',
                message:'Where would you like to create the module (must specify a subdirectory)?',
                default: (data) => {
                    return path.join(appPath + '/', that.name || data.name,'/');
                },
                validate: (value) => {
                    value = lodash.trim(value);
                    if (lodash.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                        return 'Please enter a subdirectory.';
                    }
                    return true;
                }
            }
        ];

        sdsUtils.addNamePrompt(this,prompts,'module');

        this.prompt(prompts).then(props => {
            if (props.name){
                this.name = props.name;
            }
            this.dir = path.join(props.dir,'/');
            cb();
        });
    }

    files() {

        var module = sdsUtils.getParentModule(path.join(this.dir,'..'));
        module.dependencies.modules.push(lodash.camelCase(this.name));
        module.save();
        this.log.writeln(chalk.green(' updating') + ' %s',path.basename(module.file));
        this.module = module;

        sdsUtils.copyTpl('module', 'module.js',     this.name + '.js', this);

        var modules = this.config.get('modules');
        if (!modules) {
            modules = [];
        }
        modules.push({name:lodash.camelCase(this.name),file:path.join(this.dir,this.name + '.js')});
        this.config.set('modules',modules);
        this.config.save();
    }
    
};
