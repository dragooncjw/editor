const chevrotain = require('chevrotain');
const { createToken, Lexer } = chevrotain;

const functions = ['DATE', 'DATEIF', 'DAY'];

const datas = ['单选', '日期', '多选', '附件'];

export const createLexer = () => {
    const Unknown = createToken({ name: 'Unknown', pattern: /(\w|[\u4e00-\u9fa5]|[^\x00-\xff])+/ });

    const FunctionType = createToken({
        name: "FunctionType",
        pattern: new RegExp(`${functions.join('|')}`),
        longer_alt: Unknown
    })


    const LBracket = createToken({
        name: 'LBracket',
        pattern: /\(/,
        longer_alt: Unknown,
    })

    const RBracket = createToken({
        name: 'RBracket',
        pattern: /\)/,
        longer_alt: Unknown,
    })

    const Comma = createToken({
        name: 'Comma',
        pattern: /,/,
        longer_alt: Unknown,
    });

    const WhiteSpace = createToken({
        name: "WhiteSpace",
        pattern: /\s+/,
        longer_alt: Unknown,
        // group: chevrotain.Lexer.SKIPPED
    })

    const Data = createToken({
        name: 'Data',
        pattern: new RegExp(`${datas.join('|')}`),
        longer_alt: Unknown,
    });


    let allTokens = [
        FunctionType,
        WhiteSpace,
        LBracket,
        RBracket,
        Comma,
        Data,
        // The Identifier must appear after the keywords because all keywords are valid identifiers.
        Unknown,
    ]

    return new Lexer(allTokens);
}
