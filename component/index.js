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

        var prompts = [{
            type: 'confirm',
            name: 'needpartial',
            message: 'Does this component need an external html file (i.e. partial)?',
            default: true
        }];

        sdsUtils.addNamePrompt(this, prompts, 'component');

        this.prompt(prompts).then(props => {
            if (props.name) {
                this.name = props.name;
            }
            this.needpartial = props.needpartial;
            sdsUtils.askForModuleAndDir('directive', this, true, cb);
        });
    }
    
    files(){
        var styleExt = (this.config.get("cssExt") || 'less').replace('.', '');
        this.htmlPath = sdsUtils.getCleanPath(this.dir, this.name + '.html');

        if (this.needpartial) {
            sdsUtils.copyTpl('directive', 'complex/directive.html',   this.name + '.html', this);
            sdsUtils.copyTpl('directive', 'complex/directive.js',     this.name + '.js', this);
            sdsUtils.copyTpl('directive', 'complex/directive.less',   this.name + '.' + styleExt, this);
            sdsUtils.copyTpl('directive', 'complex/directive-spec.js',this.name + '-spec.js', this);
        }else{
            sdsUtils.copyTpl('directive', 'simple/directive.js',      this.name + '.js', this);
            sdsUtils.copyTpl('directive', 'simple/directive-spec.js', this.name + '-spec.js', this);
        }
    }
};
