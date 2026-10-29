
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

