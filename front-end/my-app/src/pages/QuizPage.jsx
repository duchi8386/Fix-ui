import React, { useEffect, useState } from "react";
import { getQuiz, submitQuiz } from "../services/QuizService.js";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await getQuiz();
                setQuiz(response.data);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };
        fetchQuiz();
    }, []);

    const handleSelectAnswer = (questionId, option) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = async () => {
        const formattedAnswers = Object.keys(answers).map((questionId) => ({
            questionId,
            score: answers[questionId].scores
        }));

        try {
            const response = await submitQuiz({ quizId: quiz._id, answers: formattedAnswers });
            navigate("/skincare-result");
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };

    if (!quiz) return <p className="text-center text-lg font-semibold">Loading...</p>;

    return (
        <div className="quiz-container mx-auto max-w-3xl p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center">{quiz.title}</h1>
            <p className="text-gray-600 text-center mb-6">{quiz.description}</p>

            {quiz.questions.map((question, qIndex) => (
                <div key={question._id} className="mb-6 p-4 border rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">
                        {qIndex + 1}. {question.text}
                    </h3>
                    <div className="space-y-2">
                        {question.options.map((option, index) => (
                            <label key={index} className="flex items-center gap-3 p-2 border rounded-md cursor-pointer hover:bg-gray-100">
                                <input
                                    type="radio"
                                    name={`question-${question._id}`}
                                    value={option.text}
                                    checked={answers[question._id] === option}
                                    onChange={() => handleSelectAnswer(question._id, option)}
                                    className="w-4 h-4 accent-blue-500"
                                />
                                {option.text}
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button
                className="w-full bg-blue-500 text-black py-2 px-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
                onClick={handleSubmit}
            >
                Submit Quiz
            </button>
        </div>
    );
};

export default QuizPage;
