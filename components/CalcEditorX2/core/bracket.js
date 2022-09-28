import {findClosingBracketMatchIndex} from "@/components/CalcEditorX2/utils/bracket";

export class Bracket {
    constructor(editor, token) {
        this.editor = editor;
        this.token = token;

        if (this.token.type === 'LBracket' || this.token.type === 'RBracket') {
            this.matchBracket = this._matchBracket.bind(this);
            this.addEvent();
        }
    }

    get isLeft() {
        return this.token.type === 'LBracket';
    }

    get isRight() {
        return this.token.type === 'RBracket';
    }

    _matchBracket() {
        const { manager } = this.editor;
        const { tokens } = manager;
        const me = this;

        const index = tokens.findIndex(token => token === this.token);

        if (index < 0) {
            return;
        }

        let matchIndex = findClosingBracketMatchIndex(tokens, index);
        if (matchIndex > 0) {
            const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            // 先取消所有的高亮
            this.removeAllHighlight(tokens);

            this.highlight(true, color);


            tokens[matchIndex].bracket.highlight(true, color);
        }
    }

    isBracket(token) {
        return token.type === 'LBracket' || token.type === 'RBracket';
    }

    removeAllHighlight(tokens) {
        tokens.forEach(token => {
            if (this.isBracket(token)) {
                token.bracket.highlight(false);
            }
        })
    }

    highlight(open, color) {
        if (open) {
            this.token.$textHost.style.color = color;
        } else {
            this.token.$textHost.style.color = '';
        }
    }

    addEvent() {
        const { $host } = this.token;

        $host.addEventListener('click', this.matchBracket);
    }

    removeEvent() {
        const { $host } = this.token;

        $host.addEventListener('click', this.matchBracket);
    }
}
