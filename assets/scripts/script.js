let startMenu = document.querySelector('.start-menu'); // start menu screen
let gameScreen = document.querySelector('.game'); // game screen
let scores = document.querySelector('.scores'); // scorebard screen
let header = document.querySelector('header'); // header containing timer and score
let currentScore = document.querySelector('#score'); // current score element in header
let questionBox = document.querySelector('#question'); // question box on game screen
let scoreList = document.querySelector('#highscores'); // score list on scoreboard
let playBtn = document.querySelector('#play'); // play button
let timer = document.querySelector('#timer'); // current time in header
let answerBtn = document.querySelector('.game'); // answer button
let resetScores = document.querySelector('#reset-scores'); // reset score button
let restartGame = document.querySelector('#restart-game'); // restart game button

let endGame = false; // a conditional to see if the user has answered all the questions
let question = ''; // the current selected question
let correctAnswer = ''; // the correct answer for the currently selected question
let timeLeft = 60; // time left on the clock
let score = 0; // user score
let usedQuestions = {}; // add all used questions into this object

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
    scoreList.innerHTML = ''; // empty scoreboard
    for (let [key, value] of Object.entries(scoreObject).sort().reverse()) { // sort through object and sort in reverse (highest to lowest)
        let newScore = document.createElement('li'); // create new <li> element
        newScore.textContent = `${value}'s Score: ${key}`; // add score to the list element
        scoreList.appendChild(newScore); // add it to the <ol>
    }
}

// start game function

function startGame() {
    score = 0; // reset score
    timeLeft = 59; // reset timer
    timer.innerHTML = `${timeLeft + 1} seconds left`; // start timer at 60 seconds
    score.innerHTML = `Score: ${score}`; // set score to 0 on to top
    let countdown = setInterval(function() { // start countdown
        if (timeLeft === 1) timer.innerHTML = `${timeLeft} second left`; // if the time is at 1 second, use the singular of second
        else if (timeLeft > 1) timer.innerHTML = `${timeLeft} seconds left`; // if the time is above 1 second use the plural of second
        else { // if time ran out end game and move to score
            clearInterval(countdown); // remove the countdown
            questionBank = Object.assign(questionBank, usedQuestions); // reset the question bank
            header.setAttribute('style', 'visibility: hidden'); // set the header to invisible
            gameScreen.setAttribute('style', 'display: none;'); // set the game screen to none
            scores.setAttribute('style', 'display: flex; text-align: center; justify-content: center;'); // center and display score screen
            usedQuestions = {} // clear used questions
            newScore(); // create a new score for the user
        }

        if (endGame) { // if the user has answered all the questions run the same procedures as if it hit 0 seconds
            clearInterval(countdown);
            questionBank = Object.assign(questionBank, usedQuestions);
            header.setAttribute('style', 'visibility: hidden');
            gameScreen.setAttribute('style', 'display: none;');
            scores.setAttribute('style', 'display: flex; text-align: center; justify-content: center;');
            endGame = false;
            usedQuestions = {}
            newScore();
        }

        timeLeft--; // remove 1 second
    }, 1000);
    startMenu.setAttribute('style', 'display: none;'); // hide start screen
    gameScreen.setAttribute('style', 'display: flex; margin-top: 10%;'); // show game screen
    header.setAttribute('style', 'visibility: visible;'); // show the header with timer and score
    scores.setAttribute('style', 'display: none;'); // hide score screen
    createQuestion(); // generate new random question
}

function createQuestion() { // creating a new question
    try { // if the index doesnt exceed the length of the array, create question
        let choices = []; // create choices array
        let buttons = document.querySelectorAll('#answer'); // select answer button
        let questions = Object.keys(questionBank); // grab questions from the questionBank
    
        question = questions[Math.floor(Math.random() * questions.length)]; // choose a random question from the question bank
        correctAnswer = questionBank[question].answer; // assign correctAsnwer to the answer of the question
        choices = questionBank[question].wrongAnswers; // create choice array with the options to choose from
    
        usedQuestions[question] = { // add this question to the usedQuestions object
            "answer": correctAnswer,
            "wrongAnswers": choices
        }
    
        delete questionBank[question]; // remove the question from the questionBank
        
        choices.push(correctAnswer); // add the correctAnswer to the question choices
    
        questionBox.textContent = question; // switch the displayed question to the new question
    
        for (let i = 0; i < buttons.length; i++) { // assign the options to each button on the screen
            buttons[i].textContent = choices[i];
        }
    } catch (err) { // if the index exceeds the length of the array, catch the error and end the game
        endGame = true;
    }

}

function checkAnswer() { // check if the users guess was correct
    return function(event) {
        let element = event.target; // select the button pressed

        if (element.matches('#answer')) { // if the button pressed is apart of the answer ID
            let guess = element.textContent; // take the text inside the button as the guess
            if (guess === correctAnswer) { // if the guess is the answer add 5 to the score
                score += 5;
            } else timeLeft -= 15; // if the guess is not the answer, remove 15 seconds from the timer
            if (timeLeft === 1) timer.innerHTML = `${timeLeft} second left`; // check plurality of the time left
            else if (timeLeft > 1) timer.innerHTML = `${timeLeft} seconds left`; // ^ ^ ^
            currentScore.innerHTML = `Score: ${score}`; // update displayed score
            createQuestion(); // create a new question
        }
    }
}

function newScore() { // prompt user with their name to save their score and name
    let username = prompt('Enter your name'); // get name from the user

    let scoreboard = JSON.parse(localStorage.getItem('highscores')); // grab the saved data of the site

    if (scoreboard !== null) { // if the storage existed, add name and score to an object to save to storage
        scoreboard[score] = username;
        localStorage.setItem('highscores', JSON.stringify(scoreboard));
        renderScores(scoreboard); // display the scoreboard
        return; // exit function
    } 
    let highscores = {}; // if theres no saved data, create a new scoring object and save it to local storage
    highscores[score] = username;
    localStorage.setItem('highscores', JSON.stringify(highscores));
    renderScores(highscores); // show scoreboard
}

playBtn.addEventListener('click', startGame); // play button listener

answerBtn.onclick = checkAnswer(); // answer button listener

restartGame.addEventListener('click', startGame); // restart game listener

resetScores.addEventListener('click', function() { // reset scores listener
    localStorage.clear();
    scoreList.innerHTML = '';
});