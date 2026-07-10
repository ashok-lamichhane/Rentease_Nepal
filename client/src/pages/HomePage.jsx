import Navbar from "../components/Navbar";
import Slide from "../components/Slide";
import HowItWorks from "../components/HowItWorks";
import Categories from "../components/Categories";
import Listings from "../components/Listings";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Slide />
      <HowItWorks />
      <Categories />
      <Listings />
      <Footer />
    </>
  );
};

export default HomePage;
