var Kakuro = require("./Kakuro.js");
var conf = require("./Configs.js");

var Genetics = {};

//Esta función genera un individuo aleatorio en forma de arreglo.
//Este arreglo representa los números que conforman la solucion
//dispuestos como si fueran leidos fila por fila de arriba hacia abajo
//y de izquierda a derecha.
Genetics.getRandomGenome = function () {
    var gen = new Array();
    for (var i = 0; i < Kakuro.getBlanks(); i++) {
        gen[i] = Math.floor(Math.random() * 9) + 1
    }
    return gen;
}

//Esta es la función fitness que se debe minimizar.
//La funcion toma el parametro "genome" como el individuo a evaluar y
//calcula todas las sumas horizontales y verticales comparandolas con
//las sumas definidas por el puzzle.
//Luego devuelve la suma de los valores absolutos de las diferencias
//entre las sumas calculadas y las esperadas. Si una suma es formada
//con números repetidos, lo cual es contra las reglas, la diferencia
//entre la suma calculada y la esperada será toda la suma esperada.
Genetics.evaluateGenome = function (genome) {
    var data = Kakuro.buildDataMatrix(genome);

    var sumas = 0;
    for (var i = 0; i < Kakuro.height(); i++) {
        for (var j = 0; j < Kakuro.width(); j++) {
            if (Kakuro.def_matrix[i][j] > 0) {
                var k = Kakuro.def_matrix[i][j] - 1;
                if (Kakuro.sumas_hor[k] > 0) {
                    if (seRepitenHor(data, i, j + 1)) {
                        sumas += Kakuro.sumas_hor[k];
                    } else {
                        var a = sumaHor(data, i, j + 1);
                        var b = Kakuro.sumas_hor[k];
                        sumas += Math.abs(a - b);
                    }
                }
                if (Kakuro.sumas_ver[k] > 0) {
                    if (seRepitenVer(data, i + 1, j)) {
                        sumas += Kakuro.sumas_ver[k];
                    } else {
                        var a = sumaVer(data, i + 1, j);
                        var b = Kakuro.sumas_ver[k];
                        sumas += Math.abs(a - b);
                    }
                }
            }
        }
    }
    return sumas;
}

//Esta función devuelve la suma horizontal que empieza con el número
//en la casilla (i, j) dentro de la matriz de solución "data".
function sumaHor(data, i, j) {
    var suma = 0;
    var y = j;
    while (y < Kakuro.width() && Kakuro.def_matrix[i][y] == 0) {
        suma += data[i][y];
        y++;
    }
    return suma;
}

//Esta función devuelve la suma vertical que empieza con el número
//en la casilla (i, j) dentro de la matriz de solución "data".
function sumaVer(data, i, j) {
    var suma = 0;
    var x = i;
    while (x < Kakuro.height() && Kakuro.def_matrix[x][j] == 0) {
        suma += data[x][j];
        x++;
    }
    return suma;
}

//Esta función devuelve "true" si la suma horizontal que empieza con
//el número en la casilla (i, j) dentro de la matriz de solución "data"
//no contiene números repetidos. Devuelve "false" en caso contrario.
function seRepitenHor(data, i, j) {
    var num = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var y = j;
    while (y < Kakuro.width() && Kakuro.def_matrix[i][y] == 0) {
        num[data[i][y] - 1]++;
        y++;
    }
    var rep = false;
    for (var k = 0; k < num.length; k++) {
        if (num[k] > 1) {
            rep = true;
        }
    }
    return rep;
}

//Esta función devuelve "true" si la suma vertical que empieza con
//el número en la casilla (i, j) dentro de la matriz de solución "data"
//no contiene números repetidos. Devuelve "false" en caso contrario.
function seRepitenVer(data, i, j) {
    var num = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var x = i;
    while (x < Kakuro.height() && Kakuro.def_matrix[x][j] == 0) {
        num[data[x][j] - 1]++;
        x++;
    }
    var rep = false;
    for (var k = 0; k < num.length; k++) {
        if (num[k] > 1) {
            rep = true;
        }
    }
    return rep;
}

//Esta función realiza un cruce entre los individuos "genA" y "genB".
//El operador de cruce es el cruce uniforme
Genetics.crossoverGenomes = function (genA, genB) {
    var a, b;
    if (Math.random() > 0.5) {
        a = genA.slice();
        b = genB.slice();
    } else {
        a = genB.slice();
        b = genA.slice();
    }
    for (var i = 0; i < a.length; i++) {
        if (Math.random() > 0.5) {
            a[i] = b[i];
        }
    }
    return a;
}

//Esta función revuelve una mutación del individuo "genome".
//Puede usar uno de dos tipos de mutación: mutación multigen y
//mutación por intercambio
Genetics.mutateGenome = function (genome) {
    if (Math.random() > 0.5) {
        return this.mutateGenome1(genome);
    } else {
        return this.mutateGenome2(genome);
    }
}

//Implementación de la mutación multigen por suma de una valor aleatorio
//en el rango [-2; 2]. Si la suma lleva al gen a salirse de los valores
//que puede tomar ([1; 9]), entonces se adapta al gen para que permanesca
//en el rango apropiado.
Genetics.mutateGenome1 = function (genome) {
    var gen = genome.slice();
    for (var i = 0; i < gen.length; i++) {
        if (Math.random < conf.probabilidad_mutacion) {
            gen[i] += Math.floor(Math.random() * 5) - 2;
            if (gen[i] < 1) {
                gen[i] = 2 - gen[i];
            }
            if (gen[i] > 9) {
                gen[i] = 18 - gen[i];
            }
        }
    }

    return gen;
}

//Implementación de la mutación por intercambio.
//Se escogen 2 genes al azar y se cambia su posición
Genetics.mutateGenome2 = function (genome) {
    var gen = genome.slice();

    var a = Math.floor(Math.random() * gen.length);
    var b = Math.floor(Math.random() * gen.length);

    var temp = gen[a];
    gen[a] = gen[b];
    gen[b] = temp;

    return gen;
}

module.exports = Genetics;
