import { Sequelize } from 'sequelize';
import Consulta from "../domain/consulta.js";
import Paciente from "../domain/paciente.js";
import dbConfig from "./config.js"

import createModelPaciente from './schema/pacientes.js';
import createModelConsulta from './schema/consultas.js';

/**
 * Classe responsável pelo acesso ao BD e à criação dos modelos e relacionamentos
 */

class Db {
    /**
     * Objeto que dá acesso às funcionalidades do Sequelize
     */
    #sequelize;

    /**
     * Inicializa o BD
     */
    async init() {
        this.#sequelize = new Sequelize(
            dbConfig.database,
            dbConfig.username,
            dbConfig.password,
            {
                host: dbConfig.host,
                dialect: dbConfig.dialect,
                logging: false
            }
        );

        try {
            await this.#sequelize.authenticate();
        } catch (error) {
            return false;
        }

        // Criando os modelos (tabelas)
        createModelPaciente(Paciente, this.#sequelize, Sequelize.DataTypes);
        createModelConsulta(Consulta, this.#sequelize, Sequelize.DataTypes);

        // Criando os relacionamentos
        Paciente.hasMany(Consulta, { foreingKey: 'cpf' });
        Consulta.belongsTo(Paciente, { foreingKey: 'cpf' });

        return true;
    }

    get sequelize() {
        return this.#sequelize;
    }
}

const db = new Db();
export default db;