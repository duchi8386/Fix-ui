import React, { useEffect, useState } from "react";
import { getQuizResult } from "../services/ResultService";
import { useNavigate } from "react-router-dom";

const SkincareResult = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchResult = async () => {
            try {
                const response = await getQuizResult();
                setResult(response.data.data);
            } catch (error) {
                console.error("Error fetching quiz result:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [navigate]);

    if (loading) {
        return <p className="text-center text-lg font-semibold">Loading...</p>;
    }

    if (!result) {
        return <p className="text-center text-lg font-semibold">No result found. Please take the quiz.</p>;
    }

    return (
        <div className="routine-container mx-auto max-w-3xl p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">
                Your Skin Type: <span className="text-blue-500">{result.skinType}</span>
            </h1>
            <h2 className="text-xl font-semibold text-center">Recommended Skincare Routine:</h2>

            {result.recommendedRoutine ? (
                <ul className="mt-6 space-y-6">
                    {result.recommendedRoutine.steps.map((step, index) => (
                        <li key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                            <h3 className="font-semibold mb-2">Step {step.stepNumber}: {step.description}</h3>

                            {step.product ? (
                                <div
                                    className="flex gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                                    onClick={() => navigate(`/products/${step.product._id}`)} // ✅ Chuyển hướng
                                >
                                    <img
                                        src={step.product.imageUrl}
                                        alt={step.product.name}
                                        className="object-cover rounded-lg shadow d-flex justify-content-center"
                                        style={{height:'100px', width:'150px'}}
                                    />
                                    <div>
                                        <h4 className="text-lg font-semibold">{step.product.name}</h4>
                                        <p className="text-sm text-gray-600">{step.product.description}</p>
                                        <p className="text-md font-semibold text-green-600 mt-2">
                                            Price: {step.product.price.toLocaleString()} VND
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No product recommended for this step.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-600 mt-4">No skincare routine found for this skin type.</p>
            )}

            <div className="flex justify-center mt-6">
                <button
                    onClick={() => navigate("/home")}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default SkincareResult;
