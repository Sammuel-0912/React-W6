import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const showSuccess = () => {
    Swal.fire({
        title: "成功加入購物車",
        text: "商品已成功加入購物車",
        icon: "success",
        confirmButtonText: "確定",
        confirmButtonColor: "#3085d6",
    });
}

const showError = () => {
    Swal.fire({
        title: "加入購物車失敗",
        text: "商品無法加入購物車",
        icon: "error",
        confirmButtonText: "確定",
    });
}

const SingleProduct = () => {
    const location = useLocation();
    const product = location.state?.productData.product;
    if (!product) {
        return <div className="container mt-4">沒有可用的產品資料!!</div>
    }
    const addToCart = async (id, qty = 1) => {
        try {
            const data = {
                product_id: id,
                qty,
            }
            const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
            //成功時的提示
            showSuccess();
        } catch (error) {
            // console.error("加入購物車失敗",error);
            showError();
        }
    }
    return (
        <div className="container mt-4">
            <div className="card" style={{ width: "18rem" }}>
                <img
                    src={product.imageUrl}
                    className="card-img-top"
                    alt={product.title}
                />
                <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">
                        {product.description}
                    </p>
                    <p className="card-text">
                        <strong>分類:</strong> {product.category}
                    </p>
                    <p className="card-text">
                        <strong>單位:</strong> {product.unit}
                    </p>
                    <p className="card-text">
                        <strong>原價:</strong> {product.origin_price} 元
                    </p>
                    <p className="card-text">
                        <strong>現價:</strong> {product.price} 元
                    </p>
                    <button className="btn btn-primary" onClick={() => addToCart(product.id)}>立即購買</button>
                </div>
            </div>
        </div>
    );
}

export default SingleProduct; 