const util = require("util");


function YasonGenerator(options) {
  const self = this;
  self.options = util._extend({
    stringReferences: {
      minimumLength: 12
    }
  }, (options == null ? {} : options))
  
  self.stringify = function(obj) {
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
    
    return serialize(obj, objectNames);
  };
  
  function serialize(value, objectNames, usedNames) {
    if(usedNames == null) { usedNames = new Map(); }
    if(value == null) {
      return "null";
    } else if(typeof(value) === "number" || typeof(value) === "string") {
      return serializeScalar(value, objectNames, usedNames);
    } else if(typeof(value) === "array" || Array.isArray(value)) {
      return serializeArray(value, objectNames, usedNames);
    } else {
      return serializeObject(value, objectNames, usedNames);
    }
  }
  
  function serializeObject(obj, objectNames, usedNames) {
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
      if(objectNames.has(value) && usedNames.has(value)) {
          result += "*" + objectNames.get(value);
      } else {
        if(objectNames.has(value)) {
          result += "&" + objectNames.get(value) + " ";
          usedNames.set(value, true)
        }
        result += serialize(value, objectNames, usedNames);
      }
    });
    result += "}";
    return result;
  }
  
  function serializeArray(arr, objectNames, usedNames) {
    if(usedNames == null) { usedNames = new Map(); }
    var result = "[";
    Array.prototype.forEach.call(arr, (value, index) => {
      if(index > 0) { result += "," }
      if(objectNames.has(value) && usedNames.has(value)) {
        result += "*" + objectNames.get(value);
      } else {
        if(objectNames.has(value)) {
          result += "&" + objectNames.get(value) + " ";
          usedNames.set(value, true)
        }
        result += serialize(value, objectNames, usedNames);
      }
    });
    result += "]";
    return result;
  }
  
  function serializeScalar(value, objectNames, usedNames) {
    return JSON.stringify(value);
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
