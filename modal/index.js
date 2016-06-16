'use strict';
var generators = require('yeoman-generator');
var sdsUtils = require('../utils.js');
var lodash = require('lodash');
var chalk = require('chalk');
var path = require('path');
var jsonFile = require('jsonfile');
var appPath =(jsonFile.readFileSync('./bower.json', {throws:false}) || {appPath:'app'}).appPath;

module.exports =  class SDSAngularGenerator extends generators.Base {
    constructor() {
        super(...arguments);
        this.lodash = lodash;

        sdsUtils.getNameArg(this, arguments[0]);
    }

    askFor(){
        var cb = this.async();

        var prompts = [];

        sdsUtils.addNamePrompt(this,prompts,'modal');

        this.prompt(prompts).then(props => {
            if (props.name){
                this.name = props.name;
            }
            sdsUtils.askForModuleAndDir('modal',this,true,cb);
        });
    }
    
    files(){

        this.ctrlname = lodash.capitalize(lodash.camelCase(this.name)) + 'Ctrl';

        var styleExt = (this.config.get("cssExt") || 'less').replace('.', '');
        sdsUtils.copyTpl('modal', 'modal.html',   this.name + '.html', this);
        sdsUtils.copyTpl('modal', 'modal.js',     this.name + '.js', this);
        sdsUtils.copyTpl('modal', 'modal.less',   this.name + '.' + styleExt, this);
        sdsUtils.copyTpl('modal', 'modal-spec.js',this.name + '-spec.js', this);

        setTimeout(() => {

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

        },200);

    }
};
