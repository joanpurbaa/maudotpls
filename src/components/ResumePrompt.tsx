import React from "react";
import { RotateCcw } from "lucide-react";

interface ResumePromptProps {
	resumeQuiz: () => void;
	startFreshQuiz: () => void;
}

const ResumePrompt: React.FC<ResumePromptProps> = ({
	resumeQuiz,
	startFreshQuiz,
}) => {
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
};

export default ResumePrompt;
