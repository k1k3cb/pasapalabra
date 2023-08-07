import { gameQuestions } from './questions.js';

const textInputElement = document.getElementById('text-input');
const userFormElement = document.getElementById('user-form');
const questionElement = document.getElementById('question');
const circleElement = document.getElementById('circle');
const pasapalabraBtnElement = document.getElementById('pasapalabra-btn');
const preguntaTitleElement = document.getElementById('pregunta-title');
const heartsContainerElement = document.getElementById('hearts-container');
const letterUsedElement = document.getElementById('letter-used');
const timeLeftElement = document.getElementById('time-left');
const gameDataElement = document.getElementById('game-data');
const questionContainerElement = document.getElementById('question-container');
let randomQuestionsArray = [];
let gameOver = false;
let attempts = 3;
let timer;

//genero un array con solo una pregunta (de forma aleatoria) por cada letra del abecedario
const generateRandomQuestions = array => {
	randomQuestionsArray = array.flatMap(({ letter, questions }) => {
		const randomIndex = Math.floor(Math.random() * questions.length);
		const { question, answer } = questions[randomIndex];
		return { letter, question, answer };
	});
	console.log(randomQuestionsArray);
};

const showNextQuestion = () => {
	if (gameOver) {
		const resumeGame = document.createElement('p');
		resumeGame.textContent = 'Has perdido :(';
		resumeGame.classList.add('centered-text');
		gameDataElement.textContent = ''; 
		gameDataElement.appendChild(resumeGame);
		questionContainerElement.classList.add('opacity');
		textInputElement.disabled = true;
		pasapalabraBtnElement.disabled = true;
		return;
	}
	const currentQuestion = randomQuestionsArray[0];
	if (currentQuestion) {
		questionElement.textContent = currentQuestion.question;
		letterUsedElement.textContent = `La letra actual es la ${currentQuestion.letter}`;
		// me aseguro  que ninguna letra esté resaltada antes de resaltar la letra de la pregunta actual
		const letterElements = Array.from(circleElement.children);
		letterElements.forEach(element =>
			element.classList.remove('letter--current')
		);
		// Busco y resalto la letra actual
		const currentLetter = currentQuestion.letter;
		const currentLetterElement = letterElements.find(
			element => element.textContent === currentLetter
		);
		currentLetterElement.classList.add('letter--current');
		// Reinicio temporizador para la nueva pregunta
		startTimer();
	}
};

const removeHeart = () => {
	const heartIcons = heartsContainerElement.querySelectorAll('.heart-icon');
	if (heartIcons.length > 0) {
		heartsContainerElement.removeChild(heartIcons[heartIcons.length - 1]);
	}
};

const checkWord = () => {
	if (gameOver) return;

	const userWord = textInputElement.value.trim().toLowerCase();

	if (randomQuestionsArray.length > 0) {
		const currentQuestion = randomQuestionsArray[0];

		const letterElement = Array.from(circleElement.children).find(
			element => element.textContent === currentQuestion.letter
		);
		// console.log(letterElement);

		if (userWord === currentQuestion.answer) {
			letterElement.classList.add('letter--correct');
		} else if (userWord !== currentQuestion.answer) {
			letterElement.classList.add('letter--wrong');
			attempts--;
			// Elimina un corazón
			removeHeart();

			if (attempts === 0) {
				
				preguntaTitleElement.classList.add('hidden');
				console.log('lost');
				gameOver = true;
				textInputElement.disabled = true;
				pasapalabraBtnElement.disabled = true;
			}
		}

		randomQuestionsArray.shift();
	}

	if (randomQuestionsArray.length === 0) {
		const resumeGame = document.createElement('p');
		resumeGame.textContent = 'Fin de la partida';
		resumeGame.classList.add('centered-text');
		gameDataElement.textContent = '';
		gameDataElement.appendChild(resumeGame);

	}

	showNextQuestion();

	textInputElement.value = '';
	console.log(randomQuestionsArray);
};

const skipQuestion = () => {
	if (randomQuestionsArray.length > 1) {
		const currentQuestion = randomQuestionsArray.shift();
		randomQuestionsArray.push(currentQuestion);
		showNextQuestion();
	}
};

const updateTimer = () => {
	if (attempts > 0) {
		let timeLeft = parseInt(timeLeftElement.textContent);
		timeLeft--;
		timeLeftElement.textContent = timeLeft; // Actualizar  tiempo mostrado

		if (timeLeft === 0) {
			markQuestionAsWrong();
		}
	}
};

const startTimer = () => {
	clearInterval(timer);
	let timeLeft = 15; // tiempo  15 segundos
	timeLeftElement.textContent = timeLeft;

	timer = setInterval(updateTimer, 1000);
};

const markQuestionAsWrong = () => {
	if (randomQuestionsArray.length > 0) {
		const currentQuestion = randomQuestionsArray[0];

		const letterElement = Array.from(circleElement.children).find(
			element => element.textContent === currentQuestion.letter
		);

		// Detener el temporizador
		clearInterval(timer);

		// Marcar la pregunta como errónea
		letterElement.classList.add('letter--wrong');

		// Reducir los intentos restantes
		attempts--;
		removeHeart();

		if (attempts === 0) {
			// questionElement.textContent = '¡Has perdido!';
			questionContainerElement.classList.add('hidden');
			// console.log('lost');
			gameOver = true;
			textInputElement.disabled = true;
			pasapalabraBtnElement.disabled = true;
		}

		randomQuestionsArray.shift();
		console.log(randomQuestionsArray);
	}

	// Pasar a la siguiente pregunta
	showNextQuestion();
};

//hago que no afecte el enter con el botón de pasapalabra
const handleKeyPress = event => {
	if (event.key === 'Enter') {
		event.preventDefault();
		checkWord();
	}
};

pasapalabraBtnElement.addEventListener('click', skipQuestion);
userFormElement.addEventListener('keypress', handleKeyPress);
generateRandomQuestions(gameQuestions);
showNextQuestion();
startTimer();
