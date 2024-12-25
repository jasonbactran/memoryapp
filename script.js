document.addEventListener('DOMContentLoaded', () => {
    const inputScreen = document.getElementById('input-screen');
    const memorizeScreen = document.getElementById('memorize-screen');
    const recallScreen = document.getElementById('recall-screen');
    const resultScreen = document.getElementById('result-screen');
    const historyScreen = document.getElementById('history-screen');

    const startButton = document.getElementById('start-button');
    const submitButton = document.getElementById('submit-button');
    const restartButton = document.getElementById('restart-button');
    const viewHistoryButton = document.getElementById('view-history-button');
    const backButton = document.getElementById('back-button');
    const clearHistoryButton = document.getElementById('clear-history-button');

    const wordCountInput = document.getElementById('word-count');
    const memorizeTimeInput = document.getElementById('memorize-time');
    const wordList = document.getElementById('word-list');
    const timerDisplay = document.getElementById('timer');
    const recallForm = document.getElementById('recall-form');
    const resultList = document.getElementById('result-list');
    const historyList = document.getElementById('history-list');
    const scoreDisplay = document.getElementById('score');

    let words = [];
    let timer;
    let history = JSON.parse(localStorage.getItem('history')) || [];

    const randomWords = ['apple', 'banana', 'cherry', 'date', 'kiwi'];

    function showScreen(screen) {
        [inputScreen, memorizeScreen, recallScreen, resultScreen, historyScreen]
            .forEach(s => s.classList.add('hidden'));
        screen.classList.remove('hidden');
    }

    function startTimer(seconds, callback) {
        let remaining = seconds;
        timerDisplay.textContent = `${remaining}s`;
        timer = setInterval(() => {
            remaining--;
            timerDisplay.textContent = `${remaining}s`;
            if (remaining <= 0) {
                clearInterval(timer);
                callback();
            }
        }, 1000);
    }

    function evaluateResults() {
        const inputs = Array.from(recallForm.querySelectorAll('input')).map(input => input.value.trim());
        let correct = 0;
        words.forEach((word, i) => {
            const isCorrect = word === inputs[i];
            const li = document.createElement('li');
            li.textContent = `${word} - ${inputs[i] || 'Empty'}`;
            li.classList.add(isCorrect ? 'correct' : 'incorrect');
            if (isCorrect) correct++;
            resultList.appendChild(li);
        });
        const percentage = ((correct / words.length) * 100).toFixed(2);
        scoreDisplay.textContent = `Score: ${correct}/${words.length} (${percentage}%)`;

        history.unshift({ date: new Date().toLocaleString(), correct, total: words.length, percentage });
        localStorage.setItem('history', JSON.stringify(history));
        showScreen(resultScreen);
    }

    startButton.addEventListener('click', () => {
        words = Array.from({ length: wordCountInput.value }, () => randomWords[Math.floor(Math.random() * randomWords.length)]);
        wordList.innerHTML = words.map(w => `<li>${w}</li>`).join('');
        showScreen(memorizeScreen);
        startTimer(memorizeTimeInput.value, () => showScreen(recallScreen));
    });

    submitButton.addEventListener('click', evaluateResults);
});
