let startMenu = document.querySelector('.start-menu');
let gameScreen = document.querySelector('.game');
let scores = document.querySelector('.scores');
let header = document.querySelector('header');
let currentScore = document.querySelector('#score');
let questionBox = document.querySelector('#question');
let scoreList = document.querySelector('#highscores');
let playBtn = document.querySelector('#play');
let timer = document.querySelector('#timer');
let answerBtn = document.querySelector('.game');
let resetScores = document.querySelector('#reset-scores');
let restartGame = document.querySelector('#restart-game');

let endGame = false;
let question = '';
let correctAnswer = '';
let timeLeft = 60;
let score = 0; // lets say 5 for each correct answer
let usedQuestions = {};

let questionBank = {
    // formatting: question: {"answer": "ans", "wrongAnswers": [1, 2, 3]}
    "Which for loop is correct?": {
        "answer": "for (let i = 0; i < 10; i++)",
        "wrongAnswers": ["for (let i = 0: i < 10; i++)", "for {let i = 0; i < 10; i++)", "for (let i = 0; i < 10; i++]"]
    },
    "What do you call a function that calls itself inside the function?": {
        "answer": "recursive",
        "wrongAnswers": ["repeating", "rotating", "inner function"]
    },
    "Which keyword defines a function?": {
        "answer": "function",
        "wrongAnswers": ["func", "def", "functon"]
    },
    "What is an object?": {
        "answer": "key value pairs",
        "wrongAnswers": ["another kind of array", "data object", "name value pairs"]
    },
    "What type of language is Javascript?": {
        "answer": "dynamically typed",
        "wrongAnswers": ["staticly typed", "weakly typed", "orderly typed"]
    },
    "In which HTML element do we link the Javascript?": {
        "answer": "<script>",
        "wrongAnswers": ["<body>", "<link>", "<scripting>"]
    },
    "If you want a user to type text for you to use, what method is used?": {
        "answer": "prompt()",
        "wrongAnswers": ["input()", "alert()", "confirm()"]
    },
    "What is the file extension of Javascript files?": {
        "answer": ".js",
        "wrongAnswers": [".jscript", ".javascript", ",js"]
    },
    "What year was Javascript created?": {
        "answer": "1995",
        "wrongAnswers": ["1996", "1997", "1990"]
    },
    "What keyword is used to define a variable that can't change?": {
        "answer": "const",
        "wrongAnswers": ["let", "var", "immutable"]
    },
    "How many days did it take to develop Javascript?": {
        "answer": "10 days",
        "wrongAnswers": ["30 days", "5 days", "223 days"]
    },
    "What was Javascripts original name?": {
        "answer": "Mocha",
        "wrongAnswers": ["Java Applets", "TypeScript", "JavaOnline"]
    },
    "Is the DOM apart of Javascript?": {
        "answer": "no, it's a part of the browser",
        "wrongAnswers": ["yes", "yes, otherwise it wouldn't be there", "no, it belongs to HTML"]
    },
    "How would you create an object?": {
        "answer": "let object = {}",
        "wrongAnswers": ["let object = []", "let object: {}", "let object = ()"]
    },
    "Which of these is not a data type in Javascript?": {
        "answer": "float",
        "wrongAnswers": ["undefined", "boolean", "string"]
    },
    "Which of these is the Strict Equality operator?": {
        "answer": "===",
        "wrongAnswers": ["==", "====", "="]
    }
}


// render highscores

function renderScores(scoreObject) {
    scoreList.innerHTML = '';
    for (let [key, value] of Object.entries(scoreObject).sort().reverse()) {
        let newScore = document.createElement('li');
        newScore.textContent = `${value}'s Score: ${key}`;
        scoreList.appendChild(newScore);
    }
}

function startGame() {
    score = 0;
    timeLeft = 59;
    timer.innerHTML = `${timeLeft + 1} seconds left`;
    score.innerHTML = `Score: ${score}`;
    let countdown = setInterval(function() {
        if (timeLeft === 1) timer.innerHTML = `${timeLeft} second left`;
        else if (timeLeft > 1) timer.innerHTML = `${timeLeft} seconds left`;
        else {
            clearInterval(countdown);
            questionBank = Object.assign(questionBank, usedQuestions);
            header.setAttribute('style', 'visibility: hidden');
            gameScreen.setAttribute('style', 'display: none;');
            scores.setAttribute('style', 'display: flex; text-align: center; justify-content: center;');
            usedQuestions = {}
            newScore();
        }

        if (endGame) {
            clearInterval(countdown);
            questionBank = Object.assign(questionBank, usedQuestions);
            header.setAttribute('style', 'visibility: hidden');
            gameScreen.setAttribute('style', 'display: none;');
            scores.setAttribute('style', 'display: flex; text-align: center; justify-content: center;');
            endGame = false;
            usedQuestions = {}
            newScore();
        }

        // event listener

        timeLeft--;
    }, 1000);
    startMenu.setAttribute('style', 'display: none;');
    gameScreen.setAttribute('style', 'display: flex; margin-top: 10%;');
    header.setAttribute('style', 'visibility: visible;');
    scores.setAttribute('style', 'display: none;');
    createQuestion();
}

function createQuestion() {
    try {
        let choices = [];
        let buttons = document.querySelectorAll('#answer');
        let questions = Object.keys(questionBank);
    
        question = questions[Math.floor(Math.random() * questions.length)];
        correctAnswer = questionBank[question].answer;
        choices = questionBank[question].wrongAnswers;
    
        usedQuestions[question] = {
            "answer": correctAnswer,
            "wrongAnswers": choices
        }
    
        delete questionBank[question];
        
        choices.push(correctAnswer);
    
        questionBox.textContent = question;
    
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].textContent = choices[i];
        }
    } catch (err) {
        endGame = true;
    }

} // assign values to buttons

function checkAnswer() {
    return function(event) {
        let element = event.target;

        if (element.matches('#answer')) {
            let guess = element.textContent;
            if (guess === correctAnswer) {
                score += 5;
            } else timeLeft -= 15;
            if (timeLeft === 1) timer.innerHTML = `${timeLeft} second left`;
            else if (timeLeft > 1) timer.innerHTML = `${timeLeft} seconds left`;
            currentScore.innerHTML = `Score: ${score}`;
            createQuestion();
        }
    }
}

function newScore() {
    let username = prompt('Enter your name');

    let scoreboard = JSON.parse(localStorage.getItem('highscores'));

    if (scoreboard !== null) {
        scoreboard[score] = username;
        localStorage.setItem('highscores', JSON.stringify(scoreboard));
        renderScores(scoreboard);
        return;
    } 
    let highscores = {};
    highscores[score] = username;
    localStorage.setItem('highscores', JSON.stringify(highscores));
    renderScores(highscores);
}

playBtn.addEventListener('click', startGame);

answerBtn.onclick = checkAnswer();

restartGame.addEventListener('click', startGame);

resetScores.addEventListener('click', function() { 
    localStorage.clear();
    scoreList.innerHTML = '';
});