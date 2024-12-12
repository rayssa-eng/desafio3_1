import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });
import Consulta          from "./domain/consulta.js";

import menuPrincipal       from "./menuPrincipal.js";
import repositorioCadastro from './repositorio/RepositorioCadastro.js';


export class MenuAgenda {
    mostrarMenu() {
        console.log('Agenda');
        console.log('1-Agendar consulta');
        console.log('2-Cancelar agendamento');
        console.log('3-Listar agenda');
        console.log('4-Voltar p/ menu principal');

        const opcao = parseInt(prompt(""), 10);

        console.log('--------------------------------------------------------------');

        return opcao;
    }

    handleOpcaoUsuario(opcao) {
        switch (opcao) {
            case 1:
                this.novaConsulta();
                break;
            case 2:
                this.cancelarConsulta();
                break;
            case 3:
                const filtro = prompt("\nApresentar a agenda T-Toda ou P-Periodo: ");

                if (filtro === 'P') {
                    const dataInicial = prompt('Data inicial (dd/MM/yyyy): ');
                    const dataFinal = prompt('Data final (dd/MM/yyyy): ');

                    agendaConsultorio.mostrarAgenda(dataInicial, dataFinal, filtro);
                    this.start();
                }

                agendaConsultorio.mostrarAgenda(null, null, filtro);
                this.start();
                break;
            case 4:
                menuPrincipal.start();
                break;
            default:
                // const consultas = agendaConsultorio.consultas;

                // consultas.forEach(consulta => {
                //     console.log('consulta: ', consulta);
                //     console.log('paciente da consulta: ', consulta.paciente);
                //     console.log('nome do paciente da consulta: ', consulta.paciente.nome);

                // })
                // console.log("Consultas: ", agendaConsultorio.consultas);

                console.log('\nOpção inválida.\n');
                console.log('----------------------------------------------------------\n');
                this.start();
        }
    }

    novaConsulta() {
        const pacienteCPF  = prompt("CPF: ");

        const paciente = cadastroConsultorio.getPacientePorCPF(pacienteCPF);

        if (!paciente) {
            console.error("Erro: paciente não cadastrado");
            console.log('--------------------------------------------------------------\n');

            // reiniciar menu da agenda
            this.start();
        }

        console.log(`\nAgendando consulta para: ${paciente.nome}`);

        const dataConsulta = prompt("Data da consulta (yyyy-MM-dd): ");
        const horaInicio   = prompt("Hora inicial (HHmm): ");
        const horaFim      = prompt("Hora final (HHmm): ");
        
        const consulta = new Consulta(
            dataConsulta,
            horaInicio,
            horaFim,
            paciente
        );

        if (agendaConsultorio.adicionarConsulta(consulta)) {
            console.log("\nAgendamento realizado com sucesso!");
            console.log('--------------------------------------------------------------\n');

            this.start();
        } else {
            console.error("\nErro: já existe uma consulta agendada nesse horário");
            console.log('--------------------------------------------------------------\n');

            this.start();
        }
    }

    cancelarConsulta() {
        const pacienteCPF = prompt("CPF: ");
        const paciente = cadastroConsultorio.getPacientePorCPF(pacienteCPF);

        console.log(`\nCancelando agendamento para ${paciente.nome}`);
    
        if (!paciente) {
            console.error("Erro: paciente não cadastrado");
            console.log('--------------------------------------------------------------\n');

            this.start();
            return;
        }
    
        const dataConsulta = prompt("Data da consulta (yyyy-MM-dd): ");
        const horaInicio = prompt("Hora inicial (HHmm): ");
    
        const consultaEncontrada = agendaConsultorio
            .getConsultasPorPaciente(paciente)
            .find(consulta =>
                consulta.data.toISODate() === dataConsulta &&
                consulta.horaInicio.toFormat("HHmm") === horaInicio);
    
        if (!consultaEncontrada) {
            console.error("Erro: agendamento não encontrado");
            console.log('--------------------------------------------------------------\n');

            this.start();
            return;
        }
    
        agendaConsultorio.removerConsulta(consultaEncontrada);
    
        const consultasRestantes = agendaConsultorio.getConsultasPorPaciente(paciente);
    
        console.log("Agendamento cancelado com sucesso!");
        console.log('--------------------------------------------------------------\n');

        this.start();
    }

    start() {
        const opcao = this.mostrarMenu();
        this.handleOpcaoUsuario(opcao);
    }
}

const menuAgenda = new MenuAgenda();
export default menuAgenda;
