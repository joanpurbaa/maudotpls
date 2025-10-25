import React from "react";
import { Trophy } from "lucide-react";
import type { QuizResults as QuizResultsType } from "../../types/quiz";
import ResultsGrid from "./ResultsGrid";
import ScoreCard from "./ScoreCard";

interface QuizResultsProps {
	user: string;
	results: QuizResultsType;
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

				<ResultsGrid results={results} />
				<ScoreCard percentage={percentage} />

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
