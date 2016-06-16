'use strict';
var generators = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var lodash = require('lodash');

module.exports =  class SDSAngularGenerator extends generators.Base {
    constructor() {
        super(...arguments);
        this.lodash = lodash;

        sdsUtils.getNameArg(this, arguments[0]);
    }
    askFor(){
        var cb = this.async();

        var prompts = [];

        sdsUtils.addNamePrompt(this,prompts,'filter');

        this.prompt(prompts).then(props => {
            if (props.name){
                this.name = props.name;
            }
            sdsUtils.askForModuleAndDir('filter',this,false,cb);
        });
    }
    
    files(){
        sdsUtils.copyTpl('filter', 'filter.js',      this.name + '.js', this);
        sdsUtils.copyTpl('filter', 'filter-spec.js', this.name + '-spec.js', this);
    }
};
