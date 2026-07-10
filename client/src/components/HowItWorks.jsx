import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { images, site } from "../data/branding";
import "../styles/HowItWorks.scss";

const steps = [
  {
    title: "For Renters",
    image: images.homestay,
    points: [
      "Search rooms, homestays, hotels and guest houses",
      "Compare prices, amenities and locations across Nepal",
      "Book securely and manage trips from your dashboard",
    ],
    cta: "Find a stay",
    link: "/auth?mode=login",
  },
  {
    title: "For Home & Property Owners",
    image: images.hotel,
    points: [
      "List spare rooms, flats or entire properties",
      "Reach students, travellers and long-term renters",
      "Manage bookings and reservations in one place",
    ],
    cta: "List your property",
    link: "/auth?mode=signup",
  },
];

const HowItWorks = () => {
  const user = useSelector((state) => state.user);

  if (user) {
    return null;
  }

  return (
    <section className="how-it-works">
      <div className="how-it-works_header">
        <h2>Built for Nepal's rental market</h2>
        <p>{site.description}</p>
      </div>
      <div className="how-it-works_grid">
        {steps.map((step) => (
          <article key={step.title} className="how-it-works_card">
            <img src={step.image} alt={step.title} />
            <div className="how-it-works_card-body">
              <h3>{step.title}</h3>
              <ul>
                {step.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link to={step.link}>{step.cta}</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
