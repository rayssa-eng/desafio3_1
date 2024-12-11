/**
 * Define as propriedades da classe Paciente e o mapeamento dessas propriedades para a tabela do BD
 *  
 * @param {Paciente} Paciente Classe a ser modelada
 * @param {Sequelize} sequelize Instância do Sequelize
 * @param {Sequelize.DataTypes} DataTypes Tipos de dados do Sequelize
 */
const createModelPaciente = (Paciente, sequelize, DataTypes) => {
    Paciente.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            cpf: {
                type: DataTypes.STRING(11),
                primaryKey: true,
                allowNull: false
            },
            nome: {
                type: DataTypes.STRING(100), 
                allowNull: false
            },
            dtNascimento: {
                type: DataTypes.DATEONLY,
                allowNull: false
            }
        },
        {
            sequelize,
            indexes: [{ unique: true, fields: ["cpf"] }]
        }
    );
};

export default createModelPaciente;