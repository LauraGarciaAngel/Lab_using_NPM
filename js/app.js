
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

document.addEventListener("DOMContentLoaded", () => {
  const hoyFormateado = dayjs().format("YYYY-MM-DD");
  inputFecha.max = hoyFormateado;

  cargarApod();
});

function mostrarCargando(espera) {
  if (espera) {
    cargando.classList.remove("hidden");
    contenedorApod.classList.add("hidden");
  } else {
    cargando.classList.add("hidden");
    contenedorApod.classList.remove("hidden");
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