import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import paymentApi from "../api/paymentApi";

function PaymentSuccess() {

    const [params] = useSearchParams();

    const code =
        params.get("vnp_ResponseCode");

    useEffect(() => {

        if (code === "00") {

            paymentApi.confirm({
                vnp_ResponseCode:
                    params.get("vnp_ResponseCode"),
                vnp_TransactionNo:
                    params.get("vnp_TransactionNo"),
                vnp_TxnRef:
                    params.get("vnp_TxnRef")
            });
        }

    }, []);

    return (
        <div className="container mt-5">

            {
                code === "00"
                ? (
                    <div className="alert alert-success">
                        Thanh toán thành công
                    </div>
                )
                : (
                    <div className="alert alert-danger">
                        Thanh toán thất bại
                    </div>
                )
            }

        </div>
    );
}

export default PaymentSuccess;