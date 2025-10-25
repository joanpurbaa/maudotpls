export interface Answer {
	question: string;
	selectedAnswer: string;
	correctAnswer: string;
	isCorrect: boolean;
}

export interface Question {
	question: string;
	correct_answer: string;
	options: string[];
	category: string;
	difficulty: string;
}

export interface QuizData {
	user: string;
	questions: Question[];
	currentQuestionIndex: number;
	answers: Answer[];
	timeLeft: number;
	quizStarted: boolean;
	quizFinished: boolean;
	savedAt: string;
}

export interface ApiResponse {
	results: {
		question: string;
		correct_answer: string;
		incorrect_answers: string[];
		category: string;
		difficulty: string;
	}[];
}

export interface QuizResults {
	correct: number;
	wrong: number;
	unanswered: number;
}
