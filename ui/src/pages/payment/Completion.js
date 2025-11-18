import { Navigate, useNavigate, useSearchParams, Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Content from "../../components/ui/Content";
import { useEffect } from "react";
import styles from "./Completion.module.css";

const Completion = (props) => {
  const [params] = useSearchParams();
  const redirect_status = params.get("redirect_status");
  const payment_intent = params.get("payment_intent");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("cart");
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!redirect_status || !payment_intent) return <Navigate to="/" />;

  const success = (
    <>
      {" "}
      <h1>Thanh toán thành công!</h1>
      <h2 className="mt-2">Hẹn gặp bạn tại rạp chiếu phim 🎬</h2>
      <h3 className="mt-5">Vé đã được gửi đến email của bạn</h3>
      <h6 className="mt-5">Chuyển hướng sau 10 giây...</h6>
      <p>
        Nếu không được chuyển hướng,{" "}
        <Link to="/" className={styles.link}>
          nhấp vào đây
        </Link>
      </p>
    </>
  );

  const failure = (
    <>
      <h1>Đã xảy ra lỗi trong quá trình thanh toán</h1>
      <h2>ID: {payment_intent}</h2>
      <h6 className="mt-5">Chuyển hướng sau 10 giây...</h6>
      <p>
        Nếu không được chuyển hướng,{" "}
        <Link to="/" className={styles.link}>
          nhấp vào đây
        </Link>
      </p>
    </>
  );

  const content = redirect_status === "succeeded" ? success : failure;

  return (
    <Container style={{minHeight: "75vh"}}>
      <Content>{content}</Content>
    </Container>
  );
};

export default Completion;
