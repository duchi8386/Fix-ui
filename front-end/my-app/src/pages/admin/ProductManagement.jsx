import { useEffect, useState } from "react";
import { getProductList, changeStatusProduct } from "../../services/ProductService.js";
import { getSkinTypeList } from "../../services/SkinTypeService.js";
import { useNavigate } from "react-router-dom";

export const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [skinTypes, setSkinTypes] = useState([]);
    const [selectedSkinType, setSelectedSkinType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const limit = 5; // Số sản phẩm mỗi trang

    useEffect(() => {
        fetchProducts();
    }, [selectedSkinType, selectedCategory, currentPage]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const [productsRes, skinTypesRes] = await Promise.all([
                getProductList({
                    skinType: selectedSkinType,
                    category: selectedCategory,
                    page: currentPage,
                    limit
                }),
                getSkinTypeList(),
            ]);
            setProducts(productsRes.data);
            setTotalPages(productsRes.pagination.totalPages);
            setSkinTypes(skinTypesRes.data);
        } catch (error) {
            setError(error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleView = (productId) => {
        navigate(`/admin/products/${productId}/view`);
    };

    const handleEdit = (productId) => {
        navigate(`/admin/products/${productId}/edit`);
    };

    const handleToggleStatus = async (productId) => {
        try {
            await changeStatusProduct(productId);
            fetchProducts(); // Cập nhật danh sách sản phẩm sau khi thay đổi trạng thái
        } catch (error) {
            console.error("Failed to update product status:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Product Management</h1>

            {/* Bộ lọc */}
            <div className="flex gap-4 mb-4">
                <select
                    value={selectedSkinType}
                    onChange={(e) => setSelectedSkinType(e.target.value)}
                    className="border p-2"
                >
                    <option value="">All Skin Types</option>
                    {skinTypes.map((skin) => (
                        <option style={{ color: "black" }} className="text-primary" key={skin._id} value={skin._id}>
                            {skin.type}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border p-2"
                >
                    <option value="">All Categories</option>
                    <option value="cleanser">Cleanser</option>
                    <option value="serum">Serum</option>
                    <option value="moisturizer">Moisturizer</option>
                    <option value="toner">Toner</option>
                    <option value="sunscreen">Sunscreen</option>
                </select>
            </div>

            <button
                onClick={() => navigate("/admin/products/new")}
                className="bg-blue-500 text-danger px-4 py-2 rounded ml-4"
            >
                Add Product
            </button>

            {/* Bảng sản phẩm */}
            <table className="w-full mt-4 border-collapse border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Brand</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Stock</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id} className="border">
                        <td className="border px-4 py-2">{product.id}</td>
                        <td className="border px-4 py-2">{product.name}</td>
                        <td className="border px-4 py-2">{product.category}</td>
                        <td className="border px-4 py-2">{product.brand}</td>
                        <td className="border px-4 py-2">{formatCurrency(product.price)} VND</td>
                        <td className="border px-4 py-2">{product.stock}</td>
                        <td className="border px-4 py-2">
                                <span className={product.status === "active" ? "text-black" : "text-black"}>
                                    {product.status}
                                </span>
                        </td>
                        <td className="border px-4 py-2">
                            <button
                                onClick={() => handleView(product.id)}
                                className="bg-gray-300 text-black px-2 py-1 rounded mr-2"
                            >
                                View
                            </button>
                            <button
                                onClick={() => handleEdit(product.id)}
                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleToggleStatus(product.id)}
                                className={`px-2 py-1 rounded ${
                                    product.status === "active" ? "bg-red-500 text-success" : "bg-green-500 text-danger"
                                }`}
                            >
                                {product.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="mt-4 flex justify-center">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border mx-1"
                >
                    Previous
                </button>
                <span className="px-3 py-1">{currentPage} / {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border mx-1"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
