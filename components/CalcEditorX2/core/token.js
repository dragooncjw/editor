import {createZeroSpace} from "../utils/dom";
import {removeZeroSpaceText} from "../utils/util";

import {Bracket} from "./bracket";


export class Token {
    constructor(editor, tokenMeta) {
        this.editor = editor;
        this.tokenMeta = tokenMeta;
        this.$host = document.createElement('span');
        this.$host.classList.add('x-token');
        this.$textHost = document.createElement('span');
        this.$textHost.classList.add('x-token-text');

        this.bracket = new Bracket(editor, this);
        this.initDOM();
    }

    static get placeHolderToken() {
        return {
            image: '',
            tokenType: {
                name: 'Unknown',
            }
        };
    }

    static get dataToken() {
        return {
            image: '',
            tokenType: {
                name: 'Data',
            }
        };
    }

    get isZeroSpace() {
        return this.type === 'Data' || this.tokenMeta.isZeroSpace;
    }

    get text() {
        return removeZeroSpaceText(this.$textHost.innerText);
    }

    get isEmpty() {
        return this.text.length === 0;
    }

    get type() {
        return this.tokenMeta?.tokenType?.name;
    }


    initDOM() {
        const { tokenType, image } = this.tokenMeta;
        const type = tokenType.name;

        // 要放一个zero space 的dom结构进去，保证既可以切换光标， 又删除是一位；
        if (this.isZeroSpace) {

            const $image = document.createElement('span');
            $image.innerText = image;
            $image.contentEditable = 'false';

            const $preZeroSpace = createZeroSpace();
            $preZeroSpace.dataset.ignore = 'true';
            this.$textHost.appendChild($preZeroSpace);
            this.$textHost.appendChild($image);
            // 不加后面的， 光标无法移动到后面
            const $postZeroSpace = createZeroSpace();
            this.$textHost.appendChild($postZeroSpace);

        } else {
            this.$textHost.innerHTML = image;
        }

        this.$textHost.classList.add(`x-type-${type.toLowerCase()}`);
        this.$host.appendChild(this.$textHost);
    }

    destroy() {
        this.$host.remove();

        this.bracket.removeEvent();
    }

    updateType(newTokenMeta) {
        // 不考虑data的变化， data只能删， 不能改
        const originType = this.type;
        const newType = newTokenMeta.tokenType.name;

        this.tokenMeta = newTokenMeta;
        this.$host.innerHTML = '';
        this.$textHost.innerHTML = '';
        this.$textHost.classList.remove(`x-type-${originType.toLowerCase()}`);
        this.initDOM();


        // if (originType !== 'Data') {
        //     this.$textHost.classList.remove(`x-type-${this.type.toLowerCase()}`);
        //     this.$textHost.classList.add(`x-type-${newType.toLowerCase()}`);
        //
        //     this.tokenMeta = newTokenMeta;
        // }
    }
}
