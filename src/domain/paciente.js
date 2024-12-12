import { Model } from "sequelize";
import { DateTime } from 'luxon';

import ErroPaciente from "./erro-paciente.js";
import Result from "./result.js";

/**
 * Classe Paciente do dominio
 */
export class Paciente extends Model {
    static async of(cpf, nome, dtNasc) {
        const errors = [];

        const hoje = DateTime.now();
        const idade = hoje.diff(dtNasc, 'years').years;

        if (!this.validaCPF(cpf)) {
            errors.push(ErroPaciente.CPF_INVALIDO);
        }

        if (nome === null || nome.length < 5) {
            errors.push(ErroPaciente.NOME_INVALIDO);
        }

        if (!dtNasc.isValid) {
            errors.push(ErroPaciente.DT_NASC_INVALIDA);
        }

        if (idade < 13) {
            errors.push(ErroPaciente.IDADE_INVALIDA);
        }

        const existingPaciente = await Paciente.findOne({ where: { cpf } });
        if (existingPaciente) {
            errors.push(ErroPaciente.CPF_DUPLICADO);
        }

        const dtNascimento = dtNasc.toJSDate();

        return errors.length == 0
               ? Result.success(Paciente.build({ cpf, nome, dtNascimento }))
               : Result.failure(errors);
    }

    async agenda(consulta) {
        try {
            await this.addConsulta(consulta);
            return true;
        } catch {
            return false;
        }
    }

    static validaCPF(cpf) {
        // Remove non-numeric characters
        cpf = cpf.replace(/\D/g, "");

        // Ensure the CPF has 11 digits
        if (cpf.length !== 11) {
            return false;
        }

        // Check for invalid known CPFs (all digits are the same)
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        // Extract individual digits
        const num = cpf.split("").map(Number);

        // Calculate the first check digit
        const soma1 = num[0] * 10 + num[1] * 9 + num[2] * 8 + num[3] * 7 + num[4] * 6 +
                        num[5] * 5 + num[6] * 4 + num[7] * 3 + num[8] * 2;
        let resto1 = (soma1 * 10) % 11;
        if (resto1 === 10) resto1 = 0;

        // Verify the first check digit
        if (resto1 !== num[9]) {
            return false;
        }

        // Calculate the second check digit
        const soma2 = num[0] * 11 + num[1] * 10 + num[2] * 9 + num[3] * 8 + num[4] * 7 +
                        num[5] * 6 + num[6] * 5 + num[7] * 4 + num[8] * 3 + num[9] * 2;
        let resto2 = (soma2 * 10) % 11;
        if (resto2 === 10) resto2 = 0;

        // Verify the second check digit
        if (resto2 !== num[10]) {
            return false;
        }

        return true;
    }

}

export default Paciente;