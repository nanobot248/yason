const util = require("util");


function YasonGenerator(options) {
  const self = this;
  self.options = util._extend({}, (options == null ? {} : options))
  
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
    console.log("objectNames: ", objectNames);
    
    if(o
  };
  
  function serialize(value, objectNames) {
    if(value == null) {
      return "null";
    } else if(typeof(value) === "number" || typeof("value") === "string") {
      return serializeScalar(value, objectNames);
    } else if(value instanceof Array) {
      return serializeArray(value, objectNames);
    } else {
      return serializeObject(value, objectNames);
    }
  }
  
  function serializeObject(obj, objectNames) {
    var result = "{";
    Object.keys(obj).forEach((key) => {
      
    });
    result += "}";
  }
  
  function serializeArray(arr, objectNames) {
    
  }
  
  function serializeScalar(value, objectNames) {
    return JSON.stringify(value);
  }
  
  function findReferencedObjects(obj) {
    var objects = new Map();
    var current = [obj];
    
    while(current.length > 0) {
      var next = [];
      current.forEach((item) => {
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
