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
    askFor: function() {
        var cb = this.async();

        var prompts = [];

        sdsUtils.addNamePrompt(this,prompts,'filter');

        this.prompt(prompts, function (props) {
            if (props.name){
                this.name = props.name;
            }
            sdsUtils.askForModuleAndDir('filter',this,false,cb);
        }.bind(this));
    },
    files: function () {
        sdsUtils.copyTpl('filter', 'filter.js',      this.name + '.js', this);
        sdsUtils.copyTpl('filter', 'filter-spec.js', this.name + '-spec.js', this);
    }
});