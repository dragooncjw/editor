import React, {memo} from 'react';

export default memo(function Textarea({ caret, onKeyDown  }) {
    return (
        <div
            style={{
                position: 'absolute',
                display: caret ? 'block' : 'none',
                height: 0,
                top: `${caret?.top}px`,
                left: `${caret?.left}px`,
                overflow: 'hidden',
            }}
        >
         <textarea id="textarea"
                   style={{
                       position: 'absolute',
                       padding: 0,
                       width: '1000px',
                       height: '1em',
                       outline: 'none',
                       fontSize: '4px'
                   }}
                   onKeyDown={onKeyDown}/>
        </div>
    );
});
