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

function validarFecha() {
  const div = document.createElement("div");
  div.innerHTML = "";

  const hoyMs = Date.now();
  //getTime() trae todos los milisegundos pasados desde 1970 hasta la fecha introducida por el usuario
  const inputFechaMs = new Date(inputFecha.value).getTime();

  const fechaInicioMs = new Date("1995-06-15").getTime();

  if (inputFechaMs > hoyMs || inputFechaMs < fechaInicioMs) {

    div.innerHTML = `
        <p>La foto elegida no existe</p>
    `;
    formBuscar.appendChild(div);
  }
}

btnBuscar.addEventListener("click", validarFecha);
