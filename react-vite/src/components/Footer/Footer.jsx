import './Footer.css'
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
const Footer = () => {

    return (
        <div className="footer" id='form-footer'>
            <div className='links-display'>
            <div className="group-links">
                <p>Zachary Gold</p>
                <hr />
                <div className='link-icons'>
                    <a href="https://github.com/Zach-gold" target='_blank' rel="noreferrer"><FaGithub /></a>
                    <a href="https://www.linkedin.com/in/zacharyryangold/" target='_blank' rel="noreferrer"><FaLinkedin /></a>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Footer;
