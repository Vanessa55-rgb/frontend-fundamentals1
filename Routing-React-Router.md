# Enrutamiento Web: Cliente vs Servidor

## ¿Qué es el Enrutamiento?

El enrutamiento es el proceso de determinar qué contenido mostrar basándose en la URL.

```
/home → Muestra página Home
/about → Muestra página About
/users/123 → Muestra perfil del usuario 123
```

---

## Enrutamiento del Servidor (Tradicional)

### Cómo Funciona

Cada URL es manejada por el servidor, que responde con una página HTML completa.

```
Cliente: GET /about
         ↓
Servidor: Busca página /about
         ↓
Servidor: Envía about.html completo
         ↓
Cliente: Recarga página completa
```

### Ejemplo con Express.js

```javascript
import express from 'express';
const app = express();

// Cada ruta es una página diferente
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Home</h1>
        <a href="/about">About</a>
      </body>
    </html>
  `);
});

app.get('/about', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>About</h1>
        <a href="/">Home</a>
      </body>
    </html>
  `);
});

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`
    <html>
      <body>
        <h1>User ${userId}</h1>
      </body>
    </html>
  `);
});

app.listen(3000);
```

### Comportamiento

```
Click en link → Request al servidor → Servidor responde → Página se recarga
|______________|____________________|__________________|_______________|
     ❌           ❌ Lento              ❌ Carga entera    ❌ Parpadeo
```

### Ventajas del Enrutamiento del Servidor

- ✅ **SEO**: HTML completo en cada página
- ✅ **Simple**: No requiere JavaScript
- ✅ **Funciona sin JS**: Accesible para todos
- ✅ **Historial del navegador**: Back/Forward funcionan nativamente

### Desventajas

- ❌ **Recarga completa**: Pierde estado, parpadeo
- ❌ **Lento**: Nueva request por cada navegación
- ❌ **No es fluido**: Experiencia poco app-like
- ❌ **Desperdicia recursos**: Descarga header/footer en cada página

---

## Enrutamiento del Cliente (SPA)

### Cómo Funciona

El navegador maneja las rutas con JavaScript, sin recargar la página.

```
Cliente: Click en /about
         ↓
JavaScript: Intercepta navegación
         ↓
JavaScript: Actualiza URL (History API)
         ↓
JavaScript: Renderiza componente About
         ↓
Cliente: Ve nueva página (sin recarga)
```

### History API

La base del enrutamiento del cliente:

```javascript
// Cambiar URL sin recargar
history.pushState({ page: 'about' }, 'About', '/about');

// Detectar cambios de URL
window.addEventListener('popstate', (event) => {
  console.log('URL cambió a:', location.pathname);
  // Renderizar componente correspondiente
});

// Ir atrás/adelante
history.back();
history.forward();
```

### Implementación Manual

```javascript
// Router básico
class Router {
  constructor() {
    this.routes = {};
    window.addEventListener('popstate', () => this.handleRoute());
  }
  
  // Registrar ruta
  route(path, handler) {
    this.routes[path] = handler;
  }
  
  // Navegar a ruta
  navigate(path) {
    history.pushState(null, '', path);
    this.handleRoute();
  }
  
  // Manejar ruta actual
  handleRoute() {
    const path = location.pathname;
    const handler = this.routes[path];
    
    if (handler) {
      handler();
    } else {
      console.log('404: Ruta no encontrada');
    }
  }
  
  // Iniciar
  init() {
    // Interceptar clicks en links
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
    
    this.handleRoute();
  }
}

// Uso
const router = new Router();

router.route('/', () => {
  document.getElementById('app').innerHTML = '<h1>Home</h1>';
});

router.route('/about', () => {
  document.getElementById('app').innerHTML = '<h1>About</h1>';
});

router.init();
```

### Ventajas del Enrutamiento del Cliente

- ✅ **Sin recargas**: Navegación instantánea
- ✅ **Mantiene estado**: Variables, scroll, etc.
- ✅ **Fluido**: Transiciones y animaciones
- ✅ **Eficiente**: Solo carga datos necesarios

### Desventajas

- ❌ **Requiere JS**: No funciona sin JavaScript
- ❌ **SEO complejo**: Requiere SSR o pre-rendering
- ❌ **Bundle grande**: Todo el código cargado al inicio
- ❌ **Primera carga lenta**: Debe descargar todo el JS

---

## React Router

La librería estándar para enrutamiento en React.

### Instalación

```bash
npm install react-router-dom
```

### Configuración Básica

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function NotFound() {
  return <h1>404 - Página no encontrada</h1>;
}
```

### Rutas Dinámicas

```jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(setUser);
  }, [id]);
  
  if (!user) return <p>Cargando...</p>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

// Uso: /users/123 → id = "123"
```

### Navegación Programática

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    
    if (success) {
      navigate('/dashboard'); // Redirigir
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" />
      <input type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Rutas Anidadas

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />}>
          <Route index element={<ProductList />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <nav>...</nav>
      <Outlet /> {/* Renderiza rutas hijas */}
      <footer>...</footer>
    </div>
  );
}

function Products() {
  return (
    <div>
      <h1>Products</h1>
      <Outlet /> {/* ProductList o ProductDetail */}
    </div>
  );
}
```

### Protected Routes (Rutas Protegidas)

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Uso
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Lazy Loading (Code Splitting)

```jsx
import { lazy, Suspense } from 'react';

// Cargar componentes solo cuando se necesitan
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Search Params (Query Strings)

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q'); // /search?q=react
  const page = searchParams.get('page'); // /search?q=react&page=2
  
  const handleSearch = (term) => {
    setSearchParams({ q: term, page: 1 });
  };
  
  return (
    <div>
      <input 
        value={query || ''}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <p>Buscando: {query}</p>
      <p>Página: {page || 1}</p>
    </div>
  );
}
```

### Location y Navigate

```jsx
import { useLocation, useNavigate } from 'react-router-dom';

function Component() {
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log(location.pathname); // /users/123
  console.log(location.search);   // ?tab=posts
  console.log(location.hash);     // #comments
  console.log(location.state);    // Estado pasado
  
  // Navegar con estado
  navigate('/profile', { 
    state: { from: location.pathname }
  });
  
  // Navegar atrás
  navigate(-1);
  
  // Reemplazar en historial
  navigate('/home', { replace: true });
}
```

---

## Configuración del Servidor

### Problema: 404 en Refresh

```
Usuario en /about → Refresh → Servidor busca /about.html → 404
```

El servidor no conoce las rutas del cliente, necesita redirigir todo al index.html.

### Solución en diferentes servidores

#### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Express.js

```javascript
import express from 'express';
import path from 'path';

const app = express();

// Servir archivos estáticos
app.use(express.static('build'));

// Todas las rutas → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

#### Vercel (vercel.json)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Netlify (_redirects)

```
/*  /index.html  200
```

---

## React Router vs Next.js Router

### React Router (Client-side)

```jsx
// Enrutamiento manual
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
```

### Next.js (File-based)

```
pages/
├─ index.jsx        → /
├─ about.jsx        → /about
├─ users/
│  ├─ index.jsx     → /users
│  └─ [id].jsx      → /users/:id
└─ api/
   └─ hello.js      → /api/hello
```

```jsx
// pages/users/[id].jsx
export default function UserPage() {
  const router = useRouter();
  const { id } = router.query;
  
  return <h1>User {id}</h1>;
}
```

### Comparación

| Característica | React Router | Next.js Router |
|----------------|--------------|----------------|
| **Configuración** | Manual | Automática (file-based) |
| **Renderizado** | Solo cliente | Cliente + Servidor |
| **SEO** | Requiere SSR extra | Built-in SSR/SSG |
| **API Routes** | No | Sí |
| **Flexibilidad** | Alta | Media |
| **Curva aprendizaje** | Media | Baja |

---

## Patrones Avanzados

### Breadcrumbs

```jsx
import { useLocation, Link } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  return (
    <nav>
      <Link to="/">Home</Link>
      {pathnames.map((name, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return isLast ? (
          <span key={to}> / {name}</span>
        ) : (
          <span key={to}> / <Link to={to}>{name}</Link></span>
        );
      })}
    </nav>
  );
}

// /products/123 → Home / products / 123
```

### Route Guards

```jsx
function AdminRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}
```

### Scroll Restoration

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// En App
<BrowserRouter>
  <ScrollToTop />
  <Routes>...</Routes>
</BrowserRouter>
```

---

## Mejores Prácticas

### 1. Estructura de Rutas Clara

```jsx
// ✅ Bueno: Rutas organizadas
const routes = {
  home: '/',
  about: '/about',
  users: {
    list: '/users',
    detail: (id) => `/users/${id}`,
    edit: (id) => `/users/${id}/edit`
  }
};

<Link to={routes.users.detail(123)}>Ver usuario</Link>
```

### 2. Lazy Loading por Ruta

```jsx
// ✅ Cargar solo cuando se necesita
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

// ❌ Cargar todo de una vez
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
```

### 3. Error Boundaries por Ruta

```jsx
<Route 
  path="/dashboard" 
  element={
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  }
/>
```

---

## Recursos

- [React Router Docs](https://reactrouter.com/)
- [Next.js Routing](https://nextjs.org/docs/routing/introduction)
- [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [SPA Routing Patterns](https://www.patterns.dev/posts/client-side-routing/)
