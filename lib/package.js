const YasonGenerator = require("./yason_generator");
const YasonParser = require("./yason_parser");
const YasonGeneratorTransform = require("./yason_generator_transform");
const YasonParserTransform = require("./yason_parser_transform");

const generator = new YasonGenerator();
const parser = YasonParser;

function YasonReference(name) {
  const self = this;
  self.name = name;
  self.parent = null;
  self.parentKey = null;
}

function YasonTaggedValue(tag, value) {
  const self = this;
  self.tag = tag;
  self.value = value;
}

module.exports = {
  YasonReference: YasonReference,
  YasonTaggedValue: YasonTaggedValue,
  Generator: YasonGenerator,
  Parser: YasonParser,
  GeneratorTransform: YasonGeneratorTransform,
  ParserTransform: YasonParserTransform,
  stringify: generator.stringify,
  parse: parser.parse
};
