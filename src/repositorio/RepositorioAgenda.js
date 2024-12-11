import Consulta from "../domain/consulta.js";
import Paciente from "../domain/paciente.js";

/**
 * Repositório que representa a agenda de consultas
 * da clínica
 */
class RepositorioAgenda {
    /**
     * Salva uma consulta na agenda
     * 
     * @param {Consulta} consulta 
     */
    async salva(consulta) {
        if (consulta !== null) await consulta.save();
    }

    /**
     * Remove uma consulta da agenda
     * 
     * @param {Consulta} consulta 
     */
    async remove(consulta) {
        if (consulta !== null) await consulta.destroy();
    }

    /**
     * 
     * Recupera todas as consultas
     * 
     * @returns Lista de consultas 
     */
    async buscaTodas() {
        return await Consulta.findAll();
    }



}

const repositorioAgenda = new RepositorioAgenda();
export default repositorioAgenda;