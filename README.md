# PantryPal

A modern pantry management application built with React, TypeScript, and Express. Track your pantry items, plan meals, manage shopping lists, and monitor your grocery budget.

## Features

- **Pantry Management**: Track items with expiry dates, quantities, and categories
- **Smart Dashboard**: View expiring items, suggested recipes, and statistics
- **Meal Planning**: Plan your weekly meals with nutritional tracking
- **Shopping Lists**: Create and manage shopping lists with price estimates
- **Budget Tracking**: Monitor grocery spending with visual charts
- **Recipe Suggestions**: Get recipe recommendations based on available ingredients
- **Barcode Scanning**: Quick item entry via barcode scanning
- **Dark Mode**: Full theme support for comfortable viewing

## Tech Stack

### Frontend
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Radix UI components
- Tailwind CSS for styling
- Recharts for data visualization
- date-fns for date handling

### Backend
- Express.js
- TypeScript
- Zod for validation
- In-memory storage (easily replaceable with database)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd PantryPal
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
PantryPal/
├── client/               # Frontend React application
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Page components
│       ├── lib/          # Utilities and helpers
│       └── hooks/        # Custom React hooks
├── server/               # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   └── storage.ts       # Data storage layer
└── shared/              # Shared types and schemas
```

## API Endpoints

### Pantry Items
- `GET /api/pantry` - Get all pantry items
- `POST /api/pantry` - Create new pantry item
- `PUT /api/pantry/:id` - Update pantry item
- `DELETE /api/pantry/:id` - Delete pantry item

### Shopping List
- `GET /api/shopping` - Get shopping list items
- `POST /api/shopping` - Add item to shopping list
- `PUT /api/shopping/:id` - Update shopping item
- `DELETE /api/shopping/:id` - Remove from shopping list

### Meal Planning
- `GET /api/meals` - Get meal plans
- `POST /api/meals` - Create meal plan
- `DELETE /api/meals/:id` - Delete meal plan

### Budget & Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense

### Statistics
- `GET /api/stats` - Get dashboard statistics
- `GET /api/expiring-soon` - Get items expiring within 7 days

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Future Enhancements

- Database integration (PostgreSQL with Drizzle ORM)
- User authentication and multi-user support
- AI-powered recipe suggestions
- Nutrition tracking and analysis
- Mobile app version
- Barcode scanning implementation
- Recipe import from URLs
- Grocery store price comparison

## License

MIT
