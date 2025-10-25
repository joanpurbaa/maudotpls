import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import type { QuizResults as QuizResultsType } from "../../types/quiz";

interface ResultsGridProps {
	results: QuizResultsType;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results }) => {
	return (
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
	);
};

export default ResultsGrid;
