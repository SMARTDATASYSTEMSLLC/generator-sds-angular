#generator-sds-angular

>Yeoman Generator for Smart Data Systems

This generator follows the [Angular Best Practice Guidelines for Project Structure](https://github.com/johnpapa/angularjs-styleguide).

Getting Started
-------------

Prerequisites: Node, Grunt, Yeoman, and Bower.  Once Node is installed, do:

    npm install -g grunt-cli yo bower

Next, install this generator:

    npm install -g generator-sds-angular

To create a project:

    mkdir MyNewAwesomeApp
    cd MyNewAwesomeApp
    yo sds-angular

Grunt Tasks
-------------

Now that the project is created, you have 3 simple Grunt commands available:

    grunt serve   #This will run a development server with watch & livereload enabled.
    grunt test    #Run local unit tests.
    grunt build   #Places a fully optimized (minified, concatenated, and more) in /dist

When `grunt serve` is running, any changed javascript files will be linted using JSHint as well as have their appropriate unit tests executed.  Only the unit tests that correspond to the changed file will be run.  This allows for an efficient test driven workflow.

Yeoman Subgenerators
-------------

There are a set of subgenerators to initialize empty Angular components.  Each of these generators will:

* Create one or more skeleton files (javascript, LESS, html, spec etc) for the component type.
* Update index.html and add the necessary `script` tags.
* Update app.less and add the @import as needed.
* For partials, update the app.js, adding the necessary route call if a route was entered in the generator prompts.

There are generators for `directive`,`partial`,`service`, `filter`, `module`, and `modal`.

Running a generator:

    yo sds-angular:directive my-awesome-directive
    yo sds-angular:partial my-partial
    yo sds-angular:service my-service
    yo sds-angular:filter my-filter
    yo sds-angular:module my-module
    yo sds-angular:modal my-modal

The name paramater passed (i.e. 'my-awesome-directive') will be used as the file names.  The generators will derive appropriate class names from this parameter (ex. 'my-awesome-directive' will convert to a class name of 'MyAwesomeDirective').  Each sub-generator will ask for the folder in which to create the new skeleton files.  You may override the default folder for each sub-generator in the `.yo-rc.json` file.

The modal subgenerator is a convenient shortcut to create partials that work as modals for Bootstrap v3.1 and Angular-UI-Bootstrap v0.10 (both come preconfigured with this generator).  If you choose not to use either of these libraries, simply don't use the modal subgenerator.

Subgenerators are also customizable.  Please read [CUSTOMIZING.md](CUSTOMIZING.md) for details.

Submodules
-------------

Submodules allow you to more explicitly separate parts of your application.  Use the `yo sds-angular:module my-module` command and specify a new subdirectory to place the module into.  Once you've created a submodule, running other subgenerators will now prompt you to select the module in which to place the new component.

Preconfigured Libraries
-------------

The new app will have a handful of preconfigured libraries included.  This includes Angular 1.2, Bootstrap 3, AngularUI Bootstrap, AngularUI Utils, FontAwesome 4, JQuery 2, Underscore 1.5, LESS 1.6, and Moment 2.5.  You may of course add to or remove any of these libraries.  But the work to integrate them into the app and into the build process has already been done for you.

