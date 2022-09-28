const { parse } = require('./parser');

const BaseVisitor = parser.getBaseCstVisitorConstructor();

class SQLVisitor extends BaseVisitor {
    constructor() {
        super();

        this.validateVisitor();
    }

    selectClause(ctx) {
        console.info(ctx);

        // Each Terminal or Non-Terminal in a grammar rule are collected into
        // an array with the same name(key) in the ctx object.
        let columns = ctx.Identifier.map((identToken) => identToken.image)

        return {
            type: 'SELECT_CLAUSE',
            columns: columns,
        }
    }

    selectStatement(ctx) {
        // "this.visit" can be used to visit none-terminals and will invoke the correct visit method for the CstNode passed.
        let select = this.visit(ctx.selectClause)

        //  "this.visit" can work on either a CstNode or an Array of CstNodes.
        //  If an array is passed (ctx.fromClause is an array) it is equivalent
        //  to passing the first element of that array
        let from = this.visit(ctx.fromClause)

        // "whereClause" is optional, "this.visit" will ignore empty arrays (optional)
        let where = this.visit(ctx.whereClause)

        return {
            type: "SELECT_STMT",
            selectClause: select,
            fromClause: from,
            whereClause: where
        }
    }

    fromClause(ctx) {
        const tableName = ctx.Identifier[0].image

        return {
            type: "FROM_CLAUSE",
            table: tableName
        }
    }

    whereClause(ctx) {
        const condition = this.visit(ctx.expression)

        return {
            type: "WHERE_CLAUSE",
            condition: condition
        }
    }

    expression(ctx) {
        // Note the usage of the "rhs" and "lhs" labels defined in step 2 in the expression rule.
        const lhs = this.visit(ctx.lhs[0])
        const operator = this.visit(ctx.relationalOperator)
        const rhs = this.visit(ctx.rhs[0])

        return {
            type: "EXPRESSION",
            lhs: lhs,
            operator: operator,
            rhs: rhs
        }
    }

    // these two visitor methods will return a string.
    atomicExpression(ctx) {
        if (ctx.Integer) {
            return ctx.Integer[0].image
        } else {
            return ctx.Identifier[0].image
        }
    }

    relationalOperator(ctx) {
        if (ctx.GreaterThan) {
            return ctx.GreaterThan[0].image
        } else {
            return ctx.LessThan[0].image
        }
    }
}

const visitor = new SQLVisitor();

/**
 * AST vs CST
 * There are two major differences.
 *
 * An Abstract Syntax Tree would not normally contain all the syntactic information. This mean the exact original text can not always be re-constructed from the AST.
 * An Abstract Syntax Tree would not represent the whole syntactic parse tree. It would normally only contain nodes related to specific parse tree nodes, but not all of those (mostly leaf nodes).
 *
 * #
 */
// https://stackoverflow.com/questions/1888854/what-is-the-difference-between-an-abstract-syntax-tree-and-a-concrete-syntax-tre
function toAst(inputText) {
    const cst = parse(inputText);

    const ast = visitor.visit(cst);

    return ast;
}

console.info(toAst('SELECT column1 FROM table2'));



