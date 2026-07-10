# How to Set CORS Origin in Django

**Tandermis — Backend CORS Configuration Guide**

This guide explains how to allow your Next.js frontend to call your Django API without browser CORS errors.

---

## Overview

CORS (Cross-Origin Resource Sharing) controls which websites can make requests to your API from the browser. When your frontend runs on a different origin than your backend (e.g. `http://localhost:3000` calling `https://tandermis.pythonanywhere.com`), Django must explicitly allow that origin.

The standard solution is the **`django-cors-headers`** package.

---

## Step 1: Install django-cors-headers

Run in your Django project environment:

```bash
pip install django-cors-headers
```

Add it to `requirements.txt` if you use one:

```
django-cors-headers>=4.0.0
```

---

## Step 2: Add to INSTALLED_APPS

Open your Django `settings.py` and add `corsheaders`:

```python
INSTALLED_APPS = [
    ...
    "corsheaders",
    ...
]
```

---

## Step 3: Add the Middleware (order matters)

Add `CorsMiddleware` **as high as possible** in `MIDDLEWARE`, typically right after `SecurityMiddleware`:

```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # add this line
    "django.middleware.common.CommonMiddleware",
    ...
]
```

**Important:** If `CorsMiddleware` is placed too low in the list, CORS headers may not be applied correctly.

---

## Step 4: Set Allowed Origins

In `settings.py`, define the exact frontend URLs that may call your API:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",       # Next.js local dev
    "http://127.0.0.1:3000",       # alternate local dev
    "https://tandermis.com",       # production frontend (update as needed)
    "https://www.tandermis.com",   # if you use www
]
```

### Rules for origins

- Use the **exact** origin: scheme + host + port (if non-default).
- **No trailing slash** — use `https://example.com`, not `https://example.com/`.
- Include both `http://` and `https://` variants if you use both.
- Do **not** use wildcards in `CORS_ALLOWED_ORIGINS`.

---

## Step 5 (Optional): Allow Credentials

Only needed if you send cookies or session auth from the browser:

```python
CORS_ALLOW_CREDENTIALS = True
```

For Bearer token auth (JWT in the `Authorization` header), this is usually **not** required.

---

## Step 6: Restart Django

After changing settings, restart your server:

| Environment      | Action                                      |
|------------------|---------------------------------------------|
| Local            | Stop and run `python manage.py runserver`   |
| PythonAnywhere   | Reload the web app from the dashboard       |

---

## Recommended Setup for Tandermis

```python
# settings.py

INSTALLED_APPS = [
    ...
    "corsheaders",
    ...
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://tandermis.com",
    "https://www.tandermis.com",
]

# Optional — only if using cookies
# CORS_ALLOW_CREDENTIALS = True
```

Replace the production URLs with your actual deployed frontend domain.

---

## What NOT to Do in Production

```python
CORS_ALLOW_ALL_ORIGINS = True  # Avoid in production
```

This allows **any** website to call your API from a user's browser. Use only for quick local experiments.

---

## Troubleshooting

### Still seeing CORS errors?

1. **Check the browser error** — the blocked origin must match an entry in `CORS_ALLOWED_ORIGINS` exactly.
2. **Verify middleware order** — `CorsMiddleware` should be near the top of `MIDDLEWARE`.
3. **Reload PythonAnywhere** — settings changes require a web app reload.
4. **Check for duplicate middleware** — custom middleware or proxies may strip CORS headers.
5. **Preflight requests** — `django-cors-headers` handles OPTIONS automatically; ensure no other middleware blocks OPTIONS.

### Example browser error

```
Access to XMLHttpRequest at 'https://tandermis.pythonanywhere.com/auth/login'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Fix:** Add `"http://localhost:3000"` to `CORS_ALLOWED_ORIGINS`.

---

## Quick Checklist

- [ ] `pip install django-cors-headers`
- [ ] Add `"corsheaders"` to `INSTALLED_APPS`
- [ ] Add `CorsMiddleware` near the top of `MIDDLEWARE`
- [ ] Set `CORS_ALLOWED_ORIGINS` with your frontend URL(s)
- [ ] Restart Django / reload PythonAnywhere
- [ ] Test login or signup from the frontend

---

## References

- django-cors-headers: https://github.com/adamchainz/django-cors-headers
- MDN CORS documentation: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

*Document generated for Tandermis frontend/backend integration.*
