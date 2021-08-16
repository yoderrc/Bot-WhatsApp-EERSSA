const validar_ced = async(body) => {


    var cedula = body;
    array = cedula.split("");
    num = array.length;
    if (num == 10) {
        total = 0;
        digito = (array[9] * 1);
        for (i = 0; i < (num - 1); i++) {
            mult = 0;
            if ((i % 2) != 0) { total = total + (array[i] * 1); } else {
                mult = array[i] * 2;
                if (mult > 9)
                    total = total + (mult - 9);
                else
                    total = total + mult;
            }
        }
        decena = total / 10;
        decena = Math.floor(decena);
        decena = (decena + 1) * 10;
        final = (decena - total);
        if ((final == 10 && digito == 0) || (final == digito)) {
            // console.log("True!!!");
            return true;
        } else {
            // console.log("False!!!");
            return false;
        }
    } else {
        //    console.log("tiene menos de 10 ");
        return false;
    }


};


module.exports = { validar_ced };