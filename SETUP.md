# Backend Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB installed and running locally, or MongoDB Atlas account

## Environment Setup

Create a `.env.local` file in the `ecommerce-server` directory with the following variables:

```env
# MongoDB Connection String
DB_CONNECTION_STRING=mongodb://localhost:27017/sustainable-ecommerce

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Port
PORT=3000

# Environment
NODE_ENV=development
```

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `sustainable-ecommerce`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and replace in `.env.local`

## Installation & Running

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run start:local
```

3. Seed the database (optional):
```bash
# The API will automatically seed data on first run
# Or manually call: POST /products/seed
```

## CORS Configuration

The backend is configured with CORS enabled for all origins in development mode:

### Development (Default)
- **Origin**: All origins allowed (`origin: true`)
- **Credentials**: Enabled
- **Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers**: Content-Type, Authorization, Accept, Origin, X-Requested-With, Cache-Control, Pragma

### Production
- **Origin**: Restricted to specific domains (configurable in `src/config/cors.config.ts`)
- **Credentials**: Enabled
- **Methods**: GET, POST, PUT, DELETE, PATCH

### Testing CORS
Use the included `cors-test.html` file to test CORS functionality:
1. Open `cors-test.html` in any browser
2. Click the test buttons to verify CORS is working
3. Test from different origins (file://, http://, https://)

## API Endpoints

### Public Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check with CORS info
- `GET /products` - Get all products with filtering
- `GET /products/:id` - Get product by ID
- `GET /products/categories` - Get all categories
- `GET /products/seed/status` - Check seed status

### Protected Endpoints (require authentication)
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/seed` - Seed database

### CORS Test Endpoints
- `POST /test-cors` - Test CORS with POST request
- `OPTIONS /test-cors` - Handle preflight request

## Data Structure

The backend now uses MongoDB with Mongoose schemas:

- **Products**: name, description, imageURL, stockQty, tags, categoryId, price, isActive
- **Categories**: name, icon, count, isActive
- **Users**: Authentication system with JWT

## Troubleshooting

### CORS Issues
1. **Check CORS configuration** in `src/config/cors.config.ts`
2. **Verify environment** - NODE_ENV should be 'development' for open CORS
3. **Test with cors-test.html** to isolate CORS issues
4. **Check browser console** for CORS error messages

### General Issues
1. **Connection Error**: Check MongoDB is running and connection string is correct
2. **Port Already in Use**: Change PORT in .env file
3. **JWT Errors**: Ensure JWT_SECRET is set
4. **Database Empty**: Call the seed endpoint to populate with sample data

### Common CORS Errors
- **"No 'Access-Control-Allow-Origin' header"**: CORS not properly configured
- **"Method not allowed"**: Check allowed methods in CORS config
- **"Credentials not supported"**: Ensure credentials: true in CORS config
