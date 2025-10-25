import type { QuizData } from "../types/quiz";

const QUIZ_STORAGE_KEY = "quizAppData";

export const saveQuizData = (data: Partial<QuizData>): void => {
	try {
		localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.error("Error saving quiz data:", error);
	}
};

export const loadQuizData = (): QuizData | null => {
	try {
		const savedData = localStorage.getItem(QUIZ_STORAGE_KEY);
		return savedData ? JSON.parse(savedData) : null;
	} catch (error) {
		console.error("Error loading quiz data:", error);
		return null;
	}
};

export const clearQuizData = (): void => {
	try {
		localStorage.removeItem(QUIZ_STORAGE_KEY);
	} catch (error) {
		console.error("Error clearing quiz data:", error);
	}
};
