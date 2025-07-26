import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import logo from "../assets/logo.jpg";

const styles = {
    navbar: {
        position: "fixed",
        width: "100%",
        top: 0,
        left: 0,
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
    },
    logo: {
        width: "50px",
    },
    hamburger: {
        fontSize: "24px",
        cursor: "pointer",
        display: "none",
    },
    navLinks: {
        display: "flex",
        gap: "20px",
        listStyle: "none",
    },
    navLink: {
        textDecoration: "none",
        color: "black",
        fontWeight: "500",
    },
    mobileMenu: {
        display: "none",
        flexDirection: "column",
        gap: "15px",
        marginTop: "10px",
    },
    authButtons: {
        display: "flex",
        gap: "10px",
    },
    loginButton: {
        padding: "10px 20px",
        background: "#005b7c",
        color: "white",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
    },
    registerButton: {
        padding: "9px 18px",
        background: "#008eab",
        color: "white",
        borderRadius: "10px",
        border: "1px solid #007bff",
        cursor: "pointer",
    },
    dropdown: {
        position: "relative",
    },
    dropbtn: {
        cursor: "pointer",
        color: "black",
        fontWeight: "500",
        background: "none",
        border: "none",
    },
    dropdownContent: {
        display: "none",
        position: "absolute",
        backgroundColor: "#f9f9f9",
        minWidth: "160px",
        boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
        zIndex: 1,
        borderRadius: "5px",
        marginTop: "10px",
    },
    dropdownContentShow: {
        display: "block",
    },
    dropdownItem: {
        color: "black",
        padding: "12px 16px",
        textDecoration: "none",
        display: "block",
        textAlign: "left",
    },
};

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>
                <img src={logo} alt="Logo" style={{width: "100%"}}/>
            </div>
            <ul style={styles.navLinks}>
                <li><Link to="/about" style={styles.navLink}>About</Link></li>
                <li><Link to="/blog" style={styles.navLink}>Blog</Link></li>
                <li><Link to="/categories" style={styles.navLink}>Categories</Link></li>
                <li>
                    <div style={styles.dropdown} ref={dropdownRef}>
                        <button style={styles.dropbtn} onClick={toggleDropdown}>
                            Sample Question <i className="fa fa-caret-down"></i>
                        </button>
                        <div
                            style={{
                                ...styles.dropdownContent,
                                ...(dropdownOpen ? styles.dropdownContentShow : {}),
                            }}
                        >
                            <Link to="/sample-question-01" style={styles.dropdownItem}>Senior Software Engineer</Link>
                            <Link to="/sample-question-02" style={styles.dropdownItem}>Intern Software Engineer</Link>
                            <Link to="/sample-question-03" style={styles.dropdownItem}>Backend Developer</Link>
                        </div>
                    </div>
                </li>
                <li><Link to="/contact" style={styles.navLink}>Contact</Link></li>
            </ul>
            <div style={styles.authButtons}>
                <Link to="/login">
                    <button style={styles.loginButton}>Login</button>
                </Link>
                <Link to="/register">
                    <button style={styles.registerButton}>Signup</button>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;

