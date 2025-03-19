import React, { useEffect, useState } from "react";
import { getSkincareRoutines } from "../../services/SkincareRoutineService.js";
import StepProducts from "./StepProducts";

const SkincareRoutineManagement = () => {
    const [routines, setRoutines] = useState([]);
    const [selectedSkinType, setSelectedSkinType] = useState(""); // Loại da được chọn

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const data = await getSkincareRoutines();
                setRoutines(data.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách routines:", error);
            }
        };
        fetchRoutines();
    }, []);

    // Cập nhật routine khi thêm sản phẩm
    const updateRoutine = (routineId, updatedStep) => {
        setRoutines(prevRoutines =>
            prevRoutines.map(routine =>
                routine._id === routineId
                    ? { ...routine, steps: routine.steps.map(step => step.stepNumber === updatedStep.stepNumber ? updatedStep : step) }
                    : routine
            )
        );
    };

    // Danh sách loại da
    const skinTypes = ["dry", "oily", "combination", "normal", "sensitive"];

    // Lọc routines theo loại da
    const filteredRoutines = selectedSkinType
        ? routines.filter(routine => routine.skinType?.name.toLowerCase() === selectedSkinType)
        : routines;

    return (
        <div>
            <h2>Danh sách Skincare Routines</h2>

            {/* Dropdown chọn loại da */}
            <label>Chọn loại da: </label>
            <select onChange={(e) => setSelectedSkinType(e.target.value)} value={selectedSkinType}>
                <option value="">Tất cả</option>
                {skinTypes.map((type) => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
            </select>

            {filteredRoutines.length === 0 ? (
                <p>Không có routine nào phù hợp</p>
            ) : (
                filteredRoutines.map(routine => (
                    <div key={routine._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <h3>{routine.name}</h3>
                        <p>Loại da: {routine.skinType?.name || "Không xác định"}</p>
                        {routine.steps.map(step => (
                            <StepProducts key={step.stepNumber} routine={routine} step={step} updateRoutine={updateRoutine} />
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default SkincareRoutineManagement;
