'use strict';
var generators = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var lodash = require('lodash');
var chalk = require('chalk');
var url = require('url');

module.exports =  class SDSAngularGenerator extends generators.Base {
    constructor() {
        super(...arguments);
        this.lodash = lodash;

        sdsUtils.getNameArg(this, arguments[0]);
    }

    askForPath(){
        var cb = this.async();

        var prompts = [];

        sdsUtils.addNamePrompt(this,prompts,'partial');

        this.prompt(prompts).then(props => {
            if (props.name) {
                this.name = props.name;
            }
            sdsUtils.askForModuleAndDir('partial',this,true,cb);
        });
    }
    
    askFor() {
        var cb = this.async();

        var prompts = [
            {
                name: 'route',
                message: 'Enter your route url (i.e. /mypartial/:id).',
                default:sdsUtils.getCleanRoute(this.dir, this)
            }
        ];

        this.prompt(prompts).then(props => {
            if (props.route[0] !== '/'){
                props.route = '/' + props.route;
            }
            this.route = url.resolve('',props.route);
            cb();
        });
    }
    
    files() {
        this.ctrlname = lodash.upperFirst(lodash.camelCase(this.name)) + 'Ctrl';
        this.uirouter = this.config.get('uirouter');

        if (this.route && this.route.length > 0) {
            this.routeUrl = sdsUtils.getCleanPath(this.dir, this.name + '.html');

        }

        var styleExt = (this.config.get("cssExt") || 'less').replace('.', '');
        sdsUtils.copyTpl('partial', 'partial.html',    this.name + '.html', this);
        sdsUtils.copyTpl('partial', 'partial.js',      this.name + '.js', this);
        sdsUtils.copyTpl('partial', 'partial.less',    this.name + '.' + styleExt, this);
        sdsUtils.copyTpl('partial', 'partial-route.js',this.name + '-route.js', this);
        if (this.config.get("hasSpecFiles") !== false) {
            sdsUtils.copyTpl('partial', 'partial-spec.js', this.name + '-spec.js', this);
        }
    }
};
