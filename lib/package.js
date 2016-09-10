const YasonGenerator = require("./yason_generator");
const YasonParser = require("./yason_parser");
const YasonGeneratorTransform = require("./yason_generator_transform");
const YasonParserTransform = require("./yason_parser_transform");

const generator = new YasonGenerator();
const parser = YasonParser;

module.exports = {
  Generator: YasonGenerator,
  Parser: YasonParser,
  GeneratorTransform: YasonGeneratorTransform,
  ParserTransform: YasonParserTransform,
  stringify: generator.stringify,
  parse: parser.parse
};
