// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "MAIN", "symbols": ["_", "EQ", "_"], "postprocess": function(d) {return {type:'main', children:d}}},
    {"name": "EQ", "symbols": ["EQ", "_", "OP", "_", "EQ"], "postprocess": function(d) {return {type:'eq',children:d}}},
    {"name": "EQ", "symbols": ["LBracket", "_", "EQ", "_", "RBracket"], "postprocess": function(d) {return {type:'eq', children:d}}},
    {"name": "EQ", "symbols": ["FLOAT"], "postprocess": id},
    {"name": "EQ", "symbols": ["ATTR"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": d => ({ type:'space', v:d.join('')})},
    {"name": "FLOAT", "symbols": ["INT", {"literal":"."}, "INT"], "postprocess": function(d) {return {type:'float',v:parseFloat(d[0].v + d[1] + d[2].v)}}},
    {"name": "FLOAT", "symbols": ["INT"], "postprocess": function(d) {return {type:'int',v:parseInt(d[0].v)}}},
    {"name": "INT$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "INT$ebnf$1", "symbols": ["INT$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INT", "symbols": ["INT$ebnf$1"], "postprocess": function(d) {return {type:'int',v:d[0].join("")}}},
    {"name": "ATTR$ebnf$1", "symbols": [/[a-z]/]},
    {"name": "ATTR$ebnf$1", "symbols": ["ATTR$ebnf$1", /[a-z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ATTR", "symbols": ["ATTR$ebnf$1"], "postprocess": function(d) {return {type:'attr',v:d[0].join("")}}},
    {"name": "LBracket", "symbols": [{"literal":"("}], "postprocess": d => ({ type:'bracket', text:'('})},
    {"name": "RBracket", "symbols": [{"literal":")"}], "postprocess": d => ({ type:'bracket', text:')'})},
    {"name": "OP", "symbols": [{"literal":"+"}], "postprocess": d => ({ type: 'op', text: '+'})},
    {"name": "OP", "symbols": [{"literal":"-"}], "postprocess": d => ({ type: 'op', text: '-'})},
    {"name": "OP", "symbols": [{"literal":"*"}], "postprocess": d => ({ type: 'op', text: '*'})},
    {"name": "OP", "symbols": [{"literal":"/"}], "postprocess": d => ({ type: 'op', text: '/'})}
]
  , ParserStart: "MAIN"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
