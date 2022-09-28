import React, { memo } from 'react';

export default memo(function Caret({ caret }) {
 return (
     <div id="caret" style={{
         position: 'absolute',
         display: caret ? 'block': 'none',
         background: 'black',
         height: '20px',
         width: '1px',
         top: `${caret?.top}px`,
         left: `${caret?.left}px`,
     }}></div>
 );
});
