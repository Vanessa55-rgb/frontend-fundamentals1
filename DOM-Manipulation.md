# DOM - Document Object Model

## ¿Qué es el DOM?

El DOM (Document Object Model) es una representación estructurada del documento HTML como un árbol de objetos. Permite a JavaScript acceder y manipular dinámicamente el contenido, estructura y estilos de una página web.

## Estructura del DOM

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mi Página</title>
  </head>
  <body>
    <h1 id="titulo">Hola Mundo</h1>
    <p class="texto">Este es un párrafo</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </body>
</html>
```

**Árbol DOM:**
```
Document
└── html
    ├── head
    │   └── title
    │       └── "Mi Página"
    └── body
        ├── h1#titulo
        │   └── "Hola Mundo"
        ├── p.texto
        │   └── "Este es un párrafo"
        └── ul
            ├── li
            │   └── "Item 1"
            └── li
                └── "Item 2"
```

---

## 1. Selección de Elementos

### getElementById

Selecciona un elemento por su ID (el más rápido).

```javascript
const titulo = document.getElementById('titulo');
console.log(titulo); // <h1 id="titulo">Hola Mundo</h1>
console.log(titulo.textContent); // "Hola Mundo"

// Si no existe, retorna null
const noExiste = document.getElementById('inexistente');
console.log(noExiste); // null
```

### getElementsByClassName

Selecciona elementos por clase (retorna HTMLCollection - similar a array).

```javascript
const textos = document.getElementsByClassName('texto');
console.log(textos); // HTMLCollection [p.texto]
console.log(textos[0]); // Primer elemento
console.log(textos.length); // Cantidad de elementos

// HTMLCollection es "live" (se actualiza automáticamente)
```

### getElementsByTagName

Selecciona elementos por etiqueta HTML.

```javascript
const parrafos = document.getElementsByTagName('p');
console.log(parrafos); // HTMLCollection de todos los <p>

const todosLosLi = document.getElementsByTagName('li');
console.log(todosLosLi); // HTMLCollection [li, li]

// Obtener todos los elementos
const todosLosElementos = document.getElementsByTagName('*');
```

### querySelector 

Selecciona el primer elemento que coincide con un selector CSS.

```javascript
// Por ID
const titulo = document.querySelector('#titulo');

// Por clase
const texto = document.querySelector('.texto');

// Por etiqueta
const primerParrafo = document.querySelector('p');

// Selectores complejos
const primerLi = document.querySelector('ul li');
const elementoEspecifico = document.querySelector('div.container > p.texto');

// Con pseudo-clases
const primerHijo = document.querySelector('ul li:first-child');
const ultimoHijo = document.querySelector('ul li:last-child');

// Por atributo
const input = document.querySelector('input[type="email"]');
const enlace = document.querySelector('a[href^="https"]');
```

### querySelectorAll 
Selecciona todos los elementos que coinciden (retorna NodeList).

```javascript
const todosLosParrafos = document.querySelectorAll('p');
console.log(todosLosParrafos); // NodeList [p, p, p]

const todosLosTextos = document.querySelectorAll('.texto');

// NodeList se puede iterar
todosLosParrafos.forEach(parrafo => {
  console.log(parrafo.textContent);
});

// Convertir a Array (si necesitas métodos de array)
const arrayParrafos = Array.from(todosLosParrafos);
const arrayParrafos2 = [...todosLosParrafos]; // Spread operator
```

### Diferencias: HTMLCollection vs NodeList

```javascript
// HTMLCollection (getElementsByClassName, getElementsByTagName)
// - "Live" (se actualiza automáticamente)
// - Solo contiene elementos
// - No tiene forEach nativo

const divs = document.getElementsByTagName('div');
console.log(divs.length); // 5

// Si agregamos un div, divs.length se actualiza automáticamente
document.body.appendChild(document.createElement('div'));
console.log(divs.length); // 6

// NodeList (querySelectorAll)
// - Estático (no se actualiza)
// - Puede contener cualquier tipo de nodo
// - Tiene forEach nativo

const parrafos = document.querySelectorAll('p');
console.log(parrafos.length); // 3

document.body.appendChild(document.createElement('p'));
console.log(parrafos.length); // 3 (no cambió)
```

---

## 2. Manipulación de Contenido

### textContent vs innerHTML vs innerText

```javascript
const div = document.querySelector('#contenido');

// textContent - Texto plano (ignora HTML)
div.textContent = 'Texto <strong>normal</strong>';
// Resultado: Texto <strong>normal</strong>

// innerHTML - Interpreta HTML
div.innerHTML = 'Texto <strong>en negrita</strong>';
// Resultado: Texto en negrita (con formato)

// innerText - Similar a textContent pero respeta CSS
div.innerHTML = '<span style="display: none">Oculto</span> Visible';
console.log(div.textContent); // "Oculto Visible"
console.log(div.innerText);   // "Visible"

// Cuidado con innerHTML y datos de usuario (XSS)
// ❌ Peligroso
const userInput = '<img src=x onerror="alert(\'XSS\')">';
div.innerHTML = userInput; // Ejecuta el script malicioso

// ✅ Seguro
div.textContent = userInput; // Muestra el texto tal cual
```

### Modificar Atributos

```javascript
const imagen = document.querySelector('img');

// getAttribute - Obtener atributo
const src = imagen.getAttribute('src');
console.log(src);

// setAttribute - Establecer atributo
imagen.setAttribute('src', 'nueva-imagen.jpg');
imagen.setAttribute('alt', 'Descripción de la imagen');

// Atributos comunes se pueden acceder directamente
imagen.src = 'otra-imagen.jpg';
imagen.alt = 'Otra descripción';
imagen.id = 'mi-imagen';
imagen.className = 'imagen-destacada';

// hasAttribute - Verificar si existe
if (imagen.hasAttribute('alt')) {
  console.log('Tiene atributo alt');
}

// removeAttribute - Eliminar atributo
imagen.removeAttribute('title');

// Atributos data-*
const elemento = document.querySelector('.card');
elemento.setAttribute('data-id', '123');
elemento.setAttribute('data-tipo', 'producto');

// Acceder a data attributes con dataset
console.log(elemento.dataset.id);   // "123"
console.log(elemento.dataset.tipo); // "producto"

elemento.dataset.precio = '100';
// <div class="card" data-id="123" data-tipo="producto" data-precio="100">
```

### value en Inputs

```javascript
const input = document.querySelector('input[type="text"]');

// Obtener valor
console.log(input.value);

// Establecer valor
input.value = 'Nuevo texto';

// Limpiar
input.value = '';

// Checkbox
const checkbox = document.querySelector('input[type="checkbox"]');
console.log(checkbox.checked); // true o false
checkbox.checked = true;

// Select
const select = document.querySelector('select');
console.log(select.value); // Valor de la opción seleccionada
select.value = 'opcion2';
```

---

## 3. Manipulación de Estilos

### Estilos Inline

```javascript
const elemento = document.querySelector('.box');

// Modificar estilos individuales
elemento.style.color = 'red';
elemento.style.backgroundColor = 'blue'; // camelCase
elemento.style.fontSize = '20px';
elemento.style.marginTop = '10px';

// Múltiples estilos
elemento.style.cssText = 'color: red; background-color: blue; font-size: 20px;';

// Obtener estilo computado (incluyendo CSS externo)
const estilos = window.getComputedStyle(elemento);
console.log(estilos.color);
console.log(estilos.fontSize);
console.log(estilos.width);
```

### Clases CSS 

```javascript
const elemento = document.querySelector('.box');

// className - Reemplaza todas las clases
elemento.className = 'nueva-clase';
elemento.className = 'clase1 clase2 clase3';

// classList - API moderna (preferida)
elemento.classList.add('activo');        // Agregar clase
elemento.classList.remove('inactivo');   // Remover clase
elemento.classList.toggle('visible');    // Alternar (add/remove)
elemento.classList.contains('activo');   // Verificar si existe (true/false)

// toggle con condición
elemento.classList.toggle('activo', true);  // Siempre agrega
elemento.classList.toggle('activo', false); // Siempre remueve

// replace
elemento.classList.replace('antigua', 'nueva');

// Múltiples clases
elemento.classList.add('clase1', 'clase2', 'clase3');
elemento.classList.remove('clase1', 'clase2');

// Iterar sobre clases
elemento.classList.forEach(clase => {
  console.log(clase);
});

// Ejemplo práctico: Toggle tema
const body = document.body;
const toggleBtn = document.querySelector('#toggle-theme');

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  const isDark = body.classList.contains('dark-mode');
  toggleBtn.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
});
```

---

## 4. Creación y Eliminación de Elementos

### Crear Elementos

```javascript
// createElement
const nuevoDiv = document.createElement('div');
nuevoDiv.textContent = 'Nuevo contenido';
nuevoDiv.className = 'card';
nuevoDiv.id = 'mi-card';

// Crear con contenido
const parrafo = document.createElement('p');
parrafo.innerHTML = 'Este es un <strong>párrafo</strong>';

// createTextNode
const texto = document.createTextNode('Texto simple');

// Crear estructura compleja
const card = document.createElement('div');
card.className = 'card';

const titulo = document.createElement('h3');
titulo.textContent = 'Título de la tarjeta';

const descripcion = document.createElement('p');
descripcion.textContent = 'Descripción de la tarjeta';

const boton = document.createElement('button');
boton.textContent = 'Click aquí';
boton.className = 'btn';

// Ensamblar
card.appendChild(titulo);
card.appendChild(descripcion);
card.appendChild(boton);
```

### Agregar Elementos al DOM

```javascript
const container = document.querySelector('.container');

// appendChild - Agrega al final
container.appendChild(nuevoDiv);

// append - Más flexible (puede agregar múltiples elementos y texto)
container.append(elemento1, elemento2, 'Texto directo');

// prepend - Agrega al inicio
container.prepend(nuevoDiv);

// insertBefore - Inserta antes de un elemento
const referencia = document.querySelector('.referencia');
container.insertBefore(nuevoDiv, referencia);

// insertAdjacentElement
const objetivo = document.querySelector('.objetivo');

// beforebegin: antes del elemento
objetivo.insertAdjacentElement('beforebegin', nuevoDiv);

// afterbegin: dentro del elemento, antes del primer hijo
objetivo.insertAdjacentElement('afterbegin', nuevoDiv);

// beforeend: dentro del elemento, después del último hijo
objetivo.insertAdjacentElement('beforeend', nuevoDiv);

// afterend: después del elemento
objetivo.insertAdjacentElement('afterend', nuevoDiv);

// insertAdjacentHTML - Insertar HTML como string
objetivo.insertAdjacentHTML('beforeend', '<p>Nuevo párrafo</p>');
```

### Clonar Elementos

```javascript
const original = document.querySelector('.original');

// Clonar sin hijos
const clonSuperficial = original.cloneNode(false);

// Clonar con todos los hijos (deep clone)
const clonProfundo = original.cloneNode(true);

// Agregar el clon al DOM
document.body.appendChild(clonProfundo);

// Ejemplo práctico: duplicar una tarjeta
const card = document.querySelector('.card');
const nuevaCard = card.cloneNode(true);
nuevaCard.querySelector('h3').textContent = 'Nueva tarjeta';
document.querySelector('.container').appendChild(nuevaCard);
```

### Eliminar Elementos

```javascript
const elemento = document.querySelector('.remover');

// remove() - Método moderno
elemento.remove();

// removeChild() - Método antiguo
const padre = elemento.parentElement;
padre.removeChild(elemento);

// Eliminar todos los hijos
const container = document.querySelector('.container');
container.innerHTML = ''; // Rápido pero elimina listeners

// Mejor forma (elimina listeners correctamente)
while (container.firstChild) {
  container.removeChild(container.firstChild);
}

// Forma moderna
container.replaceChildren(); // Elimina todos los hijos

// replaceWith - Reemplazar elemento
const viejo = document.querySelector('.viejo');
const nuevo = document.createElement('div');
nuevo.textContent = 'Nuevo elemento';
viejo.replaceWith(nuevo);
```

---

## 5. Navegación por el DOM

### Relaciones entre Nodos

```javascript
const elemento = document.querySelector('.hijo');

// Padres
console.log(elemento.parentElement);     // Elemento padre
console.log(elemento.parentNode);        // Nodo padre
console.log(elemento.closest('.ancestro')); // Ancestro más cercano que coincide

// Hijos
console.log(elemento.children);          // HTMLCollection de elementos hijos
console.log(elemento.childNodes);        // NodeList de todos los nodos (incluye texto)
console.log(elemento.firstElementChild); // Primer hijo elemento
console.log(elemento.lastElementChild);  // Último hijo elemento
console.log(elemento.firstChild);        // Primer nodo (puede ser texto)
console.log(elemento.lastChild);         // Último nodo

// Hermanos
console.log(elemento.nextElementSibling);     // Siguiente hermano elemento
console.log(elemento.previousElementSibling); // Hermano anterior elemento
console.log(elemento.nextSibling);            // Siguiente nodo
console.log(elemento.previousSibling);        // Nodo anterior

// Ejemplo práctico: encontrar ancestro
const boton = document.querySelector('.btn');
const card = boton.closest('.card');
console.log(card); // Encuentra la card que contiene el botón
```

### Verificaciones

```javascript
const elemento = document.querySelector('.test');

// Verificar si tiene hijos
console.log(elemento.hasChildNodes()); // true/false

// Verificar si contiene otro elemento
const hijo = document.querySelector('.hijo');
console.log(elemento.contains(hijo)); // true/false

// Verificar si coincide con selector
console.log(elemento.matches('.test')); // true
console.log(elemento.matches('div'));   // true/false
```

---

## 6. Event Listeners (Eventos)

### addEventListener

```javascript
const boton = document.querySelector('#miBoton');

// Sintaxis básica
boton.addEventListener('click', function() {
  console.log('Botón clickeado');
});

// Con función flecha
boton.addEventListener('click', () => {
  console.log('Botón clickeado');
});

// Con función nombrada (para poder removerla después)
function manejarClick() {
  console.log('Click');
}
boton.addEventListener('click', manejarClick);

// Remover listener
boton.removeEventListener('click', manejarClick);
```

### Eventos Comunes

```javascript
// Mouse
elemento.addEventListener('click', (e) => {});        // Click
elemento.addEventListener('dblclick', (e) => {});     // Doble click
elemento.addEventListener('mouseenter', (e) => {});   // Mouse entra
elemento.addEventListener('mouseleave', (e) => {});   // Mouse sale
elemento.addEventListener('mouseover', (e) => {});    // Mouse sobre (burbujea)
elemento.addEventListener('mouseout', (e) => {});     // Mouse fuera (burbujea)
elemento.addEventListener('mousemove', (e) => {});    // Mouse se mueve
elemento.addEventListener('mousedown', (e) => {});    // Botón presionado
elemento.addEventListener('mouseup', (e) => {});      // Botón soltado

// Teclado
elemento.addEventListener('keydown', (e) => {});      // Tecla presionada
elemento.addEventListener('keyup', (e) => {});        // Tecla soltada
elemento.addEventListener('keypress', (e) => {});     // Tecla presionada (deprecated)

// Formularios
form.addEventListener('submit', (e) => {});           // Envío de formulario
input.addEventListener('input', (e) => {});           // Cambio en tiempo real
input.addEventListener('change', (e) => {});          // Cambio al perder foco
input.addEventListener('focus', (e) => {});           // Input enfocado
input.addEventListener('blur', (e) => {});            // Input desenfocado

// Scroll
window.addEventListener('scroll', (e) => {});         // Scroll de la página
elemento.addEventListener('scroll', (e) => {});       // Scroll del elemento

// Ventana
window.addEventListener('load', (e) => {});           // Página cargada completamente
window.addEventListener('DOMContentLoaded', (e) => {}); // DOM cargado (más rápido)
window.addEventListener('resize', (e) => {});         // Ventana redimensionada
window.addEventListener('beforeunload', (e) => {});   // Antes de cerrar/recargar
```

### Objeto Event

```javascript
boton.addEventListener('click', (event) => {
  // Información del evento
  console.log(event.type);        // "click"
  console.log(event.target);      // Elemento que disparó el evento
  console.log(event.currentTarget); // Elemento con el listener
  console.log(event.timeStamp);   // Tiempo del evento
  
  // Posición del mouse
  console.log(event.clientX);     // X relativo al viewport
  console.log(event.clientY);     // Y relativo al viewport
  console.log(event.pageX);       // X relativo al documento
  console.log(event.pageY);       // Y relativo al documento
  console.log(event.offsetX);     // X relativo al elemento
  console.log(event.offsetY);     // Y relativo al elemento
  
  // Teclas modificadoras
  console.log(event.ctrlKey);     // Ctrl presionado
  console.log(event.shiftKey);    // Shift presionado
  console.log(event.altKey);      // Alt presionado
  console.log(event.metaKey);     // Cmd (Mac) / Windows key
  
  // Métodos
  event.preventDefault();         // Prevenir comportamiento por defecto
  event.stopPropagation();        // Detener propagación
});

// Evento de teclado
input.addEventListener('keydown', (event) => {
  console.log(event.key);         // Tecla presionada ("a", "Enter", "Escape")
  console.log(event.code);        // Código físico ("KeyA", "Enter")
  console.log(event.keyCode);     // Código numérico (deprecated)
  
  // Ejemplo: detectar Enter
  if (event.key === 'Enter') {
    console.log('Enter presionado');
  }
  
  // Ejemplo: detectar Ctrl+S
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    console.log('Guardar');
  }
});
```

### Event Delegation (Delegación de Eventos)

```javascript
// ❌ Ineficiente: agregar listener a cada elemento
const botones = document.querySelectorAll('.btn');
botones.forEach(boton => {
  boton.addEventListener('click', () => {
    console.log('Click');
  });
});

// ✅ Eficiente: un solo listener en el padre
const container = document.querySelector('.container');
container.addEventListener('click', (event) => {
  // Verificar si el click fue en un botón
  if (event.target.matches('.btn')) {
    console.log('Botón clickeado:', event.target.textContent);
  }
  
  // O con closest (para elementos anidados)
  const boton = event.target.closest('.btn');
  if (boton) {
    console.log('Botón clickeado:', boton.textContent);
  }
});

// Ventajas:
// - Un solo listener (mejor rendimiento)
// - Funciona con elementos dinámicos (agregados después)
// - Menos memoria utilizada
```

### Opciones de addEventListener

```javascript
// once: Se ejecuta una sola vez y se remueve automáticamente
boton.addEventListener('click', () => {
  console.log('Solo una vez');
}, { once: true });

// passive: Indica que no llamará preventDefault()
// (mejor rendimiento en scroll/touch)
window.addEventListener('scroll', () => {
  console.log('Scrolling');
}, { passive: true });

// capture: Usa fase de captura en lugar de burbujeo
elemento.addEventListener('click', () => {
  console.log('Fase de captura');
}, { capture: true });

// Combinadas
elemento.addEventListener('click', handler, {
  once: true,
  passive: true,
  capture: false
});
```

---

## 7. Asincronismo en el DOM

### DOMContentLoaded vs load

```javascript
// DOMContentLoaded - DOM listo (antes de imágenes/estilos)
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM listo');
  // Puedes manipular elementos aquí
});

// load - Todo cargado (imágenes, estilos, scripts)
window.addEventListener('load', () => {
  console.log('Página completamente cargada');
});

// Orden de ejecución:
// 1. DOMContentLoaded
// 2. load
```

### Operaciones Asíncronas con DOM

```javascript
// Ejemplo: Cargar y mostrar datos
async function cargarUsuarios() {
  const container = document.querySelector('#usuarios');
  
  // Mostrar loader
  container.innerHTML = '<p>Cargando...</p>';
  
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const usuarios = await response.json();
    
    // Limpiar container
    container.innerHTML = '';
    
    // Crear elementos para cada usuario
    usuarios.forEach(usuario => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${usuario.name}</h3>
        <p>${usuario.email}</p>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = '<p>Error al cargar usuarios</p>';
    console.error(error);
  }
}

// Llamar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarUsuarios);
```

### Debouncing en Eventos del DOM

```javascript
function debounce(func, wait) {
  let timeout;
  return function ejecutar(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Búsqueda con debounce
const inputBusqueda = document.querySelector('#busqueda');
const resultados = document.querySelector('#resultados');

const buscar = debounce(async (termino) => {
  if (termino.length < 3) {
    resultados.innerHTML = '';
    return;
  }
  
  resultados.innerHTML = '<p>Buscando...</p>';
  
  try {
    const response = await fetch(`/api/buscar?q=${termino}`);
    const datos = await response.json();
    
    resultados.innerHTML = '';
    datos.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item.nombre;
      resultados.appendChild(div);
    });
  } catch (error) {
    resultados.innerHTML = '<p>Error en la búsqueda</p>';
  }
}, 500);

inputBusqueda.addEventListener('input', (e) => {
  buscar(e.target.value);
});
```

---

## 8. Ejemplos Prácticos Completos

### Todo List

```javascript
class TodoList {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.todos = [];
    this.init();
  }
  
  init() {
    this.render();
    this.attachEvents();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="todo-app">
        <h2>Lista de Tareas</h2>
        <div class="input-group">
          <input type="text" id="todoInput" placeholder="Nueva tarea...">
          <button id="addBtn">Agregar</button>
        </div>
        <ul id="todoList"></ul>
      </div>
    `;
    this.renderTodos();
  }
  
  renderTodos() {
    const lista = this.container.querySelector('#todoList');
    lista.innerHTML = '';
    
    this.todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';
      li.innerHTML = `
        <span>${todo.text}</span>
        <div>
          <button class="toggle-btn" data-index="${index}">
            ${todo.completed ? 'Desmarcar' : 'Completar'}
          </button>
          <button class="delete-btn" data-index="${index}">Eliminar</button>
        </div>
      `;
      lista.appendChild(li);
    });
  }
  
  attachEvents() {
    const input = this.container.querySelector('#todoInput');
    const addBtn = this.container.querySelector('#addBtn');
    const lista = this.container.querySelector('#todoList');
    
    // Agregar con botón
    addBtn.addEventListener('click', () => this.addTodo(input.value));
    
    // Agregar con Enter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTodo(input.value);
    });
    
    // Event delegation para toggle y delete
    lista.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      
      if (e.target.classList.contains('toggle-btn')) {
        this.toggleTodo(index);
      }
      
      if (e.target.classList.contains('delete-btn')) {
        this.deleteTodo(index);
      }
    });
  }
  
  addTodo(text) {
    if (!text.trim()) return;
    
    this.todos.push({ text: text.trim(), completed: false });
    this.renderTodos();
    this.container.querySelector('#todoInput').value = '';
  }
  
  toggleTodo(index) {
    this.todos[index].completed = !this.todos[index].completed;
    this.renderTodos();
  }
  
  deleteTodo(index) {
    this.todos.splice(index, 1);
    this.renderTodos();
  }
}

// Uso
document.addEventListener('DOMContentLoaded', () => {
  new TodoList('#app');
});
```

### Modal Dinámico

```javascript
class Modal {
  constructor() {
    this.modal = null;
    this.createModal();
  }
  
  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="modal-body"></div>
      </div>
    `;
    document.body.appendChild(this.modal);
    
    // Event listeners
    this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
    this.modal.querySelector('.modal-overlay').addEventListener('click', () => this.close());
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }
  
  open(content) {
    const body = this.modal.querySelector('.modal-body');
    
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else {
      body.innerHTML = '';
      body.appendChild(content);
    }
    
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Uso
const modal = new Modal();

document.querySelector('#openModal').addEventListener('click', () => {
  modal.open('<h2>Título del Modal</h2><p>Contenido aquí</p>');
});
```

---

## 9. Mejores Prácticas

```javascript
// ✅ 1. Cachear selectores DOM
// ❌ Malo (busca en cada iteración)
for (let i = 0; i < 100; i++) {
  document.querySelector('.container').innerHTML += '<p>Item</p>';
}

// ✅ Bueno
const container = document.querySelector('.container');
for (let i = 0; i < 100; i++) {
  container.innerHTML += '<p>Item</p>';
}

// ✅ 2. Usar DocumentFragment para inserciones múltiples
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const p = document.createElement('p');
  p.textContent = `Item ${i}`;
  fragment.appendChild(p);
}
container.appendChild(fragment); // Una sola inserción

// ✅ 3. Event delegation para elementos dinámicos
document.body.addEventListener('click', (e) => {
  if (e.target.matches('.dynamic-btn')) {
    console.log('Click en botón dinámico');
  }
});

// ✅ 4. Remover event listeners cuando no se necesiten
function cleanup() {
  element.removeEventListener('click', handler);
}

// ✅ 5. Usar textContent en lugar de innerHTML cuando sea posible
element.textContent = 'Texto seguro'; // Más rápido y seguro

// ✅ 6. Evitar reflow/repaint innecesarios
// ❌ Malo (múltiples reflows)
element.style.width = '100px';
element.style.height = '100px';
element.style.backgroundColor = 'red';

// ✅ Bueno (un solo reflow)
element.style.cssText = 'width: 100px; height: 100px; background-color: red;';
// O usar clases
element.classList.add('styled');

// ✅ 7. Verificar existencia antes de manipular
const elemento = document.querySelector('.no-existe');
if (elemento) {
  elemento.textContent = 'Existe';
}
```

---

## 10. Recursos Adicionales

- [MDN - DOM](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model)
- [JavaScript.info - Document](https://javascript.info/document)
- [W3C DOM Specification](https://www.w3.org/TR/dom/)
