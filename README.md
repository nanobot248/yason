# Yet Another Simple Object Notation (YASON)
YASON is a small superset of JSON, compatible with the YAML language. It
extends JSON with support for (circular) references and typing (YAML tags).

This project was created as a support project for other projects and YASON
strings should be easily filterable by line-based filtering tools (e.g. grep).
Therefore YASON generators should not generate newlines by default, although
they are supported.

*YASON is JSON with the following YAML-compatible changes:*

* References: A referencable element can be defined by putting `&refname` in
  front of it and by using `*refname` to refer to it.
* Classes/Types/Namespaces: Elements can be classified using YAML-compatible
  tags (!tag, !!tag).
* By default no newlines at generation time, although newlines are supported
  by the parser.