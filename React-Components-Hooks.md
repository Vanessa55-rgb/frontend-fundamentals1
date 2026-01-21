# React - Componentes, Ciclo de Vida y Hooks

## ¿Qué es un Componente en React?

Un componente es una pieza reutilizable de UI que encapsula su propia lógica, estado y presentación. Los componentes son los bloques de construcción fundamentales en React.

```javascript
// Componente simple
function Saludo() {
  return <h1>¡Hola Mundo!</h1>;
}

// Componente con props
function SaludoPersonalizado({ nombre }) {
  return <h1>¡Hola {nombre}!</h1>;
}
```

---

## Tipos de Componentes

### 1. Componentes Funcionales (Modernos)

```javascript
// Componente funcional básico
function Boton({ texto, onClick }) {
  return <button onClick={onClick}>{texto}</button>;
}

// Con desestructuración y valores por defecto
function Tarjeta({ 
  titulo = "Sin título", 
  descripcion, 
  imagen 
}) {
  return (
    <div className="tarjeta">
      {imagen && <img src={imagen} alt={titulo} />}
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
    </div>
  );
}

// Con children
function Contenedor({ children, className }) {
  return (
    <div className={`contenedor ${className}`}>
      {children}
    </div>
  );
}

// Uso
<Contenedor className="principal">
  <Tarjeta titulo="Mi Tarjeta" descripcion="Descripción" />
</Contenedor>
```

### 2. Componentes de Clase (Legacy)

```javascript
import React, { Component } from 'react';

class Contador extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  incrementar = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>Contador: {this.state.count}</p>
        <button onClick={this.incrementar}>Incrementar</button>
      </div>
    );
  }
}
```

---

## Ciclo de Vida en Componentes de Clase

### Fases del Ciclo de Vida

```javascript
class ComponenteCicloVida extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
    console.log('1. Constructor');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('2. getDerivedStateFromProps');
    // Retorna objeto para actualizar state o null
    return null;
  }

  componentDidMount() {
    console.log('3. componentDidMount - Montado');
    // Llamadas API, suscripciones, timers
    fetch('/api/data')
      .then(res => res.json())
      .then(data => this.setState({ data }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('4. shouldComponentUpdate');
    // Retorna true/false para optimizar renders
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('5. getSnapshotBeforeUpdate');
    // Captura info del DOM antes de actualizar
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('6. componentDidUpdate - Actualizado');
    // Operaciones después de actualizar
  }

  componentWillUnmount() {
    console.log('7. componentWillUnmount - Desmontado');
    // Limpieza: cancelar timers, suscripciones
  }

  render() {
    console.log('Render');
    return <div>{this.state.data}</div>;
  }
}
```

### Diagrama del Ciclo de Vida

```
Montaje:
  constructor → getDerivedStateFromProps → render → componentDidMount

Actualización:
  getDerivedStateFromProps → shouldComponentUpdate → render 
  → getSnapshotBeforeUpdate → componentDidUpdate

Desmontaje:
  componentWillUnmount
```

---

## Hooks: El Equivalente Moderno

Los Hooks son funciones que permiten usar estado y otras características de React en componentes funcionales.

### useState - Estado Local

```javascript
import { useState } from 'react';

// Ejemplo básico
function Contador() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Múltiples estados
function Formulario() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ nombre, email, edad });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="number"
        value={edad}
        onChange={(e) => setEdad(Number(e.target.value))}
        placeholder="Edad"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}

// Estado con objetos
function PerfilUsuario() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    edad: 0
  });

  const actualizarCampo = (campo, valor) => {
    setUsuario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  return (
    <div>
      <input 
        value={usuario.nombre}
        onChange={(e) => actualizarCampo('nombre', e.target.value)}
      />
      <input 
        value={usuario.apellido}
        onChange={(e) => actualizarCampo('apellido', e.target.value)}
      />
    </div>
  );
}

// Lazy initialization (costosa)
function ComponentePesado() {
  // ❌ Se ejecuta en cada render
  const [state, setState] = useState(calcularValorInicial());

  // ✅ Solo se ejecuta una vez
  const [state, setState] = useState(() => calcularValorInicial());

  return <div>{state}</div>;
}

function calcularValorInicial() {
  console.log('Cálculo costoso...');
  return Array(1000).fill(0).reduce((a, b) => a + b, 0);
}
```

### useEffect - Efectos Secundarios

`useEffect` reemplaza `componentDidMount`, `componentDidUpdate` y `componentWillUnmount`.

```javascript
import { useState, useEffect } from 'react';

// Ejemplo básico: se ejecuta después de cada render
function Ejemplo1() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Efecto ejecutado');
    document.title = `Clicks: ${count}`;
  });

  return <button onClick={() => setCount(count + 1)}>Click</button>;
}

// Con array de dependencias: se ejecuta solo cuando cambian
function Ejemplo2() {
  const [count, setCount] = useState(0);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    console.log('Count cambió');
    document.title = `Clicks: ${count}`;
  }, [count]); // Solo se ejecuta cuando count cambia

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <input 
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
    </div>
  );
}

// Array vacío: se ejecuta una sola vez (componentDidMount)
function Ejemplo3() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setLoading(false);
      });
  }, []); // Solo al montar

  if (loading) return <p>Cargando...</p>;

  return (
    <ul>
      {usuarios.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Con cleanup (componentWillUnmount)
function Temporizador() {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSegundos(s => s + 1);
    }, 1000);

    // Cleanup: se ejecuta al desmontar o antes de re-ejecutar
    return () => {
      clearInterval(interval);
      console.log('Limpieza del intervalo');
    };
  }, []);

  return <p>Segundos: {segundos}</p>;
}

// Múltiples efectos para separar lógica
function UsuarioPerfil({ userId }) {
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState([]);

  // Efecto 1: Cargar usuario
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUsuario);
  }, [userId]);

  // Efecto 2: Cargar posts
  useEffect(() => {
    fetch(`/api/posts?userId=${userId}`)
      .then(res => res.json())
      .then(setPosts);
  }, [userId]);

  // Efecto 3: Actualizar título
  useEffect(() => {
    if (usuario) {
      document.title = usuario.name;
    }
  }, [usuario]);

  return (
    <div>
      <h1>{usuario?.name}</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

// WebSocket con cleanup
function Chat({ roomId }) {
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3000/${roomId}`);

    socket.onmessage = (event) => {
      setMensajes(prev => [...prev, JSON.parse(event.data)]);
    };

    return () => {
      socket.close();
      console.log('Socket cerrado');
    };
  }, [roomId]);

  return (
    <div>
      {mensajes.map((msg, i) => (
        <p key={i}>{msg.text}</p>
      ))}
    </div>
  );
}
```

### useContext - Contexto Global

```javascript
import { createContext, useContext, useState } from 'react';

// Crear contexto
const TemaContext = createContext();

// Provider
function TemaProvider({ children }) {
  const [tema, setTema] = useState('claro');

  const toggleTema = () => {
    setTema(prev => prev === 'claro' ? 'oscuro' : 'claro');
  };

  return (
    <TemaContext.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContext.Provider>
  );
}

// Consumir contexto
function Boton() {
  const { tema, toggleTema } = useContext(TemaContext);

  return (
    <button 
      onClick={toggleTema}
      style={{ 
        background: tema === 'claro' ? '#fff' : '#333',
        color: tema === 'claro' ? '#000' : '#fff'
      }}
    >
      Cambiar a tema {tema === 'claro' ? 'oscuro' : 'claro'}
    </button>
  );
}

// App
function App() {
  return (
    <TemaProvider>
      <Boton />
    </TemaProvider>
  );
}

// Contexto de autenticación
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const login = async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setUsuario(data.usuario);
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function PerfilUsuario() {
  const { usuario, logout } = useContext(AuthContext);

  if (!usuario) return <p>No autenticado</p>;

  return (
    <div>
      <h1>{usuario.nombre}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

### useReducer - Estado Complejo

```javascript
import { useReducer } from 'react';

// Reducer
function contadorReducer(state, action) {
  switch (action.type) {
    case 'incrementar':
      return { count: state.count + 1 };
    case 'decrementar':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'setValor':
      return { count: action.payload };
    default:
      return state;
  }
}

// Componente
function Contador() {
  const [state, dispatch] = useReducer(contadorReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'incrementar' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrementar' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'setValor', payload: 100 })}>
        Set 100
      </button>
    </div>
  );
}

// Ejemplo complejo: Carrito de compras
const initialState = {
  items: [],
  total: 0
};

function carritoReducer(state, action) {
  switch (action.type) {
    case 'agregar':
      const itemExistente = state.items.find(i => i.id === action.payload.id);
      
      if (itemExistente) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, cantidad: i.cantidad + 1 }
              : i
          ),
          total: state.total + action.payload.precio
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, cantidad: 1 }],
        total: state.total + action.payload.precio
      };

    case 'remover':
      const item = state.items.find(i => i.id === action.payload);
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item.precio * item.cantidad)
      };

    case 'actualizar_cantidad':
      const itemActual = state.items.find(i => i.id === action.payload.id);
      const diferencia = action.payload.cantidad - itemActual.cantidad;

      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, cantidad: action.payload.cantidad }
            : i
        ),
        total: state.total + (itemActual.precio * diferencia)
      };

    case 'limpiar':
      return initialState;

    default:
      return state;
  }
}

function Carrito() {
  const [state, dispatch] = useReducer(carritoReducer, initialState);

  const agregarProducto = (producto) => {
    dispatch({ type: 'agregar', payload: producto });
  };

  return (
    <div>
      <h2>Carrito (${state.total.toFixed(2)})</h2>
      <ul>
        {state.items.map(item => (
          <li key={item.id}>
            {item.nombre} x {item.cantidad} = ${(item.precio * item.cantidad).toFixed(2)}
            <button onClick={() => dispatch({ type: 'remover', payload: item.id })}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch({ type: 'limpiar' })}>
        Vaciar carrito
      </button>
    </div>
  );
}
```

### useRef - Referencias DOM y Valores Mutables

```javascript
import { useRef, useEffect } from 'react';

// Acceder a elementos DOM
function InputFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}

// Guardar valores sin causar re-renders
function Temporizador() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const iniciar = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const detener = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={iniciar}>Iniciar</button>
      <button onClick={detener}>Detener</button>
    </div>
  );
}

// Guardar valor anterior
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

function Contador() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Actual: {count}</p>
      <p>Anterior: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// Medir elementos
function MedirElemento() {
  const divRef = useRef(null);
  const [dimensiones, setDimensiones] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect();
      setDimensiones({ width, height });
    }
  }, []);

  return (
    <div ref={divRef}>
      Ancho: {dimensiones.width}px, Alto: {dimensiones.height}px
    </div>
  );
}
```

### useMemo - Memoización de Valores

```javascript
import { useMemo, useState } from 'react';

// Cálculo costoso
function ListaFiltrada({ items, filtro }) {
  // ❌ Sin useMemo: se calcula en cada render
  const itemsFiltrados = items.filter(item => 
    item.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  // ✅ Con useMemo: solo se calcula cuando items o filtro cambian
  const itemsFiltrados = useMemo(() => {
    console.log('Filtrando...');
    return items.filter(item => 
      item.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [items, filtro]);

  return (
    <ul>
      {itemsFiltrados.map(item => (
        <li key={item.id}>{item.nombre}</li>
      ))}
    </ul>
  );
}

// Ordenamiento costoso
function TablaOrdenada({ data, columna }) {
  const datosOrdenados = useMemo(() => {
    console.log('Ordenando...');
    return [...data].sort((a, b) => {
      if (a[columna] < b[columna]) return -1;
      if (a[columna] > b[columna]) return 1;
      return 0;
    });
  }, [data, columna]);

  return (
    <table>
      <tbody>
        {datosOrdenados.map(row => (
          <tr key={row.id}>
            <td>{row.nombre}</td>
            <td>{row.valor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Evitar re-creación de objetos
function Formulario() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  // ❌ Se crea nuevo objeto en cada render
  const usuario = { nombre, email };

  // ✅ Mismo objeto si nombre y email no cambian
  const usuario = useMemo(() => ({ nombre, email }), [nombre, email]);

  return <PerfilUsuario usuario={usuario} />;
}
```

### useCallback - Memoización de Funciones

```javascript
import { useCallback, useState } from 'react';

// Evitar re-creación de funciones
function ListaTareas() {
  const [tareas, setTareas] = useState([]);

  // ❌ Se crea nueva función en cada render
  const agregarTarea = (texto) => {
    setTareas([...tareas, { id: Date.now(), texto }]);
  };

  // ✅ Misma función si tareas no cambia
  const agregarTarea = useCallback((texto) => {
    setTareas(prev => [...prev, { id: Date.now(), texto }]);
  }, []); // Array vacío: función nunca cambia

  const eliminarTarea = useCallback((id) => {
    setTareas(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div>
      <FormularioTarea onAgregar={agregarTarea} />
      <ListaItems tareas={tareas} onEliminar={eliminarTarea} />
    </div>
  );
}

// Componente hijo memoizado
const FormularioTarea = React.memo(({ onAgregar }) => {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAgregar(texto);
    setTexto('');
  };

  console.log('Render FormularioTarea');

  return (
    <form onSubmit={handleSubmit}>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} />
      <button>Agregar</button>
    </form>
  );
});
```

---

## Tipos de Estado

### 1. Estado Local (useState)

Estado que solo pertenece a un componente.

```javascript
function Contador() {
  const [count, setCount] = useState(0);
  // count solo existe en este componente
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Estado Reducer (useReducer)

Para lógica de estado compleja con múltiples sub-valores o acciones.

```javascript
function FormularioComplejo() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  return (
    <form>
      <input onChange={(e) => dispatch({ 
        type: 'UPDATE_FIELD', 
        field: 'nombre', 
        value: e.target.value 
      })} />
    </form>
  );
}
```

### 3. Estado Derivado

Estado calculado a partir de otro estado.

```javascript
function CarritoCompras() {
  const [items, setItems] = useState([]);
  
  // ✅ Estado derivado: se calcula del estado items
  const total = items.reduce((sum, item) => sum + item.precio, 0);
  const cantidad = items.length;
  
  // ❌ NO hacer esto:
  // const [total, setTotal] = useState(0);
  // Mantiene estado duplicado que puede desincronizarse
  
  return (
    <div>
      <p>Total: ${total}</p>
      <p>Cantidad: {cantidad}</p>
    </div>
  );
}

// Con useMemo para optimizar
function ProductosFiltrados({ productos, categoria }) {
  const [busqueda, setBusqueda] = useState('');
  
  const productosFiltrados = useMemo(() => {
    return productos
      .filter(p => p.categoria === categoria)
      .filter(p => p.nombre.includes(busqueda));
  }, [productos, categoria, busqueda]);
  
  return <Lista items={productosFiltrados} />;
}
```

### 4. Estado Global (Context)

Estado compartido entre múltiples componentes.

```javascript
// Crear contexto
const AppContext = createContext();

// Provider
function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [configuracion, setConfiguracion] = useState({});
  
  return (
    <AppContext.Provider value={{ 
      usuario, 
      setUsuario, 
      configuracion, 
      setConfiguracion 
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Consumir en cualquier componente
function Header() {
  const { usuario, setUsuario } = useContext(AppContext);
  
  return <div>Hola {usuario?.nombre}</div>;
}

function Settings() {
  const { configuracion, setConfiguracion } = useContext(AppContext);
  
  return <div>Config: {JSON.stringify(configuracion)}</div>;
}
```

---

## Custom Hooks

Hooks personalizados para reutilizar lógica.

```javascript
// Hook para fetch de datos
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

// Uso
function Usuarios() {
  const { data, loading, error } = useFetch('/api/usuarios');

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// Hook para localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Uso
function App() {
  const [nombre, setNombre] = useLocalStorage('nombre', '');
  
  return (
    <input 
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
    />
  );
}

// Hook para tamaño de ventana
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Uso
function Component() {
  const { width, height } = useWindowSize();
  
  return <div>Ventana: {width} x {height}</div>;
}

// Hook para debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Uso
function Busqueda() {
  const [busqueda, setBusqueda] = useState('');
  const debouncedBusqueda = useDebounce(busqueda, 500);

  useEffect(() => {
    if (debouncedBusqueda) {
      fetch(`/api/buscar?q=${debouncedBusqueda}`)
        .then(res => res.json())
        .then(setResultados);
    }
  }, [debouncedBusqueda]);

  return (
    <input 
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      placeholder="Buscar..."
    />
  );
}
```

---

## Reglas de los Hooks

### Reglas Fundamentales

1. **Solo llama Hooks en el nivel superior**
```javascript
// ❌ NO hacer esto
function Componente() {
  if (condicion) {
    const [state, setState] = useState(0); // ¡ERROR!
  }
  
  for (let i = 0; i < 10; i++) {
    useEffect(() => {}); // ¡ERROR!
  }
}

// ✅ Hacer esto
function Componente() {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    if (condicion) {
      // Lógica condicional DENTRO del hook
    }
  });
}
```

2. **Solo llama Hooks desde componentes funcionales o custom hooks**
```javascript
// ❌ NO hacer esto
function funcionNormal() {
  const [state, setState] = useState(0); // ¡ERROR!
}

// ✅ Hacer esto
function MiComponente() {
  const [state, setState] = useState(0); // Correcto
}

function useMiHook() {
  const [state, setState] = useState(0); // Correcto
}
```

---

## Comparación: Componentes de Clase vs Funcionales

| Aspecto | Clase | Funcional + Hooks |
|---------|-------|-------------------|
| **Sintaxis** | Más verbose | Más conciso |
| **Estado** | `this.state` | `useState` |
| **Ciclo de vida** | Múltiples métodos | `useEffect` |
| **Lógica reutilizable** | HOCs, Render Props | Custom Hooks |
| **Performance** | Similar | Similar |
| **Curva de aprendizaje** | `this`, binding | Closures |
| **Futuro** | Legacy | Recomendado |

```javascript
// CLASE
class Contador extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.incrementar = this.incrementar.bind(this);
  }

  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }

  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }

  incrementar() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <button onClick={this.incrementar}>
        {this.state.count}
      </button>
    );
  }
}

// FUNCIONAL
function Contador() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

---

## Patrones Avanzados

### Compound Components

```javascript
// Componente padre que comparte estado con hijos
const Tabs = ({ children, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

const TabList = ({ children }) => (
  <div className="tab-list">{children}</div>
);

const Tab = ({ index, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={activeTab === index ? 'active' : ''}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
};

const TabPanel = ({ index, children }) => {
  const { activeTab } = useContext(TabsContext);
  return activeTab === index ? <div>{children}</div> : null;
};

// Uso
<Tabs defaultTab={0}>
  <TabList>
    <Tab index={0}>Perfil</Tab>
    <Tab index={1}>Configuración</Tab>
  </TabList>
  <TabPanel index={0}>Contenido del perfil</TabPanel>
  <TabPanel index={1}>Contenido de configuración</TabPanel>
</Tabs>
```

### Render Props

```javascript
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return render(position);
}

// Uso
<Mouse render={({ x, y }) => (
  <p>El mouse está en {x}, {y}</p>
)} />
```

### Higher Order Components (HOC)

```javascript
// HOC para autenticación
function withAuth(Component) {
  return function AuthComponent(props) {
    const { usuario } = useContext(AuthContext);

    if (!usuario) {
      return <Redirect to="/login" />;
    }

    return <Component {...props} />;
  };
}

// Uso
const PaginaProtegida = withAuth(function Dashboard() {
  return <h1>Dashboard</h1>;
});

// HOC para loading
function withLoading(Component) {
  return function LoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <Spinner />;
    }
    return <Component {...props} />;
  };
}
```

---

## Optimización de Rendimiento

### React.memo

```javascript
// Evita re-renders innecesarios
const ListaItem = React.memo(({ item, onClick }) => {
  console.log('Render item:', item.id);
  
  return (
    <li onClick={() => onClick(item.id)}>
      {item.nombre}
    </li>
  );
});

// Con comparación personalizada
const ListaItem = React.memo(
  ({ item, onClick }) => {
    return <li onClick={() => onClick(item.id)}>{item.nombre}</li>;
  },
  (prevProps, nextProps) => {
    // Retorna true si son iguales (NO debe re-renderizar)
    return prevProps.item.id === nextProps.item.id &&
           prevProps.item.nombre === nextProps.item.nombre;
  }
);
```

### useCallback y useMemo

```javascript
function ListaOptimizada({ items }) {
  const [filtro, setFiltro] = useState('');

  // Memoizar función para evitar re-creación
  const handleClick = useCallback((id) => {
    console.log('Click en:', id);
  }, []);

  // Memoizar cálculo costoso
  const itemsFiltrados = useMemo(() => {
    console.log('Filtrando items...');
    return items.filter(item => 
      item.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [items, filtro]);

  return (
    <div>
      <input 
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      {itemsFiltrados.map(item => (
        <ListaItem 
          key={item.id} 
          item={item} 
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
```

### Lazy Loading

```javascript
import { lazy, Suspense } from 'react';

// Cargar componente de forma diferida
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Manejo de Errores

### Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado:', error, errorInfo);
    // Enviar a servicio de logging
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Algo salió mal</h1>
          <details>
            {this.state.error?.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Uso
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Try-Catch en Async

```javascript
function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch('/api/usuarios');
        if (!res.ok) throw new Error('Error en la petición');
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchUsuarios();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {usuarios.map(u => <li key={u.id}>{u.nombre}</li>)}
    </ul>
  );
}
```

---

## Mejores Prácticas

### 1. Organización de Componentes

```javascript
// ✅ Componente bien estructurado
function ProductoCard({ producto }) {
  // 1. Hooks
  const [cantidad, setCantidad] = useState(1);
  const { agregarAlCarrito } = useCarrito();

  // 2. Efectos
  useEffect(() => {
    // Lógica de efecto
  }, []);

  // 3. Funciones de manejo
  const handleAgregar = () => {
    agregarAlCarrito(producto, cantidad);
  };

  // 4. Render
  return (
    <div className="producto-card">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p>${producto.precio}</p>
      <input 
        type="number" 
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
      />
      <button onClick={handleAgregar}>Agregar</button>
    </div>
  );
}
```

### 2. Nombrado de Componentes y Hooks

```javascript
// ✅ Nombres descriptivos
function UserProfileCard() {}
function useAuth() {}
function useFetchUsers() {}

// ❌ Nombres poco claros
function Card() {}
function hook1() {}
function getData() {}
```

### 3. Props con Valores por Defecto

```javascript
// ✅ Con valores por defecto
function Boton({ 
  texto = 'Click', 
  tipo = 'button', 
  onClick = () => {},
  disabled = false 
}) {
  return (
    <button type={tipo} onClick={onClick} disabled={disabled}>
      {texto}
    </button>
  );
}
```

### 4. Composición sobre Herencia

```javascript
// ✅ Composición
function Layout({ children, sidebar }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

<Layout sidebar={<Sidebar />}>
  <Dashboard />
</Layout>

// ❌ Herencia (no usar en React)
class Layout extends Component {}
class DashboardLayout extends Layout {}
```

### 5. Extraer Lógica a Custom Hooks

```javascript
// ✅ Lógica reutilizable
function useFormulario(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const reset = () => setValues(initialValues);

  return { values, handleChange, reset };
}

// Usar en múltiples componentes
function LoginForm() {
  const { values, handleChange, reset } = useFormulario({ 
    email: '', 
    password: '' 
  });

  return (
    <form>
      <input name="email" value={values.email} onChange={handleChange} />
      <input name="password" value={values.password} onChange={handleChange} />
    </form>
  );
}
```

---

## Recursos Adicionales

- [React Docs - Hooks](https://react.dev/reference/react)
- [React Lifecycle Methods Diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
- [useHooks - Custom Hooks Collection](https://usehooks.com/)
- [React Patterns](https://reactpatterns.com/)
