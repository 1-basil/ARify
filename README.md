# ARify - AR Product Preview E-Commerce Platform

![ARify Logo](https://img.shields.io/badge/ARify-AR%20Preview-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=flat&logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-green)

A modern e-commerce platform with Augmented Reality (AR) product preview capabilities. View products in your space before purchasing using WebXR and ARKit/ARCore technology.

---

## 📸 Demo Screenshots

### Homepage & Product Catalog
<p align="center">
  <img src="./project_demo_screenshots/pc_getstarted.png" alt="getstarted Page" height="30%" width="45%"/>
  <img src="./project_demo_screenshots/pc_explore_page.png" alt="Product explore" height="30%" width="45%"/>
  <img src="./project_demo_screenshots/pc_product_page.png" alt="Product detial Page" height="30%" width="45%"/>
  <img src="./project_demo_screenshots/mobile_product_page.png" alt="mobile page" height="10%" width="45%"/>
</p>

### AR Preview Experience
<p align="center">
  <img src="./project_demo_screenshots/mobile_ar_preview.jpg" alt="AR on Android" height="30%" width="30%"/>
  <img src="./project_demo_screenshots/pc_ar_preview.png" alt="3D Model Viewer" height="30%" width="30%"/>
</p>

### Product Management & Authentication
<p align="center">
  <img src="./project_demo_screenshots/pc_create_product.png" alt="Create Product" width="45%"/>
  <img src="./project_demo_screenshots/pc_login_screen.png" alt="Login Page" width="45%"/>
</p>


## 🌟 Features

### 🛍️ E-Commerce Core
- **Product Catalog** - Browse curated products with high-quality images
- **Product Details** - Comprehensive product information and pricing
- **Shopping Cart** - Add items and manage cart with real-time updates
- **User Authentication** - Secure JWT-based login/logout with session management

### 📱 AR Capabilities
- **3D Model Viewer** - Interactive 360° product viewing with Google Model Viewer
- **WebXR Support** - AR on Android devices via Chrome (ARCore)
- **ARKit Support** - AR on iOS devices via Safari
- **Real-time Scaling** - Auto-scale models to realistic dimensions
- **Device Compatibility Detection** - Automatic AR support checking

### ⚡ Admin Features
- **Product Creation** - Upload products with images and 3D models
- **Multi-format Support** - GLB (Android) and USDZ (iOS) uploads
- **Category Management** - Organize products by type
- **Image Preview** - Real-time image preview before upload

### 🎨 UI/UX
- **Minimalistic Design** - Clean, modern interface with Tailwind CSS
- **Responsive Layout** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - Elegant transitions and hover effects
- **Toast Notifications** - Real-time user feedback with React Toastify

---

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Lightning-fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **React Toastify** - Toast notifications
- **Google Model Viewer** - 3D/AR rendering

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework with middleware
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB Object Data Modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **Nodemailer & Brevo** - Email service
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - HTTP cookie parsing

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) or **yarn**
- **MongoDB** (v6.x or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Premsaldana/ARify.git
cd ARify
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

### 4. Environment Configuration

#### Backend `.env` file
Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/arify

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/arify

# JWT Secret (Change this in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@arify.com

# CORS Configuration
CLIENT_URL=http://localhost:5173

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

#### Frontend `.env` file
Create a `.env` file in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 5. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (macOS/Linux)
brew services start mongodb-community

# Or run mongod directly
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

### 6. Create Upload Directories
```bash
cd backend
mkdir -p uploads/images uploads/models3d
```

---

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
# OR with nodemon for auto-restart
nodemon server.js
```

You should see:
```
MongoDB connected successfully
Server is running on port 5000
```

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd frontend
npm run dev
```

Frontend will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

### Production Build

**Frontend:**
```bash
cd frontend
npm run build      # Creates optimized build
npm run preview    # Preview production build locally
```

**Backend:**
```bash
cd backend
npm start
```

---

## 📁 Project Structure

```
ARify/
├── frontend/
│   ├── public/
│   │   └── models3d/              # 3D model files (GLB/USDZ)
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   │   ├── NavBar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/               # React Context for state management
│   │   │   └── AppContext.jsx
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── ProductExplore.jsx
│   │   │   ├── ARPreview.jsx
│   │   │   ├── CreateProduct.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   └── Login.jsx
│   │   ├── assets/                # Images, icons, and static files
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   ├── index.css              # Global styles
│   │   ├── tailwind.config.js     # Tailwind CSS configuration
│   │   ├── vite.config.js         # Vite configuration
│   │   └── package.json
│   └── .env                        # Environment variables
│
├── backend/
│   ├── config/
│   │   └── mongodb.js             # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js      # Auth logic (signup, login, logout)
│   │   ├── userController.js      # User data operations
│   │   └── productController.js   # Product CRUD operations
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication middleware
│   │   └── upload.js              # Multer file upload middleware
│   ├── models/
│   │   ├── User.js                # User schema and model
│   │   └── Product.js             # Product schema and model
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication endpoints
│   │   ├── userRoutes.js          # User endpoints
│   │   └── productRoutes.js       # Product endpoints
│   ├── uploads/                   # Uploaded files directory
│   │   ├── images/                # Product images
│   │   └── models3d/              # 3D models (GLB/USDZ)
│   ├── server.js                  # Express server setup
│   ├── .env                        # Environment variables
│   ├── .gitignore                 # Git ignore rules
│   └── package.json
│
├── screenshots/                   # Demo screenshots
├── .gitignore                     # Project-level git ignore
├── LICENSE                        # MIT License
└── README.md                      # This file
```

---

## 🎮 Usage Guide

### For Users

#### 1. Browse Products
- Visit the homepage to see featured products
- Click on any product card to view full details
- Use search/filter to find specific products

#### 2. View Products in AR
- Click **"AR Preview"** button on product page
- Grant camera permissions when prompted
- Point your device at a flat surface
- Tap the screen to place the 3D model
- Use pinch-to-zoom and rotate gestures to interact
- Tap product info icon for details

#### 3. Authentication
- Click **"Login"** in navigation
- Choose between **Sign Up** or **Login**
- Sign up with username, email, and password
- Log in with email and password
- View your profile in navigation dropdown

### For Admins

#### Create New Product
1. Log in to your admin account
2. Click **"+ Create Product"** in navigation
3. Fill in product details:
   - Product name
   - Description
   - Category
   - Price
   - Stock quantity
4. Upload **Product Image** (JPG/PNG, max 10MB)
5. Upload **GLB File** (for Android AR, max 10MB)
6. Upload **USDZ File** (for iOS AR, max 10MB)
7. Click **Submit**

#### Manage Products
- View all products on Explore page
- Click edit icon to modify product details
- Click delete icon to remove product

---

## 📱 AR Device Requirements

### Android
- **OS:** Android 7.0+ (basic support) or Android 8.0+ (full AR support)
- **Browser:** Google Chrome (latest version)
- **ARCore:** Install "Google Play Services for AR" from Play Store
- **Processor:** ARM-based processor (most modern Android devices)
- **RAM:** 2GB minimum recommended
- **Supported Devices:** [Check ARCore supported devices](https://developers.google.com/ar/devices)

**Enable AR in Chrome:**
1. Open `chrome://flags` in Chrome
2. Search for "WebXR"
3. Enable all WebXR related flags
4. Restart Chrome

### iOS
- **OS:** iOS 12 or later
- **Browser:** **Safari only** (AR not supported in Chrome on iOS)
- **ARKit:** Built-in (iPhone 6S and newer)
- **Device Compatibility:**
  - iPhone 6S and newer
  - iPad Pro (all models)
  - iPad (5th generation) and newer
  - iPad Air 2 and newer
  - iPad mini 4 and newer

---

## 🔍 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /api/auth/signup         - Register new user
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout
```

### User Routes (`/api/user`)
```
GET    /api/user/userdata       - Get current user data (JWT required)
```

### Product Routes (`/api/products`)
```
GET    /api/products            - Get all products
GET    /api/products/:id        - Get single product by ID
POST   /api/products/create     - Create new product (JWT required)
PUT    /api/products/:id        - Update product (JWT required)
DELETE /api/products/:id        - Delete product (JWT required)
```

**Example API Call:**
```javascript
// Login
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Get products
const products = await axios.get('http://localhost:5000/api/products');

// Create product (requires auth token in headers)
const newProduct = await axios.post(
  'http://localhost:5000/api/products/create',
  {
    name: 'Product Name',
    description: 'Product description',
    price: 99.99,
    category: 'Electronics'
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
```

---

## 🛠️ 3D Model Guidelines

### GLB Files (Android/WebXR)
- **Format:** glTF 2.0 Binary (.glb)
- **File Size:** Max 10MB
- **Texture Resolution:** 1024x1024 to 2048x2048 pixels
- **Polygon Count:** 50k-100k triangles recommended
- **Optimization:** Enable Draco compression for smaller files
- **Tools for Creation:** Blender, SketchUp, Maya, Tinkercad

### USDZ Files (iOS/ARKit)
- **Format:** Universal Scene Description (.usdz)
- **File Size:** Max 10MB
- **Texture Resolution:** 1024x1024 to 2048x2048 pixels
- **Material Type:** PBR (Physically Based Rendering) recommended
- **Polygon Count:** 50k-100k triangles recommended
- **Tools for Creation:** Blender, Maya, Nomad Sculpt, Reality Composer

### Model Conversion Tools
- **[Blender](https://www.blender.org/)** - Free, open-source 3D creation suite
- **[Reality Converter](https://developer.apple.com/augmented-reality/tools/)** - Apple's official converter (Mac only)
- **[Online Converters](https://products.aspose.app/3d/conversion)** - Convert between formats online
- **[Three.js Editor](https://threejs.org/editor/)** - Browser-based 3D editor

### Best Practices
1. Center model at origin (0, 0, 0)
2. Use consistent scale (1 unit = 1 meter)
3. Apply all transforms before exporting
4. Check normals are facing outward
5. Bake textures into materials
6. Remove unnecessary geometry
7. Test model in [Model Viewer](https://modelviewer.dev/) before uploading

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Backend Won't Start
```bash
# Check if MongoDB is running
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port 5000 isn't in use
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000
```

#### CORS Errors in Console
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
1. Verify `CLIENT_URL=http://localhost:5173` in backend `.env`
2. Ensure CORS middleware is placed **before** routes in `server.js`
3. Clear browser cache and restart both servers

#### Frontend Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
npm install

# Check Node version
node --version  # Should be 18.x or higher
```

#### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongod --version

# Check connection string format
# Local: mongodb://localhost:27017/arify
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/arify

# Test connection
npm install -g mongodb-cli
mongodb-cli --uri "your_connection_string"
```

#### File Upload Fails
```bash
# Verify upload directories exist
mkdir -p uploads/images uploads/models3d

# Check file permissions
chmod -R 755 uploads/

# Verify file size is under 10MB
# Check allowed formats in multer middleware
```

### AR Not Working

#### Android AR Issues
1. ✅ Install "Google Play Services for AR" from Play Store
2. ✅ Enable camera permissions in Chrome settings
3. ✅ Use Chrome browser (not Firefox or Edge)
4. ✅ Enable WebXR in `chrome://flags`
5. ✅ Ensure good lighting and textured surfaces
6. ✅ Verify device is ARCore compatible

#### iOS AR Issues
1. ✅ **MUST use Safari** (Chrome doesn't support AR on iOS)
2. ✅ Enable camera permissions in iOS Settings > Safari
3. ✅ Update to iOS 12 or higher
4. ✅ Check device is ARKit compatible (iPhone 6S+)
5. ✅ Ensure good lighting conditions
6. ✅ Look for flat surfaces with visible texture

#### 3D Model Issues
```javascript
// Model appears too large/small?
// Adjust scaling in ARPreview.jsx

const getTargetSizeForCategory = (category) => {
  return {
    'Electronics': 0.15,
    'Furniture': 0.80,
    'Bottle': 0.25,
    'Accessories': 0.10
  }[category] || 0.30;
};
```

---

## 🧪 Testing Checklist

### Authentication Testing
- [ ] User can sign up with valid credentials
- [ ] Sign up validates email format
- [ ] Sign up rejects weak passwords
- [ ] User can log in with correct credentials
- [ ] Login fails with wrong credentials
- [ ] User can log out successfully
- [ ] Protected routes redirect to login when not authenticated
- [ ] JWT token persists across page refreshes

### Product Management Testing
- [ ] Products display on homepage
- [ ] Product details page loads correctly
- [ ] Image uploads work (JPG/PNG)
- [ ] GLB file upload works
- [ ] USDZ file upload works
- [ ] File size validation works (reject > 10MB)
- [ ] Product creation requires authentication
- [ ] Product deletion works

### AR Testing
- [ ] AR preview loads on product page
- [ ] Camera permissions prompt appears
- [ ] 3D model displays correctly
- [ ] Model scaling is appropriate
- [ ] Rotation/zoom gestures work
- [ ] Works on Android with Chrome
- [ ] Works on iOS with Safari
- [ ] AR placement works on flat surfaces

### Responsiveness Testing
- [ ] Layout works on mobile (375px)
- [ ] Layout works on tablet (768px)
- [ ] Layout works on desktop (1024px+)
- [ ] Navigation is accessible on all screen sizes
- [ ] Images scale appropriately
- [ ] Forms are usable on mobile

---

## 📝 Git Workflow

### First Time Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: ARify e-commerce platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ARify.git
git push -u origin main
```

### Regular Commits
```bash
git add .
git commit -m "Add feature description"
git push origin main
```

### Create .gitignore
```
node_modules/
.env
*.log
dist/
build/
.DS_Store
*.swp
*.swo
.vscode/
.idea/
```

---

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  price: Number,
  stock: Number,
  image: String (file path),
  glbModel: String (file path for Android),
  usdzModel: String (file path for iOS),
  createdBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment

### Deploy Backend to Heroku
```bash
# Install Heroku CLI
# Create Procfile in backend directory
echo "web: node server.js" > Procfile

# Deploy
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend to Vercel
```bash
npm install -g vercel
vercel

# Update VITE_BACKEND_URL to production backend URL
```

### Deploy to AWS/DigitalOcean
- Use Docker for containerization
- Set up CI/CD pipeline
- Configure environment variables
- Set up database backups

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style
- Tests pass locally
- Commit messages are descriptive
- No sensitive data in commits

---
## Acknowledgement
This project was developed as a collaborative team effort.

---
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use the code commercially
- ✅ Modify the code
- ✅ Distribute the code
- ✅ Use privately

Just include a copy of the license.

---


### Technologies & Resources Used
- [Google Model Viewer](https://modelviewer.dev/) - 3D/AR rendering
- [Tailwind CSS](https://tailwindcss.com/) - UI styling framework
- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Vite](https://vitejs.dev/) - Build tool


---

## 🔐 Security Notes

### Important Security Tips
1. **Never commit `.env` files** - Add to `.gitignore`
2. **Change JWT_SECRET in production** - Use a strong, random string
3. **Use HTTPS in production** - Not HTTP
4. **Validate all user inputs** - On both frontend and backend
5. **Keep dependencies updated** - Run `npm audit` regularly
6. **Use environment-specific configs** - Development vs Production
7. **Implement rate limiting** - Prevent brute force attacks
8. **Sanitize database queries** - Use parameterized queries

---

## 🎯 Future Roadmap

### Planned Features
- [ ] Payment integration (Stripe, PayPal)
- [ ] Order history and tracking
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard with analytics
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced product search and filters
- [ ] Inventory management
- [ ] Multi-language support

### Performance Improvements
- [ ] Implement image optimization
- [ ] Add caching strategies
- [ ] CDN integration
- [ ] Database indexing optimization
- [ ] API rate limiting

---
