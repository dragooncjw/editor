const { CstParser } = require('chevrotain');

const { allTokens, lexer, Select, Comma, SystemIdentifier, UnknownIdentifier, From, Where, Integer, LessThan, GreaterThan, WhiteSpace } = require('./lexer');

/**
 * grammar
 * selectStatement
 *    : selectClause fromClause (whereClause)?
 *
 * selectClause
 *    : "SELECT" identifierExpression ("," identifierExpression)*
 *
 * fromClause
 *    : "FROM" Identifier
 *
 * whereClause
 *    : "WHERE" expression
 *
 * expression
 *    : atomicExpression relationalOperator atomicExpression
 *
 * atomicExpression
 *    : Integer | identifierExpression
 *
 * identifierExpression
 *    : SystemIdentifier | UnknownIdentifier
 *
 * relationalOperator
 *    : ">" | "<"
 */
class SelectParser extends CstParser {
    constructor() {
        super(allTokens, {
            nodeLocationTracking: 'onlyOffset'
        });

        const $ = this;

        $.RULE('identifierExpression', () => {
           $.OR([
               { ALT: () => $.CONSUME(SystemIdentifier) },
               { ALT: () => $.CONSUME(UnknownIdentifier) }
           ]);
        });

        $.RULE('selectStatement', () => {
            $.SUBRULE($.selectClause);
            $.CONSUME1(WhiteSpace);
            $.SUBRULE($.fromClause);
            $.OPTION(() => {
                $.CONSUME2(WhiteSpace);
                $.SUBRULE($.whereClause);
            })
        });

        $.RULE('selectClause', () => {
            $.CONSUME(Select);
            $.CONSUME1(WhiteSpace);
            $.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => {
                    $.SUBRULE($.identifierExpression);
                    $.CONSUME2(WhiteSpace);
                }
            })
        })

        $.RULE('fromClause', () => {
            $.CONSUME(From);
            $.CONSUME(WhiteSpace);
            $.SUBRULE($.identifierExpression);
        })

        $.RULE('whereClause', () => {
            $.CONSUME(Where);
            $.CONSUME(WhiteSpace);
            $.SUBRULE($.expression);
        });

        $.RULE('expression', () => {
           $.SUBRULE($.atomicExpression, { LABEL: 'lhs' });
           $.CONSUME1(WhiteSpace);
           $.SUBRULE($.relationalOperator);
           $.CONSUME2(WhiteSpace);
           $.SUBRULE2($.atomicExpression, { LABEL: 'rhs' });
        });

        $.RULE('atomicExpression', () => {
           $.OR([
               { ALT: () => $.CONSUME(Integer) },
               { ALT: () => $.SUBRULE($.identifierExpression) },
           ])
        });

        $.RULE('relationalOperator', () => {
           $.OR([
               { ALT: () => $.CONSUME(LessThan) },
               { ALT: () => $.CONSUME(GreaterThan) },
           ])
        });

        this.performSelfAnalysis();
    }
}

const parser = new SelectParser([], { outputCst: true });

function parse(text) {
    const lexingResult = lexer.tokenize(text);

    parser.input = lexingResult.tokens;
    const cst = parser.selectStatement();

    console.log('alksdjdasda', cst, text)

    if (parser.errors.length > 0) {
        // throw new Error("sad sad panda, Parsing errors detected")
        return {
            success: false,
            cst,
            errors: parser.errors,
            lexingResult,
        };
    }

    return {
        success: true,
        cst,
        lexingResult,
    };
}

// const inputText = 'SELECT column1 FROM table2';
// parse(inputText);

module.exports = {
    SelectParser,
    parser,
    parse,
}
