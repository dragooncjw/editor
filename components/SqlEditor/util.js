import { createElement } from 'react';

import { components } from './components';

export const toElement = (tokens) => {
    return tokens.map(token => {
        const component = components[token.tokenType.name];
        return createElement(component, {
            image: token.image,
            startOffset: token.startOffset,
            endOffset: token.endOffset,
            _chars: token.children,
        }, null);
    })
}

export const getTextWidth = () => {
    if (typeof window === 'undefined') {
        return 0;
    }

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.font = '14px "Courier New", Courier, monospace';
    const text = ctx.measureText('a');
    return text.width;
};

export const measureText = (char) => {
    if (typeof window === 'undefined') {
        return 0;
    }

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.font = '14px "Courier New", Courier, monospace';
    const text = ctx.measureText(char);

    return {
        width: text.width,
        height: 20,
    }
};

export const toRenderTokens = (tokens) => {
    return tokens.map(token => {
        const newToken = { ...token };

        newToken._chars = token.image.split('').map((char, index) => {
            const bounds = measureText(char);

            return {
                char,
                offset: token.startOffset + index,
                bounds,
            };
        });

        return newToken;
    });
}

export const isInsideEditor = (x, y) => {
    const $innerContent = document.getElementById('innerContainer');

    const rect = $innerContent.getBoundingClientRect();

    return x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height;
}

// 同一个token不能有换行的情况
export const getCaret = (tokens, $tokenEl, clientX) => {
    if (!tokens?.length || !$tokenEl) {
        return null;
    }


    const { dataset } = $tokenEl || {};
    console.info('##tokenEl', tokens, dataset);

    const rect = $tokenEl.getBoundingClientRect();
    const charLeft = clientX - rect.left;


    const { startoffset: offset } = dataset || {};

    if (offset === undefined) {
        return null;
    }

    const token = tokens.find(token => Number(offset) >= token.startOffset && Number(offset) <= token.endOffset);

    if (!token) {
        debugger;
    }

    const charOffsetLeft = token._chars.reduce((acc, crt) => {
        if (crt.bounds.width + acc <= charLeft) {
            return crt.bounds.width + acc;
        }

        return acc;
    }, 0);

    return {
        top: rect.top,
        left: rect.left + charOffsetLeft,
        offset,
    };
};

// 如果跨token， 需要根据token的dom id， 取到节点，再计算位置；考虑到跨行的情况
export const nextCaret = (tokens, caret) => {
    const offset = Number(caret?.offset) || 0;

    let token, tokenIndex, lastToken;

    tokens.forEach((item, index) => {
        if (Number(offset) >= item.startOffset && Number(offset) <= item.endOffset) {
            token = item;
            tokenIndex = index;
        }
    });
    lastToken = tokens[tokens.length - 1];


    let charOffset, nextChar;

    if (Number(offset) + 1 > token.endOffset) {
        token = tokens[tokenIndex + 1];
        charOffset = 0;
        nextChar = token._chars[charOffset];
    } else {
        charOffset = Number(offset) + 1 - token.startOffset;
        nextChar = token._chars[charOffset] || {};
    }

    return {
        top: caret.top,
        left: caret.left + nextChar.bounds.width,
        offset: offset >= lastToken.endOffset ? Number(lastToken.endOffset) : Number(offset) + 1,
    }
}

// 如果跨token， 需要根据token的dom id， 取到节点，再计算位置；考虑到跨行的情况
export const prevCaret = (tokens, caret) => {
    const offset = Number(caret?.offset) || 0;

    let token, tokenIndex;

    tokens.forEach((item, index) => {
        if (Number(offset) >= item.startOffset && Number(offset) <= item.endOffset) {
            token = item;
            tokenIndex = index;
        }
    });


    let charOffset, prevChar;

    if (Number(offset) - 1 < token.startOffset) {
        token = tokens[tokenIndex - 1];
        charOffset = token.endOffset - token.startOffset;
        prevChar = token._chars[charOffset];
    } else {
        charOffset = Number(offset) - 1 - token.startOffset;
        prevChar = token._chars[charOffset] || {};
    }

    return {
        top: caret.top,
        left: caret.left - prevChar.bounds.width,
        offset: offset <=0 ? 0 : Number(offset) - 1,
    }
}

const layoutTokens = (tokens) => {
    const newTokens = tokens.map(token => ({
        image: token.image,
        startOffset: token.startOffset,
        endOffset: token.endOffset,
        children: [],
        width: 0,
        height: 0,
        left: 0,
        tokenType: token.tokenType,
        _orig: token,
    }));


    return newTokens.map((token, tokenIndex) => {

        let tokenWidth = 0, tokenHeight = 0;

        // const prevToken = newTokens[tokenIndex - 1];
        // token.left = prevToken ? prevToken.left + prevToken.width : 0;

        const chars = token.image.split('');
        const charRects = chars.map(char => measureText(char));

        token.children = chars.map((char, index) => {
            const rect = charRects[index];

            tokenWidth += rect.width;
            tokenHeight = Math.max(rect.height, tokenHeight);

            return {
                char,
                offset: token.startOffset + index,
                rect,
                parent: token,
            };
        });


        token.width = tokenWidth;
        token.height = tokenHeight;

        return token;
    });
}

export const getLineChildren = (tokens, line) => {
    return tokens.map((token, index) => {
        token.parent = line;

        const prevToken = tokens[index - 1];
        token.left = prevToken && prevToken.parent.lineNo === token.parent.lineNo ? prevToken.left + prevToken.width : 0;
        const chars = token.children || [];

        chars.forEach((char, charIndex) => {
           const prevChar = chars[charIndex - 1];

           char.left = prevChar ? prevChar.left + prevChar.rect.width : token.left;
        });

        return token;
    });
}

/**
 * 根据tokens、容器宽度，生成CalculationRoot -> Lines -> Tokens -> Chars结构
 */
export const layout = (tokens, containerWidth) => {
    const _tokens = layoutTokens(tokens);

    const root = {
        lines: [],
        tokens: [],
        chars: [],
    };

    let lineNo = 0;
    let lineWidth = 0;
    let lineHeight = 20;
    let lineTokens = [];

    for (let i = 0; i < _tokens.length;) {
        const token = _tokens[i];

        if (lineWidth + token.width <= containerWidth) {
            lineWidth += token.width;
            lineTokens.push(token);
            i++;
        } else {
            const line = {
                lineNo,
                width: lineWidth,
                height: lineHeight,
                top: lineHeight * lineNo,
                left: 0,
                children: [],
            };

            line.children = getLineChildren(lineTokens, line);
            root.lines.push(line);
            if (token.width > containerWidth) {
                i++;
            }

            lineNo++;
            lineWidth = 0;
            lineTokens = [];
        }
    }

    // last token
    const line = {
        lineNo,
        width: lineWidth,
        height: lineHeight,
        top: lineHeight * lineNo,
        left: 0,
        children: [],
    };
    line.children = getLineChildren(lineTokens, line);

    root.lines.push(line);

    root.lines.forEach(line => {
       let lineOffset = 0;

       line.children?.forEach?.((token) => {
           root.tokens.push(token);

           token.children?.forEach?.((char) => {
              char.lineOffset = lineOffset++;
              root.chars.push(char);
           });
       })
    });

    return root;
}
