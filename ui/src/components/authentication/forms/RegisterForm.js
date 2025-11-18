import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import LoadingButton from "../../ui/LoadingButton";
import styles from "./RegisterForm.module.css";
import PasswordInput from "./PasswordInput";
import { InputGroup } from "react-bootstrap";

const RegisterForm = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    const user = props.user;
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setUsername(user.username);
    setEmail(user.email);
  }, [props.user]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (password !== passwordRepeat)
      return setErrorMsg("Mật khẩu không khớp");
    else setErrorMsg();
    const newUser = { username, password, firstName, lastName, email };
    props.onSubmit(newUser);
  };

  const errorMsgElement = (errorMsg || props.error) && (
    <p className="text-danger">{errorMsg ? errorMsg : props.error}</p>
  );

  return (
    <Form onSubmit={onSubmit}>
      {errorMsgElement}
      <Form.Group className="mb-3" controlId="firstName">
        <Form.Label>Tên</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập tên..."
          value={firstName}
          onChange={(ev) => setFirstName(ev.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="lastName">
        <Form.Label>Họ</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập họ..."
          value={lastName}
          onChange={(ev) => setLastName(ev.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="eMail">
        <Form.Label>E-Mail</Form.Label>
        <Form.Control
          type="email"
          placeholder="Nhập E-Mail..."
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Tên đăng nhập</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập tên đăng nhập..."
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>
          {props.isUpdate ? "Mật khẩu mới" : "Mật khẩu"}
        </Form.Label>
        <PasswordInput
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required={!props.isUpdate}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="passwordRepeat">
        <Form.Label>Xác nhận mật khẩu</Form.Label>
        <Form.Control
          type="password"
          placeholder="Nhập lại mật khẩu..."
          value={passwordRepeat}
          onChange={(ev) => setPasswordRepeat(ev.target.value)}
          required={!props.isUpdate}
        />
      </Form.Group>
      <LoadingButton
        type="submit"
        isLoading={props.isLoading}
        className={styles.submit}
      >
        {props.isUpdate ? "Lưu thay đổi" : "Đăng ký"}
      </LoadingButton>
    </Form>
  );
};

export default RegisterForm;
