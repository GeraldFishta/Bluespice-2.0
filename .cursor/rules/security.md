# Security Rules - Bluespice 2.0

## Overview

JWT validation client-side, input sanitization with DOMPurify, XSS protection patterns, Supabase RLS policies, and CORS configuration for the Bluespice payroll application.

## Core Principles

### 1. Client-Side Security

- Validate JWT tokens before API calls
- Sanitize all user inputs
- Implement XSS protection
- Use Content Security Policy (CSP)

### 2. Input Validation & Sanitization

- Validate inputs on both client and server
- Sanitize HTML content with DOMPurify
- Escape special characters in user data
- Implement rate limiting for sensitive operations

### 3. Authentication Security

- Secure JWT token storage
- Implement token refresh mechanisms
- Handle token expiration gracefully
- Use HTTPS for all communications

### 4. Data Protection

- Implement Row Level Security (RLS) in Supabase
- Encrypt sensitive data in transit
- Use secure headers
- Implement proper CORS policies

## Patterns & Examples

### JWT Validation & Security

```javascript
// lib/jwt-security.js
import jwt from "jwt-decode";

export const validateJWT = (token) => {
  try {
    if (!token) return false;

    const decoded = jwt.decode(token);
    const now = Date.now() / 1000;

    // Check expiration
    if (decoded.exp < now) {
      console.warn("JWT token expired");
      return false;
    }

    // Check issuer
    if (decoded.iss !== process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn("Invalid JWT issuer");
      return false;
    }

    // Check audience
    if (decoded.aud !== "authenticated") {
      console.warn("Invalid JWT audience");
      return false;
    }

    return true;
  } catch (error) {
    console.error("JWT validation error:", error);
    return false;
  }
};

export const getJWTPayload = (token) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};

export const isTokenExpiringSoon = (token, minutesThreshold = 5) => {
  try {
    const decoded = jwt.decode(token);
    const now = Date.now() / 1000;
    const expirationTime = decoded.exp;
    const threshold = minutesThreshold * 60;

    return expirationTime - now < threshold;
  } catch {
    return true;
  }
};
```

### Input Sanitization

```javascript
// lib/sanitization.js
import DOMPurify from "dompurify";

// Configure DOMPurify for strict sanitization
const config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
};

export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, config);
};

export const sanitizeText = (text) => {
  if (typeof text !== "string") return "";

  return text
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

export const sanitizeEmail = (email) => {
  if (typeof email !== "string") return "";

  return email
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/g, "") // Keep only valid email characters
    .trim();
};

export const sanitizePhone = (phone) => {
  if (typeof phone !== "string") return "";

  return phone
    .replace(/[^\d+\-\(\)\s]/g, "") // Keep only valid phone characters
    .trim();
};

export const sanitizeCurrency = (amount) => {
  if (typeof amount === "number") return amount;
  if (typeof amount !== "string") return 0;

  // Remove currency symbols and non-numeric characters except decimal point
  const cleaned = amount.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};
```

### Secure API Client

```javascript
// lib/secure-api.js
import axios from "axios";
import { validateJWT, getStoredToken, clearStoredToken } from "./auth";

const createSecureApiClient = () => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  // Request interceptor for security
  client.interceptors.request.use(
    (config) => {
      const token = getStoredToken();

      if (token && validateJWT(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add CSRF token if available
      const csrfToken = document.querySelector('meta[name="csrf-token"]');
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken.getAttribute("content");
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for security
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Token invalid or expired
        clearStoredToken();
        window.location.href = "/login";
      }

      if (error.response?.status === 403) {
        // Access forbidden
        console.warn("Access forbidden to resource");
      }

      if (error.response?.status === 429) {
        // Rate limited
        console.warn("Rate limited - too many requests");
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const secureApi = createSecureApiClient();
```

### Form Security Utilities

```javascript
// utils/form-security.js
import {
  sanitizeText,
  sanitizeEmail,
  sanitizeCurrency,
} from "@/lib/sanitization";

export const secureFormData = (formData) => {
  const secured = {};

  for (const [key, value] of Object.entries(formData)) {
    switch (key) {
      case "email":
        secured[key] = sanitizeEmail(value);
        break;
      case "phone":
        secured[key] = sanitizePhone(value);
        break;
      case "salary":
      case "amount":
      case "deduction":
        secured[key] = sanitizeCurrency(value);
        break;
      default:
        secured[key] = sanitizeText(value);
    }
  }

  return secured;
};

export const validateFormSecurity = (formData) => {
  const errors = {};

  // Check for potential XSS
  const xssPattern = /<script|javascript:|on\w+=/i;
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === "string" && xssPattern.test(value)) {
      errors[key] = "Invalid characters detected";
    }
  }

  // Check for SQL injection patterns
  const sqlPattern = /('|(\\')|(;)|(\-\-)|(\/\*)|(\*\/)|(\|)|(\&)|(\%)/i;
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === "string" && sqlPattern.test(value)) {
      errors[key] = "Invalid characters detected";
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
```

### Content Security Policy

```javascript
// lib/csp.js
export const cspConfig = {
  directives: {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'", // Only if necessary for MUI
      "https://cdn.jsdelivr.net",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ],
    "style-src": [
      "'self'",
      "'unsafe-inline'", // Required for MUI
      "https://fonts.googleapis.com",
    ],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "https:"],
    "connect-src": [
      "'self'",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_API_BASE_URL,
    ],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  },
};

// Next.js CSP implementation
export const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];
```

### Rate Limiting Hook

```javascript
// hooks/useRateLimit.js
import { useState, useCallback, useRef } from "react";

export const useRateLimit = (maxRequests = 5, timeWindow = 60000) => {
  const [isLimited, setIsLimited] = useState(false);
  const requestTimes = useRef([]);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const windowStart = now - timeWindow;

    // Remove old requests outside the time window
    requestTimes.current = requestTimes.current.filter(
      (time) => time > windowStart
    );

    if (requestTimes.current.length >= maxRequests) {
      setIsLimited(true);
      return false;
    }

    requestTimes.current.push(now);
    return true;
  }, [maxRequests, timeWindow]);

  const resetRateLimit = useCallback(() => {
    requestTimes.current = [];
    setIsLimited(false);
  }, []);

  return { checkRateLimit, resetRateLimit, isLimited };
};
```

### Secure File Upload

```javascript
// utils/secure-file-upload.js
export const validateFileType = (file, allowedTypes = [".csv", ".xlsx"]) => {
  const fileExtension = "." + file.name.split(".").pop().toLowerCase();
  return allowedTypes.includes(fileExtension);
};

export const validateFileSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .substring(0, 100); // Limit length
};

export const createSecureFormData = (file, additionalData = {}) => {
  const formData = new FormData();

  // Sanitize filename
  const sanitizedFile = new File([file], sanitizeFileName(file.name), {
    type: file.type,
  });

  formData.append("file", sanitizedFile);

  // Add additional sanitized data
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, sanitizeText(value));
  });

  return formData;
};
```

## Anti-Patterns

### ❌ Don't Do This

```javascript
// Don't trust client-side validation only
const BadValidation = () => {
  const [email, setEmail] = useState("");

  const isValidEmail = (email) => {
    return email.includes("@"); // Too simple, can be bypassed
  };

  const handleSubmit = () => {
    if (isValidEmail(email)) {
      // Submit without server validation - DANGEROUS!
      submitToServer(email);
    }
  };
};

// Don't render unsanitized HTML
const BadHTMLRender = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
  // XSS vulnerability!
};

// Don't store sensitive data in localStorage
const BadTokenStorage = () => {
  const storeSensitiveData = (data) => {
    localStorage.setItem(
      "userData",
      JSON.stringify({
        password: data.password, // NEVER store passwords
        salary: data.salary, // Sensitive business data
        ssn: data.ssn, // Personal information
      })
    );
  };
};
```

### ✅ Do This Instead

```javascript
// Always validate on both client and server
const GoodValidation = () => {
  const schema = yup.object({
    email: yup.string().email().required(),
  });

  const {
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Client validation
  });

  const handleSubmit = async (data) => {
    // Server will also validate - double protection
    await api.post("/validate", data);
  };
};

// Sanitize HTML before rendering
const GoodHTMLRender = ({ content }) => {
  const sanitizedContent = sanitizeHTML(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

// Store only necessary, non-sensitive data
const GoodTokenStorage = () => {
  const storeUserData = (data) => {
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: data.id,
        role: data.role,
        preferences: data.preferences,
        // No sensitive data
      })
    );
  };
};
```

## Related Files/Dependencies

### Required Packages

```json
{
  "dompurify": "^3.0.0",
  "jwt-decode": "^3.0.0",
  "helmet": "^7.0.0"
}
```

### File Structure

```
lib/
├── jwt-security.js       # JWT validation utilities
├── sanitization.js       # Input sanitization functions
├── secure-api.js         # Secure API client
└── csp.js               # Content Security Policy
utils/
├── form-security.js      # Form security utilities
└── secure-file-upload.js # File upload security
hooks/
└── useRateLimit.js       # Rate limiting hook
```

### Security Checklist

1. **Input Validation**: Validate and sanitize all user inputs
2. **JWT Security**: Validate tokens and handle expiration
3. **XSS Protection**: Sanitize HTML content and use CSP
4. **CSRF Protection**: Use CSRF tokens for state-changing operations
5. **Rate Limiting**: Implement rate limiting for sensitive operations
6. **Secure Headers**: Use security headers (HSTS, X-Frame-Options, etc.)
7. **File Upload**: Validate file types and sizes
8. **Error Handling**: Don't expose sensitive information in errors
9. **Logging**: Log security events for monitoring
10. **Dependencies**: Keep security-related dependencies updated
