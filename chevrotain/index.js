const chevrotain = require('chevrotain');
const { lexer } = require('./lexer');

const SelectParser = require('./parser').SelectParser;
const parser = new SelectParser();

function parse(text) {
    const lexingResult = lexer.tokenize(text);

    parser.input = lexingResult.tokens;
    parser.selectStatement();

    if (parser.errors.length > 0) {
        throw new Error("sad sad panda, Parsing errors detected")
    }

    console.info(parser);
}

const inputText = 'SELECT column1 FROM table2';
parse(inputText);
