import React from "react";
import { Trophy, CheckCircle, XCircle } from "lucide-react";

interface QuizResultsProps {
	user: string;
	results: {
		correct: number;
		wrong: number;
		unanswered: number;
	};
	percentage: number;
	handleResetQuiz: () => void;
	setUser: (user: string | null) => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
	user,
	results,
	percentage,
	handleResetQuiz,
	setUser,
}) => {
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
};

export default QuizResults;
