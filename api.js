const fs = require('fs');
const { validar_ced } = require('./validar_ced.js');
const fetch = require('node-fetch');
const mimeDb = require('mime-db')
const express = require('express');
const moment = require('moment');
const ora = require('ora');
const cors = require('cors');
const chalk = require('chalk');
const ExcelJS = require('exceljs');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');

const { Client, MessageMedia } = require('whatsapp-web.js');
const app = express();
app.use(express.urlencoded({ extended: true }))
const SESSION_FILE_PATH = './session.json';
let client;
let sessionData;
app.use(cors());

const sendMessage = (to, message) => {

    client.sendMessage(to, message);

};
const sendMedia = (from, fileName) => {

    const media = MessageMedia.fromFilePath(`./img/${fileName}`);
    client.sendMessage(from, media);
};

const SENDNOTIFICATION = (from, ) => {

    const media = MessageMedia.fromFilePath(`./img/${fileName}`);
    client.sendMessage(from, media);
};
const SAVEHISTORY = async(number, message) => {
    const pathHistory = `./chats/${number}.xlsx`;
    const workbook = new ExcelJS.Workbook();
    const today = moment().format('DD-MM-YYYY hh:mm')

    if (fs.existsSync(pathHistory)) {
        /**
         * Si existe el archivo de conversacion lo actualizamos
         */
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.readFile(pathHistory)
            .then(() => {
                const worksheet = workbook.getWorksheet(1);
                const lastRow = worksheet.lastRow;
                var getRowInsert = worksheet.getRow(++(lastRow.number));
                getRowInsert.getCell('A').value = today;
                getRowInsert.getCell('B').value = message;
                getRowInsert.commit();
                workbook.xlsx.writeFile(pathHistory);
            }).catch(err => {
                console.log(err);
            });

    } else {
        const worksheet = workbook.addWorksheet('Chats');
        worksheet.columns = [
            { header: 'Date', key: 'date_chat' },
            { header: 'Message', key: 'message' }
        ];
        worksheet.addRow([today, message]);
        workbook.xlsx.writeFile(pathHistory)
            .then(() => {

                console.log("history saved");
            })
            .catch((err) => {
                console.log("err", err);
            });

    };
}



/*-----------------------------------------*/

/**
 * Escuchamos cuando entre un mensaje nuevo
 */
const listenMessage = () => {

    client.on('message', async msg => {
        const { from, to, body } = msg;
        console.log("num from: --->   " + from);
        console.log("num to: --->   " + to);
        if (body.length == 10) {

            validar_ced(body).then(a => {

                if (a == true) {


                    client.sendMessage(from, 'Hola soy un bot creado por YoderRC');
                    const fetch = require('node-fetch');
                    const APIQUEEN = 'https://apiqueen.mybluemix.net/api/v1/eerssa/consulta';

                    fetch(APIQUEEN, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ cedula: body }),

                    }).then(response => {
                        // Workconsole.log(response.json());
                        return response.json();
                    }).then(a => {
                        // Work with JSON data here
                        console.log(a);

                        const keyjson = Object.keys(a).length;
                        console.log(keyjson);


                        // a.msg_error
                        if (a.msg_error) {
                            console.log('Cédula no válida, o usuario no contiene reegistros en la EERSSA');
                            sendMessage(from, 'Cédula no válida, o usuario no contiene reegistros en la EERSSA');

                        } else {



                            const keyCount = Object.keys(a.data.valores_por_pagar[0]).length;



                            for (let i = 0; i < a.data.valores_por_pagar.length; i++) {


                                if (keyCount == 16) {
                                    let m_predeterminado = 'Hola ' + "*" + a.data.nombre_cliente.trim() + "*" + ' Este es el reporte sobre tu consumo de energía eléctrica en la EERSSA ⚡\n';

                                    m_predeterminado = m_predeterminado + "*MEDIDOR Nº* " + a.data.valores_por_pagar[i].Medidor.trim() + ' Estos son los valores pendientes que tienes: \n' + '*ESTADO CANCELADO:* ' + "*" + a.data.valores_por_pagar[i].Estado_Cancelado + "*" +
                                        '\n' + '*CONSUMO ENERGÉTICO (Kwh):* ' + a.data.valores_por_pagar[i].Consumo_Kwh + " Kwh" + '\n' + '*VALOR DE LA FACTURA:* ' + a.data.valores_por_pagar[i].Valor_Factura + '\n' + '*DEUDA HASTA LA FECHA:* ' + a.data.valores_por_pagar[i].Deuda_a_la_Fecha;
                                    console.log(m_predeterminado);
                                    client.sendMessage(from, m_predeterminado);
                                    if (i == (a.data.valores_por_pagar.length - 1)) {
                                        let m_valor_total = '*CONSUMO ENERGÉTICO TOTAL DE:* ' + a.data.nombre_cliente.trim() + ": " + a.data.valores_totales[0].total_consumo_energetico + '(Kwh)' + '\n' + '*CONSUMO MONETARIO TOTAL DE:* ' + a.data.nombre_cliente.trim() + ": " + a.data.valores_totales[0].total_consumo_monetario + ' $' + '\n'
                                        client.sendMessage(from, m_valor_total);
                                    }
                                } else {
                                    if (keyCount == 42) {

                                        let m_predeterminado = 'Hola ' + a.data.nombre_cliente.trim() + ' Este es el reporte sobre tu consumo de energía eléctrica\n';

                                        m_predeterminado = m_predeterminado + 'Felicidades :D al momento no tienes deudas pendientes: \n' + a.data.valores_por_pagar + '\n' + a.data.valores_totales + '\n';
                                        client.sendMessage(from, m_predeterminado);
                                    }

                                }

                            };

                            /*
                                                for (var i = 0; i < a.data.reporte_de_consumo_y_pagos[0].length; i++) {
                                                    if (i % 2 == 0) {
                                                        console.log(a.data.reporte_de_consumo_y_pagos[0][i].Mes_Emision);
                                                        console.log(a.data.reporte_de_consumo_y_pagos[0][i].Estado_cancelado);
                                                        console.log(a.data.reporte_de_consumo_y_pagos[0][i].total_consumo_monetario);

                                                    } else {
                                                        console.log(a.data.reporte_de_consumo_y_pagos[0][i].Mes_Emision);
                                                        console.log(a.data.reporte_de_consumo_y_pagos[0][i].total_consumo_energetico);

                                                    };

                                                    //console.log(a.data.nombre_cliente);

                                                };*/



                        };





                    }).catch(err => {
                        console.log("Algo saliò mal ");
                    });

                } else {
                    console.log("no es una cedula")

                };
            });





        }


        //   await replyAsk(from, body);


    });
};
/*-----------------------------------------*/

/**
 * Response a pregunta
 */

/*const replyAsk = (from, answer) => new Promise((resolve, reject) => {
    // console.log(`---------->`, answer);
    if (answer.length == 10) {
        client.sendMessage(from, 'Hola soy un bot creado por YoderRC');
        resolve(true)
    }

})*/


/**
 * Revisamos si tenemos credenciales guardadas para inciar sessio
 * este paso evita volver a escanear el QRCODE
 */
const withSession = () => {

    puppeteer.launch({ args: ['--no-sandbox'] });

    // Si exsite cargamos el archivo con las credenciales
    const spinner = ora(`Cargando ${chalk.yellow('Validando session con Whatsapp...')}`);
    sessionData = require(SESSION_FILE_PATH);
    spinner.start();

    client = new Client({

        session: sessionData,
        puppeteer: {
            args: [
                '--no-sandbox'
            ],
        }
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        spinner.stop();

        // sendMessage();
        // sendMedia();


        connectionReady();

    });


    /*------------*/
    client.on('auth_failure', () => {
        spinner.stop();
        console.log('** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **');
    });
    /*-----------------------------------------*/


    client.initialize();
}

/**
 * Generamos un QRCODE para iniciar sesion
 */
const withOutSession = () => {

    puppeteer.launch({ args: ['--no-sandbox'] });

    client = new Client({



        puppeteer: {
            args: [
                '--no-sandbox'
            ],
        }
    });

    console.log('No tenemos session guardada');
    client = new Client();
    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        connectionReady();
    });

    client.on('auth_failure', () => {
        console.log('** Error de autentificacion vuelve a generar el QRCODE **');
    })

    /*-----------------------------------------*/

    client.on('authenticated', (session) => {
        // Guardamos credenciales de de session para usar luego
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
            if (err) {
                console.log(err);
            }
        });
    });

    /*-----------------------------------------*/
    /*-----------------------------------------*/

    client.initialize();
}












const connectionReady = () => {
    const interval = setInterval(function() {
        client.sendMessage("593989182467@c.us", "hola esta es una notificacion de yoder cada 5 minutos");
    }, 60000);
    interval;

    listenMessage();

}

app.post('/send', sendMessage);

(fs.existsSync(SESSION_FILE_PATH)) ? withSession(): withOutSession();
app.listen(process.env.PORT || 9000, () => {
    console.log('Server ready!');
})