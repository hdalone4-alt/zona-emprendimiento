/* ==========================================================
   1. DATOS: [nombre del negocio, [cubículos que ocupa]]
   Los cubículos que no aparezcan aquí se muestran como "vacío".
   ========================================================== */
const NEGOCIOS_BASE = [
  ["Tienda universitaria Unimagdalena", [1, 2]], ["Glamour", [3]], ["Salume artesanías", [4]],
  ["Matutino", [5]], ["Crujiplatanitos", [6]], ["Mimate", [7]], ["Frizzy", [8]], ["Umbría", [9]],
  ["Judith crochet", [10]], ["Refrescamos", [11]], ["Cremositos", [12]], ["Shi mundo", [13]],
  ["Sabrolin", [14]], ["Memorialart", [15]], ["Mar negro", [16]], ["El rincón del pollo", [17]],
  ["Comidas rápidas en gallo", [18]], ["Titan grill", [19]], ["Hamburghini", [21]],
  ["Alt+tend", [22]], ["Freskitos icecream", [23]], ["Perritos Jenni", [24]], ["Arte sano", [25]],
  ["Brown vives", [26]], ["5-midas", [27]], ["Comidas jeikol", [28]], ["Mexicano", [29]],
  ["Reinbo maid café", [30]], ["Mangle", [31]], ["Alea", [33]], ["Raspa2", [34]], ["Aela", [35]],
  ["Esquites", [36]], ["Chill tapioka", [37]], ["Matcha bar", [38]], ["Nova", [39]],
  ["Dorilocos", [40]], ["Akweyka", [41]], ["Delicias de mi tierra", [42]], ["Flor de loto", [43]],
  ["Crunchips", [44]], ["Colectivo imaginario", [46]], ["Bungavilier", [47]], ["Ami", [48]],
  ["Coffe fruit", [49]], ["Foodnix", [56]], ["Tinto club", [57]], ["Mare creaciones", [58]],
  ["Creemifrut", [59]], ["Chicha chic", [60]], ["Koko bakery", [61]], ["Pargo lab", [62]],
  ["Lady universitaria", [63, 64]]
];

/* ==========================================================
   2. INFORMACIÓN DE CADA NEGOCIO (editable)
   La clave es el nombre exacto. Si un negocio no está aquí,
   se muestra "pendiente". Judith crochet es solo un EJEMPLO.
   ========================================================== */
const DETALLES = {
  "Judith crochet": {
    telefono: "+57 300 123 4567",
    descripcion: "Texto de ejemplo: aquí va la descripción del negocio.",
    productos: [["Producto de ejemplo 1", "$10.000"], ["Producto de ejemplo 2", "$25.000"]],
    imagen: "img/Negocios/Judith_Crochet.JPEG",
  },

  "Glamour": {
    imagen: "img/Negocios/Glamour.JPEG",
  },

  "Matutino": {
    imagen: "img/Negocios/Matutino.JPEG",
  },

  "Salume artesanías": {
    imagen: "img/Negocios/Salume artesanías.JPEG",
  }


  
};


/* ==========================================================
   3. CÓDIGO (normalmente no hay que tocarlo)
   ========================================================== */
const NEGOCIOS = NEGOCIOS_BASE.map(([nombre, mods], id) => ({ id, nombre, mods }));
const negocioPorModulo = {};
NEGOCIOS.forEach(n => n.mods.forEach(m => (negocioPorModulo[m] = n.id)));

const $lista = document.getElementById("lista");
const $plano = document.getElementById("plano");
const $buscar = document.getElementById("buscar");
const $sinResultados = document.getElementById("sin-resultados");
let seleccionado = null;

const normalizar = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const escapar = t => t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function htmlDetalle(n) {
  const d = DETALLES[n.nombre] || {};
  const productos = d.productos && d.productos.length
    ? `<ul class="productos">${d.productos.map(([p, v]) => `<li><span>${escapar(p)}</span><strong>${escapar(v)}</strong></li>`).join("")}</ul>`
    : `<p class="pendiente">Productos por agregar.</p>`;
  return `
    <p class="tel">${d.telefono ? escapar(d.telefono) : '<span class="pendiente">Teléfono por agregar</span>'}</p>
    <h3>Descripción</h3>
    <p>${d.descripcion ? escapar(d.descripcion) : '<span class="pendiente">Descripción por agregar.</span>'}</p>
    <h3>Productos</h3>
    ${productos}`;
}

/* ----- Lista ----- */
$lista.innerHTML = NEGOCIOS.map(n => `
  <li class="item" data-id="${n.id}">
    <div class="item-cont">
      <button class="item-btn" type="button" aria-expanded="false">
        <span>${escapar(n.nombre)}</span>
        <span class="mods">${n.mods.length > 1 ? "Cubículos" : "Cubículo"} ${n.mods.join(" y ")}</span>
      </button>
      <div class="detalle"><div class="detalle-int"><div class="detalle-pad">${htmlDetalle(n)}</div></div></div>
    </div>
  </li>`).join("");

/* ----- Mapa: 4 filas de bloques, lado izquierdo (33-64) y derecho (1-32) ----- */
function htmlBloque(izq, der, g) {
  let h = `<div class="bloque">`;
  for (let r = 0; r < 4; r++) {
    [izq + 4 * g + r, der + 4 * g + r].forEach(num => {
      h += num in negocioPorModulo
        ? `<button type="button" class="mod ocupado" data-mod="${num}" title="${escapar(NEGOCIOS[negocioPorModulo[num]].nombre)}">${num}</button>`
        : `<button type="button" class="mod vacio" disabled title="Cubículo vacío">${num}</button>`;
    });
  }
  return h + `</div>`;
}

/* Señales: cambia aquí el texto o la posición */
const SENAL_ARRIBA = `<div class="ref"><span class="flecha">↑</span>Cafeta Pequeña</div>`;
const SENAL_ABAJO = `<div class="ref">Bienestar<span class="flecha">↓</span></div>`;
const FILA_SENALES = `
  <div class="fila-ref">
    <div class="ref"><span class="flecha">←</span>Parqueadero</div>
    <div class="ref">Ciénaga Grande<span class="flecha">→</span></div>
  </div>`;

let htmlPlano = "";
for (let g = 0; g < 4; g++) {
  if (g === 2) htmlPlano += FILA_SENALES;           // entre el 2.º y el 3.er grupo de bloques
  const pasillo = g === 0 ? SENAL_ARRIBA : g === 3 ? SENAL_ABAJO : "";
  const clase = g === 0 ? "arriba" : g === 3 ? "abajo" : "";
  htmlPlano += htmlBloque(49, 33, g)                // lado izquierdo
             + `<div class="corredor ${clase}">${pasillo}</div>`
             + htmlBloque(17, 1, g);                // lado derecho
}
$plano.innerHTML = htmlPlano;

/* ----- Selección ----- */
function seleccionar(id, desdeMapa = false) {
  const mismo = seleccionado === id;
  seleccionado = mismo ? null : id;

  if (!mismo && desdeMapa && $buscar.value) { $buscar.value = ""; filtrar(); }

  document.querySelectorAll(".item").forEach(li => {
    const abierto = Number(li.dataset.id) === seleccionado;
    li.classList.toggle("abierto", abierto);
    // Retraso según la distancia al negocio tocado: los más cercanos se pliegan primero (cascada)
    li.style.setProperty("--i", Math.abs(Number(li.dataset.id) - id));
    li.querySelector(".item-btn").setAttribute("aria-expanded", abierto);
  });
  $lista.classList.toggle("con-seleccion", seleccionado !== null);   // oculta los demás negocios mientras uno está abierto
  document.querySelectorAll(".mod").forEach(b => {
    const dueño = negocioPorModulo[b.dataset.mod];
    b.classList.toggle("sel", seleccionado !== null && dueño === seleccionado);
  });
  if (seleccionado !== null) {
    // Sube hasta el buscador para que se vean el negocio abierto y la imagen
    document.querySelector(".panel-lista").scrollIntoView({ block: "start", behavior: "smooth" });
  } else {
    // Al cerrar, la lista vuelve a mostrarse completa: se deja a la vista el negocio que estaba abierto
    document.querySelector(`.item[data-id="${id}"]`).scrollIntoView({ block: "nearest" });
  }
  cambiarImagen(seleccionado !== null ? rutaImagen(NEGOCIOS[seleccionado]) : IMAGEN_BASE);
}

$lista.addEventListener("click", e => {
  const btn = e.target.closest(".item-btn");
  if (btn) seleccionar(Number(btn.closest(".item").dataset.id));
});
$plano.addEventListener("click", e => {
  const mod = e.target.closest(".mod.ocupado");
  if (mod) seleccionar(negocioPorModulo[mod.dataset.mod], true);
});

/* ----- Buscador ----- */
function filtrar() {
  const q = normalizar($buscar.value.trim());
  let visibles = 0;
  const coinciden = new Set();
  NEGOCIOS.forEach(n => {
    const ok = !q || normalizar(n.nombre).includes(q);
    document.querySelector(`.item[data-id="${n.id}"]`).hidden = !ok;
    if (ok) { visibles++; coinciden.add(n.id); }
  });
  document.querySelectorAll(".mod.ocupado").forEach(b =>
    b.classList.toggle("atenuado", !!q && !coinciden.has(negocioPorModulo[b.dataset.mod])));
  $sinResultados.hidden = visibles > 0;
}
$buscar.addEventListener("input", filtrar);

/* ----- Imagen que cambia con la selección ----- */
const IMAGEN_BASE = "img/ZonaUni.png";       // imagen por defecto (debe ser igual al src de #img-base en index.html)
const CARPETA_IMAGENES = "img/negocios/";    // carpeta con las fotos de cada negocio
const EXTENSION = ".jpg";                    // extensión de esas fotos (".png" si usas png)

/* La foto de cada negocio se busca sola: carpeta + nombre del negocio + extensión.
   Nombre del archivo = nombre del negocio en minúsculas, sin tildes y con guiones.
   Ejemplos: "Judith crochet" -> img/negocios/judith-crochet.jpg
             "Salume artesanías" -> img/negocios/salume-artesanias.jpg
   Si un negocio necesita otra ruta, agrega  imagen: "img/otra.jpg"  en DETALLES.
   Si la foto no existe todavía, se muestra la imagen por defecto. */
const archivoDe = nombre => normalizar(nombre).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function rutaImagen(n) {
  const d = DETALLES[n.nombre];
  return (d && d.imagen) || `${CARPETA_IMAGENES}${archivoDe(n.nombre)}${EXTENSION}`;
}

/* Ayuda: escribe  nombresDeArchivo()  en la consola (F12) para ver cómo debe llamarse cada foto */
window.nombresDeArchivo = () =>
  console.table(NEGOCIOS.map(n => ({ negocio: n.nombre, archivo: rutaImagen(n) })));

const $imgBase = document.getElementById("img-base");
const $imgNueva = document.getElementById("img-nueva");
let imagenActual = IMAGEN_BASE;
let tokenImagen = 0;

function terminarCascada() {
  if (!$imgNueva.classList.contains("cae")) return;
  $imgBase.setAttribute("src", $imgNueva.getAttribute("src"));
  $imgNueva.classList.remove("cae");
}

$imgNueva.addEventListener("transitionend", e => {
  if (e.propertyName !== "clip-path") return;
  terminarCascada();
  $imgNueva.classList.remove("sube");
});

/* Cascada inversa: vuelve al logo recogiendo la foto hacia arriba */
function retraerImagen() {
  terminarCascada();                            // la foto actual queda en la capa de abajo
  const foto = $imgBase.getAttribute("src");
  if (foto === IMAGEN_BASE) return;             // ya se está viendo el logo
  $imgNueva.classList.remove("sube");
  $imgNueva.setAttribute("src", foto);          // se copia la foto a la capa de arriba
  $imgNueva.classList.add("fija");              // y se muestra completa, sin animación
  $imgBase.setAttribute("src", IMAGEN_BASE);    // debajo queda el logo
  void $imgNueva.offsetWidth;                   // fuerza al navegador a aplicar lo anterior
  $imgNueva.classList.remove("fija");
  $imgNueva.classList.add("sube");              // la foto sube y desaparece
}

function cambiarImagen(src) {
  if (src === imagenActual) return;
  imagenActual = src;
  const token = ++tokenImagen;
  if (src === IMAGEN_BASE) { retraerImagen(); return; }   // volver al logo: cascada inversa

  const precarga = new Image();
  precarga.onload = () => {
    if (token !== tokenImagen) return;   // si hubo otro clic mientras cargaba
    $imgNueva.classList.remove("sube");
    terminarCascada();                   // cierra la cascada anterior si seguía en curso
    $imgNueva.setAttribute("src", src);
    void $imgNueva.offsetWidth;          // reinicia la animación
    $imgNueva.classList.add("cae");
  };
  precarga.onerror = () => {
    if (token !== tokenImagen) return;
    // La foto de este negocio todavía no existe: se vuelve a la imagen por defecto
    imagenActual = $imgNueva.classList.contains("cae")
      ? $imgNueva.getAttribute("src")
      : $imgBase.getAttribute("src");
    if (src !== IMAGEN_BASE) cambiarImagen(IMAGEN_BASE);
  };
  precarga.src = src;
}