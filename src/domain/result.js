class Result {
    /**
     * Resultado caso a operacao tenha sucesso
     */
    #data;

    /**
     * Lista de erros caso a operacao falhe
     */
    #errors;

    constructor(data, errors) {
        this.#data = data;
        this.#errors = errors;
    }

    get isSuccess() {
        return this.#data !== null;
    }

    get isFailure() {
        return this.#errors !== null;
    }

    get data() {
        return this.#data;
    }

    get errors() {
        return this.#errors;
    }

    /**
     * Cria o objeto caso a operacao tenha sucesso
     * 
     * @param {Any} data 
     * @returns Objeto Result
     */
    static success(data) {
        return new Result(data, null);
    }

    /**
     * Cria o objeto caso a operacao fracasse
     * 
     * @param {Array} errors 
     * @returns Objeto Result
     */
    static failure(errors) {
        return new Result(null, errors);
    }
}

export default Result;