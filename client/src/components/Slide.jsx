import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { images, site } from "../data/branding";
import "../styles/Slide.scss";

const Slide = () => {
  const user = useSelector((state) => state.user);
  const isHost = user?.role === "host";

  return (
    <section className="slide" style={{ backgroundImage: `url(${images.hero})` }}>
      <div className="slide_overlay" />
      <div className="slide_content">
        <p className="slide_eyebrow">Homestays • Guest Houses • Hotels • Rooms for Rent</p>
        {user ? (
          <>
            <h1>
              Welcome back{user.firstName ? `, ${user.firstName}` : ""}!
            </h1>
            <p className="slide_text">
              {isHost
                ? "Manage your listings, track reservations, and reach renters across Nepal from your dashboard."
                : "Discover trusted rooms, homestays, and guest houses — your next stay in Nepal is just a search away."}
            </p>
            <div className="slide_actions">
              <Link
                to={isHost ? "/create-listing" : "/#listings"}
                className="slide_btn slide_btn--primary"
              >
                {isHost ? "List Your Property" : "Browse Stays"}
              </Link>
              <Link
                to={`/${user._id}/${isHost ? "properties" : "trips"}`}
                className="slide_btn slide_btn--ghost"
              >
                {isHost ? "My Properties" : "My Trips"}
              </Link>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
};

export default Slide;
