import React from "react";

interface QuizRulesProps {
	user: string;
	loading: boolean;
	handleStartQuiz: () => void;
}

const QuizRules: React.FC<QuizRulesProps> = ({
	user,
	loading,
	handleStartQuiz,
}) => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user}!</h2>
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
};

export default QuizRules;
