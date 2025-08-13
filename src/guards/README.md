# Authentication & Authorization Guards

This module provides comprehensive authentication and authorization guards for protecting your API endpoints.

## Features

- **JWT Token Validation**: Automatically validates JWT tokens from Authorization headers
- **Role-Based Access Control**: Restrict access based on user roles
- **Public Endpoints**: Mark specific endpoints as public (no authentication required)
- **User Context**: Automatically attach user information to requests
- **Flexible Configuration**: Easy to configure and extend

## Guards

### AuthGuard

The main authentication guard that validates JWT tokens and extracts user information.

**Features:**
- Validates Bearer tokens from Authorization header
- Extracts and verifies JWT payload
- Attaches user information to request object
- Supports public endpoints with `@Public()` decorator

**Usage:**
```typescript
@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  // All endpoints require authentication unless marked with @Public()
}
```

### RolesGuard

Provides role-based access control for endpoints.

**Features:**
- Restricts access based on user roles
- Works in conjunction with `@Roles()` decorator
- Supports multiple roles per endpoint

**Usage:**
```typescript
@Controller('products')
@UseGuards(AuthGuard, RolesGuard)
export class ProductsController {
  @Post()
  @Roles('admin', 'seller')
  async createProduct() {
    // Only admin and seller roles can access this endpoint
  }
}
```

## Decorators

### @Public()

Marks an endpoint as public, bypassing authentication requirements.

```typescript
@Get()
@Public()
async getPublicData() {
  // This endpoint doesn't require authentication
}
```

### @Roles(...roles)

Specifies which roles can access an endpoint.

```typescript
@Post()
@Roles('admin')
async adminOnlyEndpoint() {
  // Only admin role can access this endpoint
}

@Put()
@Roles('admin', 'seller')
async adminOrSellerEndpoint() {
  // Admin or seller roles can access this endpoint
}
```

## User Context

After successful authentication, user information is automatically attached to the request object.

```typescript
export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  };
}

// In your controller
@Get('profile')
async getProfile(@Req() req: AuthenticatedRequest) {
  const { user } = req;
  return `Hello ${user.firstName} ${user.lastName}!`;
}
```

## Configuration

### JWT Configuration

Make sure your JWT module is properly configured in your module:

```typescript
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '120s' },
    })
  ],
  // ... other configuration
})
```

### Environment Variables

Set the following environment variable:

```env
JWT_SECRET=your-super-secret-jwt-key-here
```

## Usage Examples

### Basic Authentication

```typescript
@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  @Get()
  async getAllProducts() {
    // Requires valid JWT token
  }
}
```

### Role-Based Access

```typescript
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  @Post('users')
  @Roles('admin')
  async createUser() {
    // Only admin role can access
  }
}
```

### Mixed Access Control

```typescript
@Controller('products')
@UseGuards(AuthGuard, RolesGuard)
export class ProductsController {
  @Get()
  @Public()
  async getPublicProducts() {
    // No authentication required
  }

  @Post()
  @Roles('admin', 'seller')
  async createProduct() {
    // Requires authentication + admin or seller role
  }

  @Delete()
  @Roles('admin')
  async deleteProduct() {
    // Requires authentication + admin role only
  }
}
```

### Accessing User Information

```typescript
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const { user } = req;
    
    return {
      message: 'Profile retrieved successfully',
      data: {
        userId: user.userId,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    };
  }
}
```

## Error Handling

The guards automatically throw appropriate exceptions:

- **UnauthorizedException**: When no token is provided or token is invalid
- **ForbiddenException**: When user doesn't have required role (handled by RolesGuard)

## Security Best Practices

1. **Always use HTTPS** in production
2. **Set appropriate JWT expiration times**
3. **Use strong JWT secrets**
4. **Implement token refresh mechanisms**
5. **Log authentication failures for monitoring**
6. **Rate limit authentication endpoints**

## Testing

When testing protected endpoints, include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/products
```

## Troubleshooting

### Common Issues

1. **"Access token is required"**: Make sure to include `Authorization: Bearer <token>` header
2. **"Invalid or expired access token"**: Check if token is valid and not expired
3. **"Forbidden"**: Verify user has the required role for the endpoint

### Debug Mode

Enable debug logging to troubleshoot authentication issues:

```typescript
// In your main.ts or configuration
process.env.DEBUG = 'auth:guard';
```
