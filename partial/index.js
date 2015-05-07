'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var sdsUtils = require('../utils.js');
var _ = require('underscore');
var chalk = require('chalk');
var url = require('url');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var PartialGenerator = module.exports = function PartialGenerator(args, options, config) {

    sdsUtils.getNameArg(this,args);

    yeoman.generators.Base.apply(this, arguments);
};

util.inherits(PartialGenerator, yeoman.generators.Base);

PartialGenerator.prototype.askForPath = function askForPath(){
    var cb = this.async();

    var prompts = [];

    sdsUtils.addNamePrompt(this,prompts,'partial');

    this.prompt(prompts, function (props) {
        if (props.name) {
            this.name = props.name;
        }
        sdsUtils.askForModuleAndDir('partial',this,true,cb);
    }.bind(this));
};

PartialGenerator.prototype.askFor = function askFor() {
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
};

PartialGenerator.prototype.files = function files() {
    this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';
    this.uirouter = this.config.get('uirouter');

    if (this.route && this.route.length > 0) {
        this.routeUrl = sdsUtils.getCleanPath(this.dir, this.name + '.html');

    }

    sdsUtils.processTemplates(this.name,this.dir,'partial',this,null,null,this.module);


    //if (this.route && this.route.length > 0){
    //    var partialUrl = this.dir + this.name + '.html';
    //    sdsUtils.injectRoute(this.module.file,this.config.get('uirouter'),this.name,this.route,partialUrl,this);
    //}

};
