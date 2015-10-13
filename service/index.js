'use strict';
var generators = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var chalk = require('chalk');
var lodash = require('lodash');


module.exports = generators.Base.extend({
    constructor: function (args) {
        generators.Base.apply(this, arguments);
        this.lodash = lodash;

        sdsUtils.getNameArg(this, args);
    },
    askFor: function() {
        var cb = this.async();
        var prompts = [];

        sdsUtils.addNamePrompt(this,prompts,'service');

        this.prompt(prompts, function (props) {
            if (props.name){
                this.name = props.name;
            }
            sdsUtils.askForModuleAndDir('service',this,true,cb);
        }.bind(this));

    },
    files: function() {
        sdsUtils.copyTpl('service', 'service.js',     this.name + '.js', this);
        sdsUtils.copyTpl('service', 'service-spec.js',this.name + '-spec.js', this);
    }
});