import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductModal from "../component/ProductModal";
import Pagination from "../component/Pagination";
import * as bootstrap from "bootstrap";
import { useDispatch } from "react-redux";
import { createMessage } from "../slice/messageSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const initialProductState = {
    id: "",
    title: "",
    imageUrl: "",
    unit: "",
    origin_price: 0,
    price: 0,
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
};

const Products = () => {
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [pagination, setPagination] = useState({});
    const productModalRef = useRef(null);
    const [modalType, setModalType] = useState("");
    const [templateData, setTemplateData] = useState(initialProductState);

    //使用useCallback 優化，避免不必要的重新渲染
    
    const getProductData = useCallback(async (page = 1) => {
        try {
            const { data } = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
            setProducts(data.products);
            setPagination(data.pagination);
        } catch (error) {
            dispatch(createMessage(error.response.data));
            // alert("取得產品資料失敗");
        }
    }, [dispatch]);

    //初始化，驗證與Modal實例化
    useEffect(() => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (!token) return navigate("/login");

        axios.defaults.headers.common.Authorization = token;

        const init = async () => {
            try {
                await axios.post(`${API_BASE}/api/user/check`);
                getProductData();
            } catch (error) {
                dispatch(createMessage(error.response.data));
                // console.log(error.response.data.message)
                navigate("/login");
            }
        };
        init();
        productModalRef.current = new bootstrap.Modal("#productModal", {
            keyboard: false,
        });
        document.querySelector("#productModal")
            .addEventListener("hide.bs.modal", () => {
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            });
    }, [navigate, getProductData]);

    //開啟Modal邏輯
    const openModal = (product, type) => {
        setModalType(type);
        setTemplateData(type === "new" ? initialProductState : { ...product });
        productModalRef.current.show();
    };
    const closeModal = () => productModalRef.current.hide();

    //新增與更新合併優化
    const updateProductData = async () => {
        const isEdit = modalType === "edit";
        const url = `${API_BASE}/api/${API_PATH}/admin/product${isEdit ? `/${templateData.id}` : ""}`;
        const method = isEdit ? "put" : "post";
        const payload = {
            data: {
                ...templateData,
                origin_price: Number(templateData.origin_price),
                price: Number(templateData.price),
                is_enabled: templateData.is_enabled ? 1 : 0,
            }
        };
        try {
            await axios[method](url, payload);
            closeModal();
            getProductData(pagination.current_page);
        } catch (error) {
            dispatch(createMessage(error.response.data));
            // alert(`${isEdit ? "更新" : "新增"}失敗: ${error.response?.data?.message}`);
        }
    };
    //處理圖片上傳
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file-to-upload", file);
        try {
            const { data } = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData);
            setTemplateData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        } catch (error) {
            dispatch(createMessage(error.response.data));
            // alert("圖片上傳失敗", error);
        }
    }
    //通用輸入處理
    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setTemplateData(prev => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddImage = () => {
        setTemplateData(prev => ({
            ...prev,
            imagesUrl: [...prev.imagesUrl, ""]
        }));
    };

    const handleRemoveImage = () => {
        setTemplateData(prev => ({
            ...prev,
            imagesUrl: prev.imagesUrl.slice(0, -1)
        }));
    };

    const handleImageChange = (index, value) => {
        setTemplateData(prev => ({
            ...prev,
            imagesUrl: prev.imagesUrl.map((img, i) => i === index ? value : img)
        }));
    };
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={() => openModal(null, "new")}>
                    建立新的產品
                </button>
            </div>

            <table className="table mt-4">
                <thead>
                    <tr>
                        <th width="120">分類</th>
                        <th>產品名稱</th>
                        <th width="120">原價</th>
                        <th width="120">售價</th>
                        <th width="100">狀態</th>
                        <th width="120">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.category}</td>
                            <td>{product.title}</td>
                            <td className="text-end">{product.origin_price}</td>
                            <td className="text-end">{product.price}</td>
                            <td>
                                <span className={product.is_enabled ? "text-success" : "text-muted"}>
                                    {product.is_enabled ? "啟用" : "未啟用"}
                                </span>
                            </td>
                            <td>
                                <div className="btn-group">
                                    <button className="btn btn-outline-primary btn-sm" onClick={() => openModal(product, "edit")}>編輯</button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => openModal(product, "delete")}>刪除</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination pagination={pagination} changePage={getProductData} />

            {/* 將 ref 綁定在實體 DOM 上 */}
            <div ref={productModalRef} className="modal fade" id="productModal" tabIndex="-1">
                <ProductModal
                    modalType={modalType}
                    templateData={templateData}
                    onCloseModal={closeModal}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                    onUpdateProduct={updateProductData}
                    onAddImage={handleAddImage}
                    onRemoveImage={handleRemoveImage}
                    onImageChange={handleImageChange}
                    onDeleteProduct={async () => {
                        await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${templateData.id}`);
                        closeModal();
                        getProductData();
                    }}
                // ...其他 props
                />
            </div>
        </div>
    );
}


export default Products;
