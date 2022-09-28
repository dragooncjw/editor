
const chevrotain = require('chevrotain');
const { createToken, Lexer } = chevrotain;

const systemIdentifiers = ['counterparty', 'textfield0', '2selectfield'];

const matchSystemIdentifier = (text, startOffset) => {
    let endOffset = startOffset;
    let charCode = text.charCodeAt(endOffset);
    // a-z, A-Z， 0-9, systemIdentifiers
    while (
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122) ||
        (charCode >= 48 && charCode <= 57)
    ) {
        endOffset++
        charCode = text.charCodeAt(endOffset)
    }

    if (endOffset === startOffset) {
        return null;
    } else {

        let matchedString = text.substring(startOffset, endOffset);

        console.info('#matchedString', matchedString);

        if (systemIdentifiers.includes(matchedString)) {
            return [matchedString];
        }

        return null;
    }
};

const SystemIdentifier = createToken({ name: "SystemIdentifier", pattern: matchSystemIdentifier })
const UnknownIdentifier = createToken({ name: 'UnknownIdentifier', pattern: /[a-zA-Z]\w*/ })
// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/chevrotain/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
const Select = createToken({
    name: "Select",
    pattern: /SELECT/,
    longer_alt: UnknownIdentifier
})
const From = createToken({
    name: "From",
    pattern: /FROM/,
    longer_alt: UnknownIdentifier
})
const Where = createToken({
    name: "Where",
    pattern: /WHERE/,
    longer_alt: UnknownIdentifier
})

const Comma = createToken({ name: "Comma", pattern: /,/ })

const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ })

const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ })

const LessThan = createToken({ name: "LessThan", pattern: /</ })

const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    // group: chevrotain.Lexer.SKIPPED
})


let allTokens = [
    SystemIdentifier,
    WhiteSpace,
    // "keywords" appear before the Identifier
    Select,
    From,
    Where,
    Comma,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    UnknownIdentifier,
    Integer,
    GreaterThan,
    LessThan,
]

const lexer = new Lexer(allTokens);

module.exports = {
    allTokens,
    lexer,
    WhiteSpace,
    // "keywords" appear before the Identifier
    Select,
    From,
    Where,
    Comma,
    SystemIdentifier,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    UnknownIdentifier,
    Integer,
    GreaterThan,
    LessThan,
}
