import { useState, useEffect, useCallback } from "react";
import type {
	Question,
	Answer,
	QuizData,
	ApiResponse,
	QuizResults,
} from "../types/quiz";
import {
	saveQuizData,
	loadQuizData,
	clearQuizData,
} from "../utils/localStorage";
import { decodeHTML, shuffleArray } from "../utils/questionUtils";

export const useQuiz = () => {
	const [user, setUser] = useState<string | null>(null);
	const [username, setUsername] = useState<string>("");
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [timeLeft, setTimeLeft] = useState<number>(600);
	const [quizStarted, setQuizStarted] = useState<boolean>(false);
	const [quizFinished, setQuizFinished] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [showResumePrompt, setShowResumePrompt] = useState<boolean>(false);

	useEffect(() => {
		const savedData = loadQuizData();
		if (
			savedData?.quizStarted &&
			!savedData.quizFinished &&
			savedData.questions.length > 0
		) {
			setShowResumePrompt(true);
		}
	}, []);

	useEffect(() => {
		if (quizStarted && !quizFinished) {
			const dataToSave: Partial<QuizData> = {
				questions,
				currentQuestionIndex,
				answers,
				timeLeft,
				quizStarted,
				quizFinished,
				savedAt: new Date().toISOString(),
				user: user || "",
			};
			saveQuizData(dataToSave);
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
			clearQuizData();
		}
	}, [quizFinished]);

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

	const resumeQuiz = useCallback((): void => {
		const savedData = loadQuizData();
		if (savedData) {
			setUser(savedData.user);
			setQuestions(savedData.questions);
			setCurrentQuestionIndex(savedData.currentQuestionIndex);
			setAnswers(savedData.answers);
			setTimeLeft(savedData.timeLeft);
			setQuizStarted(savedData.quizStarted);
			setQuizFinished(savedData.quizFinished);
			setShowResumePrompt(false);
		}
	}, []);

	const startFreshQuiz = useCallback((): void => {
		clearQuizData();
		setShowResumePrompt(false);
	}, []);

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

	const handleLogin = (): void => {
		if (username.trim()) {
			setUser(username);
		}
	};

	const handleStartQuiz = async (): Promise<void> => {
		await fetchQuestions();
		setQuizStarted(true);
		setTimeLeft(180);
	};

	const handleAnswerSelect = (selectedAnswer: string): void => {
		const currentQuestion = questions[currentQuestionIndex];
		const isCorrect = selectedAnswer === currentQuestion.correct_answer;

		const newAnswer: Answer = {
			question: currentQuestion.question,
			selectedAnswer,
			correctAnswer: currentQuestion.correct_answer,
			isCorrect,
		};

		setAnswers([...answers, newAnswer]);

		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setQuizFinished(true);
		}
	};

	const getResults = (): QuizResults => {
		const correct = answers.filter((a) => a.isCorrect).length;
		const wrong = answers.filter((a) => !a.isCorrect).length;
		const unanswered = questions.length - answers.length;
		return { correct, wrong, unanswered };
	};

	const handleResetQuiz = (): void => {
		clearQuizData();
		setQuestions([]);
		setCurrentQuestionIndex(0);
		setAnswers([]);
		setTimeLeft(180);
		setQuizStarted(false);
		setQuizFinished(false);
	};

	return {
		user,
		username,
		setUsername,
		questions,
		currentQuestionIndex,
		timeLeft,
		quizStarted,
		quizFinished,
		loading,
		showResumePrompt,
		resumeQuiz,
		startFreshQuiz,
		handleLogin,
		handleStartQuiz,
		handleAnswerSelect,
		getResults,
		handleResetQuiz,
		setUser,
	};
};
