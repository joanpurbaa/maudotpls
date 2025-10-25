import React from "react";
import { Clock, CheckCircle } from "lucide-react";
import { formatTime } from "../../utils/timeFormatter";

interface QuizHeaderProps {
	user: string;
	timeLeft: number;
	currentQuestionIndex: number;
	totalQuestions: number;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
	user,
	timeLeft,
	currentQuestionIndex,
	totalQuestions,
}) => {
	const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

	return (
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
						Question {currentQuestionIndex + 1} of {totalQuestions}
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
	);
};

export default QuizHeader;
