import React, { useEffect, useState } from "react";
import { getQuiz, submitQuiz } from "../services/QuizService.js";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Button, Radio, Steps, Spin, Progress } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaArrowLeft, FaCheck, FaSpa } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const { Title, Paragraph } = Typography;

const QuizPage = () => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const response = await getQuiz();
                setQuiz(response.data);
                // Initialize answers object with empty values
                const initialAnswers = {};
                response.data.questions.forEach(question => {
                    initialAnswers[question._id] = null;
                });
                setAnswers(initialAnswers);
            } catch (error) {
                console.error("Error fetching quiz:", error);
                toast.error("Không thể tải dữ liệu trắc nghiệm. Vui lòng thử lại sau!");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    const handleSelectAnswer = (questionId, option) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        // Check if all questions are answered
        const unansweredQuestions = Object.values(answers).filter(answer => answer === null).length;

        if (unansweredQuestions > 0) {
            toast.warning(`Bạn còn ${unansweredQuestions} câu hỏi chưa trả lời!`);
            return;
        }

        const formattedAnswers = Object.keys(answers).map((questionId) => ({
            questionId,
            score: answers[questionId].scores
        }));

        try {
            setSubmitting(true);
            const response = await submitQuiz({ quizId: quiz._id, answers: formattedAnswers });
            toast.success("Đã hoàn thành bài trắc nghiệm!");
            setTimeout(() => navigate("/skincare-result"), 1500);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            toast.error("Có lỗi xảy ra khi gửi kết quả!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="text-center mb-8">
                    <Skeleton height={60} width={300} className="mx-auto" />
                    <Skeleton height={20} count={2} className="mt-4" />
                </div>
                <Skeleton height={400} className="rounded-lg" />
            </div>
        );
    }

    const currentQuestion = quiz?.questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / (quiz?.questions.length - 1)) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-3xl mx-auto px-4">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaSpa className="text-4xl text-blue-500 mx-auto mb-3" />
                    <Title level={2}>{quiz.title}</Title>
                    <Paragraph className="text-gray-600 max-w-xl mx-auto">
                        {quiz.description}
                    </Paragraph>
                </motion.div>

                <Card className="shadow-lg rounded-xl mb-6 overflow-hidden">
                    <div className="p-1">
                        <Progress
                            percent={progress}
                            showInfo={false}
                            status="active"
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                        <span className="font-medium text-gray-600">
                            Câu hỏi {currentQuestionIndex + 1}/{quiz.questions.length}
                        </span>
                        <div className="text-sm text-blue-600">
                            {Math.round(progress)}% hoàn thành
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="p-6"
                        >
                            <Title level={4} className="mb-6">
                                {currentQuestionIndex + 1}. {currentQuestion.text}
                            </Title>

                            <Radio.Group
                                className="w-full space-y-3"
                                value={answers[currentQuestion._id]}
                                onChange={(e) => handleSelectAnswer(currentQuestion._id, e.target.value)}
                            >
                                {currentQuestion.options.map((option, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 300 }}

                                    >
                                        <Radio
                                            value={option}
                                            className="w-full py-3 px-4 border rounded-lg flex items-center cursor-pointer hover:bg-blue-50 transition-colors"
                                        >
                                            <div className="ml-2 font-medium">
                                                {option.text}
                                            </div>
                                        </Radio>
                                    </motion.div>
                                ))}
                            </Radio.Group>
                        </motion.div>
                    </AnimatePresence>

                    <div className="px-6 py-4 bg-gray-50 flex justify-between">
                        <Button
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                            icon={<FaArrowLeft className="mr-1" />}
                        >
                            Câu trước
                        </Button>

                        {currentQuestionIndex < quiz.questions.length - 1 ? (
                            <Button
                                type="primary"
                                onClick={handleNextQuestion}
                                disabled={!answers[currentQuestion._id]}
                                className="bg-blue-500"
                                icon={<FaArrowRight className="ml-1" />}
                            >
                                Câu tiếp theo
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                loading={submitting}
                                className="bg-green-500 hover:bg-green-600"
                                icon={<FaCheck className="mr-1" />}
                            >
                                Hoàn thành
                            </Button>
                        )}
                    </div>
                </Card>

                <div className="text-center mt-4">
                    <span className="text-sm text-gray-500">
                        Trả lời tất cả các câu hỏi để nhận kết quả chính xác nhất
                    </span>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
