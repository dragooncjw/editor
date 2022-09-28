
export const getCaretByCoord = (root, clientX, clientY) => {
    const $container = document.getElementById('innerContainer');
    const containerRect = $container.getBoundingClientRect();

    const x = clientX - containerRect.left;
    const y = clientY - containerRect.top;


    const line = root.lines.find(line => y >= line.top && y <= line.top + line.height);
    let targetChar;
    const tokens = line.children;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const chars = token.children;

        for (let j = 0; j < chars.length; j++) {
            const char = chars[j];

            if (x >= char.left && x <= char.left + char.rect.width) {
                targetChar = char;
                break;
            }
        }

        if (targetChar) {
            break;
        }
    }

    if (!line && !targetChar) {
        return null;
    } else if (!targetChar) {
        const tokens = line.children || [];
        const lastToken = tokens[tokens.length - 1];
        const chars = lastToken.children || [];
        const lastChar = chars[chars.length - 1];

        return {
            offset: lastChar.offset,
            top: line.top,
            left: lastChar.left,
            lineNo: line.lineNo,
            char: lastChar,
        };
    } else {
        return {
            offset: targetChar.offset,
            top: line.top,
            left: targetChar.left,
            lineNo: line.lineNo,
            char: targetChar,
        }
    }
}

export const getCaretByOffset = (root, offset) => {
    const chars = root.chars;
    const char = chars.find(char => char.offset >= offset);


    if (!char) {
        const firstChar = chars[0];
        const lastChar = chars[chars.length - 1];

        if (offset > lastChar.offset) {
            const line = lastChar.parent.parent;

            return {
                offset: lastChar.offset + 1,
                top: line.top,
                left: lastChar.left + lastChar.rect.width,
                lineNo: line.lineNo,
            }
        } else if (offset < 0) {
            const line = firstChar.parent.parent;

            return {
                offset: 0,
                top: line.top,
                left: 0,
                lineNo: 0,
                char: char,
            }
        }
    } else {
        const line = char.parent.parent;


        return {
            offset: char.offset,
            top: line.top,
            left: char.left,
            lineNo: line.lineNo,
            char: char,
        }
    }
}

export const moveCaretToNextLine = (root, caret) => {
    if (!caret) {
        return null;
    }

    const lines = root.lines || [];
    const maxLineNo = lines.length - 1;

    // 最后一行
    if (caret.lineNo >= maxLineNo) {
        return caret;
    } else {
        const chars = root.chars || [];
        const { lineNo } = caret;
        const line = lines[lineNo + 1];
        const lineChars = chars.filter(char => char.parent.parent.lineNo === line.lineNo);
        const maxOffset = lineChars.length;
        const char = caret.char.lineOffset >= maxOffset ? lineChars[maxOffset - 1] : lineChars[caret.char.lineOffset];

        return {
            offset: char.offset,
            top: line.top,
            left: char.left,
            lineNo: caret.lineNo + 1,
            char,
        }

    }
}

export const moveCaretToPreLine = (root, caret) => {
    if (!caret) {
        return null;
    }

    const lines = root.lines || [];

    // 第一行
    if (caret.lineNo <= 0) {
        return caret;
    } else {
        const chars = root.chars || [];
        const { lineNo } = caret;
        const line = lines[lineNo - 1];
        const lineChars = chars.filter(char => char.parent.parent.lineNo === line.lineNo);
        const maxOffset = lineChars.length;
        const char = caret.char.lineOffset >= maxOffset ? lineChars[maxOffset - 1] : lineChars[caret.char.lineOffset];

        return {
            offset: char.offset,
            top: line.top,
            left: char.left,
            lineNo: caret.lineNo - 1,
            char,
        }

    }
}
