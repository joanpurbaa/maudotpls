import React from "react";
import ResumePrompt from "./components/ResumePrompt/ResumePrompt";
import Login from "./components/Login/Login";
import QuizResults from "./components/QuizResults";
import QuizInProgress from "./components/QuizInProgress";
import { useQuiz } from "./hooks/useQuiz";
import QuizRules from "./components/QuizRules";

const App: React.FC = () => {
	const {
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
	} = useQuiz();

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
			handleAnswerSelect={handleAnswerSelect}
		/>
	);
};

export default App;
