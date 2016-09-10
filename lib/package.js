const YasonGenerator = require("./yason_generator");
const YasonParser = require("./yason_parser");

const generator = new YasonGenerator();
const parser = YasonParser;

module.exports = {
  Generator: YasonGenerator,
  Parser: YasonParser,
  stringify: generator.stringify,
  parse: parser.parse
};
