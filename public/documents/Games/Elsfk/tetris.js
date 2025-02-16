const board = document.getElementById('game-board');
const nextPieceBoard = document.getElementById('next-piece');
const scoreDisplay = document.getElementById('score');
const menu = document.getElementById('menu');
const gameContainer = document.getElementById('game-container');
const easyButton = document.getElementById('easy');
const normalButton = document.getElementById('normal');
const hardButton = document.getElementById('hard');
const godModeButton = document.getElementById('god-mode');
const pauseButton = document.getElementById('pause');
const restartButton = document.getElementById('restart');
const endGameButton = document.getElementById('end-game');
const closeTabButton = document.getElementById('close-tab');
const mobileLeftButton = document.getElementById('mobile-left');
const mobileRightButton = document.getElementById('mobile-right');
const mobileDownButton = document.getElementById('mobile-down');
const mobileRotateButton = document.getElementById('mobile-rotate');
const mobileFlipButton = document.getElementById('mobile-flip');
const cells = [];
const nextPieceCells = [];
const boardWidth = 10;
const boardHeight = 20;
let currentPosition = 4;
let currentTetromino = [];
let nextTetromino = [];
let score = 0;
let isGameOver = false;
let isPaused = false;
let intervalId;
let difficulty = 1000; // 默认下落速度（普通难度）
let speedIncreaseInterval;

// 初始化游戏板
function init() {
    gameContainer.style.display = 'flex';
    menu.style.display = 'none';
    cells.length = 0;
    nextPieceCells.length = 0;
    board.innerHTML = '';
    nextPieceBoard.innerHTML = '';
    for (let i = 0; i < boardHeight * boardWidth; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
        cells.push(cell);
    }
    for (let i = 0; i < 36; i++) { // 6x6 网格
        const cell = document.createElement('div');
        cell.classList.add('cell');
        nextPieceBoard.appendChild(cell);
        nextPieceCells.push(cell);
    }
    spawnTetromino();
    updateScore();
    intervalId = setInterval(moveDown, difficulty);
}

// 生成新的方块
function spawnTetromino() {
    if (isGameOver) return;
    const shapes = [
        [1, boardWidth + 1, boardWidth * 2 + 1, 2], // Z形状
        [0, boardWidth, boardWidth + 1, boardWidth * 2 + 1], // S形状
        [1, boardWidth, boardWidth + 1, boardWidth + 2], // T形状
        [0, 1, boardWidth, boardWidth + 1], // O形状
        [1, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 3 + 1] // I形状
    ];
    if (!nextTetromino.length) {
        nextTetromino = shapes[Math.floor(Math.random() * shapes.length)];
    }
    currentTetromino = nextTetromino.map(index => index + currentPosition);
    nextTetromino = shapes[Math.floor(Math.random() * shapes.length)];
    draw();
    drawNextPiece();
    if (currentTetromino.some(index => cells[index].classList.contains('taken'))) {
        gameOver();
    }
}

// 绘制当前方块
function draw() {
    currentTetromino.forEach(index => {
        if (cells[index]) {
            cells[index].classList.add('tetromino');
        }
    });
}

// 绘制下一个方块
function drawNextPiece() {
    nextPieceCells.forEach(cell => cell.classList.remove('tetromino'));
    const centerOffset = 9; // 将方块居中显示在 6x6 的网格中
    nextTetromino.forEach(index => {
        const row = Math.floor(index / boardWidth);
        const col = index % boardWidth;
        const nextPieceIndex = row * 6 + col + centerOffset;
        if (nextPieceCells[nextPieceIndex]) {
            nextPieceCells[nextPieceIndex].classList.add('tetromino');
        }
    });
}

// 清除当前方块
function undraw() {
    currentTetromino.forEach(index => {
        if (cells[index]) {
            cells[index].classList.remove('tetromino');
        }
    });
}

// 移动方块
function moveDown() {
    if (isGameOver || isPaused) return;
    undraw();
    currentTetromino = currentTetromino.map(index => index + boardWidth);
    draw();
    if (currentTetromino.some(index => index >= boardWidth * boardHeight || cells[index].classList.contains('taken'))) {
        currentTetromino = currentTetromino.map(index => index - boardWidth);
        freeze();
    }
}

// 冻结方块
function freeze() {
    currentTetromino.forEach(index => {
        if (cells[index]) {
            cells[index].classList.remove('tetromino');
            cells[index].classList.add('taken');
        }
    });
    checkRows();
    spawnTetromino();
}

// 检查并消除满行
function checkRows() {
    for (let row = boardHeight - 1; row >= 0; row--) {
        const rowStart = row * boardWidth;
        const rowEnd = rowStart + boardWidth;
        const isRowFull = cells.slice(rowStart, rowEnd).every(cell => cell.classList.contains('taken'));
        if (isRowFull) {
            // 消除行
            cells.slice(rowStart, rowEnd).forEach(cell => cell.classList.remove('taken'));
            // 移动上面的行下来
            for (let i = rowStart - 1; i >= 0; i--) {
                if (cells[i].classList.contains('taken')) {
                    cells[i].classList.remove('taken');
                    cells[i + boardWidth].classList.add('taken');
                }
            }
            // 增加分数
            score += 10;
            updateScore();
        }
    }
}

// 更新分数显示
function updateScore() {
    scoreDisplay.textContent = `分数: ${score}`;
}

// 游戏结束
function gameOver() {
    isGameOver = true;
    clearInterval(intervalId);
    if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);
    alert(`游戏结束！你的分数是: ${score}`);
    cells.forEach(cell => cell.classList.remove('taken', 'tetromino'));
    score = 0;
    updateScore();
    isGameOver = false;
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
}

// 暂停游戏
function pauseGame() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? '继续' : '暂停';
}

// 重新开始游戏
function restartGame() {
    if (confirm('确定要重新开始游戏吗？')) {
        clearInterval(intervalId);
        if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);
        init();
    }
}

// 结束游戏并返回主菜单
function endGame() {
    if (confirm('确定要结束游戏并返回主菜单吗？')) {
        gameOver();
    }
}

// 关闭当前标签页
function closeTab() {
    if (confirm('确定要关闭当前标签页吗？')) {
        window.location.href = 'about:blank'; // 跳转到空白页面
    }
}

// 监听键盘事件
document.addEventListener('keydown', (e) => {
    if (isGameOver || isPaused) return;
    if (e.key === 'ArrowLeft') {
        moveLeft();
    } else if (e.key === 'ArrowRight') {
        moveRight();
    } else if (e.key === 'ArrowDown') {
        moveDown();
    } else if (e.key === ' ') { // 空格键：逆时针旋转
        rotate();
    } else if (e.key === 'Enter') { // 回车键：左右翻转
        flip();
    }
});

// 左移
function moveLeft() {
    undraw();
    const isAtLeftEdge = currentTetromino.some(index => index % boardWidth === 0);
    if (!isAtLeftEdge) {
        currentTetromino = currentTetromino.map(index => index - 1);
    }
    if (currentTetromino.some(index => cells[index].classList.contains('taken'))) {
        currentTetromino = currentTetromino.map(index => index + 1);
    }
    draw();
}

// 右移
function moveRight() {
    undraw();
    const isAtRightEdge = currentTetromino.some(index => index % boardWidth === boardWidth - 1);
    if (!isAtRightEdge) {
        currentTetromino = currentTetromino.map(index => index + 1);
    }
    if (currentTetromino.some(index => cells[index].classList.contains('taken'))) {
        currentTetromino = currentTetromino.map(index => index - 1);
    }
    draw();
}

// 逆时针旋转
function rotate() {
    undraw();
    const pivot = currentTetromino[1]; // 以第二个方块为旋转中心
    const rotated = currentTetromino.map(index => {
        const row = Math.floor(index / boardWidth) - Math.floor(pivot / boardWidth);
        const col = (index % boardWidth) - (pivot % boardWidth);
        return pivot + col * boardWidth - row;
    });
    if (rotated.every(index => !cells[index].classList.contains('taken'))) {
        currentTetromino = rotated;
    }
    draw();
}

// 左右翻转
function flip() {
    undraw();
    const flipped = currentTetromino.map(index => {
        const row = Math.floor(index / boardWidth);
        const col = index % boardWidth;
        return row * boardWidth + (boardWidth - 1 - col);
    });
    if (flipped.every(index => !cells[index].classList.contains('taken'))) {
        currentTetromino = flipped;
    }
    draw();
}

// 设置难度
easyButton.addEventListener('click', () => {
    difficulty = 1500; // 简单难度，下落速度较慢
    init();
});

normalButton.addEventListener('click', () => {
    difficulty = 1000; // 普通难度
    init();
});

hardButton.addEventListener('click', () => {
    difficulty = 500; // 困难难度，下落速度较快
    init();
});

godModeButton.addEventListener('click', () => {
    difficulty = 1000; // 初始速度
    init();
    speedIncreaseInterval = setInterval(() => {
        difficulty = Math.max(100, difficulty - 50); // 每隔一段时间加快速度
        clearInterval(intervalId);
        intervalId = setInterval(moveDown, difficulty);
    }, 5000); // 每 5 秒加快一次
});

// 绑定控制按钮事件
pauseButton.addEventListener('click', pauseGame);
restartButton.addEventListener('click', restartGame);
endGameButton.addEventListener('click', endGame);
closeTabButton.addEventListener('click', closeTab);

// 绑定手机虚拟按键事件
mobileLeftButton.addEventListener('click', moveLeft);
mobileRightButton.addEventListener('click', moveRight);
mobileDownButton.addEventListener('click', moveDown);
mobileRotateButton.addEventListener('click', rotate);
mobileFlipButton.addEventListener('click', flip);