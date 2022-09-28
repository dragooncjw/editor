import {isElement} from "./type";
import {removeZeroSpaceText} from "./util";
import {getContentLength, getDeepestNode} from "@/components/CalcEditorX2/utils/dom";


export class SelectionUtil {
    static get() {
        return window.getSelection();
    }

    static get anchorNode() {
        const selection = SelectionUtil.get();

        return selection ? selection.anchorNode : null;
    }

    static get anchorElement() {
        const anchorNode = SelectionUtil.anchorNode;

        if (!anchorNode) {
            return null;
        }

        if (!isElement(anchorNode)) {
            // 如果是textNode的话，由于textNode没有class、id等属性，一般要获取它的parentElement操作
            return anchorNode.parentElement;
        } else {
            return anchorNode;
        }
    }

    static get anchorOffset() {
        const selection = SelectionUtil.get();

        return selection ? selection.anchorOffset : null;
    }

    static get isCollapsed() {
        const selection = SelectionUtil.get();

        return selection ? selection.isCollapsed : null;
    }

    static isSelectionAtEditor(selection) {
        if (!selection) {
            return false;
        }

        let selectedNode = selection.anchorNode || selection.focusNode;

        if (!isElement(selectedNode)) {
            selectedNode = selectedNode.parentNode;
        }

        const workingArea = selectedNode.closest(`.x-root`);
        return !!workingArea;
    }

    static isRangeAtEditor(range) {
        if (!range) {
            return false;
        }

        let selectedNode = range.startContainer;

        if (!isElement(selectedNode)) {
            selectedNode = selectedNode.parentNode;
        }

        const workingArea = selectedNode.closest(`.x-root`);
        return !!workingArea;
    }

    static isSelectionExist() {
        const selection = SelectionUtil.get();
        return !!selection.anchorNode;
    }

    static get range() {
        return this.getRangeFromSelection(this.get());
    }

    // 除了firefox浏览器外， 其他的getRangeAt的index只能为0
    static getRangeFromSelection(selection) {
        return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
    }

    static get text() {
        const selection = this.get();

        return selection ? selection.toString() : '';
    }

    // The cursor is the graphical image that represents the mouse.
    // It can either be an arrow for pointing, a hand, an hourglass, or an I-shaped text selector.
    // The caret, on the other hand, is the blinking object that is used to enter text.
    static setCursor(element, offset) {
        const range = document.createRange();
        const selection = this.get();

        range.setStart(element, offset);
        // range.setEnd(element, offset);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);

        return range.getBoundingClientRect();

    }

    static collapseToEnd() {
        const selection = this.get();
        // selection.collapseToEnd();

        const { focusNode } = selection;

        const range = document.createRange();

        const rightLeafNode = getDeepestNode(focusNode, true);

        range.setStart(rightLeafNode, getContentLength(rightLeafNode));
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
    }

    static expandToTag(element) {
        const selection = this.get();
        const range = document.createRange();

        range.selectNodeContents(element);

        // 如果不removeAllRanges， 存在多个range， 那么浏览器会异常， 显示不符合预期
        selection.removeAllRanges();
        selection.addRange(range);
    }

    static getElementText(element) {
        const selection = this.get();
        const range = document.createRange();

        range.selectNodeContents(element);

        return range.toString();
    }



    // [废弃]重新整理， 要根据zeroSpace计算， 不要直接toString
    static _saveSelection(containerEl) {
        const range = this.range;
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = removeZeroSpaceText(preSelectionRange.toString()).length;

        return {
            start: start,
            end: start + removeZeroSpaceText(range.toString()).length
        }
    };

    // [废弃]重新整理， 要根据zeroSpace计算， 不要直接toString
    static _restoreSelection(containerEl, savedSel) {
        let charIndex = 0, range = this.range;
        range.setStart(containerEl, 0);
        range.collapse(true);
        let nodeStack = [containerEl], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            // text
            if (node.nodeType == 3) {
                const nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    // 这里node如果是
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    const child = node.childNodes[i];

                    // 过滤zeroSpace
                    if (child.dataset?.zeroSpace !== 'true') {
                        nodeStack.push(node.childNodes[i]);
                    }
                }
            }
        }

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
