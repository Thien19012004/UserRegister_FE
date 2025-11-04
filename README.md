
## Live Demo

 **(https://userregister-fe.onrender.com)**

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20.19.0 or later recommended)
- npm (included with Node.js)
- Git (for cloning the repository)

## Project Setup

1. Clone the repository:
```bash
git clone https://github.com/Thien19012004/UserRegister_FE.git
cd UserRegister_FE
```

2. Install dependencies:
```bash
npm install
```

3. Configure the environment:

Create a `.env` file in the project root (if not exists) with:
```env
VITE_API_URL=http://localhost:4000  # Change this to your backend URL
```

## Running Locally

1. Start the development server:
```bash
npm run dev
```

2. Access the application:
- Open your browser to [http://localhost:5173](http://localhost:5173)
- The development server supports hot-reloading

## Building for Production

1. Create a production build:
```bash
npm run build
```

2. Preview the production build locally:
```bash
npm run preview
```

## Environment Configuration

The application requires a backend API. Configure the API URL in:
- Development: `.env` file (VITE_API_URL)
- Production: Set the environment variable on your hosting platform

Current environments:
- Development: http://localhost:4000
- Production: https://userregister-be.onrender.com

## Project Structure

```
src/
├── api/          # API client and endpoints
├── auth/         # Authentication context and services
├── components/   # Reusable UI components
├── pages/        # Page components
└── assets/       # Static assets
```