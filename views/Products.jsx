import axios from "axios"
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Product = () => {
    const [products, setProducts] = useState([]);
    const Navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const handleViewMore = async (id) => {
        if(isLoading) return;
        try {
            setIsLoading(true);
            const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
            //檢查回傳資料是否成功
            if(res.data.success) {
                Navigate(`/product/${id}`,{state: {productData: res.data}});
            } else {
                //處理後端回傳的錯誤(例如產品不存在)
                alert("找不到該產品");
            }
        } catch (error) {
            console.log("取得產品失敗",error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
                // console.log(res.data.products);
                setProducts(res.data.products);
            } catch (error) {
                console.log("取得產品失敗",error.response.data);
            }
        }
        getProduct();
    },[]);
    return (
        <div className="container mt-4">
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4 mb-3" key={product.id}>
                        <div className="card">
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
                                    <strong>價格:</strong> {product.price} 元
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">單位: {product.unit}</small>
                                </p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleViewMore(product.id)}
                                >
                                    查看更多
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default Product;
