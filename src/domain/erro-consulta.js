/**
 * Classe que representa os erros de validacao da Consulta marcada
 */
class ErroConsulta {
    static get CONFLITO_HORARIO() {
        return 1;
    }

    static get PACIENTE_INVALIDO() {
        return 2;
    }

    static get DT_INVALIDO() {
        return 3;
    }
}

export default ErroConsulta;