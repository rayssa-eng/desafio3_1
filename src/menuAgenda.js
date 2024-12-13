import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });
import Consulta          from "./domain/consulta.js";

import { DateTime } from 'luxon';

import menuPrincipal       from "./menuPrincipal.js";
import repositorioCadastro from './repositorio/RepositorioCadastro.js';
import repositorioAgenda from './repositorio/RepositorioAgenda.js';


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

    async handleOpcaoUsuario(opcao) {
        switch (opcao) {
            case 1:
                await this.novaConsulta();
                break;
            case 2:
                await this.cancelarConsulta();
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
                console.log('\nOpção inválida.\n');
                console.log('----------------------------------------------------------\n');
                this.start();
        }
        console.log('\n');
        this.start();
    }

    async novaConsulta() {
        const pacienteCPF  = prompt("CPF: ");

        const paciente = await repositorioCadastro.buscaPorCPF(pacienteCPF);

        if (!paciente) {
            console.error("Erro: paciente não cadastrado");
            console.log('--------------------------------------------------------------\n');

            return false;
        }

        console.log(`\nAgendando consulta para: ${paciente.nome}`);

        const dataConsultaStr = prompt("Data da consulta (yyyy-MM-dd): ");
        const horaInicioStr   = prompt("Hora inicial (HHmm): ");
        const horaFimStr      = prompt("Hora final (HHmm): ");

        // parse dos inputs
        const dataConsulta = DateTime.fromFormat(dataConsultaStr, "yyyy-MM-dd");
        const horaInicio   = DateTime.fromFormat(horaInicioStr, "HHmm");
        const horaFim      = DateTime.fromFormat(horaFimStr, "HHmm");

        if (!dataConsulta.isValid || !horaInicio.isValid || !horaFim.isValid) {
            throw new Error("Data ou horário fornecido é inválido.");
        }

        const dtIni = dataConsulta.set({
            hour: horaInicio.hour,
            minute: horaInicio.minute,
        });

        const dtFim = dataConsulta.set({
            hour: horaFim.hour,
            minute: horaFim.minute,
        });

        const result = await Consulta.of(dtIni, dtFim);

        if (result.isSuccess) {
            const consulta = result.data;
            const consultaArmazenada = await repositorioAgenda.salva(consulta);

            let agenda;

            if (consultaArmazenada) {
                agenda = await paciente.agenda(consulta);
            } else {
                console.error(`\nErro ao agendar consulta para ${paciente.nome}`);
                return false;
            }
            
            if (agenda) {
                console.log(`\nConsulta agendada com sucesso para ${dtIni.toFormat("dd/MM/yyyy HH:mm")}, com o(a) paciente ${paciente.nome}.\n`);
            } else {
                console.error(`\nErro ao vincular consulta a(o) paciente ${paciente.nome}`);
                return false;
            }
        } else {
            console.error("Erro ao agendar consulta:");
            result.errors.forEach((error) => console.error(`- ${error}`));
            
            return false;
        }
    }

    async cancelarConsulta() {
        const pacienteCPF = prompt("CPF: ");
        const paciente = await repositorioCadastro.buscaPorCPF(pacienteCPF);
    
        if (!paciente) {
            console.error("Erro: paciente não cadastrado");
            console.log('--------------------------------------------------------------\n');
            return;
        }
    
        console.log(`\nCancelando agendamento para ${paciente.nome}`);
    
        const dataConsulta = prompt("Data da consulta (yyyy-MM-dd): ");
        const horaInicio = prompt("Hora inicial (HHmm): ");
    
        const consultaEncontrada = repositorioAgenda.buscaConsultaPorPacienteDataHora(
            pacienteCPF,
            dataConsulta,
            horaInicio
        );
    
        if (!consultaEncontrada) {
            console.error("Erro: agendamento não encontrado");
            console.log('--------------------------------------------------------------\n');
            return;
        }
    
        await repositorioAgenda.remove(consultaEncontrada);
    
        console.log("Agendamento cancelado com sucesso!");
        console.log('--------------------------------------------------------------\n');
    }

    async start() {
        const opcao = this.mostrarMenu();
        await this.handleOpcaoUsuario(opcao);
    }
}

const menuAgenda = new MenuAgenda();
export default menuAgenda;
