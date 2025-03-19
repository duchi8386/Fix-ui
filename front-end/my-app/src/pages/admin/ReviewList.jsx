import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewList() {
    const [reviews, setReviews] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadReviews();
    }, [search, page]);

    const loadReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/reviews/all-reviews?search=${search}&page=${page}&limit=5`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setReviews(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Lỗi khi tải đánh giá", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Danh Sách Đánh Giá</h1>

            {/* Ô tìm kiếm */}
            <input
                type="text"
                placeholder="Tìm kiếm theo tên người dùng hoặc sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-full mb-4"
            />

            {/* Danh sách đánh giá */}
            <table className="w-full border">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">Người Đánh Giá</th>
                    <th className="border p-2">Sản Phẩm</th>
                    <th className="border p-2">Số Sao</th>
                    <th className="border p-2">Nhận Xét</th>
                    <th className="border p-2">Ngày</th>
                </tr>
                </thead>
                <tbody>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <tr key={review._id} className="border">
                            <td className="border p-2">{review.user?.fullName || "N/A"}</td>
                            <td className="border p-2">{review.product?.name || "N/A"}</td>
                            <td className="border p-2">{review.rating} ⭐</td>
                            <td className="border p-2">{review.comment || "Không có nhận xét"}</td>
                            <td className="border p-2">{new Date(review.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center p-4">Không tìm thấy đánh giá</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="p-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    &larr; Trước
                </button>
                <span className="p-2">{page} / {totalPages}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Sau &rarr;
                </button>
            </div>
        </div>
    );
}
