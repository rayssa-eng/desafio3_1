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
        if (consulta !== null) {
            await consulta.save();
            return true;
        }
        return false;
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

    
    /**
     * Busca uma consulta por CPF do paciente, data e hora inicial.
     * 
     * @param {string} cpf CPF do paciente
     * @param {string} dataConsulta Data da consulta (yyyy-MM-dd)
     * @param {string} horaInicio Hora inicial (HHmm)
     * @returns {Consulta | null} Consulta encontrada ou null
     */
    async buscaConsultaPorPacienteDataHora(cpf, dataConsulta, horaInicio) {
        return await Consulta.findOne({
            include: {
                model: Paciente,
                where: { cpf }
            },
            where: {
                data: dataConsulta,
                horaInicio: horaInicio
            }
        });
    }
}

const repositorioAgenda = new RepositorioAgenda();
export default repositorioAgenda;