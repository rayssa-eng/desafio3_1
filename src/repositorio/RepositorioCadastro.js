import Paciente from "../domain/paciente.js";

class RepositorioCadastro {
    /**
     * Salva um paciente no cadastro (insert ou update)
     * @param {Paciente} paciente 
     */
    async salva(paciente) {
        if (paciente !== null) await paciente.save();
    }

    /**
     * Remove um paciente do cadastro
     * 
     * @param {Paciente} paciente
     */
    async remove(paciente) {
        if (paciente !== null) await paciente.destroy();
    }

    /**
     * 
     * @param {string} cpf 
     * @returns Paciente ou null se não existir 
     */
    async buscaPorCPF(cpf) {
        return await Paciente.findOne({ where: { cpf } });
    }

    async buscaPorCPFComConsultas(cpf) {
        return await Paciente.findOne({ include: "Consulta", where: { cpf } });
    }

     /**
     * Busca todos os pacientes com suas consultas agendadas
     * @param {string} ordenacao Critério de ordenação (ex: 'cpf', 'nome')
     * @returns {Paciente[]} Lista de pacientes com consultas
     */
     async buscaTodosComConsultas(ordenacao) {
        return await Paciente.findAll({
            include: {
                model: Consulta,
                as: 'consultas',
            },
            order: [
                [ordenacao, 'ASC']
            ]
        });
    }

}

const repositorioCadastro = new RepositorioCadastro();
export default repositorioCadastro;