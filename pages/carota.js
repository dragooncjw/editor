import React, { useEffect, useRef } from 'react';

import carota from '@/carota/src/carota';

export default function  () {
 const carotaRef = useRef();
 const jsonViewRef = useRef();

 useEffect(() => {
     if (typeof window !== 'undefined') {
         var exampleEditor = carota.editor.create(carotaRef.current);

        addJsonView(exampleEditor);
        addToolbar(exampleEditor);
     }
 }, []);

 const addJsonView = (exampleEditor) => {
     // We don't update the JSON view until half a second after the last change
     // to avoid slowing things down too much
     var persistenceTextArea = jsonViewRef.current;
     var updateTimer = null;
     var updatePersistenceView = function() {
         if (updateTimer !== null) {
             clearTimeout(updateTimer);
         }
         updateTimer = setTimeout(function() {
             updateTimer = null;
             const frames = exampleEditor.children();
             const words = exampleEditor.words;

             persistenceTextArea.value = JSON.stringify(exampleEditor.save(), null, 4);
             console.info('#frames', frames);
             console.info('#words', words);
         }, 500);
     };

     var manuallyChangingJson = 0;
     carota.dom.handleEvent(persistenceTextArea, 'input', function() {
         try {
             manuallyChangingJson++;
             exampleEditor.load(JSON.parse(persistenceTextArea.value), false);
         } catch (x)  {
             // ignore if syntax errors
         } finally {
             manuallyChangingJson--;
         }
     });


     // Whenever the document changes, re-display the JSON format and update undo buttons
     exampleEditor.contentChanged(function() {
         if (!manuallyChangingJson) {
             updatePersistenceView();
         }
     });
 }

 const addToolbar = (exampleEditor) => {
     // Wire up the toolbar controls
     ['size'].forEach(function(id) {
         var elem = document.querySelector('#' + id);

         // When the control changes value, update the selected range's formatting
         carota.dom.handleEvent(elem, 'change', function() {
             var range = exampleEditor.selectedRange();
             var val = elem.nodeName === 'INPUT' ? elem.checked : elem.value;
             range.setFormatting(id, val);
         });

         // When the selected range coordinates change, update the control
         exampleEditor.selectionChanged(function(getFormatting) {
             var formatting = getFormatting();
             var val = id in formatting ? formatting[id] : carota.runs.defaultFormatting[id];
             if (elem.nodeName === 'INPUT') {
                 if (val === carota.runs.multipleValues) {
                     elem.indeterminate = true;
                 } else {
                     elem.indeterminate = false;
                     elem.checked = val;
                 }
             } else {
                 elem.value = val;
             }
         });
     });
 }

 return (
     <div style={{ display: 'flex', width: 'calc(100% - 16px)', height: 'calc(100vh - 16px)' }}>
         <div className="section">
             <div id="exampleToolbar">
                 <select id="size">
                     <option>8</option>
                     <option>9</option>
                     <option>10</option>
                     <option>11</option>
                     <option>12</option>
                     <option>14</option>
                     <option>16</option>
                     <option>18</option>
                     <option>20</option>
                     <option>24</option>
                     <option>30</option>
                     <option>36</option>
                     <option>72</option>
                 </select>
             </div>
             <div  ref={carotaRef}></div>
         </div>

         <div style={{ width: 1, height: '100%', background: '#ddd' }}></div>


         <div className="section">
             <textarea ref={jsonViewRef}></textarea>
         </div>

         <style jsx>{`
              .section {
                flex: 1;
              }

              textarea {
                width: 99%;
                height: 99%;
                border: none;
                background: rgb(30, 30, 30);
                color: rgb(0, 200, 20);
              }
        `}</style>
     </div>
 );
}
