---
trigger: always_on
---

---
title: Naming Conventions Guide
applies_to:
  - "**/*.ts"
---

# Naming Conventions Guide  
**NestJS + TypeScript + TypeORM + PostgreSQL**

Core Principles

Consistency – Same naming rules across all modules

Clarity – Names must reflect business intent, not technical detail

TypeScript First – Strong typing is mandatory

NestJS Conventions – Align with NestJS & backend community standards

Scalability – Feature/module-based, domain-driven naming

File Naming
General Rule

Use kebab-case for all file & folder names

One responsibility per file

users.controller.ts
users.service.ts
user.entity.ts
create-user.dto.ts
jwt-auth.guard.ts

Modules

Folder name: plural, kebab-case

Module file: <domain>.module.ts

modules/
└─ users/
   ├─ users.module.ts
   ├─ users.controller.ts
   ├─ users.service.ts

Controllers

Suffix: .controller.ts

Use plural naming (resource-based)

users.controller.ts
auth.controller.ts


Class name:

export class UsersController {}

Services

Suffix: .service.ts

Represent business use-cases

users.service.ts
auth.service.ts


Class name:

export class UsersService {}

Entities (TypeORM)

File name: singular

Suffix: .entity.ts

user.entity.ts
order-item.entity.ts


Class name:

@Entity('users')
export class User {}

DTOs (Data Transfer Objects)

Suffix with .dto.ts

Prefix with verb or purpose

Never reuse Entity as DTO

create-user.dto.ts
update-user.dto.ts
login.dto.ts
query-user.dto.ts


Class naming:

export class CreateUserDto {}
export class UpdateUserDto {}

Guards / Interceptors / Pipes / Filters
Type	File Suffix	Class Suffix
Guard	.guard.ts	Guard
Interceptor	.interceptor.ts	Interceptor
Pipe	.pipe.ts	Pipe
Filter	.filter.ts	Filter

Example:

jwt-auth.guard.ts
roles.guard.ts
http-exception.filter.ts

Config Files

Suffix: .config.ts

Use domain-based naming

app.config.ts
database.config.ts
auth.config.ts

Migration Files

Timestamp + description

Use snake_case

1700000000000-create-users-table.ts
1700000100000-add-index-email.ts

Variable Naming
General Variables

Use camelCase

Use meaningful domain terms

const userCount = 10;
const currentUser = req.user;

Boolean Variables

Prefix with is, has, can, should

const isActive = true;
const hasPermission = false;

Collections

Use plural nouns

const users: User[] = [];
const roleList: UserRole[] = [];

Function Naming
Service Methods

Use verbs

Reflect business intent, not HTTP method

createUser()
updateUserProfile()
changePassword()
assignRole()


❌ Bad:

postUser()
handleCreateUser()

Repository / DB Methods

Use CRUD semantics

findById()
findByEmail()
saveUser()
deleteById()

Async Functions

Do NOT suffix with Async

Name already implies async behavior

getUsers()
validateToken()

Controller Method Naming

Map to REST semantics

Use plural resources

@Get()
getUsers()

@Post()
createUser()

@Put(':id')
updateUser()

Class Naming
Controllers / Services / Modules

Use PascalCase

Always end with framework-specific suffix

UsersController
UsersService
UsersModule

Utility / Helper Classes

Use nouns

Avoid suffixing with Helper unless necessary

PasswordHasher
TokenGenerator
DateFormatter

TypeScript Naming
Type Aliases

Use PascalCase

Prefer type over interface unless extending

type UserRole = 'admin' | 'staff';
type JwtPayload = {
  userId: number;
};

Interfaces

Use PascalCase

NO I prefix

interface PaginationResult<T> {
  data: T[];
  total: number;
}

Enums

Use PascalCase

Enum members: UPPER_SNAKE_CASE

enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

Database Naming
Table Names

snake_case

plural

users
order_items

Column Names

snake_case

@Column({ name: 'created_at' })
createdAt: Date;

Folder Naming

Use kebab-case

Feature / domain-based

modules/
├─ user-management/
├─ order-processing/

Import Naming

Prefer absolute imports

Use type-only imports

import { UsersService } from '@/modules/users/users.service';
import type { JwtPayload } from '@/common/types';

Best Practices

Do not encode technical details into names

Avoid abbreviations unless domain-standard

Do not mix DTOs, Entities, and Response models

Align naming with business/domain language

One file = one responsibility

Update this guide when architecture evolves