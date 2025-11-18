import { Container, Nav, Navbar } from "react-bootstrap";
import { ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import styles from "./NavBar.module.css";
import NavLink from "../ui/NavLink";
import { BoxArrowInRight, BoxArrowRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

const NavBar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const collapseRef = useRef();
  const [expanded, setExpanded] = useState(false);

  const collapseHandler = () => {
    if(window.innerWidth >= 768) return;
    setExpanded(expanded ? false : "expanded");
  };

  return (
    <Navbar
      collapseOnSelect
      expand="md"
      bg="dark"
      variant="dark"
      sticky="top"
      className={styles.navBar}
      id="navbar"
      expanded={expanded}
    >
      <Container className={styles.container}>
        <Navbar.Brand className={styles.brand}>
          <Link to="/" onClick={() => setExpanded(false)}>
            Showtime
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={collapseHandler}
        />
        <Navbar.Collapse id="responsive-navbar-nav" ref={collapseRef}>
          <Nav className={`me-auto ${styles.navLinks}`}>
            <NavLink to="/" onClick={collapseHandler}>
              Trang chủ
            </NavLink>
            {isLoggedIn && (
              <NavLink to="/dashboard" onClick={collapseHandler}>
                Bảng điều khiển
              </NavLink>
            )}
            {user && user.role === ROLES.USER && (
              <NavLink to="/user/tickets" onClick={collapseHandler}>
                Vé của tôi
              </NavLink>
            )}
            {user &&
              (user.role === ROLES.ADMIN || user.role === ROLES.STAFF) && (
                <NavLink to="/tickets/validation" onClick={collapseHandler}>
                  Quét vé
                </NavLink>
              )}
          </Nav>
          <Nav className={styles.navAccount}>
            {isLoggedIn ? (
              <NavLink
                className={styles.authAction}
                onClick={() => {
                  collapseHandler();
                  logout();
                }}
              >
                <BoxArrowRight /> Đăng xuất
              </NavLink>
            ) : (
              <NavLink
                className={styles.authAction}
                to="/login"
                onClick={collapseHandler}
              >
                <BoxArrowInRight /> Đăng nhập
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
