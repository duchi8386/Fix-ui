import { FaShippingFast, FaCreditCard, FaRedo, FaShoppingCart } from "react-icons/fa";

export default function Policy() {
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-8">Chính Sách Đặt Hàng & Mua Hàng</h1>

            <section className="mb-6 px-6">
                <h2 className="text-2xl font-semibold flex items-center mb-4">
                    <FaShoppingCart className="mr-3 text-blue-600" /> Hướng Dẫn Đặt Hàng
                </h2>
                <p>Khách hàng có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ hàng và thực hiện thanh toán. Đảm bảo thông tin cá nhân và địa chỉ giao hàng chính xác để tránh sai sót.</p>
            </section>

            <section className="mb-6 px-6">
                <h2 className="text-2xl font-semibold flex items-center mb-4">
                    <FaCreditCard className="mr-3 text-green-600" /> Phương Thức Thanh Toán
                </h2>
                <ul className="list-disc pl-8">
                    <li>Thanh toán khi nhận hàng (COD)</li>
                    <li>Thanh toán qua VNPAY</li>
                    <li>Chuyển khoản ngân hàng</li>
                </ul>
            </section>

            <section className="mb-6 px-6">
                <h2 className="text-2xl font-semibold flex items-center mb-4">
                    <FaShippingFast className="mr-3 text-purple-600" /> Chính Sách Giao Hàng
                </h2>
                <p>Thời gian giao hàng từ 2 - 5 ngày làm việc tùy khu vực. Phí vận chuyển sẽ được tính dựa trên địa chỉ giao hàng.</p>
            </section>

            <section className="px-6">
                <h2 className="text-2xl font-semibold flex items-center mb-4">
                    <FaRedo className="mr-3 text-red-600" /> Chính Sách Đổi Trả
                </h2>
                <p>Sản phẩm có thể đổi trả trong vòng 7 ngày kể từ khi nhận hàng nếu có lỗi từ nhà sản xuất. Sản phẩm cần nguyên vẹn, chưa qua sử dụng và có hóa đơn mua hàng đi kèm.</p>
            </section>
        </div>
    );
}
