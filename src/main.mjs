import  menuPrincipal  from "./menuPrincipal.js";
import db from "./db/db.js";

const initialized = await db.init();

if (!initialized) {
    console.log("Ocorreu um problema na conexão com o BD");
    process.exit(1);
}

menuPrincipal.start();