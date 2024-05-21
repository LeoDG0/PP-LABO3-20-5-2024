class PlanetaBase {

    static nextId = 1;

    constructor(nombre, tamano, masa, tipo) {
      this.id = PlanetaBase.nextId++;
      this.nombre = nombre;
      this.tamano = tamano;
      this.masa = masa;
      this.tipo = tipo;
    }
  
    verify() {
      
        const errores = [];
        
        const checkNombre = this.checkNombre();
        if (!checkNombre.success) {
            errores.push(checkNombre.rta);
        }

        const checkTamano = this.checkTamano();
        if (!checkTamano.success) {
            errores.push(checkTamano.rta);
        }

        const checkMasa = this.checkMasa();
        if (!checkMasa.success) {
            errores.push(checkMasa.rta);
        }

        const checkTipo = this.checkTipo();
        if (!checkTipo.success) {
            errores.push(checkTipo.rta);
        }

        return errores.length === 0 ? {success: true, errores: null} : {success: false, errores};
    }
    
    
    checkNombre() {
        
        if (typeof this.nombre !== "string" || this.nombre.trim() === ""){
            return {success: false, rta: "El nombre no puede quedar vacio!"};
        }

        if(this.nombre.length < 3){
            return {success: false, rta: "nombre demasiado corto!(min 3 letras)"};
        }

        if (this.nombre.length > 100){
            return {success: false, rta: "nombre demasiado grande!(max 100 letras)"};
        }

        return { success: true, rta: ""};
    }

    checkTamano(){
        if (typeof this.tamano !== "number" || isNaN(this.tamano) || this.tamano <= 0){
            return {success: false, rta: "El tamaño debe ser un numero positivo."};
        }
        return {success: true, rta: ""};
    }

    checkMasa() {
        
        if (typeof this.masa !== "string" || this.masa.trim() === ""){
            return {success: false, rta: "El masa no puede quedar vacio!"};
        }

        if(this.masa.length < 3){
            return {success: false, rta: "masa demasiado corto!(min 3 letras)"};
        }

        if (this.masa.length > 100){
            return {success: false, rta: "masa demasiado grande!(max 12 letras)"};
        }

        return { success: true, rta: ""};
    }

    checkTipo() {
        const tiposValidos = ["rocoso", "gaseoso", "helado", "enano"];
        if (typeof this.tipo !== "string" || this.tipo.trim() === "") {
            return { success: false, rta: "El tipo no puede quedar vacío!" };
        }

        if (!tiposValidos.includes(this.tipo)) {
            return { success: false, rta: "Tipo no valido! Seleccione un tipo de la lista." };
        }

        return { success: true, rta: "" };
    }

  }
  
  export { PlanetaBase };