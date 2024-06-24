import { Planeta } from "./planeta.js";
import { leer, escribir, limpiar, jsonToObject, objectToJson } from "./local-storage-delay.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";
import { PlanetaBase } from "./planeta-base.js";

const KEY_STORAGE = "planetas";
let items = [];
const formulario = document.getElementById("form-item");
let editIndex = null; 
const btnEliminar = document.getElementById("btn-eliminar");
const btnCancelar = document.getElementById("btn-cancelar");
let originalItem = null;

document.addEventListener("DOMContentLoaded", onInit);

function onInit() {
    actualizarAño();
    loadItems();
    escuchandoFormulario();
    escuchandoBtnDeleteAll();
    escuchandBtnCancelar();
}

function escuchandBtnCancelar(){
    btnCancelar.addEventListener("click", cancelarEdicion);
}

function cancelarEdicion(){
    if (editIndex !== null && originalItem){
        items[editIndex] = originalItem;
    }
    actualizarFormulario();
    editIndex = null;
    originalItem = null;
}

async function loadItems() {
    mostrarSpinner();
    let str = await leer(KEY_STORAGE);
    ocultarSpinner();
    let objetos = jsonToObject(str) || [];

    if (Array.isArray(objetos)) {
        objetos.forEach(obj => {
            const model = new Planeta(
                obj.nombre,
                obj.tamano,
                obj.masa,
                obj.tipo,
                obj.distanciaAlSol,
                obj.presentaVida,
                obj.presentaAnillo,
                obj.composicionAtmosferica
            );
            model.id = obj.id;
            items.push(model);
        });

        const maxId = Math.max(...items.map(item => item.id), 0) + 1; /*https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax lo saque de aca al spread, lo uso para conseguir el id mas alto*/
        PlanetaBase.nextId = maxId + 1;

        rellenarTabla();
    } else {
        console.error("los datos no son array");
    }
}

function rellenarTabla() {
    const tabla = document.getElementById("table-items");
    let tbody = document.getElementsByTagName('tbody')[0];

    tbody.innerHTML = '';

    const celdas = ["id", "nombre", "tamano", "masa", "tipo", "distanciaAlSol", "presentaAnillo", "presentaVida", "composicionAtmosferica"];

    items.forEach((item, index) => {
        let nuevaFila = document.createElement("tr");

        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            nuevaCelda.textContent = item[celda] || "";
            nuevaFila.appendChild(nuevaCelda);
        });

        let celdaBotones = document.createElement("td");
        celdaBotones.className = "flex td-action";

        let botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "btn btn-update";
        botonEditar.setAttribute("data-id", item.id);
        botonEditar.onclick = function () { onUpdate(items.findIndex(i => i.id === item.id)) };

        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-danger";
        botonEliminar.setAttribute("data-id", item.id);
        botonEliminar.onclick = function () { onDelete(items.findIndex(i => i.id === item.id)) };

        celdaBotones.appendChild(botonEditar);
        celdaBotones.appendChild(botonEliminar);

        nuevaFila.appendChild(celdaBotones);
        tbody.appendChild(nuevaFila);
    });
}

async function escuchandoFormulario() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        
        let model;
        if(editIndex !== null)
        {
            model = items[editIndex];
            model.nombre = formulario.querySelector("#nombre").value;
            model.tamano = parseFloat(formulario.querySelector("#tamano").value);
            model.masa = formulario.querySelector("#masa").value;
            model.tipo = formulario.querySelector("#tipo").value;
            model.distanciaAlSol = parseFloat(formulario.querySelector("#distancia").value);
            model.presentaVida = formulario.querySelector("#vida").checked;
            model.presentaAnillo = formulario.querySelector("#anillo").checked;
            model.composicionAtmosferica = formulario.querySelector("#composicion").value;
        }
        else{

            model = new Planeta(
                formulario.querySelector("#nombre").value,
                formulario.querySelector("#tamano").value,
                formulario.querySelector("#masa").value,
                formulario.querySelector("#tipo").value,
                formulario.querySelector("#distancia").value,
                formulario.querySelector("#vida").checked,
                formulario.querySelector("#anillo").checked,
                formulario.querySelector("#composicion").value
            );
        }

        const rta = model.verify();

        if (rta) {
            if (editIndex !== null) {
                model.id = items[editIndex].id;
                items[editIndex] = model;
                editIndex = null;
                originalItem = null;
                btnEliminar.style.display = "none";
            } else {
                items.push(model);
            }

            const str = objectToJson(items);

            mostrarSpinner();
            await escribir(KEY_STORAGE, str);
            ocultarSpinner();
            actualizarFormulario();
            rellenarTabla();
        }
    });
}

function actualizarFormulario() {
    formulario.reset();
    editIndex = null;
    originalItem = null;
    btnEliminar.style.display ="none";
}

async function escuchandoBtnDeleteAll() {
    const btn = document.getElementById("btn-delete-all");

    btn.addEventListener("click", async () => {
        const rta = confirm("Desea eliminar todos los items?");

        if (rta) {
            items.splice(0, items.length);

            mostrarSpinner();
            await limpiar(KEY_STORAGE);
            ocultarSpinner();
            rellenarTabla();
        }
    });
}

function actualizarAño() {
    const yearElement = document.getElementById("year");
    const año = new Date().getFullYear();
    yearElement.textContent = año;
}

async function onDelete(index) { 
    const rta = confirm('Desea eliminar el item?');
    mostrarSpinner();

    if (rta) {
        try {
            items.splice(index, 1); 
            const str = objectToJson(items);
            await escribir(KEY_STORAGE, str);
            rellenarTabla(); 
        } catch (error) {
            console.error(error);
        }
    }

    ocultarSpinner();
}

function onUpdate(index) {
    const item = items[index];
    originalItem = {...item};

    formulario.querySelector("#nombre").value = item.nombre;
    formulario.querySelector("#tamano").value = item.tamano;
    formulario.querySelector("#masa").value = item.masa;
    formulario.querySelector("#tipo").value = item.tipo;
    formulario.querySelector("#distancia").value = item.distanciaAlSol;
    formulario.querySelector("#vida").checked = item.presentaVida;
    formulario.querySelector("#anillo").checked = item.presentaAnillo;
    formulario.querySelector("#composicion").value = item.composicionAtmosferica;

    editIndex = index;

    btnEliminar.style.display = "inline-block";

    btnEliminar.onclick = function() { onDelete(index);};
}