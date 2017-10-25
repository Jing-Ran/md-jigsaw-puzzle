(function() {
  'use strict';

  let gameLevelSwitch = document.querySelector('.c-switch');
  let gameLevel = document.querySelector('#game-level-cb');
  let gameLevelMsg = document.querySelector('.c-splash__msg');
  let splash = document.querySelector('.c-splash');
  let startBtn = document.querySelector('.c-btn--start');
  let puzzleBoard = document.querySelector('.l-puzzle');
  let hintImg = document.querySelector('.img--solved');
  let pauseBtn = document.querySelector('.c-btn--pause');
  let hintBtn = document.querySelector('.c-btn--hint');
  let hintTimes = document.querySelector('.c-btn--hint .hint-times');
  let hintCount = 3;
  let countdownTimer = document.querySelector('.c-countdown');
  let gameTimeEasy = 10 * 60 * 1000;
  let gameTimeHard = 5 * 60 * 1000;
  let gameTime = gameTimeEasy;
  let continueBtn = document.querySelector('.c-btn--continue');
  let restartBtnPause = document.querySelector('.c-modal--pause .c-btn--restart');
  let pauseModal = document.querySelector('.c-modal--pause');
  let overlay = document.querySelector('.c-modal-overlay');
  let restartBtnGameover = document.querySelector('.c-modal--gameover' +
    ' .c-btn--restart');
  let gameoverModal = document.querySelector('.c-modal--gameover');
  let puzzlePieceArr = ['0-0', '0-1', '0-2', '0-3', '0-4', '1-0', '1-1', '1-2',
    '1-3', '2-0', '2-1', '2-2', '2-3', '2-4', '3-0', '3-1', '3-2', '3-3',
    '4-0', '4-1', '4-2', '4-3', '4-4', '5-0', '5-1', '5-2', '5-3', '6-0',
    '6-1', '6-2', '6-3', '6-4', '7-0', '7-1', '7-2', '7-3', '8-0', '8-1',
    '8-2', '8-3', '8-4'];
  let piecesStorage = document.querySelector('.l-pieces-storage');
  let dropZone = document.querySelector('.c-pieces--drop-zone');
  let restartBtnCong = document.querySelector('.c-modal--congrats' +
    ' .c-btn--restart');
  let congratsModal = document.querySelector('.c-modal--congrats');
  let rightPieces = 0;
  let startZoneId = '';



  // Countdown object
  let countdownObj = {
    start(endTime) {
      let self = this;
      let timeLeft = Date.parse(endTime) - Date.parse(new Date());
      let seconds = Math.floor((timeLeft/1000) % 60);
      let minutes = Math.floor((timeLeft/1000/60) % 60);

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

      this.timeout = window.setTimeout(() => {
        self.gameTimeLeft = timeLeft;
        self.start(endTime);
      }, 1000);
    },

    pause() {
      clearTimeout(this.timeout);
      delete this.timeout;
    },

    resume() {
      if (!this.timeout) {
        let newDeadline = new Date(this.gameTimeLeft + Date.parse(new Date()) - 1000);
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
      gameLevelMsg.innerHTML = `<span>hard mode</span>You will have 5 minutes & NO hint to solve the puzzle. Good Luck!`;
      gameTime = gameTimeHard;
      countdownTimer.innerHTML = '05:00';
      hintTimes.innerHTML = '';
      hintBtn.disabled = true;
    } else { // easy mode
      gameLevelMsg.innerHTML = `<span>easy mode</span>You will have 10 minutes & 3 hints to solve the puzzle.`;
      gameTime = gameTimeEasy;
      countdownTimer.innerHTML = '10:00';
      hintTimes.innerHTML = '(3)';
      hintBtn.disabled = false;
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
    hintTimes.innerHTML = `(${--hintCount})`;
  }
  
  function hideHint() {
    hintImg.style.visibility = 'hidden';
    if (hintCount === 0) {
      hintBtn.disabled = true;
    }
  }


  function gameOver() {
    let gameoverSound = new Audio('assets/sound/gameover.wav');
    gameoverSound.play();
    openModal(gameoverModal);
  }

  function congrats() {
    let allPieces = document.querySelectorAll('.c-pieces__piece-img');
    for (let piece of allPieces) {
      piece.classList.add('congrats-flip');
    }
  }



  function loadPieces() {
    const SHUFFLED_ARR = shufflePieces(puzzlePieceArr);
    for (let piece of SHUFFLED_ARR) {
      let newImg = document.createElement('img');
      newImg.setAttribute('src', `assets/images/${piece}.png`);
      newImg.setAttribute('id', piece);
      newImg.classList.add('c-pieces__piece-img');
      newImg.setAttribute('draggable', 'true');
      newImg.addEventListener('dragstart', handleDragStart);
      piecesStorage.appendChild(newImg);
    }
  }

  function shufflePieces(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }


  function handleDragStart(e) {
    if (e.target.classList.contains('c-pieces__piece-img')) {
      const START_LOCATION = e.target.parentNode;
      e.dataTransfer.setData('text/plain', e.target.id);

      if (START_LOCATION.classList.contains('c-pieces__piece')) {
        // if move a piece from one drop span to another
        // startZone indicates the previous drop span
        startZoneId = START_LOCATION.id.substr(-3);
      }
    }
  }

  function handleDragOver(e) {
    // Allow drop
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    // Get the data, which is the id of the DragStart target - the piece-img is
    // being dragged
    const TARGET_ID = e.dataTransfer.getData('text');

    if (e.target.classList.contains('c-pieces__piece')) { // dropSpan is empty
      // e.target is the dropSpan
      e.target.appendChild(document.getElementById(TARGET_ID));

      // call calcRightPieces func
      calcRightPieces(e.target, TARGET_ID);
    } else if (e.target.classList.contains('c-pieces__piece-img') &&
      TARGET_ID !== e.target.id)  { // dropSpan not empty
      // e.target is piece-img
      swapPieces(TARGET_ID, e.target);
    }

    // reset startZoneId - prevent it from taking prev value
    startZoneId = '';

    // Clear the drag data cache (for all formats/types)
    e.dataTransfer.clearData();
  }


  function swapPieces(newPieceId, oldPiece) {
    const NEW_PIECE = document.getElementById(newPieceId);
    let dropSpan = oldPiece.parentNode;
    dropSpan.replaceChild(NEW_PIECE, oldPiece);
    piecesStorage.appendChild(oldPiece);

    // recalculate number of right pieces
    calcRightPieces(dropSpan, newPieceId, oldPiece.id);
  }


  // call this func when a piece is dropped
  function calcRightPieces(dropSpan, currentPieceId, prevPieceId) {
    const DROP_SPAN_ID = dropSpan.id.substr(-3);

    if (DROP_SPAN_ID === currentPieceId) {
      rightPieces++;
    } else {
      // if previous piece was in the right span -- current piece is wrong
      // OR if current piece was right and is moving to a wrong span
      if (prevPieceId === DROP_SPAN_ID || currentPieceId === startZoneId)
        rightPieces--;

      // if both previous and current were in right spans, and they are exchanged
      if (currentPieceId === startZoneId && prevPieceId === DROP_SPAN_ID)
        rightPieces--;
    }

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

  startBtn.addEventListener('click', () => {
    const DEADLINE = new Date(Date.parse(new Date()) + gameTime);
    startGame();
    loadPieces();

    // start countdown timer
    countdownObj.start(DEADLINE);
  });

  hintBtn.addEventListener('mousedown', showHint);

  hintBtn.addEventListener('mouseup', hideHint);

  pauseBtn.addEventListener('click', () => {
    countdownObj.pause();
    openModal(pauseModal);
  });

  continueBtn.addEventListener('click', () => {
    closeModal(pauseModal);
    countdownObj.resume();
  });

  restartBtnPause.addEventListener('click', () => restartGame(pauseModal));

  restartBtnGameover.addEventListener('click', () => restartGame(gameoverModal));

  restartBtnCong.addEventListener('click', () => restartGame(congratsModal));

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleDrop);
})();