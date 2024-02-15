import inquirer from "inquirer";

const events = [];

function main(){
    inquirer.prompt([{
        type: "list",
        name: "option",
        message: "Cosa vuoi fare?",
        choices: [
            "Aggiungi un evento",
            "Visualizza gli eventi",
            "Prenota un biglietto",
            "Annulla una prenotazione",
            "Esci"
        ]
    }]).then((answers) => {
        switch (answers.option) {
            case "Aggiungi un evento":
                addEvent();
                break;
            case "Visualizza gli eventi":
                viewEvents();
                break;
            case "Prenota un biglietto":
                bookTickets();
                break;
            case "Annulla una prenotazione":
                cancelBooking();
                break;
            case "Esci":
                process.exit(0);
        }
    });
}

function addEvent(){
    inquirer.prompt([
        {
            type: "input",
            name: "titolo",
            message: "Inserisci il titolo dell'evento: ",
            validate: (answer) => {
                if (answer.length > 0) {
                    return true;
                }
                return "Inserisci un titolo!";
            }
        },
        {
            type: "input",
            name: "datetime",
            message: "Inserisci data e ora dell'evento: ",
            validate: (answer) => {
                if (answer.length > 0 && answer.match(/^\d{4}-\d{2}-\d{2} [0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}$/)) {
                    return true;
                }
                return "Inserisci una data e ora valide!";
            }
        },
        {
            type: "input",
            name: "luogo",
            message: "Inserisci il luogo dell'evento: ",
            validate: (answer) => {
                if (answer.length > 0) {
                    return true;
                }
                return "Inserisci un luogo!";
            }
        },
        {
            type: "input",
            name: "posti",
            message: "Inserisci i posti disponibili: ",
            validate: (answer) => {
                if (answer.length > 0 && answer.match(/^[0-9]+$/)) {
                    return true;
                }
                return "Inserisci i posti disponibili!";
            }
        },
    ]).then((evento) => {
        // Aggiungi l'evento all'array events
        evento.prenotati = 0;
        events.push(evento);
        console.log("Evento aggiunto");
        // Torna al menu principale
        main();
    });
}

function viewEvents(){
    for(let e of events){
        console.log(`Titolo: ${e.titolo}`);
        console.log(`Data e ora: ${e.datetime}`);
        console.log(`Luogo: ${e.luogo}`);
        console.log(`Posti disponibili: ${e.posti}`);
        console.log(`Posti prenotati: ${e.prenotati}`);
    }
    main();
}

function bookTickets(){
    let choices = events.map((e) => {
        let disponibili = Number(e.posti) - e.prenotati;
        return `${e.titolo} - ${disponibili} posti liberi`;
    });
    inquirer.prompt([
        {
            type: "list",
            name: "titolo",
            message: "Seleziona l'evento da prenotare: ",
            choices: choices
        },
        {
            type: "input",
            name: "posti",
            messagi: "Numero biglietti da prenotare: ",
            validate: (answer) => {
                if (answer.length > 0 && answer.match(/^[0-9]+$/)) {
                    return true;
                }
                return "Inserisci i posti da prenotare!";
            }
        }
    ]).then((answers) => {
        for (let e of events){
            if (e.titolo === answers.titolo.split("-")[0].trim()){
                if (Number(answers.posti) <= Number(e.posti) - e.prenotati){
                    e.prenotati += Number(answers.posti);
                    console.log("Prenotazione effettuata!");
                } else {
                    console.log("Errore!");
                }
                break;
            }
        }
        main();
    })

}

function cancelBooking(){

    main();
}

// Funzione che visualizza il menu principale
// e permette di scegliere l'operazione da eseguire
// ed esegue l'operazione scelta
main();