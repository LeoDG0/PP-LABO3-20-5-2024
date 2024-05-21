import { Planeta } from "./planeta.js";
import { leer, escribir, limpiar, jsonToObject, objectToJson } from "./local-storage-delay.js";
import { mostrarSpinner, ocultarSpinner} from "./spinner.js";

const KEY_STORAGE = "planetas";
let items = [];
const formulario = document.getElementById("form-item");



document.addEventListener("DOMContentLoaded", onInit);

function onInit(){
    
    actualizarAño();
    loadItems();
    

    escuchandoFormulario();
    escuchandoBtnDeleteAll();
}

async function loadItems(){
    mostrarSpinner();
    let str = await leer(KEY_STORAGE);
    ocultarSpinner();
    let objetos = jsonToObject(str) || [];

    if(Array.isArray(objetos))
    {
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
    
            items.push(model);
        });

        rellenarTabla();
    }
    else{
        console.error("los datos no son array");
    }
    
}

function rellenarTabla(){
    const tabla = document.getElementById("table-items");
    let tbody = document.getElementsByTagName('tbody')[0];

    tbody.innerHTML = '';

    const celdas = ["id", "nombre", "tamano", "masa", "tipo", "distanciaAlSol", "presentaAnillo", "presentaVida", "composicionAtmosferica"];

    items.forEach((item) => {
        let nuevaFila = document.createElement("tr");

        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            nuevaCelda.textContent = item[celda] || "";

            nuevaFila.appendChild(nuevaCelda);
        })

        tbody.appendChild(nuevaFila);
    });
}

async function escuchandoFormulario(){
    // const formulario = document.getElementById("form-item");

    formulario.addEventListener("submit", async (e)=> {

        e.preventDefault();

        const model = new Planeta(
            formulario.querySelector("#nombre").value,
            formulario.querySelector("#tamano").value,
            formulario.querySelector("#masa").value,
            formulario.querySelector("#tipo").value,
            formulario.querySelector("#distancia").value,
            formulario.querySelector("#vida").checked,
            formulario.querySelector("#anillo").checked,
            formulario.querySelector("#composicion").value
        );
        
        const rta = model.verify();

        if(rta){
            items.push(model);
            const str = objectToJson(items);

            mostrarSpinner();
            await escribir(KEY_STORAGE, str);
            ocultarSpinner();
            actualizarFormulario();
            rellenarTabla();
        }
    });   
}

function actualizarFormulario(){
    formulario.reset();
}


async function escuchandoBtnDeleteAll(){
    const btn = document.getElementById("btn-delete-all");

    btn.addEventListener("click", async (e) => {
        const rta = confirm("Desea eliminar todos los items?");

        if(rta){
            items.splice(0, items.length);
            
            mostrarSpinner();
            let str = await limpiar(KEY_STORAGE);
            ocultarSpinner();
            rellenarTabla();
        }
    });
}

function actualizarAño(){
    const yearElement = document.getElementById("year");

    const año = new Date().getFullYear();

    yearElement.textContent = año;
}
