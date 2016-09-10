const YasonGenerator = require("./yason_generator");

const Transform = require('stream').Transform;
const util = require('util');

function YasonGeneratorTransform(options) {
  const self = this;
  self.options = options != null ? options : {};
  self.generator = new YasonGenerator(self.options.generator);

  if (!(self instanceof YasonGeneratorTransform))
    return new YasonGeneratorTransform(options);
  Transform.call(self, {readableObjectMode: false, writableObjectMode: true});

  self._transform = function(data, encoding, cb) {
    try {
      var buf = Buffer.from(self.generator.stringify(data) + "\n", "utf8");
      self.push(buf)
      cb(null);
    } catch(ex) {
      cb(ex);
    }
  };
}
util.inherits(YasonGeneratorTransform, Transform);

module.exports = YasonGeneratorTransform;
