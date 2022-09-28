import React, { useState } from 'react';
import { isInsideEditor } from "@/components/SqlEditor/util";
import {
    getCaretByCoord,
    getCaretByOffset,
    moveCaretToNextLine,
    moveCaretToPreLine
} from "@/components/SqlEditor/selection";

export default function useMouseDown ({ root, text, setText }) {
    const [caret, setCaret] = useState(null);

    const handleMouseDown = (e) => {
        const { clientX, clientY } = e || {};
        if (!isInsideEditor(clientX, clientY)) {
            setCaret(null);
            return;
        }

        const caret = getCaretByCoord(root, clientX, clientY);
        setCaret(caret);
    }

    const handleMouseUp = () => {
        const $textarea = document.getElementById('textarea');
        $textarea.focus();
    }

    const handleKeyDown = (e) => {
        const keyCode = e.keyCode;

        const char = String.fromCharCode(keyCode).toLowerCase();
        const arr = text.split('');

        // delete
        if (keyCode === 8) {
            if (caret.offset <= 0) {
                return;
            }

            arr.splice(caret.offset, 1);
            setText(arr.join(''));

            setCaret(getCaretByOffset(root, caret.offset - 1));
        } else if (keyCode >= 37 && keyCode <= 40) {
            // left/ right
            if (keyCode === 37) {
                // left
               if (caret) {
                   setCaret(getCaretByOffset(root, caret.offset <= 0 ? 0 : caret.offset - 1));
               }
            } else if (keyCode === 39) {
                // right
                if (caret) {
                    setCaret(getCaretByOffset(root, caret.offset + 1));
                }
            } else if (keyCode === 38) {
                // up
                setCaret(moveCaretToPreLine(root, caret));
            } else {
                // down
                setCaret(moveCaretToNextLine(root, caret));
            }
        } else if (
            (keyCode >= 65 && keyCode <= 90) // a-z
            || (keyCode >= 48 && keyCode <= 57) // 0-9
            || (keyCode === 188) // ,
            || (keyCode === 32) // whitespace
        ) {
            arr.splice(caret.offset, 0, keyCode === 188 ? ',' : char);

            setText(arr.join(''));


            setCaret(getCaretByOffset(root, caret.offset + 1));
        }
    }

     return {
         caret,
         handleMouseDown,
         handleMouseUp,
         handleKeyDown,
     };
}
