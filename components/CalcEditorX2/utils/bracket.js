export function findClosingBracketMatchIndex(tokens, pos) {
    if (tokens[pos].type === 'LBracket') {
        let depth = 1;
        for (let i = pos + 1; i < tokens.length; i++) {
            switch (tokens[i].type) {
                case 'LBracket':
                    depth++;
                    break;
                case 'RBracket':
                    if (--depth == 0) {
                        return i;
                    }
                    break;
            }
        }
        return -1;    // No matching closing parenthesis
    } else if (tokens[pos].type === 'RBracket') {
        let depth = 1;
        for (let i = pos - 1; i >= 0; i--) {
            switch(tokens[i].type) {
                case 'LBracket':
                    if (--depth === 0) {
                        return i;
                    }

                    break;
                case 'RBracket':
                    depth++;
                    break;

            }
         }

        return -1;
    }
}
