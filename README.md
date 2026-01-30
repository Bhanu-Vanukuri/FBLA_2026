# Byte-Sized Business Boost

**FBLA Coding & Programming 2025–2026 Project**
*High School Division - Presentation Event*

![Byte-Sized Business Boost Logo](public/tauri.svg)

## 🎯 Project Overview

Byte-Sized Business Boost is a production-quality GUI desktop application developed for the FBLA Coding & Programming event. This Tauri-based standalone application helps users discover, review, rate, and support local businesses in their community while demonstrating advanced programming knowledge, strong UX design, and modular architecture.

## 🚀 Features

### ✅ Core Functional Requirements (FBLA-MAPPED)

1. **🔍 Business Discovery & Sorting**
   - View comprehensive business listings with name, category, average rating, review count, and active deals
   - Sort businesses by category, rating, or number of reviews
   - Search by business name or keyword with real-time filtering
   - Category-based browsing (Food, Retail, Services, Entertainment)

2. **⭐ Reviews & Ratings System**
   - Submit 1–5 star ratings with written reviews
   - Comprehensive input validation (length, type, rating range)
   - Persistent storage across sessions using SQLite
   - Real-time average rating calculation and display

3. **❤️ Favorites / Bookmarks**
   - One-click bookmarking of businesses
   - Persistent storage of favorites
   - Dedicated Favorites view with quick access
   - Visual indicators for favorited businesses

4. **🎉 Deals & Coupons**
   - Display discounts, promo codes, and limited-time offers
   - Visual emphasis with badges and special styling
   - Expiration date tracking
   - Dedicated Deals page for browsing all active offers

5. **🤖 Bot / Spam Prevention (REQUIRED)**
   - Simple math CAPTCHA verification before submitting reviews
   - Rust backend enforcement for security
   - Automatic CAPTCHA regeneration
   - Input validation and error handling

### 💡 Intelligent Features (REQUIRED FOR MAX SCORE)

**🎯 Personalized Recommendations**
- "Top Rated Businesses" section on homepage
- Category-based suggestions
- Smart filtering options ("Top-rated food businesses")
- Activity-based recommendations in user profile

**📊 Data Analytics**
- Average ratings and review counts
- Customizable sorting and filtering
- Business performance metrics
- User activity tracking

## 🛠️ Technology Stack (LOCKED)

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Tauri 2.x | Cross-platform desktop app framework |
| **Frontend** | React 19.x | Modern UI components and state management |
| **Backend** | Rust 1.92 | High-performance business logic |
| **Database** | SQLite | Local data storage with ACID compliance |
| **Styling** | CSS3 | Responsive, accessible design |
| **Icons** | React Icons | Visual enhancements |
| **Routing** | React Router v6 | Navigation system |

## 📁 Project Architecture

```
fbla-byte-sized-business-boost/
├── src/                  # React Frontend
│   ├── App.jsx           # Main application component
│   ├── App.css           # Global styles
│   └── main.jsx          # React entry point
├── src-tauri/            # Rust Backend
│   ├── src/              # Rust source code
│   │   ├── main.rs       # Entry point
│   │   ├── lib.rs        # Tauri setup and commands
│   │   ├── models.rs     # Data models and structures
│   │   ├── database.rs   # SQLite operations
│   │   └── commands.rs   # Tauri command handlers
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # Tauri configuration
├── package.json          # JavaScript dependencies
└── README.md             # Project documentation
```

### 🔄 Frontend ↔ Backend Communication

The application uses Tauri's powerful IPC (Inter-Process Communication) system:

1. **Frontend** makes requests via `invoke()` calls
2. **Tauri** routes commands to Rust backend
3. **Backend** processes requests, interacts with SQLite
4. **Responses** are serialized and returned to frontend
5. **React** updates UI with received data

## 🎨 User Experience (UX) Requirements

### ✅ Navigation System
- **Sidebar Navigation**: Persistent left sidebar with icons and labels
- **Breadcrumb Navigation**: Contextual page headers
- **Deep Linking**: Direct access to business details via URLs

### ✅ Accessibility Considerations
- **Semantic HTML**: Proper use of headings, labels, and ARIA attributes
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **High-Contrast Colors**: WCAG-compliant color schemes
- **Responsive Design**: Mobile-friendly layouts with media queries
- **Readable Fonts**: Clear typography with appropriate sizing

### ✅ Design Rationale
- **Color Scheme**: Professional blue tones with accent colors for CTAs
- **Card-Based Layout**: Consistent information hierarchy
- **Visual Feedback**: Hover effects, loading states, and transitions
- **Error Handling**: Graceful error messages and recovery options

## 💻 Running the Application Locally

### Prerequisites
- Node.js 18+
- npm 9+
- Rust 1.92+
- SQLite

### Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/fbla-byte-sized-business-boost.git
cd fbla-byte-sized-business-boost

# Install dependencies
npm install

# Install Rust dependencies
cd src-tauri
cargo build
cd ..
```

### Development Mode
```bash
# Start the development server
npm run tauri dev
```

### Production Build
```bash
# Build for your platform
npm run tauri build
```

## 📦 Build Outputs

### Windows
- **Output**: `src-tauri/target/release/bundle/msi/fbla-byte-sized-business-boost_1.0.0_x64_en-US.msi`
- **Format**: Windows Installer (.msi)
- **Architecture**: x86_64

### macOS
- **Output**: `src-tauri/target/release/bundle/dmg/fbla-byte-sized-business-boost_1.0.0_x64.dmg`
- **Format**: Disk Image (.dmg)
- **Architecture**: Universal (Apple Silicon + Intel)

## 📋 FBLA Requirements Compliance

| Requirement | Implementation | Status |
|------------|----------------|--------|
| GUI-based desktop app | Tauri + React application | ✅ |
| Business discovery & sorting | Discover page with filters | ✅ |
| Reviews & ratings system | Star ratings with written reviews | ✅ |
| Favorites/bookmarks | Heart icon favorites system | ✅ |
| Deals & coupons display | Visual deal badges and deals page | ✅ |
| Bot/spam prevention | Math CAPTCHA verification | ✅ |
| Intelligent features | Personalized recommendations | ✅ |
| Local data storage | SQLite database | ✅ |
| Offline functionality | No internet required | ✅ |
| Input validation | Form validation and error handling | ✅ |
| Accessible UX design | WCAG-compliant interface | ✅ |

## 📊 Data Structures

### Business Model
```rust
struct Business {
    id: String,
    name: String,
    category: String,
    description: String,
    address: String,
    phone: String,
    website: Option<String>,
    average_rating: f32,
    review_count: usize,
    has_deals: bool,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}
```

### Review Model
```rust
struct Review {
    id: String,
    business_id: String,
    user_id: String,
    rating: u8,          // 1-5 stars
    comment: String,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}
```

### Deal Model
```rust
struct Deal {
    id: String,
    business_id: String,
    title: String,
    description: String,
    discount_code: Option<String>,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
    is_active: bool,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}
```

## 🔒 Error Handling & Data Validation

### Frontend Validation
- Minimum review length (10 characters)
- Valid rating range (1-5 stars)
- CAPTCHA verification
- Form field requirements

### Backend Validation
- Database constraint enforcement
- Foreign key integrity
- Data type validation
- Graceful error responses

### Data Corruption Handling
- SQLite transaction safety
- Error recovery mechanisms
- User-friendly error messages

## 🎓 Presentation Alignment

### ✅ Demonstration Readiness
- **7-Minute Demo**: Optimized workflow for quick presentation
- **Live Navigation**: Intuitive interface for judges
- **Offline Operation**: No internet dependency
- **Clear Features**: Easy to showcase all FBLA requirements

### ✅ Q&A Preparation
- **Architecture Diagrams**: Visual aids for explaining design
- **Code Samples**: Key implementations ready to discuss
- **Performance Metrics**: SQLite efficiency and Rust speed
- **Security Measures**: CAPTCHA and input validation

## 🏆 Judging Criteria Alignment

### Advanced Programming Knowledge
- **Rust Backend**: Memory safety, performance, and concurrency
- **React Frontend**: Component-based architecture and hooks
- **SQLite Integration**: Efficient data storage and retrieval
- **Error Handling**: Robust exception management

### Strong UX Design
- **Intuitive Interface**: Clear navigation and visual hierarchy
- **Accessibility**: WCAG compliance and keyboard support
- **Responsive Design**: Mobile-friendly layouts
- **Visual Feedback**: Loading states and transitions

### Modular Architecture
- **Separation of Concerns**: Frontend/Backend separation
- **Reusable Components**: React component library
- **Clean Code**: Meaningful naming and comments
- **Scalable Design**: Easy to extend functionality

## 📚 Libraries & Resources

### Open Source Dependencies
- **Tauri**: MIT License
- **React**: MIT License
- **React Router**: MIT License
- **React Icons**: MIT License
- **UUID**: MIT License
- **Chrono**: MIT/Apache 2.0
- **Serde**: MIT/Apache 2.0

### Development Tools
- **Vite**: Fast frontend tooling
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **SQLite**: Embedded database

## 🎯 Future Enhancements

### Potential Improvements
- **User Authentication**: Secure login system
- **Business Owner Portal**: Manage business listings
- **Advanced Analytics**: Detailed business insights
- **Social Sharing**: Share reviews and deals
- **Multi-language Support**: Internationalization

### Performance Optimizations
- **Caching**: Reduce database queries
- **Lazy Loading**: Improve initial load time
- **Image Optimization**: Compress business images
- **Database Indexing**: Faster search operations

## 📋 Final Enforcement Rules Compliance

✅ **GUI-based desktop app only** - No CLI interaction
✅ **All data stored locally** - SQLite database
✅ **No runtime errors** - Comprehensive error handling
✅ **Successful Tauri builds** - Tested on Windows & macOS
✅ **Offline functionality** - No external dependencies
✅ **Malware-free** - Clean codebase

## 🏁 Conclusion

Byte-Sized Business Boost successfully implements all FBLA Coding & Programming requirements with a production-quality desktop application. The project demonstrates:

- **Advanced technical skills** in Rust and React development
- **Strong UX/UI design** with accessibility considerations
- **Modular architecture** for maintainability
- **Comprehensive documentation** for judges and users
- **Presentation-ready** demo with clear value proposition

This application is ready for FBLA competition and showcases the developer's ability to create sophisticated, user-friendly software solutions that meet real-world business needs.