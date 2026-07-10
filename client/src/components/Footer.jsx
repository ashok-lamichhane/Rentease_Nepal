import "../styles/Footer.scss";
import { LocalPhone, Email } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { contact, site } from "../data/branding";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_left">
        <Link to="/">
          <img src="/assets/logo.png" alt={`${site.name} logo`} />
        </Link>
        <p>{site.tagline}</p>
      </div>

      <div className="footer_center">
        <h3>Quick Links</h3>
        <ul>
          <li><Link to="/auth?mode=signup">Become a Property Owner</Link></li>
          <li><Link to="/auth?mode=login">Renter Login</Link></li>
          <li><Link to="/">Browse Stays</Link></li>
        </ul>
      </div>

      <div className="footer_right">
        <h3>Contact</h3>
        <div className="footer_right_info">
          <LocalPhone />
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
        </div>
        <div className="footer_right_info">
          <Email />
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <p className="footer_credit">Open-source Nepal imagery via Unsplash</p>
      </div>
    </footer>
  );
};

export default Footer;
