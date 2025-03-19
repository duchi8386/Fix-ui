import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "../style/productDetail.css";
import {getProductDetail} from "../services/ProductService.js";
import {getReviewsByProductId, createReview} from "../services/ReviewService.js";
import {addToCart} from "../services/CartService.js";

const ProductDetail = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProductAndReviews = async () => {
            try {
                const productResponse = await getProductDetail(id);
                const reviewsResponse = await getReviewsByProductId(id);
                console.log(reviewsResponse.data);
                setProduct(productResponse.data);
                setReviews(reviewsResponse.data.data || []);
                setLoading(false);
            } catch (err) {
                setError("Không tìm thấy sản phẩm");
                setLoading(false);
            }
        };
        fetchProductAndReviews();
    }, [id]);

    useEffect(() => {
        console.log("State reviews cập nhật:", reviews);
    }, [reviews]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await createReview({productId: id, rating, comment});

            const newReview = response.data || {};

            const reviewToAdd = {
                _id: newReview._id || Date.now().toString(),
                user: newReview.user || {fullName: "Ẩn danh"},
                createdAt: newReview.createdAt ? new Date(newReview.createdAt) : new Date(),
                rating: newReview.rating || rating,
                comment: newReview.comment || comment
            };

            setReviews((prevReviews) => [reviewToAdd, ...prevReviews]);

            setComment("");
            setRating(5);
        } catch (err) {
            console.log(err);
            console.log(err.response.data.message);
            alert(err.response.data.message);
        }
        setIsSubmitting(false);
    };

    const handleAddToCart = async () => {
        try {
            await addToCart(product._id, 1);
            alert("Added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };


    if (loading) return <p>Đang tải...</p>;
    if (error) return <p style={{color: "red"}}>{error}</p>;

    return (
        <div className="product-detail container">
            <div className="product-content">
                {/* Hình ảnh sản phẩm */}
                <div className="product-image">
                    <img src={product.imageUrl} alt={product.name}/>
                </div>

                {/* Thông tin sản phẩm */}
                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p className="price">Giá: {product.price} VND</p>
                    <p className="description">Mô Tả: {product.description}</p>
                    <p className="brand">Thương Hiệu: {product.brand.name}</p>
                    <p className="ingredient">Nguyên Liệu: {product.ingredients}</p>
                    <button className="btn btn-primary" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                </div>
            </div>

            {/* Danh sách Review */}
            <h3>Đánh giá sản phẩm</h3>
            <div className="reviews">
                {reviews.length > 0 ? (
                    <div className="review-list container">
                        {reviews.map((review) => (
                            <div key={review._id} className="review-item row">
                                <div className="review-header">
                                    <div className="review-info">
                                        <div>
                                            <strong>{review.user?.fullName || "Ẩn danh"}</strong>
                                        </div>
                                        <div>
                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Chưa có đánh giá nào.</p>
                )}
            </div>

            <div className="review-form">
                <h3>Viết đánh giá của bạn</h3>
                <form onSubmit={handleReviewSubmit}>
                    <label>Chọn số sao:</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num} ⭐</option>
                        ))}
                    </select>
                    <label>Nhận xét:</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} required/>
                    <button type="submit" disabled={isSubmitting} className="btn btn-success">
                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductDetail;
