import React, { useEffect, useState } from "react";
import { addProductToStep } from "../../services/SkincareRoutineService.js";
import axios from "axios";

const API_BASE_URL = "http://localhost:9999";

const StepProducts = ({ routine, step, updateRoutine }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");

    const categoryMap = {
        1: "cleanser",
        2: "toner",
        3: "serum",
        4: "moisturizer",
        5: "sunscreen",
    };
    const category = categoryMap[step.stepNumber];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products?category=${category}`, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
                setProducts(response.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        };
        fetchProducts();
    }, [category]);

    const handleAddProduct = async () => {
        if (!selectedProduct) return;
        try {
            const response = await addProductToStep(routine._id, step.stepNumber, selectedProduct);
            alert("Thêm sản phẩm thành công!");

            // Cập nhật state của routine (không cần reload)
            const updatedStep = { ...step, product: products.find(p => p.id === selectedProduct) };
            updateRoutine(routine._id, updatedStep);

            setSelectedProduct(""); // Reset dropdown
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
        }
    };

    return (
        <div>
            <h4>Step {step.stepNumber}: {step.description}</h4>
            <ul>
                {step.product ? (
                    <li>{step.product.name}</li>
                ) : (
                    <li>Chưa có sản phẩm</li>
                )}
            </ul>
            <select onChange={(e) => setSelectedProduct(e.target.value)} value={selectedProduct}>
                <option value="">Chọn sản phẩm</option>
                {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                ))}
            </select>
            <button onClick={handleAddProduct}>Thêm sản phẩm</button>
        </div>
    );
};

export default StepProducts;
