import { Model, Op } from "sequelize";
import { DateTime } from 'luxon';

import ErroConsulta from "./erro-consulta.js";
import Result from "./result.js";


/**
 * Classe Consulta do dominio
 */
export class Consulta extends Model {
    static async of(dtIni, dtFim) {
        const errors = [];
        const duracao = dtFim.diff(dtIni, 'minutes');

        const dtIniJS = dtIni.toJSDate();
        const dtFimJS = dtFim.toJSDate(); 
        
        if (duracao <= 0) {
            errors.push(ErroConsulta.DT_INVALIDO);
        }

        const conflictingConsulta = await Consulta.findOne({
            where: {
                [Op.or]: [
                    {
                        dtInicio: {
                            [Op.between]: [dtIniJS, dtFimJS]
                        }
                    },
                    {
                        dtFim: {
                            [Op.between]: [dtIniJS, dtFimJS]
                        }
                    },
                    {
                        [Op.and]: [
                            { dtInicio: { [Op.lte]: dtIniJS } },
                            { dtFim: { [Op.gte]: dtFimJS } }
                        ]
                    }
                ]
            }
        });

        if (conflictingConsulta) {
            errors.push(ErroConsulta.CONFLITO_HORARIO);
        }

        return errors.length == 0
               ? Result.success(Consulta.build({ dtInicio: dtIniJS, dtFim: dtFimJS }))
               : Result.failure(errors);
    }
}

export default Consulta;