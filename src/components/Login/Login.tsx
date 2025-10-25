import React from "react";
import { Trophy } from "lucide-react";

interface LoginProps {
	username: string;
	setUsername: (username: string) => void;
	handleLogin: () => void;
}

const Login: React.FC<LoginProps> = ({
	username,
	setUsername,
	handleLogin,
}) => {
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleLogin();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
				<div className="text-center mb-8">
					<Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
					<h1 className="text-3xl font-bold text-gray-800">Quiz Master</h1>
					<p className="text-gray-600 mt-2">Test your knowledge!</p>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Enter your name
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							onKeyPress={handleKeyPress}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Your name"
						/>
					</div>
					<button
						onClick={handleLogin}
						className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
						Start Quiz
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
