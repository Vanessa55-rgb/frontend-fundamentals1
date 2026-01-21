# SPA - Single Page Application

## ¿Qué es una SPA?

Una **Single Page Application** es una aplicación web que carga una sola página HTML y actualiza dinámicamente el contenido conforme el usuario interactúa, **sin recargar la página**.

```
Aplicación tradicional:
Click → Request → Nueva página → Recarga completa ❌

SPA:
Click → JavaScript → Actualiza vista → Sin recarga ✅
```

---

## Concepto Fundamental

### Aplicación Tradicional (Multi-Page)

```
Estructura:
├─ index.html        (Home)
├─ about.html        (About)
├─ contact.html      (Contact)
└─ products.html     (Products)

Navegación:
Usuario en index.html → Click "About" → Request about.html → Servidor envía about.html → Página se recarga
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<body>
  <nav>
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
  </nav>
  <h1>Home Page</h1>
</body>
</html>

<!-- about.html -->
<!DOCTYPE html>
<html>
<body>
  <nav>
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
  </nav>
  <h1>About Page</h1>
</body>
</html>
```

**Problema**: Recarga completa, pierde estado, header/footer se descargan de nuevo.

### SPA (Single Page)

```
Estructura:
├─ index.html        (Solo 1 archivo HTML)
├─ bundle.js         (Todo el JavaScript)
└─ styles.css

Navegación:
Usuario ve Home → Click "About" → JavaScript cambia contenido → Sin recarga
```

```html
<!-- index.html (UNA SOLA VEZ) -->
<!DOCTYPE html>
<html>
<head>
  <title>Mi SPA</title>
</head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>
```

```jsx
// bundle.js (React SPA)
function App() {
  const [page, setPage] = useState('home');
  
  return (
    <div>
      <nav>
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('about')}>About</button>
      </nav>
      
      {page === 'home' && <HomePage />}
      {page === 'about' && <AboutPage />}
    </div>
  );
}

function HomePage() {
  return <h1>Home Page</h1>;
}

function AboutPage() {
  return <h1>About Page</h1>;
}
```

---

## Arquitectura de una SPA

### Diagrama de Componentes

```
┌─────────────────────────────────────┐
│         index.html (Shell)          │
│  <div id="root"></div>              │
└─────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────┐
│         JavaScript Bundle           │
│  - React/Vue/Angular                │
│  - Router                           │
│  - State Management                 │
│  - Componentes                      │
└─────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────┐
│       Virtual DOM / Components      │
│  ┌─────────┬─────────┬─────────┐   │
│  │ Header  │  Main   │ Sidebar │   │
│  └─────────┴─────────┴─────────┘   │
└─────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────┐
│           DOM Real                  │
│  (Actualizado dinámicamente)        │
└─────────────────────────────────────┘
```

### Flujo de Datos

```
1. CARGA INICIAL
   ├─ Descargar index.html (5KB)
   ├─ Descargar bundle.js (200KB-2MB)
   ├─ Ejecutar JavaScript
   ├─ Renderizar UI inicial
   └─ App lista para interactuar

2. NAVEGACIÓN
   ├─ Usuario hace click
   ├─ JavaScript intercepta
   ├─ Actualiza estado
   ├─ Re-renderiza componentes
   └─ DOM actualizado (sin recarga)

3. DATOS
   ├─ Fetch API REST
   ├─ Actualiza estado local
   └─ UI refleja cambios
```

---

## Ejemplo Completo de SPA

### SPA con React Router

```jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// App principal (cargada UNA sola vez)
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Header persiste (no se recarga)
function Header() {
  const [cartCount, setCartCount] = useState(3);
  
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
      </nav>
    </header>
  );
}

// Componentes de páginas
function Home() {
  return (
    <div>
      <h1>Welcome Home</h1>
      <p>This is a SPA - No page reloads!</p>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Fetch sin recargar página
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts);
  }, []);
  
  return (
    <div>
      <h1>Products</h1>
      {products.map(p => (
        <Link to={`/products/${p.id}`} key={p.id}>
          {p.name}
        </Link>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct);
  }, [id]);
  
  if (!product) return <p>Loading...</p>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

// Footer persiste (no se recarga)
function Footer() {
  return <footer>© 2024 Mi SPA</footer>;
}
```

---

## Ventajas de las SPAs

### 1. Experiencia de Usuario Fluida

```jsx
// ✅ SPA: Transición suave
function App() {
  return (
    <div className="fade-transition">
      <Routes>
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </div>
  );
}

// Transiciones, animaciones, mantiene scroll position
```

### 2. Reduce Carga del Servidor

```
Multi-Page:
  Request 1: GET /home    → HTML completo (100KB)
  Request 2: GET /about   → HTML completo (95KB)
  Request 3: GET /contact → HTML completo (90KB)
  Total: 285KB HTML

SPA:
  Request 1: GET /        → HTML mínimo (5KB)
  Request 2: GET bundle.js → JS (200KB) [UNA VEZ]
  Request 3: GET /api/data → JSON (10KB)
  Request 4: GET /api/more → JSON (8KB)
  Total: 223KB (y cacheable)
```

### 3. Reutilización de Componentes

```jsx
// Header/Footer solo se renderizan UNA vez
<App>
  <Header /> {/* Persiste durante toda la sesión */}
  <main>
    {/* Solo esto cambia */}
  </main>
  <Footer /> {/* Persiste durante toda la sesión */}
</App>
```

### 4. Desarrollo Moderno

```jsx
// Componentes reutilizables
<ProductCard product={product} />

// Estado global
const { user, cart } = useContext(AppContext);

// Hot reload en desarrollo
// Cambias código → Se actualiza sin perder estado
```

---

## Desventajas de las SPAs

### 1. SEO Complejo

```html
<!-- Multi-Page: HTML completo para bots -->
<html>
  <title>Producto X - Tienda</title>
  <meta name="description" content="Compra el Producto X...">
  <body>
    <h1>Producto X</h1>
    <p>Descripción del producto...</p>
  </body>
</html>

<!-- SPA sin SSR: HTML vacío para bots -->
<html>
  <body>
    <div id="root"></div>
    <!-- Googlebot ve esto vacío -->
  </body>
</html>
```

**Solución**: SSR (Server-Side Rendering) con Next.js, Remix, etc.

### 2. Carga Inicial Lenta

```
Aplicación Tradicional:
  GET /page → 50ms → HTML listo → Usuario ve contenido
  
SPA:
  GET / → 50ms → HTML vacío
  GET bundle.js → 500ms → Descarga JS
  Ejecutar JS → 300ms
  Fetch datos → 200ms
  Render → 100ms
  Total: 1150ms hasta ver contenido
```

**Solución**: Code splitting, lazy loading

```jsx
// Dividir bundle en chunks pequeños
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
```

### 3. JavaScript Obligatorio

```
Multi-Page: Funciona sin JS
SPA: Requiere JS habilitado
```

Si JavaScript está deshabilitado o falla, la SPA no funciona.

### 4. Gestión de Estado Compleja

```jsx
// Estado global en toda la app
const [user, setUser] = useState(null);
const [cart, setCart] = useState([]);
const [notifications, setNotifications] = useState([]);
const [theme, setTheme] = useState('light');

// Sincronizar entre componentes
// Manejar datos de múltiples APIs
// Optimistic updates
// Cache management
```

### 5. Memoria y Performance

```javascript
// SPA mantiene todo en memoria
let componentes = [...]; // Crecen con el tiempo
let listeners = [...];    // Event listeners acumulados
let timers = [...];       // Setinterval sin limpiar

// Puede causar memory leaks si no se limpia
```

---

## Patrones de Arquitectura SPA

### 1. App Shell

```jsx
// Shell persistente
function AppShell() {
  return (
    <div className="app">
      <TopBar />
      <Sidebar />
      <main className="content">
        <Routes>
          {/* Contenido dinámico */}
        </Routes>
      </main>
      <BottomBar />
    </div>
  );
}
```

### 2. State Management

```jsx
// Context API
const AppContext = createContext();

function AppProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    cart: [],
    theme: 'light'
  });
  
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
}

// Redux
const store = createStore(rootReducer);

<Provider store={store}>
  <App />
</Provider>
```

### 3. Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### 4. Data Fetching

```jsx
// Custom hook para fetch
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);
  
  return { products, loading, error };
}

// Usar en componente
function ProductList() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <Spinner />;
  if (error) return <Error />;
  
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

---

## SPA vs Multi-Page vs Hybrid

### Tabla Comparativa

| Característica | SPA | Multi-Page | Hybrid (Next.js) |
|----------------|-----|------------|------------------|
| **Carga inicial** | ❌ Lenta | ✅ Rápida | ✅ Rápida |
| **Navegación** | ✅ Instantánea | ❌ Recarga | ✅ Instantánea |
| **SEO** | ❌ Complejo | ✅ Fácil | ✅ Fácil |
| **Estado** | ✅ Persiste | ❌ Se pierde | ✅ Persiste |
| **Costo servidor** | 💰 Bajo | 💰💰💰 Alto | 💰💰 Medio |
| **Complejidad** | 🔧🔧🔧 Alta | 🔧 Baja | 🔧🔧 Media |
| **JavaScript** | ⚠️ Obligatorio | ✅ Opcional | ✅ Progresivo |
| **Bundle size** | ❌ Grande | ✅ Pequeño | ⚡ Optimizado |

### Casos de Uso

**Usar SPA cuando:**
```
✅ Aplicaciones interactivas (Gmail, Trello, Figma)
✅ Dashboards y admin panels
✅ Aplicaciones internas de empresa
✅ Apps que requieren mucha interactividad
✅ SEO no es crítico
```

**Usar Multi-Page cuando:**
```
✅ Sitios de contenido estático
✅ Blogs simples
✅ Landing pages
✅ Sitios corporativos
✅ Máximo SEO requerido
```

**Usar Hybrid (SSR + SPA) cuando:**
```
✅ E-commerce
✅ Redes sociales
✅ Plataformas de contenido
✅ Aplicaciones empresariales públicas
✅ Necesitas SEO + interactividad
```

---

## Optimizaciones para SPAs

### 1. Code Splitting

```jsx
// Dividir por rutas
const routes = [
  { path: '/', component: lazy(() => import('./Home')) },
  { path: '/about', component: lazy(() => import('./About')) },
  { path: '/products', component: lazy(() => import('./Products')) }
];

// Dividir por features
const AdminPanel = lazy(() => import('./features/admin'));
const UserDashboard = lazy(() => import('./features/dashboard'));
```

### 2. Prefetching

```jsx
// Precargar componente en hover
<Link 
  to="/products"
  onMouseEnter={() => import('./pages/Products')}
>
  Products
</Link>

// React Router v6.4+
<Route 
  path="/products" 
  element={<Products />}
  loader={productsLoader} // Precarga datos
/>
```

### 3. Caching

```javascript
// Service Worker para cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Cache en memoria
const cache = new Map();

function fetchWithCache(url) {
  if (cache.has(url)) {
    return Promise.resolve(cache.get(url));
  }
  
  return fetch(url)
    .then(r => r.json())
    .then(data => {
      cache.set(url, data);
      return data;
    });
}
```

### 4. Virtual Scrolling

```jsx
// Para listas largas (miles de items)
import { FixedSizeList } from 'react-window';

function LongList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

## Frameworks SPA Populares

### React
```jsx
// Biblioteca, requiere router
import { BrowserRouter } from 'react-router-dom';
function App() {
  return <BrowserRouter>...</BrowserRouter>;
}
```

### Vue
```javascript
// Framework completo con router integrado
import { createApp } from 'vue';
import { createRouter } from 'vue-router';

const router = createRouter({...});
app.use(router);
```

### Angular
```typescript
// Framework completo, opinado
@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppModule { }
```

### Svelte
```svelte
<!-- Compilado, sin Virtual DOM -->
<script>
  import { Router, Route } from 'svelte-routing';
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/about" component={About} />
</Router>
```

---

## Recursos

- [SPA Best Practices](https://developer.mozilla.org/en-US/docs/Glossary/SPA)
- [React SPA Tutorial](https://reactjs.org/docs/create-a-new-react-app.html)
- [PWA + SPA](https://web.dev/progressive-web-apps/)
- [Performance Patterns](https://www.patterns.dev/)
