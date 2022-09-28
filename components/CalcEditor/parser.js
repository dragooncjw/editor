import nearley from 'nearley';

import grammar from '@/grammar/grammar';

export const parse = (text) => {
    try {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(text);
        return parser.results;
    } catch(e) {
        debugger;
    }
}
