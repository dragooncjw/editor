const chevrotain = require('chevrotain');
const { createToken, Lexer } = chevrotain;

const functions = ['DATE', 'DATEIF', 'DAY'];

export const functionParamsCount = {
    DATE: ['年','月','日'],
    DATEIF: 2,
    DAY: ['测试入参1', '测试入参2'],
}

export const functionExampleDesc = {
    DATE: 'DATE(2000, 1, 1) = 2000/01/01',
    DATEIF: 2,
    DAY: ['DAY(测试入参1, 测试入参2)'],
}

const datas = ['单选', '日期', '多选', '附件', 'Select', 'Picker', 'Attachment'];

export const Unknown = createToken({ name: 'Unknown', pattern: /(\w|[\u4e00-\u9fa5]|[^\x00-\xff])+/ });

export const FunctionType = createToken({
    name: "FunctionType",
    pattern: new RegExp(`${functions.join('|')}`),
    longer_alt: Unknown
})


export const LBracket = createToken({
    name: 'LBracket',
    pattern: /\(/,
    longer_alt: Unknown,
})

export const RBracket = createToken({
    name: 'RBracket',
    pattern: /\)/,
    longer_alt: Unknown,
})

export const Comma = createToken({
    name: 'Comma',
    pattern: /,/,
    longer_alt: Unknown,
});

export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    longer_alt: Unknown,
    // group: chevrotain.Lexer.SKIPPED
})

export const Data = createToken({
    name: 'Data',
    pattern: new RegExp(`${datas.join('|')}`),
    longer_alt: Unknown,
});


export const allTokens = [
    FunctionType,
    WhiteSpace,
    LBracket,
    RBracket,
    Comma,
    Data,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    Unknown,
]

export const createLexer = () => {
    return new Lexer(allTokens);
}

