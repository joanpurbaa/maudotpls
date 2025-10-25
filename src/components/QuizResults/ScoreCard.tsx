import React from "react";

interface ScoreCardProps {
	percentage: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ percentage }) => {
	return (
		<div className="bg-blue-50 rounded-lg p-6 mb-6 text-center">
			<p className="text-lg text-gray-700 mb-2">Your Score</p>
			<p className="text-5xl font-bold text-blue-600">{percentage}%</p>
		</div>
	);
};

export default ScoreCard;
