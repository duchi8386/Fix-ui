import React, { useEffect, useState } from "react";
import { getProductListForUser } from "../services/productService";
import { Link } from "react-router-dom";
import "../style/productList.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [skinType, setSkinType] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [category, skinType, page]); // Gọi API khi category, skinType hoặc page thay đổi

    const fetchProducts = async () => {
        try {
            const res = await getProductListForUser({ category, skinType, page });
            setProducts(res.data || []);
            setTotalPages(res.pagination?.totalPages || 1);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    return (
        <div className="container">
            <h2 className="mb-4 text-center">Danh Sách Sản Phẩm</h2>

            {/* Bộ lọc */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Tất cả danh mục</option>
                        <option value="cleanser">Cleanser</option>
                        <option value="toner">Toner</option>
                        <option value="sunscreen">Sunscreen</option>
                        <option value="serum">Serum</option>
                        <option value="moisturizer">Moisturizer</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <select className="form-control" value={skinType} onChange={(e) => setSkinType(e.target.value)}>
                        <option value="">Tất cả loại da</option>
                        <option value="oily">Da dầu</option>
                        <option value="dry">Da khô</option>
                        <option value="combination">Da hỗn hợp</option>
                        <option value="sensitive">Da nhạy cảm</option>
                    </select>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="row justify-content-center">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="col-3 mb-4">
                            <Link to={`/products/${product.id}`} className="product-link">
                                <div className="card shadow-sm">
                                    <img
                                        src={product.imageUrl}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text text-danger">
                                            <strong>{product.price} VND</strong>
                                        </p>
                                        <p className="card-text">Stock: {product.stock}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p>Không có sản phẩm nào</p>
                    </div>
                )}
            </div>

            {/* Phân trang */}
            <div className="d-flex justify-content-center mt-3">
                <button
                    className="btn btn-primary mx-2"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Trang trước
                </button>
                <span className="align-self-center">Trang {page} / {totalPages}</span>
                <button
                    className="btn btn-primary mx-2"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
};

export default ProductList;
