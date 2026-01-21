# Asincronismo en JavaScript

## ¿Qué es el Asincronismo?

El asincronismo permite que JavaScript ejecute operaciones que toman tiempo (como llamadas a APIs, lectura de archivos, timers) sin bloquear la ejecución del resto del código.

## ¿Por qué es importante?

JavaScript es **single-threaded** (un solo hilo de ejecución), lo que significa que solo puede ejecutar una tarea a la vez. Sin asincronismo, operaciones lentas bloquearían toda la aplicación.

```javascript
// ❌ Código síncrono bloqueante (ejemplo conceptual)
const datos = obtenerDatosDelServidor(); // Espera 5 segundos
console.log(datos); // Todo se detiene hasta que lleguen los datos
console.log("Siguiente línea"); // Se ejecuta después de 5 segundos

// ✅ Código asíncrono no bloqueante
obtenerDatosDelServidor((datos) => {
  console.log(datos);
});
console.log("Siguiente línea"); // Se ejecuta inmediatamente
```

---

## Event Loop y Call Stack

### Call Stack (Pila de Llamadas)

Estructura LIFO (Last In, First Out) que registra dónde estamos en la ejecución del programa.

```javascript
function tercera() {
  console.log("3");
}

function segunda() {
  tercera();
  console.log("2");
}

function primera() {
  segunda();
  console.log("1");
}

primera();

// Call Stack:
// primera() → segunda() → tercera() → log("3")
// primera() → segunda() → log("2")
// primera() → log("1")
```

### Event Loop

Mecanismo que coordina la ejecución de código síncrono y asíncrono.

**Componentes:**
1. **Call Stack**: Ejecución de funciones síncronas
2. **Web APIs**: Manejan operaciones asíncronas (setTimeout, fetch, etc.)
3. **Callback Queue**: Cola de callbacks listos para ejecutarse
4. **Event Loop**: Mueve callbacks del queue al stack cuando está vacío

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

console.log("3");

// Salida: 1, 3, 2
// Aunque setTimeout es de 0ms, el callback va a la queue
```

**Flujo:**
```
1. console.log("1") → Call Stack → Ejecuta
2. setTimeout() → Web API → Espera
3. console.log("3") → Call Stack → Ejecuta
4. Callback de setTimeout → Queue → Espera
5. Call Stack vacío → Event Loop → Mueve callback a stack
6. console.log("2") → Ejecuta
```

---

## 1. Callbacks

Los callbacks son funciones que se pasan como argumentos a otras funciones y se ejecutan después de completar una operación.

### Callbacks Básicos

```javascript
// Ejemplo simple
function procesarUsuario(id, callback) {
  console.log(`Procesando usuario ${id}...`);
  
  // Simular operación asíncrona
  setTimeout(() => {
    const usuario = { id: id, nombre: "Ana" };
    callback(usuario);
  }, 1000);
}

procesarUsuario(1, (usuario) => {
  console.log("Usuario recibido:", usuario);
});

console.log("Código después de procesarUsuario");

// Salida:
// Procesando usuario 1...
// Código después de procesarUsuario
// Usuario recibido: { id: 1, nombre: 'Ana' }
```

### Callbacks con Manejo de Errores

```javascript
function obtenerDatos(url, callback) {
  setTimeout(() => {
    const error = Math.random() > 0.5;
    
    if (error) {
      callback(new Error("Error al obtener datos"), null);
    } else {
      callback(null, { datos: "Información del servidor" });
    }
  }, 1000);
}

// Patrón error-first callback (Node.js style)
obtenerDatos("https://api.ejemplo.com", (error, datos) => {
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  console.log("Datos:", datos);
});
```

### Callback Hell (Pirámide de la Perdición)

Cuando se anidan múltiples callbacks, el código se vuelve difícil de leer y mantener.

```javascript
// ❌ Callback Hell
obtenerUsuario(1, (errorUsuario, usuario) => {
  if (errorUsuario) {
    console.error(errorUsuario);
    return;
  }
  
  obtenerPedidos(usuario.id, (errorPedidos, pedidos) => {
    if (errorPedidos) {
      console.error(errorPedidos);
      return;
    }
    
    obtenerDetallesPedido(pedidos[0].id, (errorDetalles, detalles) => {
      if (errorDetalles) {
        console.error(errorDetalles);
        return;
      }
      
      procesarPago(detalles, (errorPago, confirmacion) => {
        if (errorPago) {
          console.error(errorPago);
          return;
        }
        
        console.log("Pago procesado:", confirmacion);
      });
    });
  });
});
```

---

## 2. Promises (Promesas)

Las Promises son objetos que representan la eventual finalización (o falla) de una operación asíncrona.

### Estados de una Promise

1. **Pending (Pendiente)**: Estado inicial, ni cumplida ni rechazada
2. **Fulfilled (Cumplida)**: La operación se completó exitosamente
3. **Rejected (Rechazada)**: La operación falló

```javascript
const promesa = new Promise((resolve, reject) => {
  // Estado: Pending
  
  const exito = true;
  
  setTimeout(() => {
    if (exito) {
      resolve({ mensaje: "Operación exitosa" }); // Estado: Fulfilled
    } else {
      reject(new Error("Operación fallida"));    // Estado: Rejected
    }
  }, 1000);
});
```

### Creación de Promises

```javascript
// Promise básica
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id: id, nombre: "Juan", edad: 30 });
      } else {
        reject(new Error("ID inválido"));
      }
    }, 1000);
  });
}

// Uso
obtenerUsuario(1)
  .then(usuario => {
    console.log("Usuario:", usuario);
  })
  .catch(error => {
    console.error("Error:", error.message);
  });
```

### Métodos then, catch y finally

```javascript
obtenerUsuario(1)
  .then(usuario => {
    console.log("Usuario obtenido:", usuario);
    return usuario.id; // El valor retornado pasa al siguiente then
  })
  .then(id => {
    console.log("ID del usuario:", id);
    return obtenerPedidos(id); // Retorna otra Promise
  })
  .then(pedidos => {
    console.log("Pedidos:", pedidos);
  })
  .catch(error => {
    // Captura cualquier error en la cadena
    console.error("Error en algún punto:", error.message);
  })
  .finally(() => {
    // Se ejecuta siempre, haya éxito o error
    console.log("Operación finalizada");
  });
```

### Encadenamiento de Promises

```javascript
// ✅ Solución al Callback Hell usando Promises
function obtenerUsuario(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, nombre: "Ana" }), 500);
  });
}

function obtenerPedidos(usuarioId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([{ id: 1, producto: "Laptop" }]), 500);
  });
}

function obtenerDetallesPedido(pedidoId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: pedidoId, total: 1000 }), 500);
  });
}

function procesarPago(detalles) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ confirmacion: "PAGO-123" }), 500);
  });
}

// Encadenamiento limpio
obtenerUsuario(1)
  .then(usuario => {
    console.log("Usuario:", usuario);
    return obtenerPedidos(usuario.id);
  })
  .then(pedidos => {
    console.log("Pedidos:", pedidos);
    return obtenerDetallesPedido(pedidos[0].id);
  })
  .then(detalles => {
    console.log("Detalles:", detalles);
    return procesarPago(detalles);
  })
  .then(confirmacion => {
    console.log("Pago procesado:", confirmacion);
  })
  .catch(error => {
    console.error("Error:", error.message);
  });
```

### Métodos Estáticos de Promise

```javascript
// Promise.resolve() - Crea una Promise cumplida
const promesaResuelta = Promise.resolve("Valor inmediato");
promesaResuelta.then(valor => console.log(valor)); // "Valor inmediato"

// Promise.reject() - Crea una Promise rechazada
const promesaRechazada = Promise.reject(new Error("Error inmediato"));
promesaRechazada.catch(error => console.error(error.message));

// Promise.all() - Espera que todas se cumplan
const promesa1 = Promise.resolve(1);
const promesa2 = Promise.resolve(2);
const promesa3 = Promise.resolve(3);

Promise.all([promesa1, promesa2, promesa3])
  .then(resultados => {
    console.log(resultados); // [1, 2, 3]
  })
  .catch(error => {
    // Se ejecuta si CUALQUIERA falla
    console.error(error);
  });

// Ejemplo práctico
Promise.all([
  fetch('/api/usuarios'),
  fetch('/api/productos'),
  fetch('/api/pedidos')
])
  .then(respuestas => Promise.all(respuestas.map(r => r.json())))
  .then(([usuarios, productos, pedidos]) => {
    console.log({ usuarios, productos, pedidos });
  })
  .catch(error => console.error("Error en alguna petición:", error));

// Promise.allSettled() - Espera que todas terminen (éxito o fallo)
const promesas = [
  Promise.resolve("Éxito 1"),
  Promise.reject("Error 1"),
  Promise.resolve("Éxito 2")
];

Promise.allSettled(promesas)
  .then(resultados => {
    console.log(resultados);
    // [
    //   { status: 'fulfilled', value: 'Éxito 1' },
    //   { status: 'rejected', reason: 'Error 1' },
    //   { status: 'fulfilled', value: 'Éxito 2' }
    // ]
  });

// Promise.race() - Resuelve con la primera que termine
Promise.race([
  new Promise(resolve => setTimeout(() => resolve("Lento"), 2000)),
  new Promise(resolve => setTimeout(() => resolve("Rápido"), 100))
])
  .then(resultado => {
    console.log(resultado); // "Rápido"
  });

// Promise.any() - Resuelve con la primera que se cumpla
Promise.any([
  Promise.reject("Error 1"),
  new Promise(resolve => setTimeout(() => resolve("Éxito"), 100)),
  Promise.reject("Error 2")
])
  .then(resultado => {
    console.log(resultado); // "Éxito"
  })
  .catch(error => {
    // Solo si TODAS fallan
    console.error("Todas fallaron:", error);
  });
```

---

## 3. Async/Await

Sintaxis moderna que hace que el código asíncrono parezca síncrono, facilitando su lectura y escritura.

### Sintaxis Básica

```javascript
// Función async siempre retorna una Promise
async function obtenerDatos() {
  return "Datos"; // Equivalente a: return Promise.resolve("Datos")
}

obtenerDatos().then(datos => console.log(datos)); // "Datos"

// await pausa la ejecución hasta que la Promise se resuelva
async function procesarUsuario() {
  console.log("Inicio");
  
  const usuario = await obtenerUsuario(1); // Espera a que se resuelva
  console.log("Usuario:", usuario);
  
  const pedidos = await obtenerPedidos(usuario.id);
  console.log("Pedidos:", pedidos);
  
  console.log("Fin");
}

procesarUsuario();
```

### Manejo de Errores con try/catch

```javascript
async function procesarDatos() {
  try {
    const usuario = await obtenerUsuario(1);
    console.log("Usuario:", usuario);
    
    const pedidos = await obtenerPedidos(usuario.id);
    console.log("Pedidos:", pedidos);
    
    const detalles = await obtenerDetallesPedido(pedidos[0].id);
    console.log("Detalles:", detalles);
    
    return detalles;
  } catch (error) {
    console.error("Error en el proceso:", error.message);
    throw error; // Re-lanzar si es necesario
  } finally {
    console.log("Proceso finalizado");
  }
}

// Uso
procesarDatos()
  .then(resultado => console.log("Resultado final:", resultado))
  .catch(error => console.error("Error capturado:", error));
```

### Async/Await vs Promises

```javascript
// Con Promises
function obtenerUsuarioYPedidos(id) {
  return obtenerUsuario(id)
    .then(usuario => {
      return obtenerPedidos(usuario.id)
        .then(pedidos => {
          return { usuario, pedidos };
        });
    });
}

// Con Async/Await (más legible)
async function obtenerUsuarioYPedidos(id) {
  const usuario = await obtenerUsuario(id);
  const pedidos = await obtenerPedidos(usuario.id);
  return { usuario, pedidos };
}
```

### Ejecución en Paralelo

```javascript
// ❌ Secuencial (lento)
async function obtenerDatosSecuencial() {
  const usuarios = await fetch('/api/usuarios').then(r => r.json());   // 1 segundo
  const productos = await fetch('/api/productos').then(r => r.json()); // 1 segundo
  const pedidos = await fetch('/api/pedidos').then(r => r.json());     // 1 segundo
  // Total: 3 segundos
  
  return { usuarios, productos, pedidos };
}

// ✅ Paralelo (rápido)
async function obtenerDatosParalelo() {
  const [usuarios, productos, pedidos] = await Promise.all([
    fetch('/api/usuarios').then(r => r.json()),
    fetch('/api/productos').then(r => r.json()),
    fetch('/api/pedidos').then(r => r.json())
  ]);
  // Total: 1 segundo (el más lento)
  
  return { usuarios, productos, pedidos };
}
```

### Async/Await con forEach

```javascript
// ❌ NO funciona como esperamos
async function procesarUsuarios(ids) {
  const resultados = [];
  
  ids.forEach(async (id) => {
    const usuario = await obtenerUsuario(id);
    resultados.push(usuario);
  });
  
  console.log(resultados); // [] - Vacío porque forEach no espera
  return resultados;
}

// ✅ Opción 1: for...of
async function procesarUsuarios(ids) {
  const resultados = [];
  
  for (const id of ids) {
    const usuario = await obtenerUsuario(id);
    resultados.push(usuario);
  }
  
  return resultados;
}

// ✅ Opción 2: map + Promise.all (paralelo)
async function procesarUsuarios(ids) {
  const promesas = ids.map(id => obtenerUsuario(id));
  const resultados = await Promise.all(promesas);
  return resultados;
}

// ✅ Opción 3: reduce (secuencial con acumulador)
async function procesarUsuarios(ids) {
  return ids.reduce(async (promesaAcumulador, id) => {
    const acumulador = await promesaAcumulador;
    const usuario = await obtenerUsuario(id);
    return [...acumulador, usuario];
  }, Promise.resolve([]));
}
```

---

## 4. Fetch API

API moderna para hacer peticiones HTTP, retorna Promises.

### Sintaxis Básica

```javascript
// GET request
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Con async/await
async function obtenerUsuarios() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Métodos HTTP

```javascript
// POST - Crear
async function crearUsuario(usuario) {
  try {
    const response = await fetch('https://api.ejemplo.com/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
      },
      body: JSON.stringify(usuario)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// PUT - Actualizar completo
async function actualizarUsuario(id, usuario) {
  const response = await fetch(`https://api.ejemplo.com/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  return response.json();
}

// PATCH - Actualizar parcial
async function actualizarEmail(id, email) {
  const response = await fetch(`https://api.ejemplo.com/usuarios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
}

// DELETE - Eliminar
async function eliminarUsuario(id) {
  const response = await fetch(`https://api.ejemplo.com/usuarios/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
}
```

### Manejo Completo de Respuestas

```javascript
async function peticionCompleta() {
  try {
    const response = await fetch('https://api.ejemplo.com/datos');
    
    console.log('Status:', response.status);        // 200, 404, 500, etc.
    console.log('OK:', response.ok);                // true si status 200-299
    console.log('Headers:', response.headers);
    
    // Diferentes formas de procesar la respuesta
    const json = await response.json();      // JSON
    // const text = await response.text();   // Texto plano
    // const blob = await response.blob();   // Archivos binarios
    // const buffer = await response.arrayBuffer(); // Buffer
    
    return json;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Error de red:', error);
    } else {
      console.error('Error:', error);
    }
  }
}
```

### Timeout y AbortController

```javascript
// Implementar timeout
async function fetchConTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const signal = controller.signal;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout');
    } else {
      console.error('Error:', error);
    }
  }
}

// Cancelar peticiones manualmente
const controller = new AbortController();

fetch('https://api.ejemplo.com/datos', { signal: controller.signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Petición cancelada');
    }
  });

// Cancelar después de 2 segundos o al hacer clic en un botón
// setTimeout(() => controller.abort(), 2000);
// boton.addEventListener('click', () => controller.abort());
```

---

## 5. Ejemplos Prácticos Completos

### Sistema de Login con Validación

```javascript
async function login(email, password) {
  try {
    // Validar inputs
    if (!email || !password) {
      throw new Error('Email y password son requeridos');
    }
    
    // Hacer petición de login
    const response = await fetch('https://api.ejemplo.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Credenciales inválidas');
      }
      throw new Error('Error en el servidor');
    }
    
    const data = await response.json();
    
    // Guardar token
    localStorage.setItem('token', data.token);
    
    // Obtener datos del usuario
    const usuario = await obtenerPerfil(data.token);
    
    return { success: true, usuario };
  } catch (error) {
    console.error('Error en login:', error.message);
    return { success: false, error: error.message };
  }
}

async function obtenerPerfil(token) {
  const response = await fetch('https://api.ejemplo.com/perfil', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error('No se pudo obtener el perfil');
  }
  
  return response.json();
}

// Uso
login('usuario@ejemplo.com', 'password123')
  .then(resultado => {
    if (resultado.success) {
      console.log('Login exitoso:', resultado.usuario);
    } else {
      console.error('Login fallido:', resultado.error);
    }
  });
```

### Carga de Datos con Reintentos

```javascript
async function fetchConReintentos(url, opciones = {}, intentosMaximos = 3) {
  let ultimoError;
  
  for (let i = 0; i < intentosMaximos; i++) {
    try {
      console.log(`Intento ${i + 1} de ${intentosMaximos}`);
      
      const response = await fetch(url, opciones);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      ultimoError = error;
      console.error(`Intento ${i + 1} falló:`, error.message);
      
      // Esperar antes de reintentar (backoff exponencial)
      if (i < intentosMaximos - 1) {
        const tiempoEspera = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, tiempoEspera));
      }
    }
  }
  
  throw new Error(`Falló después de ${intentosMaximos} intentos: ${ultimoError.message}`);
}

// Uso
fetchConReintentos('https://api.ejemplo.com/datos')
  .then(datos => console.log('Datos obtenidos:', datos))
  .catch(error => console.error('Error final:', error.message));
```

### Sistema de Caché

```javascript
class CacheAPI {
  constructor(tiempoVida = 5 * 60 * 1000) { // 5 minutos por defecto
    this.cache = new Map();
    this.tiempoVida = tiempoVida;
  }
  
  async fetch(url, opciones = {}) {
    const clave = `${url}-${JSON.stringify(opciones)}`;
    const itemCache = this.cache.get(clave);
    
    // Verificar si hay caché válido
    if (itemCache && Date.now() - itemCache.timestamp < this.tiempoVida) {
      console.log('Retornando desde caché');
      return itemCache.data;
    }
    
    // Hacer petición
    console.log('Haciendo petición a la API');
    const response = await fetch(url, opciones);
    const data = await response.json();
    
    // Guardar en caché
    this.cache.set(clave, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }
  
  limpiar() {
    this.cache.clear();
  }
  
  eliminar(url, opciones = {}) {
    const clave = `${url}-${JSON.stringify(opciones)}`;
    this.cache.delete(clave);
  }
}

// Uso
const api = new CacheAPI(60000); // 1 minuto de caché

async function obtenerUsuarios() {
  return api.fetch('https://jsonplaceholder.typicode.com/users');
}

// Primera llamada: hace petición
obtenerUsuarios().then(usuarios => console.log(usuarios));

// Segunda llamada (antes de 1 minuto): retorna desde caché
setTimeout(() => {
  obtenerUsuarios().then(usuarios => console.log(usuarios));
}, 2000);
```

---

## 6. Patrones Comunes

### Loading States

```javascript
async function cargarDatos() {
  let loading = true;
  let error = null;
  let datos = null;
  
  try {
    console.log('Cargando...'); // loading = true
    
    const response = await fetch('https://api.ejemplo.com/datos');
    if (!response.ok) throw new Error('Error en la petición');
    
    datos = await response.json();
    error = null;
  } catch (err) {
    error = err.message;
    datos = null;
  } finally {
    loading = false;
    console.log('Carga finalizada'); // loading = false
  }
  
  return { datos, error, loading };
}
```

### Debouncing (Búsqueda con Retraso)

```javascript
function debounce(func, espera) {
  let timeout;
  return function ejecutar(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, espera);
  };
}

// Uso en búsqueda
const buscarUsuarios = debounce(async (termino) => {
  if (termino.length < 3) return;
  
  const response = await fetch(`/api/buscar?q=${termino}`);
  const resultados = await response.json();
  console.log(resultados);
}, 500);

// En un input de búsqueda
// input.addEventListener('input', (e) => buscarUsuarios(e.target.value));
```

### Polling (Consultas Periódicas)

```javascript
async function iniciarPolling(url, intervalo = 5000, callback) {
  let activo = true;
  
  async function consultar() {
    if (!activo) return;
    
    try {
      const response = await fetch(url);
      const datos = await response.json();
      callback(null, datos);
    } catch (error) {
      callback(error, null);
    }
    
    if (activo) {
      setTimeout(consultar, intervalo);
    }
  }
  
  consultar();
  
  // Retorna función para detener el polling
  return () => { activo = false; };
}

// Uso
const detenerPolling = await iniciarPolling(
  'https://api.ejemplo.com/estado',
  3000,
  (error, datos) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Estado actualizado:', datos);
    }
  }
);

// Detener después de 30 segundos
setTimeout(() => detenerPolling(), 30000);
```

---

## 7. Mejores Prácticas

```javascript
// ✅ 1. Siempre manejar errores
async function buenaPractica() {
  try {
    const datos = await fetch('/api/datos');
    return await datos.json();
  } catch (error) {
    console.error('Error:', error);
    throw error; // O manejar apropiadamente
  }
}

// ✅ 2. Usar Promise.all para operaciones paralelas
const [usuarios, productos] = await Promise.all([
  fetch('/api/usuarios').then(r => r.json()),
  fetch('/api/productos').then(r => r.json())
]);

// ✅ 3. Validar respuestas HTTP
const response = await fetch('/api/datos');
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

// ✅ 4. No usar async/await innecesariamente
// ❌ Malo
async function malo() {
  return await fetch('/api/datos');
}

// ✅ Bueno
function bueno() {
  return fetch('/api/datos');
}

// ✅ 5. Usar AbortController para cancelaciones
const controller = new AbortController();
fetch('/api/datos', { signal: controller.signal });

// ✅ 6. Implementar timeouts
async function conTimeout(promesa, ms) {
  return Promise.race([
    promesa,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
