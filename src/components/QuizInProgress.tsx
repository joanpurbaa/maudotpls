import React from "react";
import { Clock, CheckCircle } from "lucide-react";

interface Question {
	question: string;
	correct_answer: string;
	options: string[];
	category: string;
	difficulty: string;
}

interface QuizInProgressProps {
	user: string;
	questions: Question[];
	currentQuestionIndex: number;
	timeLeft: number;
	formatTime: (seconds: number) => string;
	handleAnswerSelect: (selectedAnswer: string) => void;
}

const QuizInProgress: React.FC<QuizInProgressProps> = ({
	user,
	questions,
	currentQuestionIndex,
	timeLeft,
	formatTime,
	handleAnswerSelect,
}) => {
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

export default QuizInProgress;
