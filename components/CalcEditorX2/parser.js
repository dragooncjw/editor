const { CstParser } = require('chevrotain');
import { FunctionType, Comma, Unknown, LBracket, RBracket, Data } from './lexer';

/**
 * My Rule:
 * setCalculationFormula
 *    calcClause
 * 
 * calcClause
 *    "Data" bracketRule 
 * 
 * bracketRule
 *    "LBracket" (clauseParams)? "RBracket"
 */

// 记录所有的rules，用于遍历cst
export const RULES = [
  'setCalculationFormula',
  'calcClause',
  'bracketRule',
  'clauseParams',
]

export class Parser extends CstParser {
  constructor(tokens) {
    // this.editor = editor;
    console.log('alskdjaklsdj', tokens)
    super(tokens, {
      nodeLocationTracking: 'onlyOffset'
    })
    const $ = this;

    $.RULE('setCalculationFormula', () => {
      $.SUBRULE($.calcClause)
    });

    $.RULE('calcClause', () => {
      $.CONSUME(FunctionType)
      $.SUBRULE($.bracketRule)
    })

    $.RULE('bracketRule', () => {
      $.CONSUME1(LBracket)
      $.AT_LEAST_ONE(() => {
        $.SUBRULE2($.clauseParams)
      })
      $.CONSUME2(RBracket)
    })

    $.RULE('clauseParams', () => {
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          $.OR([
            {
              ALT: () => $.CONSUME1(Unknown)
            },
            {
              ALT: () => $.SUBRULE($.calcClause)
            },
            {
              ALT: () => $.CONSUME2(Data)
            },
          ])
        }
      })
    })

    this.performSelfAnalysis();
  }
}
