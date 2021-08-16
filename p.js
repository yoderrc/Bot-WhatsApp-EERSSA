/*const { validar_ced } = require('./validar_ced.js');

validar_ced("fghjuioy14").then(a => {

    if (a == true) {}
    console.log('hhhh')

});



*/

const fetch = require('node-fetch');

const APIQUEEN = 'https://apiqueen.mybluemix.net/api/v1/eerssa/consulta';

fetch(APIQUEEN, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    //1102535109
    body: JSON.stringify({ cedula: "1102535109" }),

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

    } else {



        const keyCount = Object.keys(a.data.valores_por_pagar[0]).length;
        console.log(a.data.valores_por_pagar.length);

        for (let i = 0; i < a.data.valores_por_pagar.length; i++) {


            if (keyCount == 16) {
                let m_predeterminado = 'Hola ' + a.data.nombre_cliente.trim() + ' Este es el reporte sobre tu consumo de energía eléctrica\n';

                m_predeterminado = m_predeterminado + 'Estos son los valores pendientes que tienes: \n' + 'ESTADO CANCELADO: ' + a.data.valores_por_pagar[i].Estado_Cancelado +
                    '\n' + 'CONSUMO ENERGÉTICO (Kwh): ' + a.data.valores_por_pagar[i].Consumo_Kwh + '\n' + 'DEUDA HASTA LA FECHA: ' + a.data.valores_por_pagar[i].Deuda_a_la_Fecha + '\n' + 'CONSUMO ENERGÉTICO TOTAL: ' + a.data.valores_totales[0].total_consumo_energetico + '(Kwh)' + '\n' + 'CONSUMO MONETARIO: ' + a.data.valores_totales[0].total_consumo_monetario + ' $' + '\n'
                console.log(m_predeterminado);
                console.log(a.data.valores_por_pagar[i].Deuda_a_la_Fecha);
            } else {
                if (keyCount == 42) {
                    let m_predeterminado = 'Hola ' + a.data.nombre_cliente.trim() + ' Este es el reporte sobre tu consumo de energía eléctrica\n';

                    m_predeterminado = m_predeterminado + 'Felicidades :D al momento no tienes deudas pendientes: \n' + a.data.valores_por_pagar + '\n' + a.data.valores_totales + '\n';
                    console.log(m_predeterminado);
                }

            }

        };








        for (var i = 0; i < a.data.reporte_de_consumo_y_pagos[0].length; i++) {


            if (a.data.reporte_de_consumo_y_pagos[0][i].Mes_Emision == "1") {


                console.log(a.data.reporte_de_consumo_y_pagos[0][i])



            }

            /* if (i % 2 == 0) {
                 console.log(a.data.reporte_de_consumo_y_pagos[0][i].Mes_Emision);
                 console.log(a.data.reporte_de_consumo_y_pagos[0][i].Estado_cancelado);
                 console.log(a.data.reporte_de_consumo_y_pagos[0][i].total_consumo_monetario);

             } else {
                 console.log(a.data.reporte_de_consumo_y_pagos[0][i].Mes_Emision);
                 console.log(a.data.reporte_de_consumo_y_pagos[0][i].total_consumo_energetico);

             };*/

            //console.log(a.data.nombre_cliente);

        };



    }





}).catch(err => {
    // Do something for an error here
});

/*
const APIQUEEN = {
    "status": "SUCCESS",
    "data": {
        "cedula_eerssa": "1102558531",
        "nombre_cliente": "YODER MANUEL                                      ",
        "direccion_cliente": "NELA MARTINEZ Y DOLORES CACUANGO                  ",
        "valores_por_pagar": [
            "NO EXISTEN VALORES PENDIENTES POR CANCELAR"
        ],
        "valores_totales": [
            "NO TIENE DEUDAS PENDIENTES"
        ],
        "reporte_de_consumo_y_pagos": [
            [{
                    "Mes_Emision": "1",
                    "Estado_cancelado": "SI",
                    "total_consumo_monetario": "20.12"
                },
                {
                    "Mes_Emision": "1",
                    "total_consumo_energetico": "141"
                },
                {
                    "Mes_Emision": "2",
                    "Estado_cancelado": "SI",
                    "total_consumo_monetario": "20.80"
                },
                {
                    "Mes_Emision": "2",
                    "total_consumo_energetico": "146"
                },
                {
                    "Mes_Emision": "3",
                    "Estado_cancelado": "SI",
                    "total_consumo_monetario": "19.76"
                },
                {
                    "Mes_Emision": "3",
                    "total_consumo_energetico": "138"
                },
                {
                    "Mes_Emision": "4",
                    "Estado_cancelado": "SI",
                    "total_consumo_monetario": "17.58"
                },
                {
                    "Mes_Emision": "4",
                    "total_consumo_energetico": "119"
                },
                {
                    "Mes_Emision": "5",
                    "Estado_cancelado": "SI",
                    "total_consumo_monetario": "20.33"
                },
                {
                    "Mes_Emision": "5",
                    "total_consumo_energetico": "142"
                },
                {
                    "Mes_Emision": "6",
                    "Estado_cancelado": "SI",
                    "total_consumo_monetario": "26.02"
                },
                {
                    "Mes_Emision": "6",
                    "total_consumo_energetico": "190"
                }
            ]
        ]
    }
};

console.log(APIQUEEN.data.reporte_de_consumo_y_pagos[0][0].total_consumo_monetario);*/