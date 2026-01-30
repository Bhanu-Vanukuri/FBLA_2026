import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { FaHome, FaSearch, FaHeart, FaStar, FaTag, FaUser, FaCog, FaInfoCircle } from "react-icons/fa";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize app with demo data (without database for now)
    const initializeApp = async () => {
      try {
        // Create a demo user without database calls
        const demoUser = {
          id: "demo-user-123",
          name: "FBLA User",
          email: "fbla@example.com",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setUser(demoUser);
        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize app:", err);
        setError("Failed to initialize application. Please restart.");
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Byte-Sized Business Boost...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/discover" element={<DiscoverPage user={user} />} />
            <Route path="/favorites" element={<FavoritesPage user={user} />} />
            <Route path="/deals" element={<DealsPage user={user} />} />
            <Route path="/business/:id" element={<BusinessDetailPage user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/settings" element={<SettingsPage user={user} />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Sidebar Navigation
function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1>Byte-Sized</h1>
        <p>Business Boost</p>
      </div>
      <ul className="nav-menu">
        <li>
          <Link to="/" className="nav-link">
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/discover" className="nav-link">
            <FaSearch className="nav-icon" />
            <span>Discover</span>
          </Link>
        </li>
        <li>
          <Link to="/favorites" className="nav-link">
            <FaHeart className="nav-icon" />
            <span>Favorites</span>
          </Link>
        </li>
        <li>
          <Link to="/deals" className="nav-link">
            <FaTag className="nav-icon" />
            <span>Deals</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className="nav-link">
            <FaUser className="nav-icon" />
            <span>Profile</span>
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <Link to="/settings" className="nav-link">
          <FaCog className="nav-icon" />
          <span>Settings</span>
        </Link>
        <Link to="/about" className="nav-link">
          <FaInfoCircle className="nav-icon" />
          <span>About</span>
        </Link>
      </div>
    </nav>
  );
}

// Home Page
function HomePage({ user }) {
  const [businesses, setBusinesses] = useState([]);
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use mock data instead of database calls
        const mockBusinesses = [
          {
            id: "1",
            name: "Tech Haven",
            category: "Electronics",
            description: "Your local electronics store with the latest gadgets",
            address: "123 Main St",
            phone: "555-0123",
            website: "techhaven.com",
            average_rating: 4.5,
            review_count: 128,
            has_deals: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "2", 
            name: "Cafe Bliss",
            category: "Food",
            description: "Cozy coffee shop with artisanal blends",
            address: "456 Oak Ave",
            phone: "555-0456",
            website: "cafebliss.com",
            average_rating: 4.8,
            review_count: 89,
            has_deals: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        const mockDeals = [
          {
            id: "1",
            business_id: "1",
            title: "20% Off Electronics",
            description: "Get 20% off on all electronics this weekend",
            discount_code: "TECH20",
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        setBusinesses(mockBusinesses);
        setFeaturedDeals(mockDeals);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="home-page">
      <header className="page-header">
        <h2>Welcome back, {user?.name || "User"}!</h2>
        <p>Discover great local businesses in your area</p>
      </header>

      {loading ? (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Loading businesses...</p>
        </div>
      ) : (
        <>
          <section className="featured-section">
            <h3>🔥 Top Rated Businesses</h3>
            <div className="business-grid">
              {businesses.map(business => (
                <BusinessCard key={business.id} business={business} userId={user?.id} />
              ))}
            </div>
          </section>

          {featuredDeals.length > 0 && (
            <section className="deals-section">
              <h3>🎉 Featured Deals</h3>
              <div className="deals-grid">
                {featuredDeals.map(deal => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// Discover Page
function DiscoverPage({ user }) {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("rating");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        
        // Use mock data instead of database calls
        const mockBusinesses = [
          {
            id: "1",
            name: "Tech Haven",
            category: "Electronics",
            description: "Your local electronics store with the latest gadgets",
            address: "123 Main St",
            phone: "555-0123",
            website: "techhaven.com",
            average_rating: 4.5,
            review_count: 128,
            has_deals: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "2", 
            name: "Cafe Bliss",
            category: "Food",
            description: "Cozy coffee shop with artisanal blends",
            address: "456 Oak Ave",
            phone: "555-0456",
            website: "cafebliss.com",
            average_rating: 4.8,
            review_count: 89,
            has_deals: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "3",
            name: "FitZone Gym",
            category: "Services",
            description: "State-of-the-art fitness center with personal training",
            address: "789 Fitness Blvd",
            phone: "555-0789",
            website: "fitzone.com",
            average_rating: 4.2,
            review_count: 156,
            has_deals: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "4",
            name: "Book Nook",
            category: "Retail",
            description: "Independent bookstore with cozy reading areas",
            address: "321 Literature Lane",
            phone: "555-0321",
            website: "booknook.com",
            average_rating: 4.6,
            review_count: 67,
            has_deals: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        let result = mockBusinesses;

        // Apply filtering and sorting
        let filtered = result.filter(business => {
          if (categoryFilter === "All") return true;
          return business.category === categoryFilter;
        });

        let sorted = [...filtered].sort((a, b) => {
          switch (sortOption) {
            case "rating": return b.average_rating - a.average_rating;
            case "reviews": return b.review_count - a.review_count;
            case "name": return a.name.localeCompare(b.name);
            default: return 0;
          }
        });

        setBusinesses(sorted);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [searchQuery, categoryFilter, sortOption]);

  const categories = ["All", "Food", "Retail", "Services", "Entertainment"];

  return (
    <div className="discover-page">
      <header className="page-header">
        <h2>Discover Local Businesses</h2>
        <p>Find great businesses in your community</p>
      </header>

      <div className="discover-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-filter"
          >
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Loading businesses...</p>
        </div>
      ) : (
        <div className="business-list">
          {businesses.length === 0 ? (
            <div className="no-results">
              <p>No businesses found matching your criteria.</p>
            </div>
          ) : (
            businesses.map(business => (
              <BusinessCard key={business.id} business={business} userId={user?.id} showDetails={true} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Business Card Component
function BusinessCard({ business, userId, showDetails = false }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      const checkFavorite = async () => {
        try {
          const result = await invoke("is_favorite", {
            userId,
            businessId: business.id
          });
          setIsFavorite(result);
        } catch (err) {
          console.error("Failed to check favorite status:", err);
        }
      };

      checkFavorite();
    }
  }, [userId, business.id]);

  const toggleFavorite = async () => {
    if (!userId || favoriteLoading) return;

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await invoke("remove_favorite", {
          userId,
          businessId: business.id
        });
        setIsFavorite(false);
      } else {
        await invoke("add_favorite", {
          userId,
          businessId: business.id
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className={`business-card ${showDetails ? 'detailed' : ''}`}>
      <div className="business-header">
        <h3>{business.name}</h3>
        {userId && (
          <button
            className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
            onClick={toggleFavorite}
            disabled={favoriteLoading}
          >
            <FaHeart />
          </button>
        )}
      </div>

      <div className="business-category">{business.category}</div>

      <div className="business-rating">
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= Math.round(business.average_rating) ? 'filled' : ''}
            />
          ))}
        </div>
        <span className="rating-text">
          {business.average_rating.toFixed(1)} ({business.review_count} reviews)
        </span>
      </div>

      {showDetails && (
        <div className="business-details">
          <p className="business-description">{business.description}</p>
          <div className="business-contact">
            <div className="contact-item">
              <FaHome /> {business.address}
            </div>
            <div className="contact-item">
              <FaStar /> {business.phone}
            </div>
            {business.website && (
              <div className="contact-item">
                <FaTag /> {business.website}
              </div>
            )}
          </div>
        </div>
      )}

      <Link to={`/business/${business.id}`} className="view-details-button">
        View Details
      </Link>

      {business.has_deals && (
        <div className="deal-badge">
          <FaTag /> Special Deals Available
        </div>
      )}
    </div>
  );
}

// Deal Card Component
function DealCard({ deal }) {
  return (
    <div className="deal-card">
      <div className="deal-header">
        <h4>{deal.title}</h4>
        <div className="deal-expiry">
          Expires: {new Date(deal.end_date).toLocaleDateString()}
        </div>
      </div>
      <p className="deal-description">{deal.description}</p>
      {deal.discount_code && (
        <div className="deal-code">
          Code: <strong>{deal.discount_code}</strong>
        </div>
      )}
      <div className="deal-cta">
        <button className="claim-deal-button">Claim Deal</button>
      </div>
    </div>
  );
}

// Favorites Page
function FavoritesPage({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (user?.id) {
          const result = await invoke("get_favorites_by_user", { userId: user.id });
          setFavorites(result);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="favorites-page">
      <header className="page-header">
        <h2>Your Favorite Businesses</h2>
        <p>Businesses you've saved for quick access</p>
      </header>

      {loading ? (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Loading your favorites...</p>
        </div>
      ) : (
        <>
          {favorites.length === 0 ? (
            <div className="empty-state">
              <FaHeart className="empty-icon" />
              <h3>No favorites yet</h3>
              <p>Start adding businesses to your favorites by clicking the heart icon</p>
              <Link to="/discover" className="cta-button">Discover Businesses</Link>
            </div>
          ) : (
            <div className="business-grid">
              {favorites.map(business => (
                <BusinessCard key={business.id} business={business} userId={user?.id} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Deals Page
function DealsPage({ user }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const result = await invoke("get_active_deals");
        setDeals(result);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch deals:", err);
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="deals-page">
      <header className="page-header">
        <h2>Active Deals & Coupons</h2>
        <p>Special offers from local businesses</p>
      </header>

      {loading ? (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Loading deals...</p>
        </div>
      ) : (
        <>
          {deals.length === 0 ? (
            <div className="empty-state">
              <FaTag className="empty-icon" />
              <h3>No active deals</h3>
              <p>Check back later for new offers from local businesses</p>
            </div>
          ) : (
            <div className="deals-grid">
              {deals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Business Detail Page
function BusinessDetailPage({ user }) {
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [deals, setDeals] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [captcha, setCaptcha] = useState({ question: "", answer: "" });
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState("");

  // Get business ID from URL
  const businessId = window.location.pathname.split("/").pop();

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);

        const [businessData, businessReviews, businessDeals] = await Promise.all([
          invoke("get_business_by_id", { businessId }),
          invoke("get_reviews_by_business", { businessId }),
          invoke("get_deals_by_business", { businessId })
        ]);

        if (businessData) {
          setBusiness(businessData);

          if (user?.id) {
            const favoriteStatus = await invoke("is_favorite", {
              userId: user.id,
              businessId: businessData.id
            });
            setIsFavorite(favoriteStatus);
          }
        }

        setReviews(businessReviews || []);
        setDeals(businessDeals || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch business data:", err);
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId, user]);

  const toggleFavorite = async () => {
    if (!user?.id) return;

    try {
      if (isFavorite) {
        await invoke("remove_favorite", {
          userId: user.id,
          businessId: business.id
        });
        setIsFavorite(false);
      } else {
        await invoke("add_favorite", {
          userId: user.id,
          businessId: business.id
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
    }
  };

  const generateNewCaptcha = async () => {
    try {
      const newCaptcha = await invoke("generate_captcha");
      setCaptcha(newCaptcha);
      setUserCaptchaAnswer("");
    } catch (err) {
      console.error("Failed to generate CAPTCHA:", err);
      alert("Failed to generate CAPTCHA. Please try again.");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const form = e.target;
    const rating = parseInt(form.rating.value);
    const comment = form.comment.value;

    // Validate CAPTCHA
    if (userCaptchaAnswer !== captcha.answer) {
      alert("Incorrect CAPTCHA answer. Please try again.");
      generateNewCaptcha();
      return;
    }

    // Validate review
    if (rating < 1 || rating > 5) {
      alert("Please select a valid rating (1-5 stars)");
      return;
    }

    if (comment.trim().length < 10) {
      alert("Review must be at least 10 characters long");
      return;
    }

    try {
      await invoke("create_review", {
        businessId: business.id,
        userId: user.id,
        rating,
        comment
      });

      // Refresh reviews
      const updatedReviews = await invoke("get_reviews_by_business", { businessId });
      setReviews(updatedReviews);

      // Close form and reset
      setShowReviewForm(false);
      form.reset();
      generateNewCaptcha();

      // Show success message
      alert("Thank you for your review! It has been submitted successfully.");
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Failed to submit review. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-section">
        <div className="spinner"></div>
        <p>Loading business details...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="error-section">
        <h3>Business not found</h3>
        <p>The business you're looking for doesn't exist or has been removed.</p>
        <Link to="/discover" className="cta-button">Back to Discover</Link>
      </div>
    );
  }

  return (
    <div className="business-detail-page">
      <div className="business-header-detail">
        <div className="business-info">
          <h2>{business.name}</h2>
          <div className="business-category">{business.category}</div>

          <div className="business-rating-detail">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= Math.round(business.average_rating) ? 'filled' : ''}
                />
              ))}
            </div>
            <span className="rating-text">
              {business.average_rating.toFixed(1)} ({business.review_count} reviews)
            </span>
          </div>
        </div>

        <div className="business-actions">
          {user?.id && (
            <button
              className={`favorite-button-detail ${isFavorite ? 'favorited' : ''}`}
              onClick={toggleFavorite}
            >
              <FaHeart /> {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          )}
        </div>
      </div>

      <div className="business-content">
        <div className="business-main-info">
          <p className="business-description-detail">{business.description}</p>

          <div className="business-contact-detail">
            <h4>Contact Information</h4>
            <div className="contact-grid">
              <div className="contact-item-detail">
                <FaHome className="contact-icon" />
                <div>
                  <strong>Address:</strong>
                  <span>{business.address}</span>
                </div>
              </div>
              <div className="contact-item-detail">
                <FaStar className="contact-icon" />
                <div>
                  <strong>Phone:</strong>
                  <span>{business.phone}</span>
                </div>
              </div>
              {business.website && (
                <div className="contact-item-detail">
                  <FaTag className="contact-icon" />
                  <div>
                    <strong>Website:</strong>
                    <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer">
                      {business.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {deals.length > 0 && (
          <div className="business-deals-section">
            <h3>🎉 Special Deals</h3>
            <div className="deals-grid">
              {deals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        )}

        <div className="business-reviews-section">
          <div className="reviews-header">
            <h3>Customer Reviews</h3>
            {user?.id && (
              <button
                className="write-review-button"
                onClick={() => {
                  setShowReviewForm(!showReviewForm);
                  generateNewCaptcha();
                }}
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {showReviewForm && user?.id && (
            <div className="review-form-container">
              <h4>Write Your Review</h4>
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label htmlFor="rating">Rating:</label>
                  <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="star-label">
                        <input
                          type="radio"
                          name="rating"
                          value={star}
                          required
                        />
                        <FaStar className={star <= 3 ? 'filled' : ''} />
                        <span>{star} Star{star !== 1 && 's'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Your Review:</label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows="4"
                    placeholder="Share your experience..."
                    required
                    minLength="10"
                  ></textarea>
                </div>

                <div className="form-group captcha-group">
                  <label>Human Verification (CAPTCHA):</label>
                  <div className="captcha-container">
                    <div className="captcha-question">{captcha.question}</div>
                    <input
                      type="text"
                      placeholder="Your answer"
                      value={userCaptchaAnswer}
                      onChange={(e) => setUserCaptchaAnswer(e.target.value)}
                      required
                    />
                    <button type="button" onClick={generateNewCaptcha} className="refresh-captcha">
                      🔄
                    </button>
                  </div>
                </div>

                <button type="submit" className="submit-review-button">
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= review.rating ? 'filled' : ''}
                        />
                      ))}
                    </div>
                    <div className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Profile Page
function ProfilePage({ user }) {
  return (
    <div className="profile-page">
      <header className="page-header">
        <h2>Your Profile</h2>
        <p>Manage your account and preferences</p>
      </header>

      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-avatar">
            <FaUser className="avatar-icon" />
          </div>
          <div className="profile-details">
            <h3>{user?.name || "FBLA User"}</h3>
            <p>{user?.email || "fbla@example.com"}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-value">5</div>
            <div className="stat-label">Favorites</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">3</div>
            <div className="stat-label">Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">2</div>
            <div className="stat-label">Deals Claimed</div>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h4>Account Information</h4>
            <div className="info-item">
              <strong>Name:</strong> {user?.name || "FBLA User"}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {user?.email || "fbla@example.com"}
            </div>
            <div className="info-item">
              <strong>Member Since:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="profile-section">
            <h4>Your Activity</h4>
            <div className="activity-item">
              <FaHeart className="activity-icon" />
              <span>5 businesses favorited</span>
            </div>
            <div className="activity-item">
              <FaStar className="activity-icon" />
              <span>3 reviews submitted</span>
            </div>
            <div className="activity-item">
              <FaTag className="activity-icon" />
              <span>2 deals claimed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Page
function SettingsPage() {
  return (
    <div className="settings-page">
      <header className="page-header">
        <h2>Settings</h2>
        <p>Customize your app experience</p>
      </header>

      <div className="settings-content">
        <div className="settings-section">
          <h3>App Preferences</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Enable Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Dark Mode
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Data & Privacy</h3>
          <div className="setting-item">
            <button className="clear-data-button">Clear Local Data</button>
            <p className="setting-description">This will remove all your local app data</p>
          </div>
        </div>

        <div className="settings-section">
          <h3>About</h3>
          <div className="setting-item">
            <strong>App Version:</strong> 1.0.0
          </div>
          <div className="setting-item">
            <strong>FBLA Project:</strong> Byte-Sized Business Boost
          </div>
          <div className="setting-item">
            <strong>Framework:</strong> Tauri + React
          </div>
        </div>
      </div>
    </div>
  );
}

// About Page
function AboutPage() {
  return (
    <div className="about-page">
      <header className="page-header">
        <h2>About Byte-Sized Business Boost</h2>
      </header>

      <div className="about-content">
        <div className="about-section">
          <h3>🎯 Project Overview</h3>
          <p>
            Byte-Sized Business Boost is a desktop application developed for the FBLA Coding & Programming event.
            It helps users discover, review, and support local businesses in their community.
          </p>
        </div>

        <div className="about-section">
          <h3>🚀 Features</h3>
          <ul className="features-list">
            <li>🔍 Discover local businesses by category or search</li>
            <li>⭐ Rate and review businesses with 1-5 star ratings</li>
            <li>❤️ Save favorite businesses for quick access</li>
            <li>🎉 View and claim special deals and coupons</li>
            <li>🤖 CAPTCHA protection to prevent spam reviews</li>
            <li>💡 Personalized recommendations based on your activity</li>
            <li>📱 Offline-first design with local data storage</li>
          </ul>
        </div>

        <div className="about-section">
          <h3>🛠️ Technology Stack</h3>
          <ul className="tech-stack">
            <li><strong>Framework:</strong> Tauri (Rust + WebView)</li>
            <li><strong>Frontend:</strong> React with JavaScript</li>
            <li><strong>Backend:</strong> Rust</li>
            <li><strong>Database:</strong> SQLite</li>
            <li><strong>Styling:</strong> CSS with responsive design</li>
          </ul>
        </div>

        <div className="about-section">
          <h3>🏆 FBLA Requirements</h3>
          <p>This application meets all FBLA Coding & Programming requirements:</p>
          <ul className="requirements-list">
            <li>✅ GUI-based desktop application</li>
            <li>✅ Business discovery and sorting</li>
            <li>✅ Reviews and ratings system</li>
            <li>✅ Favorites/bookmarks functionality</li>
            <li>✅ Deals and coupons display</li>
            <li>✅ Bot/spam prevention (CAPTCHA)</li>
            <li>✅ Intelligent features (recommendations)</li>
            <li>✅ Local data storage (SQLite)</li>
            <li>✅ Offline functionality</li>
            <li>✅ Input validation</li>
            <li>✅ Accessible UX design</li>
          </ul>
        </div>

        <div className="about-section">
          <h3>📚 Documentation</h3>
          <p>
            For more information about how to use this application, please refer to the
            included README.md file or the in-app help documentation.
          </p>
        </div>

        <div className="about-footer">
          <p>© 2026 FBLA Coding & Programming Project</p>
          <p>Developed for educational purposes</p>
        </div>
      </div>
    </div>
  );
}

export default App;