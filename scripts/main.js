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
  // var gameTime = gameTimeEasy;
  var gameTime = 0.1*60*1000;
  var continueBtn = document.querySelector('.c-btn--continue');
  var restartBtnPause = document.querySelector('.c-modal--pause .c-btn--restart');
  var pauseModal = document.querySelector('.c-modal--pause');
  var overlay = document.querySelector('.c-modal-overlay');
  var restartBtnGameover = document.querySelector('.c-modal--gameover .c-btn--restart');
  var gameoverModal = document.querySelector('.c-modal--gameover');
  var rightPieces = 0;


  // var deadline;

  // Countdown object
  var countdownObj = {
    start: function(endTime) {
      console.log('start endTime ' + Date.parse(endTime));
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
        console.log('self.gameTL: ' + self.gameTimeLeft);
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


  function changeGameLevel() {
    if (gameLevel.checked) {
      gameLevelMsg.innerHTML = '<span>hard mode</span>You will have 4 minutes & NO hint to solve the puzzle. Good Luck!';
      gameTime = gameTimeHard;
      countdownTimer.innerHTML = '04:00';
    } else {
      gameLevelMsg.innerHTML = '<span>easy mode</span>You will have 8 minutes & 3 hints to solve the puzzle.';
      gameTime = gameTimeEasy;
      countdownTimer.innerHTML = '08:00';
    }
  }
  
  function startGame() {
    splash.classList.add('c-splash--hidden');
    puzzleBoard.style.display = 'flex';
    // TODO: enable puzzlePieces section
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


  function gameOver() {
    openModal(gameoverModal);
    // TODO: play sound
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
})();