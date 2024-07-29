
const apiURL = 'https://opentdb.com/api.php?amount=10&type=multiple';
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions();
});

function fetchQuestions() {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            displayQuestion();
            document.getElementById('questionnaire').style.display = 'block';
        })
        .catch(error => console.error('Error fetching questions:', error));
}

function displayQuestion() {
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const questionCounter = document.getElementById('question-counter');

    const question = questions[currentQuestionIndex];
    questionElement.innerHTML = question.question;

    optionsContainer.innerHTML = '';
    const allOptions = [...question.incorrect_answers, question.correct_answer];
    allOptions.sort(() => Math.random() - 0.5);

    allOptions.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.innerHTML = option;
        optionButton.onclick = () => selectAnswer(option);
        optionsContainer.appendChild(optionButton);
    });

    questionCounter.innerHTML = `${currentQuestionIndex + 1} / ${questions.length}`;
}

function selectAnswer(answer) {
    userAnswers[currentQuestionIndex] = answer;
    nextQuestion();
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const resultsContainer = document.getElementById('results-container');
    const ResultElements = document.getElementById('results');
    let score = 0;

    questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct_answer) {
            score++;
        }
    });

    ResultElements.innerHTML = `Congratulations, you answered ${score} / ${questions.length} questions correctly.`;
    document.getElementById('questionnaire').style.display = 'none';
    resultsContainer.style.display = 'block';
}

function retry() {
    currentQuestionIndex = 0;
    userAnswers = [];
    document.getElementById('results-container').style.display = 'none';
    fetchQuestions();
}
