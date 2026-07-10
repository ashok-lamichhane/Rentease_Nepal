import { Link } from "react-router-dom";
import { images, site } from "../data/branding";
import "../styles/Slide.scss";

const Slide = () => {
  return (
    <section className="slide" style={{ backgroundImage: `url(${images.hero})` }}>
      <div className="slide_overlay" />
      <div className="slide_content">
        <p className="slide_eyebrow">Homestays • Guest Houses • Hotels • Rooms for Rent</p>
        <h1>{site.tagline}</h1>
        <p className="slide_text">
          Whether you are a homeowner with spare rooms, a guest house operator, or a hotel owner —
          connect with renters and learners looking for trusted stays across Nepal.
        </p>
        <div className="slide_actions">
          <Link to="/auth?mode=signup" className="slide_btn slide_btn--primary">
            Sign Up Free
          </Link>
          <Link to="/auth?mode=login" className="slide_btn slide_btn--ghost">
            Log In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Slide;
