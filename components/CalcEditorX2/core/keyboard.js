import {SelectionUtil} from "@/components/CalcEditorX2/utils/selection";

import { Token } from './token';
import { zeroSpaceChar } from "../utils/dom";


export class Keyboard {
    constructor(editor) {
        this.editor = editor;

        this.keyDownHandler = this._keyDownHandler.bind(this);
        this.mouseUpHandler = this._mouseUpHandler.bind(this);

        this.keyUpHandler = this._keyUpHandler.bind(this);

        this.isComposition = false;

        const $root = this.editor.$root;
        // 上下左右、enter, 用keypress的原因是， keydown的keyCode不区分大小写， keypress区分
        $root.addEventListener('keydown', this.keyDownHandler);

        // 设置currentBlock
        $root.addEventListener('mouseup', this.mouseUpHandler);

        // 其他输入
        $root.addEventListener('keyup', this.keyUpHandler);

        // 处理中文输入
        const me = this;
        document.addEventListener('compositionstart', (e) => {
            me.isComposition = true;

            console.info('___compositionstart', e.data);
        });

        document.addEventListener('compositionupdate', (e) => {
            console.info('___compositionupdate', e.data, me.isComposition);
        });

        document.addEventListener('compositionend', (e) => {
            console.info('#keyboard', 'compositionend');
            me.editor.manager.updateTokens();

            me.isComposition = false;
        });
    }

    _keyDownHandler(e) {
        const $root = this.editor.$root;

        if ($root.contains(e.target)) {
            this.keydown(e);
        }
    }

    keydown(e) {
        const { manager } = this.editor;
        const { currentToken, currentTokenIndex } = manager;

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
        if (this.isComposition || e.isComposing) {
            return;
        }

        switch(e.key) {
            case 'Shift':
            case 'Control':
            case 'Meta':
                break;

            case 'Backspace':
                // backspace
                this.backspace(e);
                break;

            case 'Enter':
                // enter
                e.preventDefault();

                // this.enter(e);
                break;

            case 'ArrowDown':
            case 'ArrowRight':
                this.arrowRightAndDown(e);
                break;

            case 'ArrowLeft':
            case 'ArrowUp':
                this.arrowLeftAndUp(e);
                break;

            case 9:
                // tab
                e.preventDefault();
                break;

            default:
                // if (this.prepare(e.key)) {
                //     e.preventDefault();
                // }

                console.info('___keydown', e.key);

                break;
        }
    }

    prepare(char) {
        const { manager } = this.editor;
        const { currentToken, currentTokenIndex } = manager;

        console.info('##char', currentToken.type);

        // 这里最主要是处理Data，因为data比较特殊，不能让用户在data中输入
       if (
            !['FunctionType', 'WhiteSpace', 'Unknown'].includes(currentToken?.type)
        ) {
            // 如果当前token是括号， 逗号， 不允许输入，插入新的token让用户输入，这样就只会改变类型， 不会拆分token

            const token = manager.composeToken({
                ...Token.placeHolderToken,
                image: char,
            });

            manager.insertToken(currentTokenIndex + 1, token);
            SelectionUtil.setCursor(token.$host, 1);

            return true;
        }

        return false;
    }

    _keyUpHandler(e) {
        const $root = this.editor.$root;

        if ($root.contains(e.target)) {
            this.keyup(e);
        }
    }

    keyup(e) {
        const { manager, caret } = this.editor;

        if (this.isComposition) {
            return;
        }

        // 方向键， 需要特殊处理， 遇到data，跳过
        if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            return;
        }

        if (manager.tokens.length) {
            // 输入字符， 校验所有tokens
            manager.updateTokens();
        }

        // 全部删除时，会自动插入一个<br>, 手动删除这个br
        // https://stackoverflow.com/questions/14638887/br-is-inserted-into-contenteditable-html-element-if-left-empty
        if (this.editor.$root.textContent === '') {

            this.editor.$root.innerHTML = '';

            // 创建一个空placeholder进去
            const token = manager.composeToken({
                ...Token.placeHolderToken,
                image: '&ZeroWidthSpace;',
            });

            manager.insertToken(0, token);
            caret.resetEmpty(token);
        }
    }

    _mouseUpHandler(e) {
        const $root = this.editor.$root;

        if ($root.contains(e.target)) {
            this.mouseup(e);
        }
    }

    mouseup(e) {
        const { caret } = this.editor;

        caret.saveSelection();
    }

    arrowRightAndDown(e) {
        const { caret } = this.editor;

        console.log('asldkjasd', caret)

        e.preventDefault();
        caret.next();
    }

    arrowLeftAndUp(e) {
        const { caret } = this.editor;

        e.preventDefault();
        caret.prev();
    }

    backspace(e) {
        const { manager, caret } = this.editor;
        const { currentToken, tokens } = manager;

        if (tokens.length) {
            if (currentToken?.type === 'Data') {
                e.preventDefault();

                manager.removeToken(currentToken);
                caret.prev();
            }

        }


        // console.info('#currentTOken', tokens);

    }
}
