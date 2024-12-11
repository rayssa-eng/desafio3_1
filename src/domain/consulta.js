import { Model } from "sequelize";
import { DateTime } from 'luxon';

import ErroConsulta from "./erro-consulta.js";
import Result from "./result.js";


/**
 * Classe Consulta do dominio
 */
export class Consulta extends Model {
    static async of(dtIni, dtFim) {
        const errors = [];
        const duracao = this.dtFim.diff(this.dtIni, 'minutes');
        
        if (duracao <= 0) {
            errors.push(ErroConsulta.DT_INVALIDO);
        } 

        const conflictingConsulta = await Consulta.findOne({
            where: {
                [Op.or]: [
                    {
                        dtIni: {
                            [Op.between]: [dtIni, dtFim]
                        }
                    },
                    {
                        dtFim: {
                            [Op.between]: [dtIni, dtFim]
                        }
                    },
                    {
                        [Op.and]: [
                            { dtIni: { [Op.lte]: dtIni } },
                            { dtFim: { [Op.gte]: dtFim } }
                        ]
                    }
                ]
            }
        });

        if (conflictingConsulta) {
            errors.push(ErroConsulta.CONFLITO_HORARIO);
        }

        return errors.length == 0
               ? Result.success(Consulta.build({ dtIni, dtFim }))
               : Result.failure(errors);
    }
}

export default Consulta;