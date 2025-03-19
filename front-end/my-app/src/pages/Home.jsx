import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizResult } from "../services/ResultService";

const Home = () => {
    const navigate = useNavigate();
    const [hasSkinType, setHasSkinType] = useState(false);

    useEffect(() => {
        const fetchUserSkinType = async () => {
            try {
                const response = await getQuizResult();
                if (response.data.data.skinType) {
                    setHasSkinType(true);
                }
            } catch (error) {
                console.error("Error fetching quiz result:", error);
            }
        };

        fetchUserSkinType();
    }, []);

    return (
        <div className="home-container">
            <h1>Welcome to BeautyCare</h1>

            {hasSkinType ? (
                <>
                    <h1>Xem lộ trình chăm sóc da</h1>
                    <button onClick={() => navigate("/skincare-result")} className="view-routine-btn">
                        Xem lộ trình chăm sóc da
                    </button>
                </>
            ) : (
                <>
                    <h1>Làm quiz để xác định loại da và đưa ra lộ trình</h1>
                    <button onClick={() => navigate("/quiz")} className="start-btn">
                        Bắt đầu quiz
                    </button>
                </>
            )}
        </div>
    );
};

export default Home;
