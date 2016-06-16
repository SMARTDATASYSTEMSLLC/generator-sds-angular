/*global describe, beforeEach, it*/
'use strict';

var assert  = require('assert');

describe('sds-angular generator', () => {
  it('can be imported without blowing up', () => {
    var app = require('../app');
    assert(app !== undefined);
  });
});
