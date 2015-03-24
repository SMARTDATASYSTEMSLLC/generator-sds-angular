'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');
var appExists = fs.existsSync('./.yo-rc.json');
var appPath = (appExists && JSON.parse(fs.readFileSync('./bower.json')).appPath) || 'app';

var ModalGenerator = module.exports = function ModalGenerator(args, options, config) {

    sdsUtils.getNameArg(this,args);

    yeoman.generators.Base.apply(this, arguments);

};

util.inherits(ModalGenerator, yeoman.generators.Base);

ModalGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var prompts = [];

    sdsUtils.addNamePrompt(this,prompts,'modal');

    this.prompt(prompts, function (props) {
        if (props.name){
            this.name = props.name;
        }
        sdsUtils.askForModuleAndDir('modal',this,true,cb);
    }.bind(this));

};

ModalGenerator.prototype.files = function files() {

    this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';

    sdsUtils.processTemplates(this.name,this.dir,'modal',this,null,null,this.module);

    setTimeout((function(){

	    console.log('');
	    console.log('  Open this modal by using ' + chalk.bold('angular-ui-bootstrap') + ' module\'s ' + chalk.bold('$modal') + ' service:');
	    console.log('');
	    console.log('  $modal.open({');
	    console.log('      templateUrl: \'' + path.join(this.dir,this.name + '.html').replace(/\\/g,'/').replace(appPath + '/', '') + '\',');
	    console.log('      controller: \''+ this.ctrlname +'\',');
        console.log('      controllerAs: \'vm\',');
        console.log('      resolve: {');
        console.log('          //passedInItem: function (){ return 0; }');
        console.log('      }');
	    console.log('  }).result.then(function(result){');
	    console.log('      //do something with the result');
	    console.log('  });');
	    console.log('');

    }).bind(this),200);

};
