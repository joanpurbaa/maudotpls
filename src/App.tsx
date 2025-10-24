import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";

const App = () => {
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState("");
	const [questions, setQuestions] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [timeLeft, setTimeLeft] = useState(600);
	const [quizStarted, setQuizStarted] = useState(false);
	const [quizFinished, setQuizFinished] = useState(false);
	const [loading, setLoading] = useState(false);
	const [hasResumeData, setHasResumeData] = useState(false);
	const [showResumePrompt, setShowResumePrompt] = useState(false);

	// Load saved data on mount
	useEffect(() => {
		try {
			const savedData = localStorage.getItem("quizAppData");
			if (savedData) {
				const data = JSON.parse(savedData);
				// Check if saved quiz is not finished and has valid data
				if (data.quizStarted && !data.quizFinished && data.questions.length > 0) {
					setHasResumeData(true);
					setShowResumePrompt(true);
				}
			}
		} catch (error) {
			console.error("Error loading saved data:", error);
		}
	}, []);

	// Save data to localStorage whenever state changes
	useEffect(() => {
		if (quizStarted && !quizFinished) {
			try {
				const dataToSave = {
					user,
					questions,
					currentQuestionIndex,
					answers,
					timeLeft,
					quizStarted,
					quizFinished,
					savedAt: new Date().toISOString(),
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

	// Clear localStorage when quiz is finished
	useEffect(() => {
		if (quizFinished) {
			try {
				localStorage.removeItem("quizAppData");
			} catch (error) {
				console.error("Error clearing data:", error);
			}
		}
	}, [quizFinished]);

	const resumeQuiz = () => {
		try {
			const savedData = localStorage.getItem("quizAppData");
			if (savedData) {
				const data = JSON.parse(savedData);
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

	const startFreshQuiz = () => {
		try {
			localStorage.removeItem("quizAppData");
			setHasResumeData(false);
			setShowResumePrompt(false);
		} catch (error) {
			console.error("Error clearing data:", error);
		}
	};

	const fetchQuestions = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				"https://opentdb.com/api.php?amount=10&type=multiple"
			);
			const data = await response.json();

			if (data.results) {
				const formattedQuestions = data.results.map((q) => ({
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

	const decodeHTML = (html) => {
		const txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	};

	const shuffleArray = (array) => {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
		}
		return newArray;
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

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleLogin = () => {
		if (username.trim()) {
			setUser(username);
		}
	};

	const handleStartQuiz = async () => {
		await fetchQuestions();
		setQuizStarted(true);
		setTimeLeft(600);
	};

	const handleAnswerSelect = (selectedAnswer) => {
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

	const getResults = () => {
		const correct = answers.filter((a) => a.isCorrect).length;
		const wrong = answers.filter((a) => !a.isCorrect).length;
		const unanswered = questions.length - answers.length;
		return { correct, wrong, unanswered };
	};

	const handleResetQuiz = () => {
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

	// Resume Prompt Screen
	if (showResumePrompt) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
				<div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
					<div className="text-center mb-6">
						<RotateCcw className="w-16 h-16 text-blue-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-800 mb-2">Resume Quiz?</h2>
						<p className="text-gray-600">
							We found a quiz in progress. Would you like to continue where you left
							off?
						</p>
					</div>

					<div className="space-y-3">
						<button
							onClick={resumeQuiz}
							className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
							Resume Quiz
						</button>
						<button
							onClick={startFreshQuiz}
							className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
							Start New Quiz
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
				<div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
					<div className="text-center mb-8">
						<Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
						<h1 className="text-3xl font-bold text-gray-800">Quiz Master</h1>
						<p className="text-gray-600 mt-2">Test your knowledge!</p>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Enter your name
							</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								onKeyPress={(e) => e.key === "Enter" && handleLogin()}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Your name"
							/>
						</div>
						<button
							onClick={handleLogin}
							className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
							Start Quiz
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!quizStarted) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
				<div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
					<div className="text-center">
						<h2 className="text-3xl font-bold text-gray-800 mb-4">
							Welcome, {user}!
						</h2>
						<div className="bg-blue-50 rounded-lg p-6 mb-6">
							<h3 className="text-xl font-semibold text-gray-800 mb-4">Quiz Rules:</h3>
							<ul className="text-left space-y-2 text-gray-700">
								<li>• Total Questions: 10</li>
								<li>• Time Limit: 10 minutes</li>
								<li>• Each question will be displayed one at a time</li>
								<li>• Once you select an answer, you will move to the next question</li>
								<li>
									• Your progress is automatically saved - you can close the browser and
									resume later!
								</li>
								<li>• Your score will be shown at the end</li>
							</ul>
						</div>
						<button
							onClick={handleStartQuiz}
							disabled={loading}
							className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400">
							{loading ? "Loading Questions..." : "Start Quiz Now"}
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (quizFinished) {
		const results = getResults();
		const percentage = Math.round((results.correct / questions.length) * 100);

		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
				<div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
					<div className="text-center mb-8">
						<Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
						<h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
						<p className="text-gray-600">Great job, {user}!</p>
					</div>

					<div className="grid grid-cols-3 gap-4 mb-8">
						<div className="bg-green-50 rounded-lg p-4 text-center">
							<CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
							<p className="text-2xl font-bold text-green-600">{results.correct}</p>
							<p className="text-sm text-gray-600">Correct</p>
						</div>
						<div className="bg-red-50 rounded-lg p-4 text-center">
							<XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
							<p className="text-2xl font-bold text-red-600">{results.wrong}</p>
							<p className="text-sm text-gray-600">Wrong</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4 text-center">
							<div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
								?
							</div>
							<p className="text-2xl font-bold text-gray-600">{results.unanswered}</p>
							<p className="text-sm text-gray-600">Unanswered</p>
						</div>
					</div>

					<div className="bg-blue-50 rounded-lg p-6 mb-6 text-center">
						<p className="text-lg text-gray-700 mb-2">Your Score</p>
						<p className="text-5xl font-bold text-blue-600">{percentage}%</p>
					</div>

					<div className="space-y-2">
						<button
							onClick={handleResetQuiz}
							className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
							Take Another Quiz
						</button>
						<button
							onClick={() => setUser(null)}
							className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
							Logout
						</button>
					</div>
				</div>
			</div>
		);
	}

	const currentQuestion = questions[currentQuestionIndex];
	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-4 mb-4">
					<div className="flex justify-between items-center mb-4">
						<div>
							<p className="text-sm text-gray-600">Logged in as</p>
							<p className="font-semibold text-gray-800">{user}</p>
						</div>
						<div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg">
							<Clock className="w-5 h-5 text-red-600" />
							<span className="text-xl font-bold text-red-600">
								{formatTime(timeLeft)}
							</span>
						</div>
					</div>

					<div className="mb-2">
						<div className="flex justify-between text-sm text-gray-600 mb-1">
							<span>
								Question {currentQuestionIndex + 1} of {questions.length}
							</span>
							<span>{Math.round(progress)}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>

					<div className="mt-3 flex items-center text-xs text-green-600">
						<CheckCircle className="w-4 h-4 mr-1" />
						<span>Progress automatically saved</span>
					</div>
				</div>

				{currentQuestion && (
					<div className="bg-white rounded-lg shadow-lg p-8">
						<div className="mb-6">
							<span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
								{currentQuestion.category}
							</span>
							<span
								className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
									currentQuestion.difficulty === "easy"
										? "bg-green-100 text-green-700"
										: currentQuestion.difficulty === "medium"
										? "bg-yellow-100 text-yellow-700"
										: "bg-red-100 text-red-700"
								}`}>
								{currentQuestion.difficulty}
							</span>
						</div>

						<h3 className="text-2xl font-bold text-gray-800 mb-8">
							{currentQuestion.question}
						</h3>

						<div className="space-y-3">
							{currentQuestion.options.map((option, index) => (
								<button
									key={index}
									onClick={() => handleAnswerSelect(option)}
									className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-all duration-200 font-medium text-gray-700 hover:text-blue-700">
									<span className="inline-block w-8 h-8 bg-gray-200 rounded-full text-center leading-8 mr-3">
										{String.fromCharCode(65 + index)}
									</span>
									{option}
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
