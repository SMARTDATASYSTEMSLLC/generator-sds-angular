'use strict';
var generators = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var lodash = require('lodash');

module.exports = generators.Base.extend({
    constructor: function (args) {
        generators.Base.apply(this, arguments);
        this.lodash = lodash;

        sdsUtils.getNameArg(this, args);
    },
    askFor: function () {
        var cb = this.async();

        var prompts = [{
            type: 'confirm',
            name: 'needpartial',
            message: 'Does this directive need an external html file (i.e. partial)?',
            default: true
        }];

        sdsUtils.addNamePrompt(this, prompts, 'directive');

        this.prompt(prompts, function (props) {
            if (props.name) {
                this.name = props.name;
            }
            this.needpartial = props.needpartial;
            sdsUtils.askForModuleAndDir('directive', this, true, cb);
        }.bind(this));

    },
    files: function () {
        var styleExt = this.config.get("cssExt");
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
});
