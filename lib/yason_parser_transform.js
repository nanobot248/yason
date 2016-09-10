const YasonParser = require("./yason_parser");

const Transform = require('stream').Transform;
const util = require('util');

function YasonParserTransform(options) {
  const self = this;
  self.parser = YasonParser;

  if (!(self instanceof YasonParserTransform))
    return new YasonParserTransform(options);
  Transform.call(self, {readableObjectMode: true, writableObjectMode: false});

  var currentData = null;

  self._transform = function(data, encoding, cb) {
    console.log("reading data: ", data);
    try {
      if(currentData == null) {
        currentData = typeof(data) === "string" ? data : data.toString("utf8");
      } else {
        currentData += typeof(data) === "string" ? data : data.toString("utf8");
      }
      fireDataEvent();
      cb();
    } catch(ex) {
      cb(ex);
    }
  };

  self._flush = function(cb) {
    try {
      fireDataEvent();
      if(currentData != null && currentData.length > 0) {
        currentData += "\n";
        fireDataEvent();
      }
      cb();
    } catch(ex) {
      cb(ex);
    }
  }

  function fireDataEvent() {
    while(true) {
      // find line terminators
      var m = currentData.match(/[\n\r\u2028\u2029]/);
      if(m != null) {
        var itemString = currentData.substr(0, m.index).trimRight();
        currentData = currentData.substr(m.index).trimLeft();
        var value = self.parser.parse(itemString);
        self.push(value);
      } else {
        break;
      }
    }
  }
}
util.inherits(YasonParserTransform, Transform);

module.exports = YasonParserTransform;
