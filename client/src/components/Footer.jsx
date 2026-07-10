import "../styles/Footer.scss";
import { LocalPhone, Email, OpenInNew } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { contact, site } from "../data/branding";

const Footer = () => {
  const user = useSelector((state) => state.user);

  const guestLinks = [
    { label: "Become a Property Owner", to: "/auth?mode=signup" },
    { label: "Renter Login", to: "/auth?mode=login" },
    {
      label: "Contact Product Owner",
      href: contact.productOwnerUrl,
      external: true,
    },
  ];

  const loggedInLinks = [
    { label: "Browse Stays", to: "/#listings" },
    {
      label: "Contact Product Owner",
      href: contact.productOwnerUrl,
      external: true,
    },
  ];

  const quickLinks = user ? loggedInLinks : guestLinks;

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
          {quickLinks.map((link) => (
            <li key={link.label}>
              {link.external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <OpenInNew className="footer_external-icon" />
                </a>
              ) : (
                <Link to={link.to}>{link.label}</Link>
              )}
            </li>
          ))}
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
