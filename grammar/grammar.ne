MAIN -> _ EQ _ {% function(d,l) {return {type:'main', children:d,location:l}} %}

# Addition and subtraction
EQ ->
  EQ _ OP _ EQ  {% function(d, l) {return {type:'eq',children:d, location:l}} %}
| LBracket _ EQ _ RBracket {% function(d, l) {return {type:'eq', children:d, location:l}} %}
| FLOAT          {% id  %}
| ATTR           {% id %}

# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:*     {% (d,l) => null %}

# I use `float` to basically mean a number with a decimal point in it
FLOAT ->
  INT "." INT    {% function(d,l) {return {type:'float',v:parseFloat(d[0].v + d[1] + d[2].v), location:l}} %}
  | INT          {% function(d,l) {return {type:'int',v:parseInt(d[0].v),location:l}} %}

INT -> [0-9]:+   {% function(d,l) {return {type:'int',v:d[0].join(""),location:l}} %}

ATTR -> [a-z]:+  {% function(d,l) {return {type:'attr',v:d[0].join(""),location:l}} %}

LBracket -> "(" {% (d,l) => ({ type:'bracket', text:'(',location:l}) %}
RBracket -> ")" {% (d,l) => ({ type:'bracket', text:')',location:l}) %}

OP -> "+" {% (d,l) => ({ type: 'op',location:l, text: '+'}) %}
| "-" {% (d,l) => ({ type: 'op',location:l, text: '-'}) %}
| "*" {% (d,l) => ({ type: 'op',location:l, text: '*'}) %}
| "/" {% (d,l) => ({ type: 'op',location:l, text: '/'}) %}
