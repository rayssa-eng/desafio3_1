import { DateTime } from "luxon";
import db from "./db/db.js";
import Consulta from "./domain/consulta.js";
import Paciente from './domain/paciente.js';
import repositorioAgenda from './repositorio/RepositorioAgenda.js';
import repositorioCadastro from './repositorio/RepositorioCadastro.js';



const initialized = await db.init();

if (!initialized) {
    console.log("Ocorreu um problema na conexão com o BD");
    process.exit(1);
}

const paciente = Paciente.build({
    cpf: '12345678901',
    nome: 'John Doe',
    dtNascimento: new Date(2000,0,1)
});

const [day, month, year, hour, minute] = '16/03/2024 10:30'.split(/[/ :]/);
const dtIni = new Date(year, month - 1, day, hour, minute);
const dtFim = new Date('2024-03-16T11:00:00');

const consulta = Consulta.build({
    dtIni: dtIni,
    dtFim: dtFim
})

function listAllMethods(obj) {
    let methods = new Set();
    while (obj = Object.getPrototypeOf(obj)) {
        Object.getOwnPropertyNames(obj).forEach((method) => methods.add(method));
    }
    return Array.from(methods);
}

// repositorioCadastro.salva(paciente);

console.log('Instance methods:', listAllMethods(paciente));
console.log('Instance methods:', listAllMethods(consulta));
console.log(await repositorioCadastro.buscaPorCPF("15765222706"));


// Executar o comando abaixo somente na primeira vez para criar 
// as tabelas do schema
// await db.sequelize.sync({ force: true });