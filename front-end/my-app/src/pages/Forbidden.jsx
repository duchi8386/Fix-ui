import { Link } from "react-router-dom";

const Forbidden = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="text-danger">403 - Forbidden</h1>
            <p>Bạn không có quyền truy cập vào trang này.</p>
            <Link to="/" className="btn btn-primary">Quay lại trang chủ</Link>
        </div>
    );
};

export default Forbidden;
