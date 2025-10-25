import React from "react";
import type { Question } from "../../types/quiz";
import QuizHeader from "./QuizHeader";
import QuestionCard from "./QuestionCard";

interface QuizInProgressProps {
	user: string;
	questions: Question[];
	currentQuestionIndex: number;
	timeLeft: number;
	handleAnswerSelect: (selectedAnswer: string) => void;
}

const QuizInProgress: React.FC<QuizInProgressProps> = ({
	user,
	questions,
	currentQuestionIndex,
	timeLeft,
	handleAnswerSelect,
}) => {
	const currentQuestion = questions[currentQuestionIndex];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
			<div className="max-w-4xl mx-auto">
				<QuizHeader
					user={user}
					timeLeft={timeLeft}
					currentQuestionIndex={currentQuestionIndex}
					totalQuestions={questions.length}
				/>

				{currentQuestion && (
					<QuestionCard
						question={currentQuestion}
						onAnswerSelect={handleAnswerSelect}
					/>
				)}
			</div>
		</div>
	);
};

export default QuizInProgress;
