---
trigger: always_on
---

---
title: NestJS Code Quality Guidelines
applies_to:
  - "**/*.ts"
---

# NestJS Code Quality Guidelines (TypeScript + TypeORM + PostgreSQL)

1. Module & Service Design Principles

Follow Single Responsibility Principle (SRP) strictly

One business domain = one module

Services must represent use-cases, not technical helpers

Controllers must stay thin

Avoid “god services” (>300 LOC)

✅ Good Example
@Injectable()
export class UsersService {
  createUser(dto: CreateUserDto) {
    // business logic
  }
}

❌ Bad Example
@Injectable()
export class UsersService {
  handleCreateUser(req: any) {
    // HTTP + DB + logic mixed
  }
}

2. Controller Quality Rules
Responsibilities

Handle HTTP layer only

Validate input via DTOs

Delegate to services

Never access repositories directly

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
}


❌ No business logic
❌ No DB calls

3. Service Layer Quality
Rules

Business logic lives in services

Prefer small, composable methods

No HTTP or request/response logic

Explicit return types

createUser(dto: CreateUserDto): Promise<User> {
  return this.usersRepository.create(dto);
}

4. Repository & Database Access
Principles

Centralize DB access

No business logic

Use expressive query methods

Handle only persistence concerns

findByEmail(email: string): Promise<User | null> {}


❌ No DTO usage
❌ No request context

5. DTO & Validation Quality
Rules

DTOs define API contract

Use class-validator

Separate DTOs per action

No optional fields unless intentional

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}


❌ Never reuse Entity as DTO

6. Entity Quality
Rules

Represent database schema only

No request or response logic

No validation

Use snake_case for DB columns

@Entity('users')
export class User {
  @Column({ name: 'created_at' })
  createdAt: Date;
}

7. Type Safety Principles

Enable strict in tsconfig.json

Avoid any

Prefer:

unknown

Generics

Type guards

Prefer union types over enums when possible

✅ Good Example
type UserStatus = 'active' | 'inactive' | 'banned';

function isActive(status: UserStatus): boolean {
  return status === 'active';
}

❌ Bad Example
function processUser(user: any) {
  return user.id;
}

8. Async & Side-Effect Handling
Rules

Always await promises

Handle errors explicitly

Use Promise.all for parallel execution

No floating promises

await Promise.all(tasks);

9. Transactions
Principles

Use transactions for multi-step DB operations

Keep transaction scope minimal

Fail fast and rollback properly

await queryRunner.startTransaction();

10. Error Handling
Rules

Throw meaningful HTTP exceptions

Never expose DB errors

Centralize formatting in exception filters

throw new NotFoundException('User not found');

11. Logging Rules

No console.log in production

Use structured logging

Include requestId / userId when possible

12. File & Folder Structure
src/
├─ common/
├─ config/
├─ database/
├─ modules/
│  └─ users/
│     ├─ dto/
│     ├─ entities/
│     ├─ users.controller.ts
│     ├─ users.service.ts
│     └─ users.module.ts

13. Naming Conventions (Summary)
Concept	Convention
Files	kebab-case
Classes	PascalCase
Variables	camelCase
Constants	UPPER_SNAKE_CASE
DTOs	Verb + Noun (CreateUserDto)
14. Testing Quality
Unit Tests

Test services, not controllers

Mock repositories

File: *.service.spec.ts

E2E Tests

Test real HTTP flows

Minimal but critical coverage

15. Code Review Rules

No console.log

No commented-out code

No unused imports

Every PR must:

Pass TypeScript

Pass lint

Have clear commit message