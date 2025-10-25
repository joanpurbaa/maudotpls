import React, { useState, useEffect } from "react";
import ResumePrompt from "./components/ResumePrompt";
import Login from "./components/Login";
import QuizRules from "./components/QuizRules";
import QuizResults from "./components/QuizResults";
import QuizInProgress from "./components/QuizInProgress";

interface Answer {
	question: string;
	selectedAnswer: string;
	correctAnswer: string;
	isCorrect: boolean;
}

interface Question {
	question: string;
	correct_answer: string;
	options: string[];
	category: string;
	difficulty: string;
}

interface QuizData {
	user: string;
	questions: Question[];
	currentQuestionIndex: number;
	answers: Answer[];
	timeLeft: number;
	quizStarted: boolean;
	quizFinished: boolean;
	savedAt: string;
}

interface ApiResponse {
	results: {
		question: string;
		correct_answer: string;
		incorrect_answers: string[];
		category: string;
		difficulty: string;
	}[];
}

const App: React.FC = () => {
	const [user, setUser] = useState<string | null>(null);
	const [username, setUsername] = useState<string>("");
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [timeLeft, setTimeLeft] = useState<number>(600);
	const [quizStarted, setQuizStarted] = useState<boolean>(false);
	const [quizFinished, setQuizFinished] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [, setHasResumeData] = useState<boolean>(false);
	const [showResumePrompt, setShowResumePrompt] = useState<boolean>(false);

	useEffect(() => {
		try {
			const savedData = localStorage.getItem("quizAppData");
			if (savedData) {
				const data: QuizData = JSON.parse(savedData);
				if (data.quizStarted && !data.quizFinished && data.questions.length > 0) {
					setHasResumeData(true);
					setShowResumePrompt(true);
				}
			}
		} catch (error) {
			console.error("Error loading saved data:", error);
		}
	}, []);

	useEffect(() => {
		if (quizStarted && !quizFinished) {
			try {
				const dataToSave: QuizData = {
					questions,
					currentQuestionIndex,
					answers,
					timeLeft,
					quizStarted,
					quizFinished,
					savedAt: new Date().toISOString(),
					user: "",
				};
				localStorage.setItem("quizAppData", JSON.stringify(dataToSave));
			} catch (error) {
				console.error("Error saving data:", error);
			}
		}
	}, [
		user,
		questions,
		currentQuestionIndex,
		answers,
		timeLeft,
		quizStarted,
		quizFinished,
	]);

	useEffect(() => {
		if (quizFinished) {
			try {
				localStorage.removeItem("quizAppData");
			} catch (error) {
				console.error("Error clearing data:", error);
			}
		}
	}, [quizFinished]);

	const resumeQuiz = (): void => {
		try {
			const savedData = localStorage.getItem("quizAppData");
			if (savedData) {
				const data: QuizData = JSON.parse(savedData);
				setUser(data.user);
				setQuestions(data.questions);
				setCurrentQuestionIndex(data.currentQuestionIndex);
				setAnswers(data.answers);
				setTimeLeft(data.timeLeft);
				setQuizStarted(data.quizStarted);
				setQuizFinished(data.quizFinished);
				setShowResumePrompt(false);
			}
		} catch (error) {
			console.error("Error resuming quiz:", error);
			setShowResumePrompt(false);
		}
	};

	const startFreshQuiz = (): void => {
		try {
			localStorage.removeItem("quizAppData");
			setHasResumeData(false);
			setShowResumePrompt(false);
		} catch (error) {
			console.error("Error clearing data:", error);
		}
	};

	const decodeHTML = (html: string): string => {
		const txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	};

	const shuffleArray = <T,>(array: T[]): T[] => {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
		}
		return newArray;
	};

	const fetchQuestions = async (): Promise<void> => {
		setLoading(true);
		try {
			const response = await fetch(
				"https://opentdb.com/api.php?amount=10&type=multiple"
			);
			const data: ApiResponse = await response.json();

			if (data.results) {
				const formattedQuestions: Question[] = data.results.map((q) => ({
					question: decodeHTML(q.question),
					correct_answer: decodeHTML(q.correct_answer),
					options: shuffleArray([
						decodeHTML(q.correct_answer),
						...q.incorrect_answers.map((a) => decodeHTML(a)),
					]),
					category: decodeHTML(q.category),
					difficulty: q.difficulty,
				}));
				setQuestions(formattedQuestions);
			}
		} catch (error) {
			console.error("Error fetching questions:", error);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (quizStarted && !quizFinished && timeLeft > 0) {
			const timer = setTimeout(() => {
				setTimeLeft(timeLeft - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (timeLeft === 0 && quizStarted) {
			setQuizFinished(true);
		}
	}, [timeLeft, quizStarted, quizFinished]);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleLogin = (): void => {
		if (username.trim()) {
			setUser(username);
		}
	};

	const handleStartQuiz = async (): Promise<void> => {
		await fetchQuestions();
		setQuizStarted(true);
		setTimeLeft(600);
	};

	const handleAnswerSelect = (selectedAnswer: string): void => {
		const currentQuestion = questions[currentQuestionIndex];
		const isCorrect = selectedAnswer === currentQuestion.correct_answer;

		setAnswers([
			...answers,
			{
				question: currentQuestion.question,
				selectedAnswer,
				correctAnswer: currentQuestion.correct_answer,
				isCorrect,
			},
		]);

		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setQuizFinished(true);
		}
	};

	const getResults = (): {
		correct: number;
		wrong: number;
		unanswered: number;
	} => {
		const correct = answers.filter((a) => a.isCorrect).length;
		const wrong = answers.filter((a) => !a.isCorrect).length;
		const unanswered = questions.length - answers.length;
		return { correct, wrong, unanswered };
	};

	const handleResetQuiz = (): void => {
		try {
			localStorage.removeItem("quizAppData");
		} catch (error) {
			console.error("Error clearing data:", error);
		}
		setQuestions([]);
		setCurrentQuestionIndex(0);
		setAnswers([]);
		setTimeLeft(600);
		setQuizStarted(false);
		setQuizFinished(false);
	};

	if (showResumePrompt) {
		return (
			<ResumePrompt resumeQuiz={resumeQuiz} startFreshQuiz={startFreshQuiz} />
		);
	}

	if (!user) {
		return (
			<Login
				username={username}
				setUsername={setUsername}
				handleLogin={handleLogin}
			/>
		);
	}

	if (!quizStarted) {
		return (
			<QuizRules user={user} loading={loading} handleStartQuiz={handleStartQuiz} />
		);
	}

	if (quizFinished) {
		const results = getResults();
		const percentage = Math.round((results.correct / questions.length) * 100);

		return (
			<QuizResults
				user={user}
				results={results}
				percentage={percentage}
				handleResetQuiz={handleResetQuiz}
				setUser={setUser}
			/>
		);
	}

	return (
		<QuizInProgress
			user={user}
			questions={questions}
			currentQuestionIndex={currentQuestionIndex}
			timeLeft={timeLeft}
			formatTime={formatTime}
			handleAnswerSelect={handleAnswerSelect}
		/>
	);
};

export default App;
