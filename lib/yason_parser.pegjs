{
  const Y = require("./package.js");
  const YasonReference = Y.YasonReference;
  const YasonTaggedValue = Y.YasonTaggedValue;

  var namedObjects = {};
  var references = [];
}

start = val:value {
  references.forEach((ref) => {
    if(ref.name in namedObjects && ref.parent != null && ref.parentKey != null) {
      ref.parent[ref.parentKey] = namedObjects[ref.name];
    }
  });
  return val;
}

value =
  __
  tag:tag? __
  refid:refid_definition?
  val:(refid_reference / object / array / string_literal / number_literal / "true" / "false" / "null")
  __
  {
    if(val instanceof YasonReference) {
      if(val.name in namedObjects) {
        val = namedObjects[val.name];
      }
    }
    if(typeof(refid) != "undefined" && refid != null) {
      namedObjects[refid] = val;
    }
    if(typeof(tag) != "undefined" && tag != null) {
      val = new YasonTaggedValue(tag, val);
    }
    return val;
  }

_ = ("\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]
  / line_terminator) { return ""; }

line_terminator =
  [\n\r\u2028\u2029]

__ = _*

tag = "!" id:(!(_) ch:. { return ch; })+ _ { return id.join(""); }

identifier =
  head:[_a-zA-Z]tail:[_a-zA-Z0-9]* { return head + tail.join(""); }

refid_definition =
  __ "&" id:identifier __ { return id; }

refid_reference =
  __ "*" id: identifier __ {
    var ref = new YasonReference(id);
    references.push(ref);
    return ref;
  }

object =
  "{" __ obj:(head:key_value_pair tail:("," pair:key_value_pair {return pair;})*
  {
    var obj = {};
    if(typeof(head) != "undefined" && head != null) { obj[head.key] = head.value; }
    else { return {}; }
    if(typeof(tail) != "undefined" && tail != null) {
      Array.prototype.forEach.call(tail, (pair) => {
        if(pair.value instanceof YasonReference) {
          if(pair.value.name in namedObjects) {
            pair.value = namedObjects[pair.value.name];
          } else {
            pair.value.parent = obj;
            pair.value.parentKey = pair.key;
            references.push(pair.value);
          }
        }
        obj[pair.key] = pair.value;
      });
    }
    return obj;
  }
  )? __ "}" { return typeof(obj) == "undefined" || obj == null ? {} : obj; }

array =
  "[" __ arr:(head:value tail:("," val:value {return val;})*
  {
    var arr = [];
    if(typeof(head) != "undefined" && head != null) {
      arr.push(head);
      if(typeof(tail) != "undefined" && tail != null) { arr = arr.concat(tail); }
      for(var i = 0; i < arr.length; i++) {
        var val = arr[i];
        if(val instanceof YasonReference) {
          if(val.name in namedObjects) {
            arr[i] = namedObjects[val.name];
          } else {
            val.parent = arr;
            val.parentKey = i;
            references.push(val);
          }
        }
      }
    }
    return arr;
  }
  )? __ "]" { return typeof(arr) == "undefined" || arr == null ? [] : arr; }

key_value_pair =
  __ key:(string_literal / identifier) __ ":" val:value
  {
    return {
      key: key,
      value: val
    };
  }

number_literal =
  __ num:$(("-")? ("0" / [1-9][0-9]*) ("." ([0-9]+))? ([eE] ([+-])? ([0-9])*)?) __
  {
    return JSON.parse(num);
  }

string_literal =
  __ str:(dquot_string / squot_string) __
  {
    str = JSON.parse('"' + str + '"');
    return str;
  }

dquot_string =
  '"' chars:('\\"' {return '\\"';} / !'"' ch:. {return ch;})* '"'
  {
    return chars.join("");
  }

squot_string =
  "'" chars:("\\'" {return "\\'";} / !"'" ch:. {return ch;})* "'"
  {
    return chars.join("").replace(/[']/g, '\\"');
  }
