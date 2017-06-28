(function() {
  'use strict';

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
  var continueBtn = document.querySelector('.c-btn--continue');
  var restartBtnPause = document.querySelector('.c-modal--pause .c-btn--restart');
  var pauseModal = document.querySelector('.c-modal--pause');
  var overlay = document.querySelector('.c-modal-overlay');
  var restartBtnGameover = document.querySelector('.c-modal--gameover .c-btn--restart');
  var gameoverModal = document.querySelector('.c-modal--gameover');
  var puzzlePieceArr = ['0-0', '0-1', '0-2', '0-3', '0-4', '1-0', '1-1', '1-2',
    '1-3', '2-0', '2-1', '2-2', '2-3', '2-4', '3-0', '3-1', '3-2', '3-3',
    '4-0', '4-1', '4-2', '4-3', '4-4', '5-0', '5-1', '5-2', '5-3', '6-0',
    '6-1', '6-2', '6-3', '6-4', '7-0', '7-1', '7-2', '7-3', '8-0', '8-1',
    '8-2', '8-3', '8-4'];
  var piecesStorage = document.querySelector('.l-pieces-storage');
  var dropZone = document.querySelector('.c-pieces--drop-zone');
  var restartBtnCong = document.querySelector('.c-modal--congrats .c-btn--restart');
  var congratsModal = document.querySelector('.c-modal--congrats');
  var rightPieces = 0;
  var startZoneId;



  // Countdown object
  var countdownObj = {
    start: function(endTime) {
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
        clearTimeout(this.timeout);
        delete this.timeout;
        if (rightPieces !== 41) gameOver();
        return false;
      }

      this.timeout = window.setTimeout(function() {
        self.gameTimeLeft = timeLeft;
        self.start(endTime);
      }, 1000);
    },

    pause: function() {
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
    hintImg.style.visibility = 'hidden';
    if (hintCount === 0) {
      hintBtn.disabled = true;
    }
  }


  function gameOver() {
    var gameoverSound = new Audio('assets/sound/gameover.wav');
    gameoverSound.play();
    openModal(gameoverModal);
  }

  function congrats() {
    var allPieces = document.querySelectorAll('.c-pieces__piece-img');
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
    if (e.target.classList.contains('c-pieces__piece-img')) {
      var startLocation = e.target.parentNode;
      e.dataTransfer.setData('text/plain', e.target.id);

      if (startLocation.classList.contains('c-pieces__piece'))
        // if move a piece from one drop span to another
        // startZone indicates the previous drop span
        startZoneId = startLocation.id.substr(-3);
    }
  }

  function handleDragOver(e) {
    // Allow drop
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    // Get the data, which is the id of the DragStart target
    var targetId = e.dataTransfer.getData('text');

    if (e.target.classList.contains('c-pieces__piece')) { // dropSpan is empty
      e.target.appendChild(document.getElementById(targetId));

      // call calcRightPieces func
      calcRightPieces(e.target, targetId);
    } else if (e.target.classList.contains('c-pieces__piece-img') &&
      targetId !== e.target.id)  { // dropSpan not empty
      swapPieces(targetId, e.target);
    }

    // Clear the drag data cache (for all formats/types)
    e.dataTransfer.clearData();
  }


  function swapPieces(newPieceId, oldPiece) {
    var newPiece = document.getElementById(newPieceId);
    var dropSpan = oldPiece.parentNode;
    dropSpan.replaceChild(newPiece, oldPiece);
    piecesStorage.appendChild(oldPiece);

    // recalculate number of right pieces
    calcRightPieces(dropSpan, newPieceId, oldPiece.id);
  }


  // call this func when a piece is dropped
  function calcRightPieces(dropSpan, currentPieceId, prevPieceId) {
    var dropSpanId = dropSpan.id.substr(-3);

    if (dropSpanId === currentPieceId) {
      rightPieces++;
    } else {
      // if previous piece was in the right span -- current piece is wrong
      // OR if current piece was right and is moving to a wrong span
      if (prevPieceId === dropSpanId || currentPieceId === startZoneId)
        rightPieces--;

      // if both previous and current were in right spans, and they are exchanged
      if (currentPieceId === startZoneId && prevPieceId === dropSpanId)
        rightPieces--;
    }
    console.log('right number ' + rightPieces);

    // pieces === 41 && nothing in storage area
    if (rightPieces === 41) {
      openModal(congratsModal);
      countdownObj.pause();
      congrats();
    }
  }

  function restartGame(modal) {
    closeModal(modal);
    window.location.reload(true);
    startZoneId = '';
    rightPieces = 0;
  }



  /*****************************************************************************
   *                            Event Listeners
   ****************************************************************************/

  gameLevelSwitch.addEventListener('click', changeGameLevel);

  startBtn.addEventListener('click', function() {
    startGame();
    loadPieces();

    // start countdown timer
    var deadline = new Date(Date.parse(new Date()) + gameTime);
    countdownObj.start(deadline);
  });

  hintBtn.addEventListener('mousedown', function() {
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
    countdownObj.resume();
  });

  restartBtnPause.addEventListener('click', function () {
    restartGame(pauseModal);
  });

  restartBtnGameover.addEventListener('click', function () {
    restartGame(gameoverModal);
  });

  restartBtnCong.addEventListener('click', function () {
    restartGame(congratsModal);
  });

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleDrop);
})();