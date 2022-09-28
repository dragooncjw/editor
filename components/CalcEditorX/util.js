import { createElement } from 'react';

import * as components from './component';

export const toElement = (tokens) => {
    if (!tokens?.length) {
        return [];
    }


    return tokens.map((token, index) => {
        const component = components[token.tokenType.name];

        if (!component) {
            return '';
        }

        return createElement(components.TokenWrap, {
            key: index,
            index,
            zeroSpace: token.tokenType.name === 'Data' ? 1 : 0,
        }, [
            createElement(component, {
                key: token.startOffset,
                ...token
            }, [])
        ])
    })
}

export const isElement = (node) => {
    return node?.nodeType === Node.ELEMENT_NODE;
}

export const isTextNode = (node) => {
    return node?.nodeType === Node.TEXT_NODE;
}

export const toArray = (arrayLike) => {
    return Array.slice.prototype.call(arrayLike);
}

// https://52sbl.cn/discussion/5024.html
export const getChar = (keyCode) => {
    let chrCode = keyCode - 48 * Math.floor(keyCode / 48);
    return String.fromCharCode((96 <= keyCode) ? chrCode: keyCode);
}

export const getContentLength = (node) => {
    if (isTextNode(node)) {
        return node.length;
    }

    return node.textContent.length;
}

/**
 * Search for deepest node which is Leaf.
 * Leaf is the vertex that doesn't have any child nodes
 *
 * @description Method recursively goes throw the all Node until it finds the Leaf
 *
 * @param {Node} node - root Node. From this vertex we start Deep-first search
 *                      {@link https://en.wikipedia.org/wiki/Depth-first_search}
 * @param {boolean} [atLast] - find last text node
 *
 * @returns {Node} - it can be text Node or Element Node, so that caret will able to work with it
 */
export const getDeepestNode = (node, atLast = false) => {
    /**
     * Current function have two directions:
     *  - starts from first child and every time gets first or nextSibling in special cases
     *  - starts from last child and gets last or previousSibling
     *
     * @type {string}
     */
    const child = atLast ? 'lastChild' : 'firstChild',
        sibling = atLast ? 'previousSibling' : 'nextSibling';

    if (node && node.nodeType === Node.ELEMENT_NODE && node[child]) {
        let nodeChild = node[child];

        return getDeepestNode(nodeChild, atLast);
    }

    return node;
}

export const closestToken = (node) => {
    if (!isElement(node)) {
      node = node.parentElement;
    }

    return node.closest(`.${components.TokenClz}`);
}

export const getFirstTextNode = (node) => {
    while(!isTextNode(node)) {
        node = node.firstChild;
    }

    return node;
}

export const getNextEditableToken = (token) => {
    if (!token) {
        return null;
    }

    while(token.dataset.zerospace === '1') {
        token = token.nextElementSibling;
    }

    return token;
}

export const moveCaretNext = (containerNode) => {
    const selection = window.getSelection();
    const { focusNode, focusOffset } = selection || {};


    if (!containerNode || !selection || !focusNode) {
        return;
    }

    // 如果在最后了， 不移动
    const lastNode = getDeepestNode(containerNode, true);
    const len = getContentLength(focusNode);
    if (lastNode === focusNode && focusOffset === len) {
        return;
    }

    try {
        // 判断range是否在endContainer的最后了，如果不是， endOffset + 1, 否则，找下个token，设置offset位0
        let range = selection.getRangeAt(0);
        if (focusOffset < len - 1) {
            // text Node
            range.setStart(getFirstTextNode(focusNode), focusOffset + 1);
            range.collapse(true);
        } else {
            const $token = closestToken(focusNode);

            if ($token.nextElementSibling) {
                range.setStart(getNextEditableToken($token.nextElementSibling), 0);
                range.collapse(true);
            } else {
                // set to end
                const cloneRange = range.cloneRange();

                cloneRange.selectNodeContents(containerNode);
                cloneRange.setStart(range.endContainer, range.endOffset);
                cloneRange.collapse(false);
                range = cloneRange;
            }

        }

        selection.removeAllRanges();
        selection.addRange(range);
    } catch(e) {
        debugger;
    }
}
