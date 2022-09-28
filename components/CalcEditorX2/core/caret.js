import {SelectionUtil } from '../utils/selection';
import {getDeepestNode, getContentLength} from "../utils/dom";
import { getOffset } from "../utils/util";
import { updateFunctionParamCursor$ } from '@/components/CalcFunction/observables';


export class Caret {
    constructor(editor) {
        this.editor = editor;

        // 基于文本的offset， 一个字符算1个， 一个data算1个
        this._offset = 0;
    }

    get offset() {
        return this._offset
    }

    set offset(value) {
        this._offset = value
        console.log('alksjdlaksjd', value, this)
        // 使用keyboard方向键的时候window.getSelection会有滞后
        // 需要保证在下一帧渲染的时候获取tokenIndex返回
        setTimeout(() => {
            updateFunctionParamCursor$.next(this)
        }, 0)
    }

    // 找最左子树node， 判断caret的anchorNode是不是最左子node， 如果是， 就是start
    // get isAtStart() {
    //     const selection = SelectionUtil.get();
    //     const { manager } = this.editor;
    //
    //     if (manager.currentToken.type === 'Data') {
    //         return true;
    //     }
    //
    //     const leftLeafNode = getDeepestNode(manager.currentToken.$host);
    //
    //     if (!selection || !selection.anchorNode) {
    //         return false;
    //     }
    //
    //     const anchorNode = SelectionUtil.anchorNode;
    //     const anchorOffset = SelectionUtil.anchorOffset;
    //
    //     return anchorNode === leftLeafNode && anchorOffset === 0;
    // }
    //
    // // 找最右侧子树node
    // get isAtEnd() {
    //     const selection = SelectionUtil.get();
    //     const { manager } = this.editor;
    //
    //     if (manager.currentToken.type === 'Data') {
    //         // data开始就是end
    //         return true;
    //
    //     }
    //
    //     const rightLeafNode = getDeepestNode(manager.currentToken.$host, true);
    //
    //     debugger;
    //     if (!selection || !selection.anchorNode) {
    //         return false;
    //     }
    //
    //     const anchorNode = SelectionUtil.anchorNode;
    //     const anchorOffset = SelectionUtil.anchorOffset;
    //
    //     const len = getContentLength(anchorNode);
    //
    //     return anchorNode === rightLeafNode && anchorOffset === len;
    //
    //
    // }
    //
    // navigatePrevious(len = 1) {
    //     const { manager } = this.editor;
    //     const { previousToken } = manager;
    //
    //     if (!previousToken) {
    //         return false;
    //     }
    //
    //     if (this.isAtStart) {
    //         manager.setCurrentTokenByChildNode(previousToken.$host);
    //     }
    //
    //     return false;
    // }
    //
    // navigateNext(len = 1) {
    //     const { manager, caret } = this.editor;
    //     const { nextToken, currentToken, nextEditableToken } = manager;
    //
    //     console.info('##nextToken', this.isAtEnd, currentToken.text, nextToken.text);
    //
    //     if (!nextToken) {
    //         return false;
    //     }
    //
    //     if (this.isAtEnd) {
    //         if (nextToken.type === 'Data') {
    //             // 如果是data， 就到结束
    //             // SelectionUtil.expandToTag(nextToken.$textHost);
    //             // SelectionUtil.collapseToEnd();
    //
    //             SelectionUtil.setCursor(nextToken.$textHost, 3);
    //         } else {
    //             // 否则， 就到开始的第一个
    //             SelectionUtil.setCursor(nextToken.$textHost.firstChild, 1);
    //         }
    //
    //         manager.setCurrentTokenByChildNode(nextToken.$host);
    //
    //         return true;
    //     }
    //
    //     return false;
    // }

    // navigatePreviousText(len = 1) {
    //     const selection = SelectionUtil.get();
    //     const { focusNode, focusOffset } = selection;
    //
    //     let offset = focusOffset - len - 1;
    //     if (offset < 0) {
    //         offset = 0;
    //     }
    //     SelectionUtil.setCursor(getFirstTextNode(focusNode), offset);
    // }
    //
    // navigateNextText(len = 1) {
    //     const selection = SelectionUtil.get();
    //     const { focusNode, focusOffset } = selection;
    //
    //     const textNode = getFirstTextNode(focusNode);
    //     let offset = focusOffset + len + 1;
    //     const contentLength = getContentLength(textNode);
    //
    //     if (offset > contentLength) {
    //         offset = contentLength;
    //     }
    //     SelectionUtil.setCursor(textNode, offset);
    // }
    //
    // setToToken(token, position = 0) {
    //     const { manager } = this.editor;
    //     let element;
    //     let offset = 0;
    //
    //     switch(position) {
    //         case 'start':
    //             // firstChild 是.ce-block下面的p
    //             element = getDeepestNode(token.$host);
    //             break;
    //         case 'end':
    //             element = getDeepestNode(token.$host, true)
    //             offset = getContentLength(element);
    //             break;
    //         default:
    //             element = getDeepestNode(token.$host);
    //             break;
    //     }
    //
    //     if (!element) {
    //         return;
    //     }
    //
    //     manager.setCurrentTokenByChildNode(token.$host);
    //     this.set(element, offset);
    // }
    //
    // set(element, offset) {
    //     const { top, bottom } = SelectionUtil.setCursor(element, offset);
    //
    //     if (top < 0) {
    //         window.scrollBy(0, top);
    //     }
    //
    //     if (bottom > window.innerHeight) {
    //         window.scrollBy(0, bottom - innerHeight);
    //     }
    // }

    getEditorLen(){
        return getOffset(this.editor.manager.tokens);
    }

    next() {
        const len = this.getEditorLen();

        if (this.offset >= len) {
            return;
        }

    }

    prev() {
        if (this.offset <= 0) {
            return;
        }

        this.offset--;

        this.updatePos(this.offset);
    }

    resetEmpty(token) {
        this.offset = 0;

        const range = document.createRange();
        range.setStart(token.$textHost, 0);
        range.collapse(true);

        const selection = SelectionUtil.get();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    updatePos(offset) {
        const len = this.getEditorLen();
        if (offset > len) {
            offset = len;
        }

        if (offset < 0) {
            offset = 0;
        }

        console.info('#offset', offset);

        const { $root: containerEl } = this.editor;

        let range = document.createRange();

        let charIndex = 0;
        range.setStart(containerEl, 0);
        range.collapse(true);
        let nodeStack = [containerEl], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            // text
            if (node.nodeType == 3) {
                const nextCharIndex = charIndex + node.length;

                if (!foundStart && offset >= charIndex && offset <= nextCharIndex) {
                    range.setStart(node, offset - charIndex);
                    foundStart = true;
                }
                if (foundStart && offset >= charIndex && offset <= nextCharIndex) {
                    // 这里node如果是
                    range.setEnd(node, offset - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    const child = node.childNodes[i];

                    // 过滤zeroSpace的text，data只保留第一个zeroSpace，长度为1；
                    if (child.contentEditable !== 'false' && child.dataset?.ignore !== 'true') {
                        nodeStack.push(node.childNodes[i]);
                    }
                }
            }
        }

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }



    saveSelection() {
        const { manager } = this.editor;
        const { tokens } = manager;

        const range = SelectionUtil.range;
        if (!range) {
            return;
        }

        const { endOffset, endContainer } = range || {};

        const tokenIndex = manager.getTokenByChildNodeIndex(endContainer);

        const token = tokens[tokenIndex];
        if (!token) {
            return;
        }


        let tokenStart = 0;
        let offset = 0;

        if (tokenIndex > 0) {
            tokenStart = getOffset(tokens.slice(0, tokenIndex));
        }

        if (token.type === 'Data') {
            offset = 1;
        } else {
            offset = endOffset;
        }


        this.offset = tokenStart + offset;
    }

    restoreSelection(delta = 0) {
        const { $root: containerEl } = this.editor;

        const offset = this.offset + delta;

        this.updatePos(offset);
    }
}

