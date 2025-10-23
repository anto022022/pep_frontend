# CORS Configuration for Next.js Frontend

This document explains the CORS (Cross-Origin Resource Sharing) setup for your Next.js application.

## What's Been Added

### 1. Next.js Configuration (`next.config.ts`)
- Added `headers()` function to set CORS headers for all routes
- Configures `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, etc.

### 2. Middleware (`middleware.ts`)
- Added CORS preflight handling for OPTIONS requests
- Ensures CORS headers are set for all requests

### 3. CORS Utility (`lib/cors.ts`)
- Reusable functions for handling CORS in API routes
- `corsHeaders()`: Returns CORS headers object
- `handleCors()`: Handles preflight requests
- `withCors()`: Applies CORS headers to responses

### 4. Production CORS Config (`lib/cors-config.ts`)
- Environment-based CORS configuration
- Supports multiple allowed origins
- Production-ready with security considerations

### 5. Example API Route (`app/api/cors-example/route.ts`)
- Demonstrates how to use CORS utilities in API routes
- Handles GET, POST, and OPTIONS requests

### 6. Kubernetes Service (`dply/stg/front-end/service.yaml`)
- Added nginx ingress annotations for CORS
- Ensures CORS headers are set at the load balancer level

## Environment Variables

Add these to your `.env` file for production:

```bash
# CORS Configuration
ALLOWED_ORIGINS="https://sandbox.pepagora.com,https://pepagora.com,http://localhost:3000"
```

## Usage in API Routes

### Basic Usage:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { handleCors, withCors } from '@/lib/cors';

export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  // Your API logic here
  const data = { message: 'Hello World' };
  
  // Return response with CORS headers
  return withCors(NextResponse.json(data));
}
```

### Advanced Usage with Origin Validation:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors-config';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  const data = { message: 'Hello World' };
  
  return NextResponse.json(data, {
    headers: corsHeaders
  });
}
```

## Security Considerations

### Development vs Production:
- **Development**: Allows all origins (`*`)
- **Production**: Restrict to specific domains using `ALLOWED_ORIGINS`

### Recommended Production Setup:
```bash
ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

### Headers to Include:
- `Content-Type`: For JSON/XML requests
- `Authorization`: For authentication tokens
- `X-Requested-With`: For AJAX requests
- `Accept`: For content negotiation
- `Origin`: For origin validation

## Testing CORS

### Test with curl:
```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  http://localhost:3000/api/cors-example

# Test actual request
curl -X GET \
  -H "Origin: https://example.com" \
  http://localhost:3000/api/cors-example
```

### Test with JavaScript:
```javascript
fetch('http://localhost:3000/api/cors-example', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(response => response.json())
.then(data => console.log(data));
```

## Troubleshooting

### Common Issues:

1. **CORS errors in browser console**:
   - Check if CORS headers are being set correctly
   - Verify allowed origins include your domain

2. **Preflight requests failing**:
   - Ensure OPTIONS method is handled
   - Check `Access-Control-Request-Headers` are allowed

3. **Credentials not working**:
   - Set `Access-Control-Allow-Credentials: true`
   - Don't use `*` for origin when using credentials

### Debug Steps:
1. Check browser Network tab for CORS headers
2. Verify middleware is running (check console logs)
3. Test with different origins
4. Check Kubernetes ingress annotations

## Production Deployment

When deploying to production:

1. Update `ALLOWED_ORIGINS` with your actual domains
2. Remove `*` from allowed origins
3. Test CORS with your actual frontend domain
4. Monitor CORS errors in logs
5. Consider using a CDN with CORS support 