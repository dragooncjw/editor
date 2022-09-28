import {isTextNode} from "@/components/CalcEditorX/util";

export function debounce(fn,  wait = 50) {
    let timer = null;

    return function(...args) {
        const me = this;

        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(me, args);
        }, wait)
    }
}

export const getFirstTextNode = (node) => {
    while(!isTextNode(node)) {
        node = node.firstChild;
    }

    return node;
}

export const removeZeroSpaceText = (text) => {
    return text.replace(/[\u200B-\u200D\uFEFF]/g, '');
}

export const getOffset = (tokens) => {
    return tokens.reduce((acc, crt) => {
        if (crt.type === 'Data' || crt.tokenType?.name === 'Data') {
            return acc + 1;
        } else {
            if (crt.image) {
                return acc + crt.image.length;
            } else {
                return acc + crt.text.length;
            }
        }
    }, 0);
};
