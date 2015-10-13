'use strict';
var generators = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var lodash = require('lodash');
var chalk = require('chalk');
var url = require('url');

module.exports = generators.Base.extend({
    constructor: function (args) {
        generators.Base.apply(this, arguments);
        this.lodash = lodash;

        sdsUtils.getNameArg(this, args);
    },
    askForPath: function(){
        var cb = this.async();

        var prompts = [];

        sdsUtils.addNamePrompt(this,prompts,'partial');

        this.prompt(prompts, function (props) {
            if (props.name) {
                this.name = props.name;
            }
            sdsUtils.askForModuleAndDir('partial',this,true,cb);
        }.bind(this));
    },
    askFor: function () {
        var cb = this.async();

        var prompts = [
            {
                name: 'route',
                message: 'Enter your route url (i.e. /mypartial/:id).',
                default:sdsUtils.getCleanRoute(this.dir, this)
            }
        ];

        this.prompt(prompts, function (props) {
            if (props.route[0] !== '/'){
                props.route = '/' + props.route;
            }
            this.route = url.resolve('',props.route);
            cb();
        }.bind(this));
    },
    files: function() {
        this.ctrlname = lodash.capitalize(lodash.camelCase(this.name)) + 'Ctrl';
        this.uirouter = this.config.get('uirouter');

        if (this.route && this.route.length > 0) {
            this.routeUrl = sdsUtils.getCleanPath(this.dir, this.name + '.html');

        }

        var styleExt = this.config.get("cssExt");
        sdsUtils.copyTpl('partial', 'partial.html',    this.name + '.html', this);
        sdsUtils.copyTpl('partial', 'partial.js',      this.name + '.js', this);
        sdsUtils.copyTpl('partial', 'partial.less',    this.name + '.' + styleExt, this);
        sdsUtils.copyTpl('partial', 'partial-route.js',this.name + '-route.js', this);
        sdsUtils.copyTpl('partial', 'partial-spec.js', this.name + '-spec.js', this);
    }
});
