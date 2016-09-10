var YasonParserTransform = require("../lib/yason_parser_transform");

var input = new YasonParserTransform();
input.on("data", (data) => {
  console.log("data: ", data);
});

process.stdin.pipe(input);
input.resume();
