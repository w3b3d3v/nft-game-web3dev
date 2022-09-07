import React from 'react';
import { AiFillInstagram } from "react-icons/ai";
import { FaLinkedin, FaTwitterSquare } from "react-icons/fa";

const Footer = () => {
  return (
    // <footer className="footer-container"></footer>
    <footer className="footer-container">
        <div className="footer-text">
            Desenvolvido por Hatus Albertassi
            <br></br>
            <a href='https://www.linkedin.com/in/hatus-albertassi-23b78186/'>
            <FaLinkedin />
            </a>
        <br></br>
        <br></br>
        </div>
        <div className="footer-text">
            Bágdex e bagmons são de total autoria do @bagilustrador criador da Bágdex.<br></br> O uso é somente para estudo.  
            <br></br>
            <a href='https://twitter.com/bagilustrador'>
            <FaTwitterSquare />
            </a>
            <a href='https://www.instagram.com/bagilustrador/'>
            <AiFillInstagram
             />
            </a>
        </div>
    </footer>
  );
};

export default Footer;
