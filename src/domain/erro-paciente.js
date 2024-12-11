/**
 * Classe para representar os erros de validacao do Paciente
 */
class ErroPaciente {
    static get CPF_INVALIDO() {
        return 1;
    }

    static get CPF_DUPLICADO() {
        return 2;
    }

    static get NOME_INVALIDO() {
        return 3;
    }

    static get DT_NASC_INVALIDA() {
        return 4;
    }

    static get IDADE_INVALIDA() {
        return 5;
    }
}

export default ErroPaciente;