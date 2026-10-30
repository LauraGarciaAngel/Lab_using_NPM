dayjs.locale("es");

const API = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";
const FAVORITOS = "favoritosApod";

const formBuscar = document.getElementById("form-buscar");
const inputFecha = document.getElementById("input-fecha");
const btnBuscar = document.getElementById("btn-buscar");
const btnFavorito = document.getElementById("btn-favorito");
const mensaje = document.getElementById("mensaje");
const cargando = document.getElementById("cargando");
const apod = document.getElementById("apod");
const listaFavoritos = document.getElementById("lista-favoritos");
const favoritosVacio = document.getElementById("favoritos-vacio");

let apodActual;
let favoritos = JSON.parse(localStorage.getItem(FAVORITOS)) || [];

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.hidden = !texto;
}

function mostrarApod(foto) {
  apodActual = foto;
  inputFecha.value = foto.date;
  document.getElementById("apod-titulo").textContent = foto.title;
  document.getElementById("apod-fecha").textContent = dayjs(foto.date).format(
    "D [de] MMMM [de] YYYY"
  );
  document.getElementById("apod-imagen").src = foto.hdurl;
  document.getElementById("apod-imagen").alt = foto.title;
  document.getElementById("apod-explicacion").innerHTML = foto.explanation;

  const enlaceVideo = document.getElementById("apod-video");
  enlaceVideo.hidden = foto.media_type !== "video";
  enlaceVideo.href = foto.permalink;

  apod.hidden = false;
  btnFavorito.disabled = false;
}

async function cargarApod(fecha) {
  mostrarMensaje("");
  cargando.hidden = false;
  btnBuscar.disabled = true;
  btnFavorito.disabled = true;

  try {
    let url = `${API}?per_page=1`;
    if (fecha) {
      url = `${API}/${dayjs(fecha).format("YYMMDD")}`;
    }

    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(
        respuesta.status === 404
          ? "No hay APOD para esa fecha."
          : `NASA respondió con el estado ${respuesta.status}.`
      );
    }

    const datos = await respuesta.json();
    mostrarApod(fecha ? datos : datos[0]);
  } catch (error) {
    mostrarMensaje(`No se pudo cargar la foto: ${error.message}`);
  } finally {
    cargando.hidden = true;
    btnBuscar.disabled = false;
  }
}

function mostrarFavoritos() {
  listaFavoritos.innerHTML = "";
  favoritosVacio.hidden = favoritos.length > 0;

  favoritos.forEach((favorito) => {
    const elemento = document.createElement("li");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "favorite-load";
    boton.textContent = `${favorito.title} — ${dayjs(favorito.date).format(
      "D [de] MMMM [de] YYYY"
    )}`;
    boton.addEventListener("click", () => cargarApod(favorito.date));
    elemento.appendChild(boton);
    listaFavoritos.appendChild(elemento);
  });
}

function guardarFavorito() {
  if (favoritos.some((favorito) => favorito.date === apodActual.date)) {
    mostrarMensaje("Esta APOD ya está en favoritos.");
    return;
  }

  favoritos.push({ date: apodActual.date, title: apodActual.title });
  localStorage.setItem(FAVORITOS, JSON.stringify(favoritos));
  mostrarFavoritos();
  mostrarMensaje("APOD guardada en favoritos.");
}

formBuscar.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const fecha = inputFecha.value;

  if (!fecha) {
    mostrarMensaje("Elige una fecha para buscar.");
  } else if (dayjs(fecha).isAfter(dayjs(), "day")) {
    mostrarMensaje("No puedes elegir una fecha futura.");
  } else if (dayjs(fecha).isBefore(dayjs("1995-06-16"), "day")) {
    mostrarMensaje("La primera APOD es del 16 de junio de 1995.");
  } else {
    cargarApod(fecha);
  }
});

btnFavorito.addEventListener("click", guardarFavorito);

inputFecha.max = dayjs().format("YYYY-MM-DD");
inputFecha.value = inputFecha.max;
mostrarFavoritos();
cargarApod();
