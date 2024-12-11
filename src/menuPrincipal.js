import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });

import  menuCadastro  from "./menuCadastro.js";
import  menuAgenda  from "./menuAgenda.js";


export class MenuPrincipal {
    mostrarMenu() {
        console.log('Menu Principal');
        console.log('1-Cadastro de pacientes');
        console.log('2-Agenda');
        console.log('3-Fim');

        const opcao = parseInt(prompt(""), 10);

        console.log('--------------------------------------------------------------');

        return opcao;
    }

    handleOpcaoUsuario(opcao) {
        switch (opcao) {
            case 1:
                menuCadastro.start()
                break;
            case 2:
                menuAgenda.start();
                break;
            case 3:
                console.log("Encerrando programa...");
                process.exit(0);
            default:
                console.log('Opção inválida.');
                this.start();
        }
    }

    start() {
        const opcao = this.mostrarMenu();
        this.handleOpcaoUsuario(opcao);
    }
}

const menuPrincipal = new MenuPrincipal();
export default menuPrincipal;
