{
  function YasonReference(name) {
    const self = this;
    self.name = name;
  }

  function YasonReferableValue(name, value) {
    const self = this;
    self.name = name;
    self.value = value;
  }
}

value =
  __
  refid:refid_definition?
  val:(refid_reference / object / array / string_literal / number_literal / "true" / "false" / "null")
  __
  {
    if(typeof(refid) != "undefined" && refid != null) {
      return new YasonReferableValue(refid, val);
    } else {
      return val;
    }
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

identifier =
  head:[_a-zA-Z]tail:[_a-zA-Z0-9]* { return head + tail.join(""); }

refid_definition =
  __ "&" id:identifier __ { console.log("reference definition: ", id); return id; }

refid_reference =
  __ "*" id: identifier __ { return new YasonReference(id); }

object =
  "{" obj:(head:key_value_pair tail:("," pair:key_value_pair {return pair;})*
  {
    var obj = {};
    if(typeof(head) != "undefined" && head != null) { obj[head.key] = head.value; }
    else { return {}; }
    if(typeof(tail) != "undefined" && tail != null) {
      console.log("object tail: ", tail);
      Array.prototype.forEach.call(tail, (pair) => {

        obj[pair.key] = pair.value;
      });
    }
    return obj;
  }
  )? "}" { return obj; }

array =
  "[" arr:(head:value tail:("," val:value {return val;})*
  {
    console.log("generating array from parameters: ", arguments);
    var arr = [];
    if(typeof(head) != "undefined" && head != null) {
      console.log("array head: ", head);
      arr.push(head);
      if(typeof(tail) != "undefined" && tail != null) { arr = arr.concat(tail); }
    }
    return arr;
  }
  )? "]" { return arr; }

key_value_pair =
  __ key:string_literal __ ":" val:value
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
    console.log("generating string from str: ", str);
    str = JSON.parse('"' + str + '"');
    return str;
  }

dquot_string =
  '"' chars:('\\"' {return '\\"';} / !'"' ch:. {return ch;})* '"'
  {
    console.log("generating dquot string from chars: ", chars);
    return chars.join("");
  }

squot_string =
  "'" chars:("\\'" {return "\\'";} / !"'" ch:. {return ch;})* "'"
  {
    return chars.join("").replace(/[']/g, '\\"');
  }
