import { DataTypes } from "sequelize";

const createModelConsulta = (Consulta, sequelize, DataTypes) => {
    Consulta.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            dtInicio: { 
                type: DataTypes.DATE, 
                allowNull: false 
            },
            dtFim: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            sequelize, // We need to pass the connection instance
            indexes: [ { fields: ["id"] } ]
        }

    )
}

export default createModelConsulta;