// 화면 요소들
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');
const couponScreen = document.getElementById('couponScreen');

// 버튼 요소들
const startButton = document.getElementById('startButton');
const submitButton = document.getElementById('submitButton');
const retryButton = document.getElementById('retryButton');
const homeButton = document.getElementById('homeButton');
const saveCouponButton = document.getElementById('saveCouponButton');
const couponHomeButton = document.getElementById('couponHomeButton');

// 게임 요소들
const problemElement = document.getElementById('problem');
const answerInput = document.getElementById('answerInput');
const scoreCount = document.getElementById('scoreCount');
const timerBar = document.getElementById('timerBar');
const couponCanvas = document.getElementById('couponCanvas');

// 오디오 요소들
const successSound = document.getElementById('successSound');
const failSound = document.getElementById('failSound');
const couponSound = document.getElementById('couponSound');

// 게임 상태 변수들
let currentAnswer = 0;
let consecutiveCorrect = 0;
let timerInterval;

// 까마귀 이미지 요소 생성
const failImage = document.createElement('img');
failImage.src = 'assets/ggg.png';
failImage.style.position = 'fixed';
failImage.style.top = '50%';
failImage.style.transform = 'translateY(-50%)';
failImage.style.width = '100px';
failImage.style.display = 'none';
document.body.appendChild(failImage);

// 화면 전환 함수
function showScreen(screen) {
    [startScreen, gameScreen, resultScreen, couponScreen].forEach(s => {
        s.classList.add('hidden');
    });
    screen.classList.remove('hidden');
}

// 랜덤 문제 생성 함수
function generateProblem() {
    const num1 = Math.floor(Math.random() * 41) + 10; // 10-50
    const num2 = Math.floor(Math.random() * 41) + 10; // 10-50
    currentAnswer = num1 + num2;
    problemElement.textContent = `${num1} + ${num2} = ?`;
}

// 타이머 시작 함수
function startTimer() {
    let timeLeft = 100; // 타이머 바의 너비 퍼센트
    timerBar.style.width = '100%';

    timerInterval = setInterval(() => {
        timeLeft -= 2; // 50번의 업데이트로 5초 구현
        timerBar.style.width = `${timeLeft}%`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleGameOver();
        }
    }, 100); // 0.1초마다 업데이트
}

// 게임 시작 함수
function startGame() {
    showScreen(gameScreen);
    answerInput.value = '';
    generateProblem();
    startTimer();
    answerInput.focus();
    failImage.style.display = 'none'; // 이미지 숨기기
}

// 정답 체크 함수
function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === currentAnswer) {
        successSound.play();
        consecutiveCorrect++;
        scoreCount.textContent = consecutiveCorrect;

        if (consecutiveCorrect >= 3) {
            clearInterval(timerInterval);
            handleGameWin();
        } else {
            startGame();
        }
    } else {
        handleGameOver();
    }
}

// 게임 오버 함수
function handleGameOver() {
    clearInterval(timerInterval);
    failSound.play();
    showScreen(resultScreen);
    consecutiveCorrect = 0;
    scoreCount.textContent = consecutiveCorrect;

    // 까마귀 이미지 애니메이션
    failImage.style.display = 'block';
    failImage.style.left = '-100px';

    const startTime = performance.now();
    const duration = 4000; // 4초

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            // 화면 너비 + 이미지 너비만큼 이동
            const position = (window.innerWidth + 100) * progress - 100;
            failImage.style.left = `${position}px`;
            requestAnimationFrame(animate);
        } else {
            failImage.style.display = 'none';
        }
    }

    requestAnimationFrame(animate);
}

// 게임 승리 함수
function handleGameWin() {
    couponSound.play();
    showScreen(couponScreen);
    generateCoupon();
}

// 쿠폰 생성 함수
function generateCoupon() {
    const ctx = couponCanvas.getContext('2d');
    couponCanvas.width = 300;
    couponCanvas.height = 150;

    // 쿠폰 배경
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, 300, 150);

    // 쿠폰 테두리
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 280, 130);

    // 쿠폰 텍스트
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🥤 음료수 1잔 무료 쿠폰', 150, 60);

    const date = new Date();
    ctx.font = '14px Arial';
    ctx.fillText(`발급일: ${date.toLocaleDateString()}`, 150, 100);
}

// 쿠폰 저장 함수
function saveCoupon() {
    const link = document.createElement('a');
    link.download = '음료수쿠폰.png';
    link.href = couponCanvas.toDataURL();
    link.click();
}

// 이벤트 리스너 등록
startButton.addEventListener('click', startGame);
submitButton.addEventListener('click', checkAnswer);
retryButton.addEventListener('click', startGame);
homeButton.addEventListener('click', () => showScreen(startScreen));
saveCouponButton.addEventListener('click', saveCoupon);
couponHomeButton.addEventListener('click', () => showScreen(startScreen));

// 엔터 키로 정답 제출
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// 초기 화면 표시
showScreen(startScreen); 