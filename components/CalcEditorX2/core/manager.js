import { Token } from "./token";

import { SelectionUtil } from "../utils/selection";


import { isElement } from "../utils/type";
import { getOffset, removeZeroSpaceText } from "../utils/util";
import {Select} from "@/chevrotain/lexer";

import { updateFunctionParamCursor$ } from '../../CalcFunction/observables';


export class Manager {
    constructor(editor) {
        this.editor = editor;

        const { originTokens } = editor;
        this.tokens = [];

        const me = this;
        originTokens.forEach((tokenMeta, index) => {
            me.insertToken(index, new Token(editor, tokenMeta));
        });

        this.updateTokens = this._updateTokens;
        // debounce， 输入中文时， 会出现中文变成zh中文；前面多了几个拼音；
        // this.updateTokens = debounce(this._updateTokens, 200);
    }

    get currentToken() {
        const selection = SelectionUtil.get();

        console.log('asldkajlskd', selection)

        const tokenIndex = this.getTokenByChildNodeIndex(selection.anchorNode);

        return this.tokens[tokenIndex];
    }

    get currentTokenIndex(){
        return this.tokens.findIndex(token => token === this.currentToken);
    }

    insertToken(index, token, replace = false) {
        if (replace) {
            this.tokens[index].$host.remove();
        }

        if (index === 0) {
            if (this.tokens.length) {
                const targetToken = this.tokens[1];

                if (targetToken) {
                    this.insertToDOM(token, 'beforebegin', targetToken);
                } else {
                    this.insertToDOM(token);
                }

            } else {
                this.insertToDOM(token);
            }

        } else {
            const previousToken = this.tokens[index - 1];

            this.insertToDOM(token, 'afterend', previousToken);
        }

        this.tokens.splice(index, replace ? 1 : 0, token);

        this.editor.event$.next({});
    }

    insertToDOM(token, position, target) {
        if (position) {
            target.$host.insertAdjacentElement(position, token.$host);
        } else {
            this.editor.$root.appendChild(token.$host);
        }
    }

    removeToken(token) {
        const index = this.tokens.findIndex(item => item === token);
        if (index >= 0) {
            this.tokens.splice(index, 1);
        }

        token.destroy();

        this.editor.event$.next({});
    }

    composeToken(tokenMeta) {
        return new Token(this.editor, tokenMeta);
    }

    getTokenByChildNodeIndex(childNode) {
        const $hosts = this.tokens.map(token => token.$host);

        if (!isElement(childNode)) {
            childNode = childNode.parentElement;
        }

        const firstLevelBlock = childNode.closest(`.x-token`);
        const index = $hosts.indexOf(firstLevelBlock);
        console.log('alksjdlasjd index', index, firstLevelBlock, childNode)

        if (!firstLevelBlock || index < 0) {
            return;
        }


        return index;
    }

    _updateTokens() {
        const { lexer, manager, caret } = this.editor;
        const me = this;

        const originTokens = [...this.tokens];

        caret.saveSelection();

        // 如果当前token是括号， 逗号， 不允许输入，插入新的token让用户输入，这样就只会改变类型， 不会拆分token
        originTokens.forEach((token, index) => {
            const text = removeZeroSpaceText(token.text);

            // 这个token被删了
            if (!token.$host.parentElement) {
                console.info('#manager', 'removeToken', token, index);
                this.removeToken(token);
                return;
            }

            if (token.isEmpty) {
                this.tokens.splice(index, 1);
                token.destroy();
                return;
            }


            const result = lexer.tokenize(text);
            const newTokens = result.tokens || [];

            if (newTokens.length === 1) {

                const newTokenMeta = newTokens[0];

                if (token.type !== newTokenMeta.tokenType.name) {
                    token.updateType(newTokenMeta);

                    if (newTokenMeta.tokenType.name === 'Data') {
                        // 移动光标到最后一个token尾部
                        const offset = index === 0 ? getOffset(newTokens) : getOffset(originTokens.slice(0, index)) + getOffset(newTokens)
                        caret.updatePos(offset);
                    } else {
                        caret.restoreSelection();
                    }
                }
            } else {
                // 在函数中输入时， 还是需要分词
               newTokens.forEach((tokenMeta, subIndex) => {
                   const newToken = me.composeToken(tokenMeta);
                   if (subIndex === 0) {
                       me.insertToken(index, newToken, true);
                   } else {
                       me.insertToken(index + subIndex, newToken);
                   }
               });

                // 移动光标到最后一个token尾部
                const tokenInnerOffset = getOffset(newTokens);
                const preTokensOffset = getOffset(originTokens.slice(0, index));

                const offset = index === 0 ? tokenInnerOffset : preTokensOffset + tokenInnerOffset;
                caret.updatePos(offset);
            }
        });

        this.editor.event$.next({});
    }
}

