import {isTextNode} from "./type";

export const make = (tag) => {
    return document.createElement(tag);
}

export const allInputsSelector = () => {
    const allowedInputTypes = ['text', 'password', 'email', 'number', 'search', 'tel', 'url'];

    return '[contenteditable=true], textarea, input:not([type]), ' +
        allowedInputTypes.map((type) => `input[type="${type}"]`).join(', ');
}

export const findAllInputs = (node) => {
    return Array.prototype.slice.call(node.querySelectorAll(allInputsSelector()));
}

export const findInput = (node) => {
    return findAllInputs(node)[0];
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

        /**
         * special case when child is single tag that can't contain any content
         */
        if (
            isSingleTag(nodeChild) &&
            !isNativeInput(nodeChild) &&
            !isLineBreakTag(nodeChild)
        ) {
            /**
             * 1) We need to check the next sibling. If it is Node Element then continue searching for deepest
             * from sibling
             *
             * 2) If single tag's next sibling is null, then go back to parent and check his sibling
             * In case of Node Element continue searching
             *
             * 3) If none of conditions above happened return parent Node Element
             */
            if (nodeChild[sibling]) {
                nodeChild = nodeChild[sibling];
            } else if (nodeChild.parentNode[sibling]) {
                nodeChild = nodeChild.parentNode[sibling];
            } else {
                return nodeChild.parentNode;
            }
        }

        return getDeepestNode(nodeChild, atLast);
    }

    return node;
}

/**
 * Check if passed tag has no closed tag
 *
 * @param {HTMLElement} tag - element to check
 * @returns {boolean}
 */
export const isSingleTag = (tag) => {
    return tag.tagName && [
        'AREA',
        'BASE',
        'BR',
        'COL',
        'COMMAND',
        'EMBED',
        'HR',
        'IMG',
        'INPUT',
        'KEYGEN',
        'LINK',
        'META',
        'PARAM',
        'SOURCE',
        'TRACK',
        'WBR',
    ].includes(tag.tagName);
}

/**
 * Checks target if it is native input
 *
 * @param {*} target - HTML element or string
 *
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNativeInput = (target) => {
    const nativeInputs = [
        'INPUT',
        'TEXTAREA',
    ];

    return target && target.tagName ? nativeInputs.includes(target.tagName) : false;
}

/**
 * Check if element is BR or WBR
 *
 * @param {HTMLElement} element - element to check
 * @returns {boolean}
 */
export const isLineBreakTag = (element) => {
    return element && element.tagName && [
        'BR',
        'WBR',
    ].includes(element.tagName);
}

export const getContentLength = (node) => {
    if (isTextNode(node)) {
        return node.length;
    }

    return node.textContent.length;
}

export const createZeroSpace = () => {
    const $zeroSpace = document.createElement('span');
    $zeroSpace.dataset.zeroSpace = 'true';
    $zeroSpace.innerHTML = '&ZeroWidthSpace;';
    return $zeroSpace;
}

export const zeroSpaceChar = '&ZeroWidthSpace;';
