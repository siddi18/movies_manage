# Movies Backend API

A Node.js/Express backend API for managing movies with Prisma ORM and MySQL database.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL database server
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install development dependencies:**
   ```bash
   npm install --save-dev @types/express @types/cors @types/node typescript ts-node
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database connection details:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   PORT=3000
   ```

4. **Setup database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema (for development)
   npm run db:push
   
   # Or run migrations (for production)
   npm run db:migrate
   ```

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npm run db:studio
```

## API Endpoints

- `GET /movies` - List movies with pagination (query params: skip, take)
- `POST /movies` - Create a new movie
- `PUT /movies/:id` - Update movie by ID
- `DELETE /movies/:id` - Delete movie by ID

## Database Schema

The `Movie` model includes:
- id (auto-increment)
- title
- type
- director
- budget
- location
- duration
- yearTime
- createdAt (auto-generated)

## Error Resolution

If you encounter TypeScript errors, ensure all type definitions are installed:
```bash
npm install --save-dev @types/express @types/cors @types/node typescript ts-node
```

For database connection issues, verify your `DATABASE_URL` in the `.env` file matches your MySQL setup.