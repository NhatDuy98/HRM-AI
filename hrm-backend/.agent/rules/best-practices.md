---
trigger: always_on
---

---
title: NestJS + TypeScript Best Practices
applies_to:
  - "**/*.ts"
---

# NestJS + TypeScript + TypeORM Best Practices

This document outlines the recommended practices for developing backend applications using **NestJS**, **TypeScript**, **TypeORM**, and **PostgreSQL**.

Application Architecture
Module-Based Architecture

Use NestJS modules as the primary architectural unit

One business domain = one module

Avoid cross-module coupling

Modules must expose services explicitly

modules/
└─ users/
   ├─ users.module.ts
   ├─ users.controller.ts
   ├─ users.service.ts
   └─ entities/

Dependency Direction (Strict)
Controller → Service → Repository → Database


❌ Controllers must NOT access repositories
❌ Services must NOT depend on controllers

Controllers
Controller Responsibilities

Handle HTTP layer only

Validate request via DTOs

Delegate business logic to services

Never access database directly

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }
}

Controller Organization Order
// 1. Imports
// 2. Decorators
// 3. Constructor (DI)
// 4. Public endpoints
// 5. Private helpers (rare)

Services (Business Logic Layer)
Service Responsibilities

Contain business rules & use-cases

Orchestrate repositories & other services

Perform validation beyond DTO level

Transaction management (when needed)

@Injectable()
export class UsersService {
  createUser(dto: CreateUserDto) {
    // business logic
  }
}


❌ No HTTP concerns
❌ No request/response shaping

Service Design

Follow Single Responsibility Principle

Prefer small, composable methods

Avoid god-services (>300 LOC)

Extract domain logic when complex

Repositories / Database Access
Repository Usage

Use @InjectRepository or custom repositories

Centralize DB access logic

No business logic inside repositories

@Injectable()
export class UsersRepository {
  findByEmail(email: string) {}
}

DTOs (Validation & API Contract)
DTO Rules

Use class-validator & class-transformer

One DTO per use-case

Never reuse Entity as DTO

Explicit typing for all fields

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

Entities (Persistence Layer)
Entity Rules

Represent database schema only

No request/response logic

No business logic

Use snake_case DB columns

@Entity('users')
export class User {
  @Column({ name: 'created_at' })
  createdAt: Date;
}

Pipes, Guards, Interceptors
Pipes

Input validation & transformation only

Guards

Authentication & authorization logic

Interceptors

Logging, response mapping, performance tracking

❌ No business logic inside these layers

Error Handling
Exceptions

Use NestJS HTTP exceptions

Create domain-specific exceptions

throw new NotFoundException('User not found');

Global Exception Filter

Convert internal errors into safe HTTP responses

Never expose DB errors directly

TypeScript Best Practices
Type Usage

Prefer type over interface

Avoid any

Use unknown + type guards when needed

Enable strict mode

function isUser(value: unknown): value is User {
  return typeof value === 'object';
}

Type Placement

Shared types → common/types

Module-specific types → inside module

Async & Concurrency
Async Rules

Always await promises

Do not ignore promise results

Handle concurrency explicitly

await Promise.all(tasks);

Transactions
Transaction Rules

Use transactions for multi-step DB operations

Keep transaction scope minimal

Prefer QueryRunner or @Transaction()

Configuration & Environment
Config Rules

Never access process.env directly

Use @nestjs/config

Validate env variables at startup

Logging
Logging Rules

Use structured logging (winston / pino)

No console.log in production

Include requestId / userId when possible

Testing
Unit Tests

Test services, not controllers

Mock repositories

File naming: *.service.spec.ts

E2E Tests

Test full request lifecycle

Use real DB or test container

Performance
Optimization Rules

Avoid N+1 queries

Use proper DB indexing

Paginate all list endpoints

Cache read-heavy endpoints (Redis)

Security
Security Best Practices

Validate all inputs

Hash passwords (bcrypt/argon2)

Never log secrets

Use Helmet & rate limiting

Project-Specific Practices
Folder Structure

Feature-based (module-based)

Co-locate controller, service, DTOs, entities

Imports

Use absolute imports (@/)

Use type-only imports

import type { JwtPayload } from '@/common/types';

React → NestJS Concept Mapping
React Concept	NestJS Equivalent
Component	Controller
Hook	Guard / Interceptor
Service (API)	Service (Business logic)
Store	Database / Cache
Side Effect	Middleware / Interceptor
Code Quality

ESLint must pass

Prettier enforced

No dead code

Meaningful commit messages

Follow naming conventions strictly