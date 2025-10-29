#!/bin/bash
# Installation script for the Movies Backend API

echo "Installing dependencies..."
npm install

echo "Installing TypeScript development dependencies..."
npm install --save-dev @types/express @types/cors @types/node typescript ts-node

echo "Generating Prisma client..."
npm run db:generate

echo "Setup complete! Don't forget to:"
echo "1. Copy .env.example to .env and configure your database URL"
echo "2. Run 'npm run db:push' to sync your database schema"
echo "3. Run 'npm run dev' to start the development server"