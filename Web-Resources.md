# Recursos Web - Estáticos vs Renderizados

## ¿Qué son los Recursos Web?

Los recursos web son todos los archivos que componen una aplicación web: HTML, CSS, JavaScript, imágenes, fuentes, videos, etc.

---

## Recursos Estáticos

### Definición

Recursos que **no cambian** en el servidor. Se sirven tal cual están almacenados.

```
Cliente solicita → Servidor envía archivo → Cliente recibe archivo idéntico
```

### Ejemplos de Recursos Estáticos

```
public/
├── images/
│   ├── logo.png          # Imagen estática
│   └── hero.jpg
├── fonts/
│   └── Roboto.woff2      # Fuente estática
├── videos/
│   └── intro.mp4         # Video estático
├── styles/
│   └── global.css        # CSS estático
└── favicon.ico           # Favicon estático
```

### Servir Recursos Estáticos

```javascript
// Express.js
import express from 'express';
const app = express();

// Servir carpeta public como estática
app.use(express.static('public'));

// Ahora accesible en:
// http://localhost:3000/images/logo.png
// http://localhost:3000/styles/global.css
```

### En React (Create React App)

```jsx
// public/logo.png se sirve estáticamente

function App() {
  return (
    <div>
      {/* Acceso directo desde public/ */}
      <img src="/logo.png" alt="Logo" />
      
      {/* También con process.env.PUBLIC_URL */}
      <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
    </div>
  );
}
```

### Ventajas

- ✅ **Rápido**: No requiere procesamiento
- ✅ **Cacheable**: Fácil de cachear en CDN
- ✅ **Simple**: No requiere lógica del servidor
- ✅ **Económico**: Menor costo de hosting

### Desventajas

- ❌ **No personalizable**: Mismo contenido para todos
- ❌ **No dinámico**: No puede cambiar según el usuario
- ❌ **Limitado**: No puede conectarse a bases de datos

---

## Recursos Renderizados (Dinámicos)

### Definición

Recursos que se **generan en tiempo de ejecución** en el servidor según la solicitud.

```
Cliente solicita → Servidor procesa → Genera HTML → Cliente recibe HTML único
```

### Tipos de Renderizado

#### 1. Server-Side Rendering (SSR)

HTML generado en cada petición.

```javascript
// Next.js - SSR
export async function getServerSideProps(context) {
  const userId = context.params.id;
  
  // Llamada a DB en cada request
  const user = await db.users.findById(userId);
  
  return {
    props: { user }
  };
}

export default function UserPage({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Última visita: {new Date().toLocaleString()}</p>
    </div>
  );
}
```

#### 2. Static Site Generation (SSG)

HTML generado en tiempo de build.

```javascript
// Next.js - SSG
export async function getStaticProps() {
  // Llamada a API en build time
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return {
    props: { posts },
    revalidate: 60 // ISR: regenerar cada 60 segundos
  };
}

export default function BlogPage({ posts }) {
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

#### 3. Client-Side Rendering (CSR)

HTML generado en el navegador.

```javascript
// React - CSR
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch en el cliente
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <p>Cargando...</p>;
  
  return (
    <div>
      <h1>Bienvenido {user.name}</h1>
      <p>Último login: {user.lastLogin}</p>
    </div>
  );
}
```

---

## Comparación Detallada

### Recursos Estáticos

```html
<!-- index.html - Siempre igual para todos -->
<!DOCTYPE html>
<html>
<head>
  <title>Mi Sitio</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h1>Bienvenido</h1>
  <p>Este contenido nunca cambia</p>
  <img src="/logo.png" alt="Logo">
</body>
</html>
```

**Características:**
- Mismo HTML para todos los usuarios
- Carga instantánea desde CDN
- No requiere servidor dinámico
- Ideal para landing pages, documentación

### Recursos Renderizados

```javascript
// user-dashboard.js - Diferente para cada usuario
app.get('/dashboard', async (req, res) => {
  const userId = req.session.userId;
  const user = await db.users.findById(userId);
  const posts = await db.posts.findByUser(userId);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dashboard - ${user.name}</title>
    </head>
    <body>
      <h1>Hola ${user.name}</h1>
      <p>Tienes ${posts.length} posts</p>
      <ul>
        ${posts.map(p => `<li>${p.title}</li>`).join('')}
      </ul>
    </body>
    </html>
  `;
  
  res.send(html);
});
```

**Características:**
- HTML personalizado por usuario
- Requiere servidor activo
- Puede consultar bases de datos
- Ideal para dashboards, perfiles, feeds

---

## Estrategias Híbridas

### 1. Estático + API (Jamstack)

```jsx
// Página estática que consume API dinámica
function ProductPage() {
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    // Contenido estático de la página
    // Reviews dinámicas desde API
    fetch('/api/reviews').then(r => r.json()).then(setReviews);
  }, []);
  
  return (
    <div>
      {/* Contenido estático */}
      <h1>Producto X</h1>
      <img src="/product.jpg" alt="Producto" />
      <p>Descripción del producto...</p>
      
      {/* Contenido dinámico */}
      <div className="reviews">
        {reviews.map(r => (
          <div key={r.id}>{r.comment}</div>
        ))}
      </div>
    </div>
  );
}
```

### 2. ISR (Incremental Static Regeneration)

```javascript
// Next.js - Lo mejor de ambos mundos
export async function getStaticProps() {
  const data = await fetchData();
  
  return {
    props: { data },
    revalidate: 10 // Regenerar cada 10 segundos
  };
}

// Primera petición: HTML estático pre-generado
// Después de 10s: Regenera en background
// Siguientes usuarios: Reciben la versión actualizada
```

---

## Casos de Uso

### Usar Recursos Estáticos cuando:

```
✅ Landing pages
✅ Sitios de marketing
✅ Documentación
✅ Blogs (sin comentarios dinámicos)
✅ Portfolios
✅ Sitios de empresa
✅ Assets (imágenes, CSS, JS, fuentes)
```

**Ejemplo: Landing Page**
```html
<!-- Todo estático -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <img src="/hero.jpg" alt="Hero">
  <h1>Nuestro Producto</h1>
  <p>Descripción...</p>
  <button onclick="location.href='/signup'">Registrarse</button>
</body>
</html>
```

### Usar Recursos Renderizados cuando:

```
✅ Dashboards de usuario
✅ Feeds personalizados
✅ E-commerce (carritos, checkouts)
✅ Redes sociales
✅ Plataformas de contenido dinámico
✅ Sistemas de gestión (CMS, CRM)
✅ Aplicaciones con autenticación
```

**Ejemplo: Dashboard**
```jsx
// Renderizado dinámico por usuario
function Dashboard({ userId }) {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}/stats`)
      .then(r => r.json())
      .then(setStats);
  }, [userId]);
  
  return (
    <div>
      <h1>Hola {stats?.name}</h1>
      <p>Ventas hoy: ${stats?.todaySales}</p>
      <p>Clientes nuevos: {stats?.newCustomers}</p>
    </div>
  );
}
```

---

## Optimización de Recursos

### Imágenes

```jsx
// ❌ Imagen estática grande
<img src="/hero.jpg" alt="Hero" /> // 5MB

// ✅ Imagen optimizada
<img 
  src="/hero-optimized.webp" 
  srcSet="
    /hero-small.webp 400w,
    /hero-medium.webp 800w,
    /hero-large.webp 1200w
  "
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  alt="Hero"
  loading="lazy"
/>

// ✅ Next.js Image (automático)
import Image from 'next/image';

<Image 
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero"
  priority // o loading="lazy"
/>
```

### CSS y JavaScript

```html
<!-- ❌ Bloquea renderizado -->
<link rel="stylesheet" href="/styles.css">
<script src="/app.js"></script>

<!-- ✅ No crítico: async/defer -->
<link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'">
<script src="/app.js" defer></script>

<!-- ✅ Inline crítico -->
<style>
  /* CSS crítico inline */
  .hero { background: blue; }
</style>
```

### Fonts

```css
/* ❌ Bloquea renderizado */
@import url('https://fonts.googleapis.com/css2?family=Roboto');

/* ✅ Preload + font-display */
/* En HTML: */
<link rel="preload" href="/fonts/Roboto.woff2" as="font" type="font/woff2" crossorigin>

/* En CSS: */
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/Roboto.woff2') format('woff2');
  font-display: swap; /* Muestra fallback mientras carga */
}
```

---

## CDN (Content Delivery Network)

### ¿Qué es un CDN?

Red de servidores distribuidos geográficamente que cachean recursos estáticos.

```
Usuario en España → Servidor CDN en Madrid (10ms)
    vs
Usuario en España → Servidor origen en USA (200ms)
```

### Configuración CDN

```javascript
// Next.js con CDN
module.exports = {
  images: {
    domains: ['cdn.example.com'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.example.com' 
    : '',
};

// Ahora todos los assets se sirven desde CDN
// /logo.png → https://cdn.example.com/logo.png
```

### Headers de Cache

```javascript
// Express - Configurar cache
app.use('/static', express.static('public', {
  maxAge: '1y', // 1 año
  immutable: true
}));

// Headers resultantes:
// Cache-Control: public, max-age=31536000, immutable
```

---

## Tabla Comparativa Final

| Aspecto | Estático | Renderizado SSR | Renderizado CSR |
|---------|----------|-----------------|-----------------|
| **Velocidad inicial** | ⚡⚡⚡ Muy rápido | ⚡⚡ Rápido | ⚡ Lento |
| **SEO** | ✅ Excelente | ✅ Excelente | ❌ Limitado |
| **Personalización** | ❌ No | ✅ Sí | ✅ Sí |
| **Costo servidor** | 💰 Muy bajo | 💰💰💰 Alto | 💰💰 Medio |
| **Escalabilidad** | ✅ Excelente | ❌ Limitada | ✅ Buena |
| **Tiempo de desarrollo** | ⏱️ Rápido | ⏱️⏱️ Medio | ⏱️⏱️ Medio |
| **Interactividad** | ❌ Limitada | ✅ Full | ✅ Full |

---

## Recursos

- [Jamstack](https://jamstack.org/)
- [Next.js Static vs SSR](https://nextjs.org/docs/basic-features/pages)
- [Web.dev - Performance](https://web.dev/performance/)
- [CDN Comparison](https://www.cdnperf.com/)
