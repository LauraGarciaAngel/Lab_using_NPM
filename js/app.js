dayjs.locale("es");

const API = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";
const PRIMERA_APOD = "1995-06-16";
const FAVORITOS = "favoritosApod";

let apodActual = null;

// =====DOM =====
const inputFecha = document.getElementById("input-fecha");
const btnBuscar = document.getElementById("btn-buscar");
const mensaje = document.getElementById("mensaje");
const cargando = document.getElementById("cargando");
const contenedorApod = document.getElementById("apod");
const apodTitulo = document.getElementById("apod-titulo");
const apodFecha = document.getElementById("apod-fecha");
const apodImagen = document.getElementById("apod-imagen");
const apodVideo = document.getElementById("apod-video");
const apodExplicacion = document.getElementById("apod-explicacion");
const btnFavorito = document.getElementById("btn-favorito");
const listaFavoritos = document.getElementById("lista-favoritos");
const favoritosVacio = document.getElementById("favoritos-vacio");
const formBuscar = document.getElementById("form-buscar");
const div = document.createElement("div");

document.addEventListener("DOMContentLoaded", () => {
  const hoyFormateado = dayjs().format("YYYY-MM-DD");
  inputFecha.max = hoyFormateado;

  cargarApod();
});

function mostrarCargando(espera) {
  if (espera) {
    cargando.hidden = false; 
    contenedorApod.hidden = true;
  } else {
    cargando.hidden = true;
    contenedorApod.hidden = false; 
  }
}

function mostrarMensaje(texto, tipo = "error") {
  mensaje.innerHTML = `
    <div class="alert alert-${tipo}">
      ${texto}
    </div>
  `;
}

function limpiarMensajes() {
  mensaje.innerHTML = "";
}

async function cargarApod(fechaEscogida = null) {
  mostrarCargando(true);
  limpiarMensajes();

  let url = API;

  if (fechaEscogida) {
    const fechaFormateadaAPI = dayjs(fechaEscogida).format("YYMMDD");
    url = `${API}/${fechaFormateadaAPI}`;
  } 
  else {
    url = `${API}?per_page=1`;
  }
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error("No hay APOD para esa fecha");
    }

    const datos = await respuesta.json();

    apodActual = Array.isArray(datos) ? datos[0] : datos;

    if (!apodActual) {
      throw new Error("No se encontraron datos para la APOD.");
    }

    renderizarApod(apodActual);
  } 
  catch (error) {
    contenedorApod.classList.add("hidden");
    mostrarMensaje(error.message, "error");
  } 
  finally {
    mostrarCargando(false);
  }
}

function renderizarApod(apod) {
  apodTitulo.textContent = apod.title || "Sin título";

  const fechaEsp = dayjs(apod.date).format("D [de] MMMM [de] YYYY");
  apodFecha.textContent = fechaEsp;

  inputFecha.value = apod.date;

  apodImagen.src = apod.hdurl || "";
  apodImagen.alt = apod.title || "Imagen de la NASA";

  if (apod.media_type === "video") {
    apodVideo.href = apod.permalink || apod.url || "#";
  } 

  apodExplicacion.innerHTML = apod.explanation || "<p>Sin descripción disponible.</p>";
}

function validarFecha() {
  div.innerHTML = "";

  if(inputFecha.value == ""){
    div.innerHTML = `
        <p>La fecha no puede estar vacia</p>
    `;
    formBuscar.appendChild(div);
    return;
  }

  const hoyMs = Date.now();
  //getTime() trae todos los milisegundos pasados desde 1970 hasta la fecha introducida por el usuario
  const inputFechaMs = new Date(inputFecha.value).getTime();

  const fechaInicioMs = new Date("1995-06-15").getTime();

  if (inputFechaMs > hoyMs || inputFechaMs < fechaInicioMs) {

    div.innerHTML = `
        <p>La foto elegida no existe</p>
    `;
    formBuscar.appendChild(div);
    return;
  }
  cargarApod(inputFecha.value);
}

btnBuscar.addEventListener("click", validarFecha);

// Favoritos parte 3 Andres :)
function guardarFavorito() {
    if (!apodActual) {
        mensaje.textContent = "No hay APOD cargada para guardar";
        return;
    }

    let favoritos = JSON.parse(localStorage.getItem(FAVORITOS)) || [];

    const existe = favoritos.some(fav => fav.date === apodActual.date);

    if (existe) {
        mensaje.textContent = "esta APOD ya guardado en favoritos.";
        return;
    }

    // Guardamos date y title
    const FavoritoNuevo = {
        date: apodActual.date,
        title: apodActual.title
    };

    favoritos.push(FavoritoNuevo);

    // guardamos en localStorage
    localStorage.setItem(FAVORITOS, JSON.stringify(favoritos));

    mensaje.textContent = "se guardo la APOD en favoritos";
    renderizarFav();
}

function renderizarFav() {
    if (!listaFavoritos) return;
    listaFavoritos.innerHTML = "";

    let favoritos = JSON.parse(localStorage.getItem(FAVORITOS)) || [];

    // se usa hidden para mostrar o ocultar el mensaje de "vacio"
    if (favoritosVacio) {
        favoritosVacio.hidden = favoritos.length > 0;
    }

    favoritos.forEach(fav => {
        const li = document.createElement("li");
        li.textContent = `${fav.date} - ${fav.title}`;

        // evento del clic en un favorito se carga el APOD[cite : 6]
        li.addEventListener("click", () => {
            // aqui agrego la funcion de busca por fecha pasandole el fav.date
        cargarApod(fav.date);
        });
        listaFavoritos.appendChild(li);
    });
}

// Escuchadores de evento para favorito
if (btnFavorito) {
    btnFavorito.addEventListener("click", guardarFavorito);
}
// cargo la lista de favoritos
document.addEventListener("DOMContentLoaded", () => {
    renderizarFav();
})