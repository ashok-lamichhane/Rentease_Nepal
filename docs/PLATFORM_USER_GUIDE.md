# RentEase Nepal — Platform User Guide

RentEase Nepal is a room and property rental platform inspired by Airbnb. Users can browse listings, book stays, manage trips, and host their own properties.

---

## Table of Contents

1. [User Roles](#user-roles)
2. [Getting Started](#getting-started)
3. [Authentication & Access](#authentication--access)
4. [Platform Features](#platform-features)
5. [Pages & Navigation](#pages--navigation)
6. [Host Features](#host-features)
7. [Guest Features](#guest-features)
8. [Property Categories](#property-categories)
9. [Booking Flow](#booking-flow)

---

## User Roles

| Role | Description |
|------|-------------|
| **Guest** | Any registered user who can browse, search, book, and save listings |
| **Host** | A registered user who creates and manages property listings |
| **Visitor** | Unregistered user who can only browse the homepage and view limited content |

> Any logged-in user can become a host by creating a listing. There is no separate host registration.

---

## Getting Started

### Registration (Email & Password)

1. Go to **Sign Up** (`/register`)
2. Fill in:
   - First Name
   - Last Name
   - Email
   - Password & Confirm Password
   - Profile Photo (required)
3. Click **REGISTER**
4. You will be redirected to the login page on success

### Login (Email & Password)

1. Go to **Log In** (`/login`)
2. Enter your email and password
3. Click **LOG IN**
4. On success, you are redirected to the homepage

### Google Sign-In

1. On the Login or Register page, click **Login with Google** or **Signup with Google**
2. Complete Google authentication
3. If the email already exists, you are logged in; otherwise a new account is created

---

## Authentication & Access

### Public Access (No Login Required)

- Homepage (`/`)
- Browse all listings
- Filter by category
- Search properties
- View listing details
- Register / Login pages

### Protected Access (Login Required)

| Feature | Route | Description |
|---------|-------|-------------|
| Create Listing | `/create-listing` | List a new property |
| Trip List | `/:userId/trips` | View your bookings |
| Wish List | `/:userId/wishList` | Saved favorite listings |
| Property List | `/:userId/properties` | Your hosted properties |
| Reservation List | `/:userId/reservations` | Bookings on your properties |
| Book a Property | Listing details page | Submit a booking |

### Session Management

- Login state is stored in **Redux** with **redux-persist** (survives page refresh)
- JWT token is issued by the backend on login
- Log out via the account menu → **Log Out**

---

## Platform Features

### 1. Homepage

- Hero slideshow
- Category filters (Cities, Countryside, Swimming Pools, etc.)
- Grid of available property listings
- Search bar in the navbar

### 2. Search

- Use the search bar in the navbar
- Searches by **category** or **listing title** (case-insensitive)
- Results shown at `/properties/search/:search`

### 3. Category Browsing

- Click a category on the homepage
- View filtered listings at `/properties/category/:category`

### 4. Listing Details

Each listing shows:

- Photo gallery (slider)
- Title, type, and location (city, province, country)
- Guest, bedroom, bed, and bathroom counts
- Host profile (name and photo)
- Description and highlights
- Amenities (WiFi, TV, parking, etc.)
- Date range picker and price calculator
- **BOOKING** button

### 5. Wish List

- Click the heart icon on any listing card (except your own listings)
- Toggle add/remove from wish list
- View all saved listings at `/:userId/wishList`

### 6. Trips (Guest Bookings)

- After booking, view all your trips at `/:userId/trips`
- Shows listing details, dates, and total price

### 7. Reservations (Host Bookings)

- Hosts view incoming bookings at `/:userId/reservations`
- Shows guest info, listing, dates, and total price

### 8. Property List (Host)

- View all properties you have listed at `/:userId/properties`

---

## Pages & Navigation

### Navbar

| Element | Action |
|---------|--------|
| Logo | Go to homepage |
| Search bar | Search listings |
| Become A Host | Go to Create Listing (login required) or Login |
| Account menu | Trip List, Wish List, Property List, Reservations, Log Out |

### Account Menu (Logged In)

- **Trip List** — Your bookings as a guest
- **Wish List** — Saved properties
- **Property List** — Properties you host
- **Reservation List** — Bookings on your properties
- **Become A Host** — Create a new listing
- **Log Out** — End session

---

## Host Features

### Creating a Listing (`/create-listing`)

**Step 1 — Category & Type**
- Choose a category (Cities, Countryside, Castles, etc.)
- Choose property type (Entire place, Room(s), Shared Room)

**Step 2 — Location**
- Street address, apartment/suite, city, province, country

**Step 3 — Capacity**
- Guest count, bedrooms, beds, bathrooms

**Step 4 — Amenities**
- Select from 24+ facilities (WiFi, TV, parking, kitchen, etc.)

**Step 5 — Photos**
- Upload multiple photos
- Drag and drop to reorder
- Remove unwanted photos

**Step 6 — Description**
- Title
- Description
- Highlight title and description
- Price per night (in Rs.)

Submit to publish the listing.

---

## Guest Features

### Booking a Property

1. Open a listing from search, category, or homepage
2. Select check-in and check-out dates using the calendar
3. Review total price (price × number of nights)
4. Click **BOOKING**
5. You are redirected to your Trip List on success

### Managing Wish List

- Heart icon on listing cards toggles wish list
- Access via account menu → **Wish List**

---

## Property Categories

| Category | Description |
|----------|-------------|
| Cities | Modern urban properties |
| Countryside | Rural and scenic locations |
| Swimming Pools | Properties with pools |
| LakeSide | Near lakes |
| Ski-in/out | Skiing destinations |
| Castles | Historic castle properties |
| Camping | Camping sites |
| Intensely Cold | Arctic/cold climate stays |
| Luxury | Premium luxury properties |

---

## Booking Flow

```
Browse → Select Listing → Pick Dates → Calculate Price → Book → View in Trip List
```

**Price calculation:** `Total = Price per night × Number of nights`

**Data stored per booking:**
- Customer ID (guest)
- Host ID (property owner)
- Listing ID
- Start date & end date
- Total price

---

## Technical Notes

- Currency is displayed in **Nepalese Rupees (Rs.)**
- Images are served from the backend API
- Google sign-in users may use their Google profile picture
- Email/password users must upload a profile photo during registration

---

## Support

For deployment and setup instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).
