<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4
- inertiajs/inertia-laravel (INERTIA_LARAVEL) - v3
- laravel/ai (AI) - v0
- laravel/cashier (CASHIER) - v16
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v13
- laravel/mcp (MCP) - v0
- laravel/octane (OCTANE) - v2
- laravel/pennant (PENNANT) - v1
- laravel/prompts (PROMPTS) - v0
- laravel/reverb (REVERB) - v1
- laravel/sanctum (SANCTUM) - v4
- laravel/scout (SCOUT) - v11
- laravel/socialite (SOCIALITE) - v5
- laravel/wayfinder (WAYFINDER) - v0
- laravel/boost (BOOST) - v2
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/react (INERTIA_REACT) - v3
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/echo-react (ECHO_REACT) - v2
- @laravel/vite-plugin-wayfinder (WAYFINDER_VITE) - v0
- eslint (ESLINT) - v9
- laravel-echo (ECHO) - v2
- prettier (PRETTIER) - v3

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Follow existing application Enum naming conventions.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== herd rules ===

# Laravel Herd

- The application is served by Laravel Herd at `https?://[kebab-case-project-dir].test`. Use the `get-absolute-url` tool to generate valid URLs. Never run commands to serve the site. It is always available.
- Use the `herd` CLI to manage services, PHP versions, and sites (e.g. `herd sites`, `herd services:start <service>`, `herd php:list`). Run `herd list` to discover all available commands.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== octane/core rules ===

# Laravel Octane

This application uses Laravel Octane, a long-running PHP server. The application bootstraps once and handles many requests within the same process.

- Never store request-specific state in singletons or static properties, because it can leak across requests.
- Use `config('octane.server')` to detect the active driver (`swoole`, `roadrunner`, or `frankenphp`).
- Prefer scoped bindings (`$this->app->scoped()`) over singletons for per-request services.

When working on Octane-specific features (concurrency, shared tables, memory, driver configuration, testing), invoke `octane-development` for detailed rules.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

=== spatie/boost-spatie-guidelines rules ===

# Project Coding Guidelines

- This codebase follows Spatie's Laravel & PHP guidelines.
- Always activate the `spatie-laravel-php-standards` skill whenever writing, editing, reviewing, or formatting Laravel or PHP code.

</laravel-boost-guidelines>

---

# Laravel SAAS Starter - Project Guidelines

> A production-ready Laravel SaaS starter kit with authentication, billing, teams, and everything you need to launch faster.
> **Built by XCO Agency** - https://xco.agency

---

## Project Overview

This is a full-stack Laravel SaaS application featuring:

- **Multi-tenant Workspace Architecture** - Users can create and manage multiple workspaces with team collaboration
- **Stripe Billing Integration** - Subscription management via Laravel Cashier with seat-based pricing
- **Complete Authentication System** - Laravel Fortify with 2FA, social login, password resets, and session management
- **Admin Panel** - Global super-admin dashboard with user impersonation and system management
- **Feature Flags** - Laravel Pennant for workspace-specific feature rollouts
- **Audit Logging** - Spatie Activitylog for complete change tracking
- **Real-time Features** - Laravel Reverb for WebSocket broadcasting
- **AI Integration** - Laravel AI SDK for AI-powered features
- **API Platform** - API key authentication with rate limiting and usage tracking

---

## Project Structure

```
├── app/
│   ├── Actions/Fortify/          # Fortify authentication customizations
│   ├── Console/Commands/          # Artisan commands
│   ├── Events/                    # Event classes
│   ├── Http/
│   │   ├── Controllers/           # Web controllers
│   │   │   ├── Auth/              # Authentication controllers
│   │   │   ├── Admin/             # Admin panel controllers
│   │   │   ├── Api/               # API controllers
│   │   │   └── Settings/          # Settings controllers
│   │   ├── Middleware/            # HTTP middleware
│   │   ├── Requests/              # Form request validation
│   │   └── Resources/             # API resources
│   ├── Jobs/                      # Queue jobs
│   ├── Listeners/                 # Event listeners
│   ├── Mail/                      # Mailables
│   ├── Models/                    # Eloquent models
│   ├── Notifications/             # Notifications
│   ├── Observers/                 # Model observers
│   ├── Policies/                  # Authorization policies
│   ├── Providers/                 # Service providers
│   ├── Services/                  # Business logic
│   │   ├── Business/              # Business services
│   │   └── AI/                    # AI-related services
│   └── Traits/                    # Reusable traits
├── bootstrap/
│   ├── app.php                    # Laravel 13 application configuration
│   └── providers.php              # Service provider registration
├── config/                        # Configuration files
├── database/
│   ├── factories/                 # Model factories
│   ├── migrations/                # Database migrations
│   └── seeders/                   # Database seeders
├── docs/features/                 # Feature documentation (60+ docs)
├── resources/
│   ├── css/app.css                # Tailwind CSS v4 with custom theme
│   ├── js/
│   │   ├── actions/               # Wayfinder-generated actions
│   │   ├── app.tsx                # Application entry point
│   │   ├── components/            # React components (shadcn/ui + custom)
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── layouts/               # Page layouts (admin, app, auth, settings)
│   │   ├── locales/               # i18n translation files
│   │   ├── pages/                 # Inertia.js page components
│   │   ├── routes/                # Wayfinder-generated routes
│   │   └── types/                 # TypeScript type definitions
│   └── views/                     # Blade views (minimal)
├── routes/
│   ├── ai.php                     # MCP server routes
│   ├── api.php                    # API routes
│   ├── channels.php               # Broadcasting channels
│   ├── console.php                # Console routes
│   ├── settings.php               # Settings routes
│   └── web.php                    # Web routes
├── tests/
│   ├── Feature/                   # Feature tests (1000+ tests)
│   ├── Unit/                      # Unit tests
│   └── Pest.php                   # Pest configuration
└── stubs/                         # Code generation stubs
```

### Key Models

- **User** - Application users with authentication
- **Workspace** - Multi-tenant organizations
- **WorkspaceInvitation** - Team invitation system
- **WorkspaceApiKey** - API key management
- **Announcement** - Global announcements
- **FeatureFlag** - Pennant feature flags
- **ConnectedAccount** - Social login accounts
- **WebhookEndpoint/WebhookLog** - Webhook management
- **ChangelogEntry** - Changelog system
- **Feedback** - User feedback collection
- **Ticket/TicketReply** - Support ticket system
- **StatusIncident** - Status page incidents

---

## Development Commands

### Setup

```bash
# Complete project setup
composer run setup

# Or step by step:
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run build
```

### Development Server

```bash
# Run all services (Laravel, Vite, Queue, Reverb, Logs)
composer run dev

# Run with SSR
composer run dev:ssr

# Individual services:
php artisan serve       # Laravel server
npm run dev             # Vite dev server
php artisan queue:listen
php artisan reverb:start
```

### Building

```bash
# Production build
npm run build

# SSR build
npm run build:ssr
```

### Testing

```bash
# Run all tests
php artisan test

# Run with compact output
php artisan test --compact

# Run specific file
php artisan test tests/Feature/Auth/LoginTest.php

# Run with filter
php artisan test --filter=can_login

# Pest parallel testing
php artisan test --parallel
```

### Code Quality

```bash
# PHP formatting (Laravel Pint)
vendor/bin/pint
vendor/bin/pint --dirty

# Frontend formatting (Prettier)
npm run format
npm run format:check

# TypeScript checking
npm run types

# ESLint
npm run lint

# Composer script
composer pint
```

---

## Key Architectural Patterns

### Multi-tenancy via Workspaces

- All resources belong to a `Workspace`
- Users can belong to multiple workspaces via `workspace_user` pivot
- Roles: `owner`, `admin`, `member`
- Middleware ensures workspace context: `workspace`, `workspace.admin`, `workspace.owner`

### Feature Flags (Pennant)

```php
use Laravel\Pennant\Feature;

// Check feature
if (Feature::active('new-feature')) {
    // Show new feature
}

// Scoped to workspace
Feature::for($workspace)->activate('beta-feature');
```

---

## Security Considerations

### Authentication & Authorization

- **Laravel Fortify** - Handles login, registration, 2FA, password reset
- **Two-Factor Authentication** - Required for certain workspaces (enforced via middleware)
- **Password expiration** - Configurable password expiry (`AUTH_PASSWORD_EXPIRY_DAYS`)
- **Workspace access control** - Middleware ensures users can only access their workspaces
- **API Key authentication** - Separate middleware for API routes

### CSRF Protection

- Stripe webhook routes excluded from CSRF in `bootstrap/app.php`
- All Inertia forms automatically include CSRF tokens

### Data Protection

- **GDPR compliance** - Data export and account deletion features
- **Audit logging** - All changes tracked via Spatie Activitylog
- **IP allowlists** - Workspace-level IP restrictions
- **Session management** - Device tracking and session invalidation

### Stripe Security

- Webhook signature verification
- Customer portal authenticated via signed URLs
- Never log full card details

---

## CI/CD Pipeline

### GitHub Actions Workflows

| Workflow | Purpose |
|----------|---------|
| `tests.yml` | Run Pest tests on PHP 8.4 |
| `lint.yml` | Run Pint, Prettier, ESLint |
| `dependency-audit.yml` | Security audit for composer/npm |
| `codeql.yml` | Static analysis |
| `release.yml` | Automated releases with release-please |

### Local CI Testing with `act`

```bash
# Run tests workflow
act push -j ci -W .github/workflows/tests.yml

# Run lint workflow
act push -j quality -W .github/workflows/lint.yml
```

---

## Environment Configuration

### Required Environment Variables

```bash
# Application
APP_NAME="Laravel SAAS Starter"
APP_URL=http://localhost:8000
APP_KEY=  # Generated via php artisan key:generate

# Database
DB_CONNECTION=sqlite  # or mysql, pgsql

# Stripe (required for billing)
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Broadcasting (Reverb)
REVERB_APP_ID=my-app-id
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret

# AI Providers (optional)
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=

# Sentry (optional)
SENTRY_LARAVEL_DSN=
```

---

## Key Directories for Common Tasks

| Task | Location |
|------|----------|
| Add a new page | `resources/js/pages/` |
| Add a reusable component | `resources/js/components/` |
| Add a controller | `app/Http/Controllers/` |
| Add a model | `app/Models/` |
| Add a migration | `database/migrations/` |
| Add a test | `tests/Feature/` |
| Add API routes | `routes/api.php` |
| Add web routes | `routes/web.php` |
| Add middleware | `app/Http/Middleware/` + register in `bootstrap/app.php` |
| Feature documentation | `docs/features/` |

---

## Documentation

Comprehensive feature documentation is available in `docs/features/`:

- **Core**: Authentication, Workspaces, Team Management, Session Management
- **Billing**: Stripe integration, Seat-based billing, Usage Dashboard
- **Admin**: Admin Panel, Impersonation, System Health, Audit Logs
- **Platform**: Announcements, Feature Flags, Webhooks, Real-time Notifications
- **Security**: 2FA Enforcement, GDPR Data Export, Account Deletion
- **API**: API Keys, Authentication, Documentation

---

*This AGENTS.md file is maintained alongside the codebase. For questions or updates, refer to the project maintainers at XCO Agency.*
