import React from "react";
import type { Question } from "../../types/quiz";

interface QuestionCardProps {
	question: Question;
	onAnswerSelect: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
	question,
	onAnswerSelect,
}) => {
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return "bg-green-100 text-green-700";
			case "medium":
				return "bg-yellow-100 text-yellow-700";
			case "hard":
				return "bg-red-100 text-red-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-8">
			<div className="mb-6">
				<span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
					{question.category}
				</span>
				<span
					className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
						question.difficulty
					)}`}>
					{question.difficulty}
				</span>
			</div>

			<h3 className="text-2xl font-bold text-gray-800 mb-8">
				{question.question}
			</h3>

			<div className="space-y-3">
				{question.options.map((option, index) => (
					<button
						key={index}
						onClick={() => onAnswerSelect(option)}
						className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-all duration-200 font-medium text-gray-700 hover:text-blue-700">
						<span className="inline-block w-8 h-8 bg-gray-200 rounded-full text-center leading-8 mr-3">
							{String.fromCharCode(65 + index)}
						</span>
						{option}
					</button>
				))}
			</div>
		</div>
	);
};

export default QuestionCard;
