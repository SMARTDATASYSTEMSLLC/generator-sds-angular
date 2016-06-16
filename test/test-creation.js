/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('sds-angular generator', () => {
  beforeEach((done) => {
    helpers.testDirectory(path.join(__dirname, 'temp'), (err) => {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('sds-angular:app', [
        '../../app'
      ]);
      done();
    });
  });

  it('creates expected files', (done) => {
    var expected = [
      // add files you expect to exist here.
      '.jshintrc',
      '.editorconfig'
    ];

    helpers.mockPrompt(this.app, {
      'someOption': 'Y'
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, () => {
      helpers.assertFiles(expected);
      done();
    });
  });
});
