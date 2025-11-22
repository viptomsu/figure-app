# 🚀 Backend Setup Guide

First-time setup guide for the Figure Backend API. This guide walks you through getting the development server running from scratch.

## 📋 Prerequisites

### Required Software

1. **Node.js 20.18.2** (exact version required)
   ```bash
   # Check current version
   node -v

   # Install with nvm (recommended)
   nvm install 20.18.2
   nvm use 20.18.2
   ```

2. **PostgreSQL 18** (or compatible version)
   ```bash
   # Check PostgreSQL version
   psql --version

   # Install on macOS
   brew install postgresql@18

   # Install on Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

3. **npm 9+** (or compatible package manager)
   ```bash
   # Check npm version
   npm -v
   ```

## ⚡ Quick Start Guide

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

```bash
# Copy the template
cp .env.sample .env

# Edit the .env file with your actual configuration
nano .env  # or use your preferred editor
```

**Required .env variables to configure:**
- `DATABASE_URL`: PostgreSQL connection string
- `ACCESS_TOKEN_SECRET`: Generate secure random string
- `REFRESH_TOKEN_SECRET`: Generate secure random string

### Step 4: Configure Environment Variables

Edit `.env` file and update these critical values:

```bash
# Generate JWT secrets (run in terminal)
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Example DATABASE_URL for local PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/figure_db?schema=public
```

### Step 5: Ensure PostgreSQL is Running

```bash
# macOS
brew services start postgresql@18

# Linux
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows (if installed as service)
net start postgresql
```

### Step 6: Create Database (if needed)

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE figure_db;

# Exit PostgreSQL
\q
```

### Step 7: Generate Prisma Client

```bash
npm run prisma:generate
```

### Step 8: Run Database Migrations

```bash
npm run prisma:migrate
```

### Step 9: Start Development Server

```bash
npm run dev
```

### Step 10: Verify Server is Running

Open http://localhost:8080 in your browser or test with curl:

```bash
curl http://localhost:8080
```

## ✅ Verification Checklist

After completing the setup, verify everything works:

```bash
# 1. Check Node version (should be 20.18.2)
node -v

# 2. Check PostgreSQL connection
npm run prisma:studio
# This should open Prisma Studio in your browser

# 3. Test database schema validation
npm run prisma:validate
# Should show "Prisma schema is valid"

# 4. Test development server startup
npm run dev
# Should show "Server running on port 8080" (or your configured port)

# 5. Test basic API endpoint
curl http://localhost:8080
# Should return a response from the API
```

## 🛠️ Common Issues & Solutions

### Node Version Mismatch
**Problem**: `Unsupported Node.js version` errors
**Solution**: Use nvm to install the exact version
```bash
nvm install 20.18.2
nvm use 20.18.2
```

### PostgreSQL Not Running
**Problem**: `ECONNREFUSED` database errors
**Solution**: Start PostgreSQL service
```bash
# macOS
brew services start postgresql@18

# Linux
sudo systemctl start postgresql
```

### Database Doesn't Exist
**Problem**: `database "figure_db" does not exist`
**Solution**: Create the database manually
```bash
psql postgres -c "CREATE DATABASE figure_db;"
```

### Port Conflict
**Problem**: `EADDRINUSE: address already in use :::8080`
**Solution**: Change PORT in `.env` or stop conflicting process
```bash
# Option 1: Change port in .env
PORT=3000

# Option 2: Kill process using port 8080
lsof -ti:8080 | xargs kill
```

### Prisma Client Errors
**Problem**: `Cannot find module '@prisma/client'`
**Solution**: Generate Prisma client
```bash
npm run prisma:generate
```

### Environment Variable Errors
**Problem**: `DATABASE_URL not defined` or JWT secrets missing
**Solution**: Create and configure `.env` file
```bash
cp .env.sample .env
# Edit .env with actual values
```

### Module Resolution Errors
**Problem**: `Cannot find module '@/...'` errors
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Next Steps

After successful setup:

1. **Read the API Documentation**: Check `README.md` for available endpoints
2. **Explore the Database Schema**: Look at `prisma/schema.prisma` to understand data models
3. **Review Development Guidelines**: Check the development section in `README.md`
4. **Test API Endpoints**: Use tools like Postman or curl to test the API

## 📚 Additional Resources

- **API Documentation**: See `README.md` for complete API reference
- **Database Schema**: `prisma/schema.prisma`
- **Development Guidelines**: `README.md#development-guidelines`
- **Troubleshooting**: `README.md#troubleshooting`

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. Check the troubleshooting section in `README.md`
2. Verify all prerequisites are met
3. Ensure PostgreSQL is running and accessible
4. Check that all environment variables are correctly set
5. Create an issue in the repository with details about your setup and error

---

**✅ You're ready to start developing!**

The server should now be running at http://localhost:8080 with hot reload enabled for development.