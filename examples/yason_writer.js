var YasonGeneratorTransform = require("../lib/yason_generator_transform");

var out = new YasonGeneratorTransform({generator: {prettyPrint: true}});
out.pipe(process.stdout);

out.write({lirum: "larum"});
out.write({bla: ["ble", "blu", "larum"], 1: [2, {3: 4}]});
