(function() {
  var puzzlePieceArr = ['0-0', '0-1', '0-2', '0-3', '0-4', '1-0', '1-1', '1-2',
    '1-3', '2-0', '2-1', '2-2', '2-3', '2-4', '3-0', '3-1', '3-2', '3-3',
    '4-0', '4-1', '4-2', '4-3', '4-4', '5-0', '5-1', '5-2', '5-3', '6-0',
    '6-1', '6-2', '6-3', '6-4', '7-0', '7-1', '7-2', '7-3', '8-0', '8-1',
    '8-2', '8-3', '8-4'];
  var piecesStorage = document.querySelector('.l-pieces-storage');
  var dropZone = document.querySelector('.c-pieces--drop-zone');
  var rightPieces = 0;

  var dropSpans = document.querySelectorAll('.c-pieces__piece');

  var pieceCols = document.querySelectorAll('.c-pieces__col'); // length = 9
  var piecesCol0 = ['0-0', '0-1', '0-2', '0-3', '0-4'];
  var piecesCol1 = ['1-0', '1-1', '1-2', '1-3'];
  var piecesCol2 = ['2-0', '2-1', '2-2', '2-3', '2-4'];
  var piecesCol3 = ['3-0', '3-1', '3-2', '3-3'];
  var piecesCol4 = ['4-0', '4-1', '4-2', '4-3', '4-4'];
  var piecesCol5 = ['5-0', '5-1', '5-2', '5-3'];
  var piecesCol6 = ['6-0', '6-1', '6-2', '6-3', '6-4'];
  var piecesCol7 = ['7-0', '7-1', '7-2', '7-3'];
  var piecesCol8 = ['8-0', '8-1', '8-2', '8-3', '8-4'];

  
  function loadPieces() {
    var shuffledArr = shufflePieces(puzzlePieceArr);
    var newImg;
    for (var i = 0; i < shuffledArr.length; i++) {
      newImg = document.createElement('img');
      newImg.setAttribute('src', 'assets/images/' + shuffledArr[i] + '.png');
      newImg.setAttribute('id', shuffledArr[i]);
      newImg.classList.add('c-pieces__piece-img');
      newImg.setAttribute('draggable', 'true');
      newImg.addEventListener('dragstart', handleDragStart);
      piecesStorage.appendChild(newImg);
    }
  }

  function shufflePieces(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  
  function handleDragStart(e) {
    console.log('drag start ' + e.target.id);
    e.dataTransfer.setData('text/plain', e.target.id);
  }

  function handleDragOver(e) {
    console.log('drag over ');
    // Allow drop
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drop ');
    // Get the data, which is the id of the DragStart target
    var targetId = e.dataTransfer.getData('text');

    if (e.target.classList.contains('c-pieces__piece')) { // dropSpan is empty
      console.log('drop if' + targetId);
      e.target.appendChild(document.getElementById(targetId));

      // call calcRightPieces func
      calcRightPieces(e.target, targetId);

    } else if (e.target.classList.contains('c-pieces__piece-img')) { // dropSpan not empty
      console.log('drop else if ' + e.target.id, e.dataTransfer.getData('text'));
      swapPieces(targetId, e.target);
    }

    // Clear the drag data cache (for all formats/types)
    e.dataTransfer.clearData();
  }

  // call this func when dropping a piece
  function swapPieces(newPieceId, oldPiece) {
    console.log('swap');
    var newPiece = document.getElementById(newPieceId);
    var dropSpan = oldPiece.parentNode;
    dropSpan.replaceChild(newPiece, oldPiece);
    piecesStorage.appendChild(oldPiece);

    // call calcRightPieces func
    console.log('old piece id ' + oldPiece.id);
    calcRightPieces(dropSpan, newPieceId, oldPiece.id);
  }


  // call this func when a piece is dropped
  function calcRightPieces(dropSpan, currentPieceId, prevPieceId) {
    var dropSpanId = dropSpan.id.substr(-3);

    console.log('rightorwrong ' + dropSpanId);

    // if (dropSpan.children.length === 0) { // no piece in this dropSpan before
    //   if (dropSpanId === currentPieceId) rightPieces++;
    // } else { // called by swapPieces func
    //   if (prevPieceId === dropSpanId) {
    //     rightPieces--; // prevPiece is right, then current must be wrong
    //   } else {
    //     if (dropSpanId === currentPieceId) rightPieces++;
    //   }
    // }


    if (dropSpanId === currentPieceId) {
      console.log('if right++ ');
      rightPieces++;
    }
    else {
      console.log('else ');
      if (prevPieceId === dropSpanId) {
        console.log('else right-- ');
        rightPieces--;
      }
    }
    console.log('right number ' + rightPieces);

    // pieces === 41 && nothing in storage area
    if (rightPieces === 41) {
      console.log('ALL are right');
      dropZone.style.pointerEvents = 'none';

      // TODO: add congratulations
      // TODO: disable all buttons (may achieve thru congrats modal)
    }
  }

  // TODO: start button call this func
  window.addEventListener('load', loadPieces);

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleDrop);

})();
