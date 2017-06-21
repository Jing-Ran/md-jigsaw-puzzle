(function() {
  var gameLevelSwitch = document.querySelector('.c-switch');
  var gameLevel = document.querySelector('#game-level-cb');
  var gameLevelMsg = document.querySelector('.c-splash__msg');
  var splash = document.querySelector('.c-splash');
  var startBtn = document.querySelector('.c-btn--start');
  var puzzleBoard = document.querySelector('.l-puzzle');
  var hintImg = document.querySelector('.img--solved');
  var pauseBtn = document.querySelector('.c-btn--pause');
  var hintBtn = document.querySelector('.c-btn--hint');
  var hintTimes = document.querySelector('.c-btn--hint .hint-times');
  var hintCount = 3;
  var countdownTimer = document.querySelector('.c-countdown');
  var gameTimeEasy = 8 * 60 * 1000;
  var gameTimeHard = 4 * 60 * 1000;
  var gameTime = gameTimeEasy;
  // var gameTime = 0.5*60*1000;
  var continueBtn = document.querySelector('.c-btn--continue');
  var restartBtnPause = document.querySelector('.c-modal--pause .c-btn--restart');
  var pauseModal = document.querySelector('.c-modal--pause');
  var overlay = document.querySelector('.c-modal-overlay');
  var restartBtnGameover = document.querySelector('.c-modal--gameover .c-btn--restart');
  var gameoverModal = document.querySelector('.c-modal--gameover');
  var rightPieces = 0;
  var puzzlePieceArr = ['0-0', '0-1', '0-2', '0-3', '0-4', '1-0', '1-1', '1-2',
    '1-3', '2-0', '2-1', '2-2', '2-3', '2-4', '3-0', '3-1', '3-2', '3-3',
    '4-0', '4-1', '4-2', '4-3', '4-4', '5-0', '5-1', '5-2', '5-3', '6-0',
    '6-1', '6-2', '6-3', '6-4', '7-0', '7-1', '7-2', '7-3', '8-0', '8-1',
    '8-2', '8-3', '8-4'];
  var piecesStorage = document.querySelector('.l-pieces-storage');
  var dropZone = document.querySelector('.c-pieces--drop-zone');

  var restartBtnCong = document.querySelector('.c-modal--congrats .c-btn--restart');
  var congratsModal = document.querySelector('.c-modal--congrats');

  var startZoneId;



  // Countdown object
  var countdownObj = {
    start: function(endTime) {
      // console.log('start endTime ' + Date.parse(endTime));
      var self = this;
      var timeLeft = Date.parse(endTime) - Date.parse(new Date());
      var seconds = Math.floor((timeLeft/1000) % 60);
      var minutes = Math.floor((timeLeft/1000/60) % 60);

      // Update Timer UI
      countdownTimer.innerHTML = ('0' + minutes).slice(-2) + ':' +
        ('0' + seconds).slice(-2);

      // 1 min left - change to warning color
      if (timeLeft <= 60000) countdownTimer.style.color = 'red';

      if (timeLeft <= 0) {
        console.log('game over');
        clearTimeout(this.timeout);
        delete this.timeout;

        if (rightPieces !== 41) gameOver();

        return false;
      }

      this.timeout = window.setTimeout(function() {
        self.gameTimeLeft = timeLeft;
        // console.log('self.gameTL: ' + self.gameTimeLeft);
        self.start(endTime);
      }, 1000);
    },

    pause: function() {
      console.log('pause');
      clearTimeout(this.timeout);
      delete this.timeout;
    },

    resume: function () {
      if (!this.timeout) {
        var newDeadline = new Date(this.gameTimeLeft + Date.parse(new Date()) - 1000);
        this.start(newDeadline);
      }
    }
  };



  // Close and open modal
  function closeModal(modal) {
    modal.classList.remove('c-modal-transition--scale-down');
    overlay.classList.remove('c-modal-overlay--show');
    overlay.style.visibility = 'hidden';
  }

  function openModal(modal) {
    modal.classList.add('c-modal-transition--scale-down');
    overlay.classList.add('c-modal-overlay--show');
    overlay.style.visibility = 'visible';
  }


  function changeGameLevel() {
    if (gameLevel.checked) { // hard mode
      gameLevelMsg.innerHTML = '<span>hard mode</span>You will have 4 minutes & NO hint to solve the puzzle. Good Luck!';
      gameTime = gameTimeHard;
      countdownTimer.innerHTML = '04:00';
      hintTimes.innerHTML = '';
      hintBtn.disabled = 'true';
    } else { // easy mode
      gameLevelMsg.innerHTML = '<span>easy mode</span>You will have 8 minutes & 3 hints to solve the puzzle.';
      gameTime = gameTimeEasy;
      countdownTimer.innerHTML = '08:00';
      hintTimes.innerHTML = '(3)';
      hintBtn.disabled = 'false';
    }
  }
  
  function startGame() {
    splash.classList.add('c-splash--hidden');
    puzzleBoard.style.display = 'flex';
    piecesStorage.style.display = 'flex';
  }
  
  function showHint() {
    // show hint image
    hintImg.style.visibility = 'visible';
    // update times of hint
    hintTimes.innerHTML = '(' + --hintCount + ')';
  }
  
  function hideHint() {
    // hide hint
    hintImg.style.visibility = 'hidden';
    if (hintCount === 0) {
      hintBtn.disabled = true;
    }
  }

  // Countdown method 1:
  // function getTimeLeft(endtime) {
  //   var time = Date.parse(endtime) - Date.parse(new Date());
  //   var sec = Math.floor((time/1000) % 60);
  //   var min = Math.floor((time/1000/60) % 60);
  //
  //   return {
  //     totalLeft: time,
  //     minutes: min,
  //     seconds: sec
  //   };
  // }
  //
  // function countdown(endtime) {
  //   var timeInterval = setInterval(function() {
  //     var timeLeft = getTimeLeft(endtime);
  //     countdownTimer.innerHTML = ('0' + timeLeft.minutes).slice(-2) + ':' +
  //       ('0' + timeLeft.seconds).slice(-2);
  //
  //     // 1 min left - change to warning color
  //     if (timeLeft.totalLeft <= 60000) countdownTimer.style.color = 'red';
  //
  //     if (timeLeft.totalLeft <= 0) {
  //       console.log('if ');
  //       clearInterval(timeInterval);
  //
  //       //TODO: call reset function
  //     }
  //   }, 1000);
  // }



  function gameOver() {
    openModal(gameoverModal);
    // TODO: play sound
  }

  function congrats() {
    console.log('congrats func');
    var allPieces = document.querySelectorAll('c-pieces__piece-img');
    for (var i = 0; i < allPieces.length; i++) {
      allPieces[i].classList.add('congrats-flip');
    }
  }



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

    var startLocation = e.target.parentNode;

    if (startLocation.classList.contains('c-pieces__piece'))
      startZoneId = startLocation.id.substr(-3);
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
    console.log('rightorwrong ' + dropSpanId, currentPieceId, prevPieceId);

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
      console.log('else ' + startZoneId);
      if (prevPieceId === dropSpanId || currentPieceId === startZoneId) {
        console.log('else right-- ');
        rightPieces--;
      }
    }
    console.log('right number ' + rightPieces);

    // pieces === 41 && nothing in storage area
    if (rightPieces === 3) {
      console.log('ALL are right');
      // dropZone.style.pointerEvents = 'none';

      // TODO: add congratulations
      // TODO: disable all buttons (may achieve thru congrats modal)
      openModal(congratsModal);
      countdownObj.pause();
      congrats();
    }
  }



  /*****************************************************************************
   *                            Event Listeners
   ****************************************************************************/

  gameLevelSwitch.addEventListener('click', changeGameLevel);

  // startBtn.addEventListener('click', startGame);
  startBtn.addEventListener('click', function() {
    startGame();

    // start countdown timer
    var deadline = new Date(Date.parse(new Date()) + gameTime);
    countdownObj.start(deadline);
  });

  // show or hide hint img
  hintBtn.addEventListener('mousedown', function() {
    // show hint
    showHint();
  });

  hintBtn.addEventListener('mouseup', function() {
    hideHint();
  });

  pauseBtn.addEventListener('click', function () {
    countdownObj.pause();
    openModal(pauseModal);
  });

  continueBtn.addEventListener('click', function () {
    closeModal(pauseModal);
    // TODO: add resume method
    countdownObj.resume();
  });

  restartBtnPause.addEventListener('click', function () {
    // closeModal(pauseModal);
    window.location.reload(true);
  });

  restartBtnGameover.addEventListener('click', function () {
    // closeModal(pauseModal);
    window.location.reload(true);
  });

  restartBtnCong.addEventListener('click', function () {
    // closeModal(pauseModal);
    window.location.reload(true);
  });

  // TODO: start button call this func
  window.addEventListener('load', loadPieces);

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleDrop);
})();