import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const paymentStatus = searchParams.get("status");
        const order = searchParams.get("orderId");
        const msg = searchParams.get("message");

        setStatus(paymentStatus);
        setOrderId(order);
        setMessage(msg);

        // Tự động điều hướng sau 5 giây
        setTimeout(() => {
            navigate("/orders"); // Quay về trang chủ hoặc trang đặt hàng
        }, 5000);
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md">
                {status === "success" ? (
                    <>
                        <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-green-600 mt-4">Thanh toán thành công!</h2>
                        <p className="text-gray-600 mt-2">Mã đơn hàng: <strong>{orderId}</strong></p>
                    </>
                ) : (
                    <>
                        <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-red-600 mt-4">Thanh toán thất bại!</h2>
                        <p className="text-gray-600 mt-2">Lý do: {message || "Không rõ lý do."}</p>
                    </>
                )}
                <p className="text-gray-500 mt-4">Bạn sẽ được chuyển hướng về trang chủ sau vài giây...</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Quay về trang chủ
                </button>
            </div>
        </div>
    );
};

export default PaymentResult;
