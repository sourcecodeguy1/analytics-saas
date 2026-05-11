# Analytica - SaaS Analytics Platform

A full-stack SaaS analytics platform with subscription billing powered by Stripe. Features user authentication, Pro/Free tier management, and webhook-driven subscription lifecycle.

## Live Demo

- **Frontend:** https://analytics.juliowebmaster.com
- **API:** https://analytics-api.juliowebmaster.com/api

## Demo Accounts

| Email | Password | Tier |
|-------|----------|------|
| `free@demo.com` | `password` | Free |
| `pro@demo.com` | `password` | Pro (pre-upgraded) |

## Features

- **Authentication:** JWT-based auth with Laravel Sanctum
- **Subscription Management:** Stripe Checkout for upgrades, webhooks for lifecycle events
- **Tiered Access:** Free and Pro user tiers with feature differentiation
- **Responsive UI:** Modern React interface with TailwindCSS and shadcn/ui components
- **CI/CD:** GitHub Actions pipeline for automated build, push, and deploy
- **Dockerized:** Multi-stage builds for production deployment

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for fast development and optimized builds
- TailwindCSS for styling
- shadcn/ui component library
- Axios for API communication

### Backend
- Laravel 13 with PHP 8.4
- Laravel Sanctum for API authentication
- SQLite database
- Stripe PHP SDK for payment processing
- Webhook handling for subscription events

### Infrastructure
- Docker & Docker Compose
- Nginx reverse proxy
- Let's Encrypt SSL certificates
- Vultr VPS hosting
- GitHub Actions CI/CD

## Project Structure

```
analytics-saas/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   └── lib/            # Utilities
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/                 # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/Api/  # API controllers
│   │   └── Models/         # Eloquent models
│   ├── config/             # Configuration files
│   ├── database/           # Migrations and seeders
│   ├── routes/             # API routes
│   ├── Dockerfile
│   └── docker/
│       ├── nginx.conf
│       └── supervisord.conf
│
└── .github/workflows/      # CI/CD pipeline
    └── deploy.yml
```

## Local Development

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local frontend development)
- PHP 8.4+ (for local backend development)
- Composer

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/sourcecodeguy1/analytics-saas.git
cd analytics-saas
```

2. Start the services:
```bash
docker-compose up -d
```

3. Run migrations and seeders:
```bash
docker exec analytics-api-container php artisan migrate --force
docker exec analytics-api-container php artisan db:seed --class=DemoUserSeeder --force
```

4. Access the application:
- Frontend: http://localhost:3000
- API: http://localhost:8000/api

### Environment Variables

#### Backend (.env)
```env
APP_NAME=Analytica
APP_ENV=local
APP_KEY=base64:your-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite

FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_ANNUAL_PRICE_ID=price_...
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
1. Builds Docker images on push to `master`
2. Pushes images to Docker Hub
3. Deploys to Vultr server via SSH
4. Runs database migrations

Required repository secrets:
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `SSH_PRIVATE_KEY` - Server SSH key
- `SSH_USERNAME` - Server username (root)
- `SSH_HOST` - Server IP
- `SERVER_DIRECTORY` - Deployment path on server

## Deployment

### Server Setup

1. Configure DNS A records:
   - `analytics.juliowebmaster.com` -> `<YOUR-SERVER-IP>`
   - `analytics-api.juliowebmaster.com` -> `<YOUR-SERVER-IP>`

2. Issue SSL certificates:
```bash
docker exec certbot certbot certonly --webroot -w /var/www/certbot \
  -d analytics.juliowebmaster.com -d analytics-api.juliowebmaster.com
```

3. Configure nginx upstreams and server blocks (see `nginx/default.conf`)

4. Deploy production `.env` file to server

## Testing Stripe Integration

Use Stripe test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | User registration |
| POST | `/api/login` | User login |
| POST | `/api/logout` | User logout |
| GET | `/api/me` | Get current user |
| POST | `/api/subscription/checkout` | Create checkout session |
| POST | `/api/subscription/cancel` | Cancel subscription |
| GET | `/api/subscription/status` | Get subscription status |
| POST | `/api/webhook` | Stripe webhook handler |

## License

MIT License

## Author

Julio Sandoval - [juliowebmaster.com](https://juliowebmaster.com)
