import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import toast from "react-hot-toast";
import { getAssetUrl } from "../config/api";
import { site } from "../data/branding";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const isHost = user?.role === "host";

  const getImageUrl = () => {
    if (user.profileImagePath) {
      return getAssetUrl(user.profileImagePath);
    }
    if (user.picture) {
      return user.picture;
    }
    return "/assets/logo.png";
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar_brand">
        <img src="/assets/logo.png" alt={`${site.name} logo`} />
        <span>{site.name}</span>
      </Link>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search city, hotel, homestay..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search.trim()) {
              navigate(`/properties/search/${search.trim()}`);
            }
          }}
        />
        <IconButton disabled={search === ""} onClick={() => navigate(`/properties/search/${search}`)}>
          <Search sx={{ color: variables.pinkred }} />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user && (
          <Link to={isHost ? "/create-listing" : "/"} className="host">
            {isHost ? "List Your Property" : "Find a Stay"}
          </Link>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <img
              src={getImageUrl()}
              alt={user.firstName ? `${user.firstName} ${user.lastName}` : "Account"}
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/auth?mode=login" onClick={() => setDropdownMenu(false)}>
              Log In
            </Link>
            <Link to="/auth?mode=signup" onClick={() => setDropdownMenu(false)}>
              Sign Up
            </Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <p className="navbar_role-badge">
              {isHost ? "Property Owner" : "Renter"}
            </p>
            <Link to={`/${user._id}/trips`} onClick={() => setDropdownMenu(false)}>
              My Trips
            </Link>
            <Link to={`/${user._id}/wishList`} onClick={() => setDropdownMenu(false)}>
              Wish List
            </Link>
            {isHost && (
              <>
                <Link to={`/${user._id}/properties`} onClick={() => setDropdownMenu(false)}>
                  My Properties
                </Link>
                <Link to={`/${user._id}/reservations`} onClick={() => setDropdownMenu(false)}>
                  Reservations
                </Link>
                <Link to="/create-listing" onClick={() => setDropdownMenu(false)}>
                  Add Listing
                </Link>
              </>
            )}
            <Link
              to="/auth"
              onClick={() => {
                dispatch(setLogout());
                setDropdownMenu(false);
                toast.success("Logged out");
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
