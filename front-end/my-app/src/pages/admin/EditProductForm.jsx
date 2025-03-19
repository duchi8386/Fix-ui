import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {getProductDetail, updateProduct} from "../../services/ProductService";
import {getSkinTypeList} from "../../services/SkinTypeService";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getBrands} from "../../services/BrandService.js";

export const EditProductForm = ({isViewOnly}) => {
    const {productId} = useParams();
    const navigate = useNavigate();
    const [skinTypes, setSkinTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        ingredients: "",
        skinType: "",
        stock: "",
        brand: "",
        image: null,
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productRes = await getProductDetail(productId);
                setProduct(productRes.data);
                const skinTypesRes = await getSkinTypeList();
                setSkinTypes(skinTypesRes.data);
                const brandRes = await getBrands();
                setBrands(brandRes.data);
            } catch (error) {
                setError("Failed to fetch product data.", error);
            }
        };
        fetchData();
    }, [productId]);

    const handleChange = (e) => {
        if (isViewOnly) return;
        const {name, value} = e.target;
        setProduct({...product, [name]: value});
    };

    const handleFileChange = (e) => {
        if (isViewOnly) return;
        setProduct({...product, image: e.target.files[0]});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewOnly) return;

        const formData = new FormData();
        Object.keys(product).forEach((key) => {
            if (key === "ingredients" && Array.isArray(product[key])) {
                // Nếu ingredients là array, duyệt từng phần tử và append vào FormData
                product[key].forEach((ingredient) => {
                    formData.append(`${key}[]`, ingredient);
                });
            } else if (key==="brand" && typeof product[key] === "object") {
                    formData.append(key, product[key]._id);
            } else {
                formData.append(key, product[key]);
            }
        });

        try {
            await updateProduct(productId, formData);
            toast.success("Product updated successfully.");
            navigate("/admin/products");
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{isViewOnly ? "Product Details" : "Edit Product"}</h1>
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="form-control"
                        disabled={isViewOnly}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        className="form-control"
                        disabled={isViewOnly}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="toner">Toner</option>
                        <option value="cleanser">Cleanser</option>
                        <option value="moisturizer">Moisturizer</option>
                        <option value="sunscreen">Sunscreen</option>
                        <option value="serum">Serum</option>
                    </select>
                </div>
                <div className="col-12">
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="form-control"
                        disabled={isViewOnly}
                        required
                    ></textarea>
                </div>
                <div className="col-md-6">
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className="form-control"
                        disabled={isViewOnly}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        placeholder="Stock"
                        className="form-control"
                        disabled={isViewOnly}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <select
                        name="brand"
                        value={product.brand._id}
                        onChange={handleChange}
                        className="form-control"
                        disabled={isViewOnly}
                        required
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand._id} value={brand._id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <select
                        name="skinType"
                        value={product.skinType}
                        onChange={handleChange}
                        className="form-control"
                        disabled={isViewOnly}
                        required
                    >
                        <option value="">Select Skin Type</option>
                        {skinTypes.map((skin) => (
                            <option key={skin._id} value={skin._id}>
                                {skin.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        name="ingredients"
                        value={product.ingredients}
                        onChange={handleChange}
                        placeholder="Ingredients (comma separated)"
                        className="form-control"
                        disabled={isViewOnly}
                    />
                </div>
                <div className="col-12">
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="form-control"
                        disabled={isViewOnly}
                    />
                </div>
                {!isViewOnly && (
                    <div className="col-12 text-center">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!product.name || !product.price || !product.category || !product.stock}
                        >
                            Update Product
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};
