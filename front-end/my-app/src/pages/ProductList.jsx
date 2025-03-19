import React, { useEffect, useState } from "react";
import { getProductListForUser } from "../services/productService";
import { Link } from "react-router-dom";
import "../style/productList.css";
import { motion } from "framer-motion";
import { FiFilter, FiSearch, FiShoppingCart, FiCheck, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar, FaSort } from "react-icons/fa";
import { Disclosure, Transition } from "@headlessui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [skinType, setSkinType] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState(""); // new state for sorting
    const [searchTerm, setSearchTerm] = useState(""); // new state for search

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category, skinType, page, sortBy]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const res = await getProductListForUser({ category, skinType, page, sortBy });
            console.log(res);
            setProducts(res.data || []);
            setTotalPages(res.pagination?.totalPages || 1);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Không thể tải danh sách sản phẩm");
            setIsLoading(false);
        }
    };

    // Filter products by search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    // Product Skeleton Loader
    const ProductSkeleton = () => (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
            <div className="relative pb-[70%] overflow-hidden">
                <Skeleton height="100%" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
            </div>
            <div className="p-4">
                <Skeleton height={24} width="80%" className="mb-2" />
                <Skeleton height={28} width="50%" className="mb-1" />
                <Skeleton height={20} width="40%" />
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center mb-6 text-gray-800"
            >
                Danh Sách Sản Phẩm
            </motion.h1>

            {/* Search bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" size={18} />
                    </div>
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-blue-600"
                    >
                        Tìm
                    </button>
                </form>
            </motion.div>

            {/* Filters */}
            <Disclosure as="div" className="mb-8">
                {({ open }) => (
                    <>
                        <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 bg-white rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <span className="flex items-center text-gray-700 font-medium">
                                <FiFilter className="mr-2" /> Bộ lọc sản phẩm
                            </span>
                            <FiChevronRight
                                className={`${open ? 'transform rotate-90' : ''} h-5 w-5 text-gray-500 transition-transform`}
                            />
                        </Disclosure.Button>

                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel className="px-4 pt-4 pb-2 mt-2 bg-white rounded-lg shadow-md">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option value="">Tất cả danh mục</option>
                                            <option value="cleanser">Cleanser</option>
                                            <option value="toner">Toner</option>
                                            <option value="sunscreen">Sunscreen</option>
                                            <option value="serum">Serum</option>
                                            <option value="moisturizer">Moisturizer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại da</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            value={skinType}
                                            onChange={(e) => setSkinType(e.target.value)}
                                        >
                                            <option value="">Tất cả loại da</option>
                                            <option value="oily">Da dầu</option>
                                            <option value="dry">Da khô</option>
                                            <option value="combination">Da hỗn hợp</option>
                                            <option value="sensitive">Da nhạy cảm</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="">Mặc định</option>
                                            <option value="price_asc">Giá: Thấp đến cao</option>
                                            <option value="price_desc">Giá: Cao đến thấp</option>
                                            <option value="newest">Mới nhất</option>
                                            <option value="popular">Phổ biến nhất</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => {
                                            setCategory("");
                                            setSkinType("");
                                            setSortBy("");
                                        }}
                                        className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Đặt lại
                                    </button>
                                    <button
                                        onClick={() => fetchProducts()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>

            {/* Results summary */}
            {!isLoading && (
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                        Hiển thị <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
                        {category && <> trong danh mục <span className="font-semibold capitalize">{category}</span></>}
                        {skinType && <> cho <span className="font-semibold capitalize">{
                            skinType === "oily" ? "da dầu" :
                                skinType === "dry" ? "da khô" :
                                    skinType === "combination" ? "da hỗn hợp" :
                                        skinType === "sensitive" ? "da nhạy cảm" : skinType
                        }</span></>}
                    </p>
                </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="h-full">
                            <ProductSkeleton />
                        </div>
                    ))}
                </div>
            )}

            {/* Products grid */}
            {!isLoading && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
                >
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="h-full"
                            >
                                <Link to={`/products/${product.id}`} className="block h-full">
                                    <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full transition-shadow hover:shadow-xl">
                                        <div className="relative pb-[70%] overflow-hidden group">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {product.discount > 0 && (
                                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                                                    -{product.discount}%
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center mb-1">
                                                <div className="flex text-yellow-400">
                                                    <FaStar size={12} />
                                                    <FaStar size={12} />
                                                    <FaStar size={12} />
                                                    <FaStar size={12} />
                                                    <FaStar size={12} className="text-gray-300" />
                                                </div>
                                                <span className="text-xs text-gray-500 ml-1">(12)</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                                            <p className="text-lg font-bold text-red-600 mb-1">{product.price.toLocaleString()} VND</p>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-gray-600">
                                                    {product.stock > 0 ? (
                                                        <span className="inline-flex items-center">
                                                            <FiCheck className="text-green-500 mr-1" />
                                                            Còn hàng ({product.stock})
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center">
                                                            <FiX className="text-red-500 mr-1" />
                                                            Hết hàng
                                                        </span>
                                                    )}
                                                </p>
                                                {/* <FiShoppingCart className="text-blue-500 hover:text-blue-600" /> */}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                            <div className="flex flex-col items-center justify-center">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-500 text-lg mt-4">Không có sản phẩm nào phù hợp</p>
                                <button
                                    onClick={() => {
                                        setCategory("");
                                        setSkinType("");
                                        setSortBy("");
                                        setSearchTerm("");
                                        fetchProducts();
                                    }}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center items-center gap-4 mt-8"
                >
                    <button
                        className={`px-4 py-2 rounded-md ${page === 1
                            ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'} 
                            transition-colors duration-200 flex items-center`}
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        <FiChevronLeft className="mr-1" />
                        Trang trước
                    </button>

                    <div className="flex items-center">
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            const pageNum = i + 1;
                            const isCurrentPage = pageNum === page;

                            return (
                                <button
                                    key={i}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-10 h-10 mx-1 flex items-center justify-center rounded-md ${isCurrentPage
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {totalPages > 5 && (
                            <>
                                <span className="mx-1">...</span>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    className={`w-10 h-10 mx-1 flex items-center justify-center rounded-md ${page === totalPages
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        className={`px-4 py-2 rounded-md ${page === totalPages
                            ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'} 
                            transition-colors duration-200 flex items-center`}
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Trang sau
                        <FiChevronRight className="ml-1" />
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default ProductList;