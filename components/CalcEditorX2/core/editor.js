import { Subject } from "rxjs";


import {Manager} from "./manager";
import {Caret} from "./caret";
import {Keyboard} from "./keyboard";
import {createLexer, allTokens} from "../lexer";
import {Parser} from '../parser';

/**
 * 简化， tokenType只有data和string ，不能有unknown、functionType等，
 * 原因： 对于Date(attr1, DateIf(attr2))这种个， 没办法在输出的过程中构造这个结构，存在递归；
 */
export class Editor {
    constructor({ originText, mountNode }) {
        this.event$ = new Subject({});

        this.lexer = createLexer();

        if (originText) {
            this.originTokens = this.lexer.tokenize(originText).tokens;
        } else {
            this.originTokens = [];
        }

        console.log('asldkajsld', originText)

        this.$root = document.createElement('div');
        this.$root.contentEditable = 'true';
        this.$root.classList.add('x-root');
        this.manager = new Manager(this);
        this.caret = new Caret(this);
        this.keyboard = new Keyboard(this);
        this.parser = new Parser(allTokens, { outputCst: true });

        // const BaseSQLVisitor = this.parser.getBaseCstVisitorConstructor();

        // class SQLToAstVisitor extends BaseSQLVisitor {
        //     constructor() {
        //       super()
        //       this.validateVisitor()
        //     }
          
        //     // The Ctx argument is the current CSTNode's children.
        //     setCalculationFormula(ctx) {
        //       // Each Terminal or Non-Terminal in a grammar rule are collected into
        //       // an array with the same name(key) in the ctx object.
        //       console.log('aslkdjalksdj', ctx)
        //       let columns = ctx.calcClause.map((identToken) => identToken.image)
          
        //       return {
        //         type: "setCalculationFormula",
        //         columns: columns
        //       }
        //     }

        //     calcClause(ctx) {
        //         // Each Terminal or Non-Terminal in a grammar rule are collected into
        //         // an array with the same name(key) in the ctx object.
        //         let columns = ctx.Identifier.map((identToken) => identToken.image)
  
        //         console.log('alksdjalksdj', ctx, columns)
            
        //         return {
        //           type: "calcClause",
        //           columns: columns
        //         }
        //       }

        //       bracketRule(ctx) {
        //         // Each Terminal or Non-Terminal in a grammar rule are collected into
        //         // an array with the same name(key) in the ctx object.
        //         let columns = ctx.Identifier.map((identToken) => identToken.image)
  
        //         console.log('alksdjalksdj', ctx, columns)
            
        //         return {
        //           type: "bracketRule",
        //           columns: columns
        //         }
        //       }

        //       clauseParams(ctx) {
        //         // Each Terminal or Non-Terminal in a grammar rule are collected into
        //         // an array with the same name(key) in the ctx object.
        //         let columns = ctx.Identifier.map((identToken) => identToken.image)
  
        //         console.log('alksdjalksdj', ctx, columns)
            
        //         return {
        //           type: "clauseParams",
        //           columns: columns
        //         }
        //       }
        //   }

        // console.log('aslkdajskldj', BaseSQLVisitor)

        // this.visitor = new SQLToAstVisitor();

        this.init(mountNode);
        this.getAST = function() {
            const text = originText
            const lexingResult = this.lexer.tokenize(text);
    
            this.parser.input = lexingResult.tokens;
            const cst = this.parser.setCalculationFormula();

            // const ast = this.visitor.visit(cst)
            
            console.log('debugger cst', cst, text);
    
            if (this.parser.errors.length > 0) {
                return {
                    success: false,
                    cst,
                    errors: this.parser.errors,
                    lexingResult,
                };
            }
        
            return {
                success: true,
                cst,
                lexingResult,
            };
        }
    }

    init(mountNode) {
          if (mountNode) {
              mountNode.innerHTML = '';

              mountNode.appendChild(this.$root);
          }
    }

}
