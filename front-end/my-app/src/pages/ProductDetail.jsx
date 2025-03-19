import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { getProductDetail } from "../services/ProductService.js";
import { getReviewsByProductId, createReview } from "../services/ReviewService.js";
import { addToCart } from "../services/CartService.js";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { toast } from "react-hot-toast";
import {
    ShoppingBagIcon,
    StarIcon,
    InformationCircleIcon,
    ChatBubbleLeftIcon
} from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";
const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);

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
            const response = await createReview({ productId: id, rating, comment });

            const newReview = response.data || {};

            const reviewToAdd = {
                _id: newReview._id || Date.now().toString(),
                user: newReview.user || { fullName: "Ẩn danh" },
                createdAt: newReview.createdAt ? new Date(newReview.createdAt) : new Date(),
                rating: newReview.rating || rating,
                comment: newReview.comment || comment
            };

            setReviews((prevReviews) => [reviewToAdd, ...prevReviews]);
            toast.success('Đánh giá của bạn đã được gửi thành công!');
            setComment("");
            setRating(5);
        } catch (err) {
            console.log(err);
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá';
            toast.error(errorMessage);
        }
        setIsSubmitting(false);
    };

    const handleAddToCart = async () => {
        try {
            await addToCart(product._id, quantity);
            toast.success('Sản phẩm đã được thêm vào giỏ hàng!', {
                icon: '🛒',
                duration: 4000
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
        }
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Calculate average rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    // Count reviews by rating
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
        ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
    });

    if (loading) return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="w-full md:w-1/2">
                    <Skeleton height={400} className="rounded-lg" />
                </div>
                <div className="w-full md:w-1/2">
                    <Skeleton height={40} className="mb-4" />
                    <Skeleton height={30} width={150} className="mb-4" />
                    <Skeleton height={20} count={3} className="mb-2" />
                    <Skeleton height={100} className="mb-4" />
                    <Skeleton height={40} width={200} />
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                <p>{error}</p>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            {/* Breadcrumb */}
            <nav className="flex mb-6 text-sm text-gray-500">
                <a href="/" className="hover:text-blue-600">Trang chủ</a>
                <span className="mx-2">/</span>
                <a href="/products" className="hover:text-blue-600">Sản phẩm</a>
                <span className="mx-2">/</span>
                <span className="text-gray-800 font-medium">{product.name}</span>
            </nav>

            {/* Product Content Section */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Product Image - Simplified to show only one image */}
                <div className="w-full md:w-1/2">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div
                            className="relative overflow-hidden"
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                        >
                            <motion.img
                                src={product.imageUrl}
                                alt={product.name}
                                className={`w-full h-[500px] object-contain object-center transition-transform duration-500 ${isZoomed ? 'scale-110' : 'scale-100'
                                    }`}
                            />
                            {isZoomed && (
                                <div className="absolute inset-0 bg-black bg-opacity-5"></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Information */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full md:w-1/2"
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

                    {/* Product rating summary */}
                    <div className="flex items-center mb-4">
                        <div className="flex">
                            {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                    key={rating}
                                    className={`h-5 w-5 ${avgRating > rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="ml-2 text-sm text-gray-600">
                            {avgRating} sao ({reviews.length} đánh giá)
                        </p>
                    </div>

                    <div className="mb-6">
                        <span className="text-3xl font-bold text-blue-600">
                            {product.price?.toLocaleString() || '0'} VND
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                            (Đã bao gồm VAT)
                        </span>
                    </div>

                    <Tab.Group>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1 mb-4">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                                        ${selected
                                                ? 'bg-white text-blue-700 shadow'
                                                : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'
                                            }`}
                                    >
                                        Thông tin chung
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                                        ${selected
                                                ? 'bg-white text-blue-700 shadow'
                                                : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'
                                            }`}
                                    >
                                        Mô tả chi tiết
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="mb-6">
                            <Tab.Panel className="rounded-xl bg-white p-4 border border-gray-200">
                                <dl className="divide-y divide-gray-200">
                                    <div className="py-3 flex justify-between">
                                        <dt className="text-gray-700">Thương hiệu</dt>
                                        <dd className="font-medium text-gray-900">{product.brand?.name}</dd>
                                    </div>
                                    <div className="py-3 flex justify-between">
                                        <dt className="text-gray-700">Nguyên liệu</dt>
                                        <dd className="font-medium text-gray-900">{product.ingredients}</dd>
                                    </div>
                                    <div className="py-3 flex justify-between">
                                        <dt className="text-gray-700">Tình trạng</dt>
                                        <dd className="font-medium text-green-600">Còn hàng</dd>
                                    </div>
                                </dl>
                            </Tab.Panel>

                            <Tab.Panel className="rounded-xl bg-white p-4 border border-gray-200">
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>

                    <div className="flex flex-col space-y-4 mb-8">
                        <div className="flex items-center">
                            <div className="flex items-center border rounded-md mr-4 overflow-hidden">
                                <button
                                    onClick={decrementQuantity}
                                    className="px-4 py-2 text-lg font-medium border-r bg-gray-50 hover:bg-gray-100 focus:outline-none"
                                >
                                    -
                                </button>
                                <span className="px-6 py-2">{quantity}</span>
                                <button
                                    onClick={incrementQuantity}
                                    className="px-4 py-2 text-lg font-medium border-l bg-gray-50 hover:bg-gray-100 focus:outline-none"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 shadow-md flex items-center justify-center"
                            >
                                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                                Thêm vào giỏ hàng
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                    <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full">
                        {reviews.length} đánh giá
                    </span>
                </div>

                {/* Rating summary */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50">
                        <div className="text-5xl font-bold text-gray-800 mb-1">{avgRating}</div>
                        <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <div className="text-xs text-gray-500">Dựa trên {reviews.length} đánh giá</div>
                    </div>

                    <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center mb-2">
                                <div className="flex items-center mr-4 w-16">
                                    <span className="text-sm mr-2">{star}</span>
                                    <StarIcon className="h-4 w-4 text-yellow-400" />
                                </div>
                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${reviews.length ? (ratingCounts[star] / reviews.length) * 100 : 0}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="h-full bg-yellow-400"
                                    ></motion.div>
                                </div>
                                <div className="w-10 text-xs text-gray-500 text-right ml-2">
                                    {ratingCounts[star]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="mb-8">
                    {reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <motion.div
                                    key={review._id}
                                    className="border-b border-gray-200 pb-6 last:border-0"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                                                {(review.user?.fullName || "Ẩn danh").charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-800 block">{review.user?.fullName || "Ẩn danh"}</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-2">{review.comment}</p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <ChatBubbleLeftIcon className="h-12 w-12 text-gray-300 mb-2" />
                            <p className="text-gray-500 italic mb-2">Chưa có đánh giá nào.</p>
                            <p className="text-sm text-gray-400">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                        </div>
                    )}
                </div>

                {/* Review Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-50 p-6 rounded-lg"
                >
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                        Viết đánh giá của bạn
                    </h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Chọn số sao:</label>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        type="button"
                                        key={num}
                                        onClick={() => setRating(num)}
                                        className="mr-1 focus:outline-none"
                                    >
                                        <StarIcon
                                            className={`h-8 w-8 ${rating >= num ? 'text-yellow-400' : 'text-gray-300'
                                                } hover:text-yellow-400`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Nhận xét:</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                                placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
                                required
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className={`${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                                } text-white py-3 px-6 rounded-md font-medium transition duration-200 focus:outline-none shadow-md w-full md:w-auto`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang gửi...
                                </span>
                            ) : "Gửi đánh giá"}
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            {/* Related products section - can be added later */}
        </motion.div>
    );
};

export default ProductDetail;
