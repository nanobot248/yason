const util = require("util");

function YasonGenerator(options) {
  const self = this;
  self.options = util._extend({
    stringReferences: {
      minimumLength: 12
    }
  }, (options == null ? {} : options))

  self.stringify = function(obj, options) {
    var classifier = self.options.classifier != null ?
      self.options.classifier : function(value, container) { return null; };
    classifier = options != null && options.classifier != null ?
      options.classifier : classifier;
    var classify = (function(container) {
      var self = this;
      self.container = container;
      return function(value) { return classifier(value, self.container); }
    })(obj);

    if(obj == null) {
      return "null";
    } else if(typeof(obj) === "number" || typeof(obj) === "string") {
      return JSON.stringify(obj);
    }

    var refCounts = findReferencedObjects(obj);
    var objectNames = new Map();
    var index = 0;
    refCounts.forEach((count, object) => {
      if(object === obj) {
        objectNames.set(object, "root");
      } else {
        objectNames.set(object, "ref" + (index++));
      }
    });

    return serialize(obj, classify, objectNames);
  };

  function serialize(value, classify, objectNames, usedNames, skipTag) {
    if(usedNames == null) { usedNames = new Map(); }
    var cls = classify != null && skipTag !== true ? classify(value) : null;
    var result = isValidClassName(cls) ? "!" + cls.toString().trim() + " " : "";
    if(value == null) {
      result += "null";
    } else if(typeof(value) === "number" || typeof(value) === "string") {
      result += serializeScalar(value, classify, objectNames, usedNames);
    } else if(typeof(value) === "array" || Array.isArray(value)) {
      result += serializeArray(value, classify, objectNames, usedNames);
    } else {
      result += serializeObject(value, classify, objectNames, usedNames);
    }
    return result;
  }

  function serializeObject(obj, classify, objectNames, usedNames) {
    if(usedNames == null) { usedNames = new Map(); }
    var result = "";

    if(objectNames.has(obj) && !usedNames.has(obj)) {
      result += "&" + objectNames.get(obj) + " ";
      usedNames.set(obj, true);
    }

    result += "{"
    Object.keys(obj).forEach((key, index) => {
      if(index > 0) { result += "," }
      var value = obj[key];
      result += JSON.stringify(key);
      result += ":";
      var cls = classify != null ? classify(value) : null;
      result += isValidClassName(cls) ? "!" + cls.toString().trim() + " " : "";
      if(objectNames.has(value) && usedNames.has(value)) {
          result += "*" + objectNames.get(value);
      } else {
        if(objectNames.has(value)) {
          result += "&" + objectNames.get(value) + " ";
          usedNames.set(value, true)
        }
        result += serialize(value, classify, objectNames, usedNames, true);
      }
    });
    result += "}";
    return result;
  }

  function serializeArray(arr, classify, objectNames, usedNames) {
    if(usedNames == null) { usedNames = new Map(); }

    var result = "[";
    Array.prototype.forEach.call(arr, (value, index) => {
      if(index > 0) { result += "," }
      var cls = classify != null ? classify(value) : null;
      result += isValidClassName(cls) ? "!" + cls.toString().trim() + " " : "";
      if(objectNames.has(value) && usedNames.has(value)) {
        result += "*" + objectNames.get(value);
      } else {
        if(objectNames.has(value)) {
          result += "&" + objectNames.get(value) + " ";
          usedNames.set(value, true)
        }
        result += serialize(value, classify, objectNames, usedNames, true);
      }
    });
    result += "]";
    return result;
  }

  function serializeScalar(value, objectNames, usedNames) {
    return JSON.stringify(value);
  }

  function isValidClassName(name) {
    if(name == null) return false;
    if(!(typeof(name) === "string")) return false;
    name = name.trim();
    if(name.length < 1) return false;
    var m = name.match(/[\u00A0\f\v\t\n\r\u2028\u2029\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF]/);
    if(m != null) return false;
    return true;
  }

  function findReferencedObjects(obj) {
    var objects = new Map();
    var current = [obj];

    while(current.length > 0) {
      var next = [];
      current.forEach((item) => {
        if(item == null || typeof(item) === "number" ||
           (typeof(item) === "string" && item.length < self.options.stringReferences.minimumLength)) {
           return;
        }
        if(objects.has(item)) {
          objects.set(item, objects.get(item) + 1);
        } else {
          objects.set(item, 1);
          if(item instanceof Array) {
            next = next.concat(item);
          } else if(item != null && typeof(item) === "object") {
            Object.keys(item).forEach((key) => {
              var value = item[key];
              if(value != null && typeof(value) != "number") {
                if(objects.has(value)) {
                  objects.set(value, objects.get(value) + 1);
                } else {
                  next.push(item[key]);
                }
              }
            });
          }
        }
      });
      current = next;
    }

    var result = new Map();
    objects.forEach((value, key) => {
      if(value != null && value > 1) {
        result.set(key, value);
      }
    });
    return result;
  }
}

module.exports = YasonGenerator;
