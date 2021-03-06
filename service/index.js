'use strict';
var generators = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var chalk = require('chalk');
var lodash = require('lodash');

module.exports =  class SDSAngularGenerator extends generators.Base {
    constructor() {
        super(...arguments);
        this.lodash = lodash;
        
        sdsUtils.getNameArg(this, arguments[0]);
    }

    askFor() {
        var cb = this.async();
        var prompts = [];

        sdsUtils.addNamePrompt(this,prompts,'service');

        this.prompt(prompts).then(props => {
            if (props.name){
                this.name = props.name;
            }
            var inDirectory = (this.config.get("hasSpecFiles") !== false);
            sdsUtils.askForModuleAndDir('service',this,inDirectory,cb);
        });

    }
    files() {
        sdsUtils.copyTpl('service', 'service.js',     this.name + '.js', this);
        if (this.config.get("hasSpecFiles") !== false) {
            sdsUtils.copyTpl('service', 'service-spec.js', this.name + '-spec.js', this);
        }
    }
};
