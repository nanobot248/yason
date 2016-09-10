const Y = require("../lib/package");
const assert = require('assert');

function checkValue(value) {
    var str1 = Y.stringify(value);
    str1 = Y.parse(str1);
    var str2 = Y.stringify(str1);
    return str1 == str2;
}

function checkString(str) {

}

describe('Objects', function() {
  describe('stringify -> parse -> stringify', function() {
    it('empty object', function() {
      assert.deepEqual({}, Y.parse("{}"));
    });
    it('empty object with spaces', function() {
      assert.deepEqual({}, Y.parse(" { } "));
    });
    it('empty object with spaces and newlines', function() {
      assert.deepEqual({}, Y.parse(" \n { \r\n } \n"));
    });
  });
});
