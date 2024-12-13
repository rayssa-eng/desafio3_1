import { DateTime } from 'luxon';
import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });

import  menuPrincipal  from "./menuPrincipal.js";
import repositorioCadastro from "./repositorio/RepositorioCadastro.js";
import repositorioAgenda from "./repositorio/RepositorioAgenda.js";

import Paciente from "./domain/paciente.js";

export class MenuCadastro {

    mostrarMenu() {
        console.log('Menu do Cadastro de Pacientes');
        console.log('1-Cadastrar novo paciente');
        console.log('2-Excluir paciente');
        console.log('3-Listar pacientes (ordenado por CPF)');
        console.log('4-Listar pacientes (ordenado por nome)');
        console.log('5-Voltar p/ menu principal');

        const opcao = parseInt(prompt(""), 10);

        console.log('--------------------------------------------------------------');

        return opcao;
    }

    async handleOpcaoUsuario(opcao) {
        switch (opcao) {
            case 1:
                await this.novoCadastro();
                break;
            case 2:
                await this.excluirCadastro();
                break;
            case 3:
                await this.mostrarListaPacientes('cpf');
                break;
            case 4:
                await this.mostrarListaPacientes('nome');
                break;
            case 5:
                menuPrincipal.start();
                return;
            default:
                console.log('Opção inválida.');
        }
        console.log('\n');
        this.start();
    }

    async novoCadastro() {
        const novoCPF = prompt("CPF: ");

        if (!(Paciente.validaCPF(novoCPF))) {
            console.error("CPF inválido.");
            console.log('--------------------------------------------------------------');

            this.start();
        }

        if (await repositorioCadastro.buscaPorCPF(novoCPF)) {
            console.error('Erro: CPF já cadastrado');
            console.log('--------------------------------------------------------------');
            this.start();
        }

        const novoNome        = prompt("Nome: ");

        if (!novoNome || novoNome.length < 5) {
            console.error("\nNome deve ter pelo menos 5 caracteres.");
            console.log('--------------------------------------------------------------');
            this.start();
        }

        const dtNascimento  = prompt("Data de nascimento (formato: DD/MM/YYYY): ");
        const dtNascimentoPaciente = DateTime.fromFormat(dtNascimento, 'dd/MM/yyyy');

        const hoje = DateTime.now();
        const idade = hoje.diff(dtNascimentoPaciente, 'years').years;

        if (idade < 13) {
            console.error('Erro: paciente deve ter pelo menos 13 anos.');
            console.log('--------------------------------------------------------------');

            this.start();
        } else if (!dtNascimentoPaciente.isValid) {
            console.error('\nData de nascimento inválida!');
            console.log('--------------------------------------------------------------');

            this.start();
        } 

        const result = await Paciente.of(novoCPF, novoNome, dtNascimentoPaciente);

        if (result.isSuccess) {
            const paciente = result.data;
            // console.log(paciente.cpf, paciente.nome, paciente.dtNascimento);
            await repositorioCadastro.salva(paciente);

            console.log('Paciente cadastrado com sucesso!');
            console.log('--------------------------------------------------------------\n');
        } else console.log(`Erro no cadastro do paciente ${result.errors}`);
    }

    async mostrarListaPacientes(ordenacao) {
        let listaPacientes = repositorioCadastro.buscaTodosComConsultas(ordenacao);
    
        let stringLista = '';
        const linhaSeparadora = "----------------------------------------------------------------------";
        
        stringLista += `${linhaSeparadora}\n`;
        stringLista += `CPF                   Nome                           Dt.Nasc. Idade\n`;
        stringLista += `${linhaSeparadora}\n`;
        
        // Loop through the patients and include their consultations
        listaPacientes.forEach((paciente) => {
            const idade = DateTime.now().diff(paciente.dtNascimento, 'years').years.toFixed(0);
    
            stringLista += `${paciente.cpf.padEnd(20)} ${paciente.nome.padEnd(30)} ${paciente.dtNascimento.toFormat('dd/MM/yyyy')} ${idade}\n`;
            
            // Fetching consultations related to the current patient
            const consultas = paciente.consultas;  // Assuming consultas are already populated via Sequelize 'include'
    
            if (consultas && consultas.length > 0) {
                consultas.forEach(consulta => {
                    stringLista += `Agendado para: ${consulta.data.toFormat('dd/MM/yyyy')}\n`;
                    stringLista += `${consulta.horaInicio.toFormat('HH:mm')} às ${consulta.horaFim.toFormat('HH:mm')}\n`;
                });
            }
        });
    
        stringLista += `${linhaSeparadora}\n`;
        console.log(stringLista);
        return stringLista;
    }

    async excluirCadastro() {
        const exCPF = prompt("CPF: ");
        const exPaciente = await repositorioCadastro.buscaPorCPFComConsultas(exCPF);
    
        if (!exPaciente) {
            console.error('Erro: paciente não cadastrado');
            console.log('--------------------------------------------------------------');
            return;
        }
    
        const consultas = await repositorioAgenda.buscaConsultasPorPaciente(exPaciente);
    
        if (consultas.length > 0) {
            console.error('Erro: paciente possui consultas agendadas');
            console.log('--------------------------------------------------------------');
            return;
        }
    
        await repositorioCadastro.remove(exPaciente);
    
        console.log('Cadastro excluído com sucesso!');
        console.log('--------------------------------------------------------------');
    }
    

    async start() {
        const opcao = this.mostrarMenu();
        await this.handleOpcaoUsuario(opcao);
    }
}

const menuCadastro = new MenuCadastro();
export default menuCadastro;
