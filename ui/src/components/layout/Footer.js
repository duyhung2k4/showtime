import styles from "./Footer.module.css";
import { Github } from "react-bootstrap-icons";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <a
        href="https://github.com/kecioch/showtime"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Github />
      </a>
      <p>phát triển bởi Team 9</p>
    </div>
  );
};

export default Footer;
