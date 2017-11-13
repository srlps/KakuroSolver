var Kakuro = {};

//Esta matriz define un puzzle especifico de kakuro.
//Este ejemplo es el de la imagen adjunta.
//Los valores de las celdas corresponden a los siguientes:
//
//-1 = celda sin uso
//0 = celda vacia para colocar un número
//>0 = celda con el valor de la suma
//
//Las celdas con valor >0 contienen la posición del valor de la suma en
//los arreglos de sumas siendo 1 la primera posición.
Kakuro.def_matrix = [
    [-1, -1, 1, 2, -1, -1, -1, -1, 3, 4],
    [-1, 5, 0, 0, 6, 7, -1, 8, 0, 0],
    [9, 0, 0, 0, 0, 0, 10, 0, 0, 0],
    [11, 0, 0, 12, 0, 0, 0, 0, 0, -1],
    [-1, -1, 13, 0, 0, 14, 0, 0, 15, 16],
    [-1, 17, 0, 0, 18, 0, 0, 0, 0, 0],
    [19, 0, 0, 20, 0, 0, 0, 21, 0, 0],
    [22, 0, 0, 0, 0, 0, 23, 0, 0, -1],
    [-1, -1, 24, 0, 0, 25, 0, 0, 26, 27],
    [-1, 28, 0, 0, 0, 0, 0, 29, 0, 0],
    [30, 0, 0, 0, 31, 0, 0, 0, 0, 0],
    [32, 0, 0, -1, -1, -1, 33, 0, 0, -1]
];

//Estos vectores definen el valor de las sumas horizontales y verticales
//del puzzle respectivamente.
//Para cada celda en la matriz con valor i > 0, se puede conocer el valor
//de la suma horizontal y vertical en estos arreglos paralelos en la posición
//(i - 1).
//Un valor 0 en estos arreglos significa que no contienen una suma en
//esa orientación.
Kakuro.sumas_hor = [
    0, 0, 0, 0,
    13, 0, 0, 17,
    24, 11,
    9, 19,
    5, 9, 0, 0,
    8, 20,
    7, 16, 12,
    27, 11,
    7, 9, 0, 0,
    28, 8,
    19, 19,
    14, 10
];

Kakuro.sumas_ver = [
    8, 14, 22, 10,
    17, 14, 5, 17,
    0, 18,
    0, 11,
    9, 8, 13, 8,
    13, 27,
    0, 12, 8,
    0, 10,
    17, 16, 10, 4,
    16, 15,
    0, 0,
    0, 0
];

//Altura del puzzle (número de filas)
Kakuro.height = function () {
    return this.def_matrix.length;
}

//Ancho del puzzle (número de columnas)
Kakuro.width = function () {
    return this.def_matrix[0].length;
}

//Número de celdas en blanco para colocar números
Kakuro.getBlanks = function () {
    var c = 0;
    for (var i = 0; i < this.height(); i++) {
        for (var j = 0; j < this.width(); j++) {
            if (this.def_matrix[i][j] == 0) {
                c++;
            }
        }
    }
    return c;
}

//Número de sumas horizontales y verticales en el puzzle
Kakuro.getSumas = function () {
    var c = 0;
    for (var i = 0; i < this.sumas_hor.length; i++) {
        if (this.sumas_hor[i] > 0) {
            c++;
        }
    }
    for (var i = 0; i < this.sumas_ver.length; i++) {
        if (this.sumas_ver[i] > 0) {
            c++;
        }
    }
    return c;
}

//Representación matricial de un individuo.
//Dado el arreglo "genome", que representa una solución del puzzle,
//se devuelve una matriz análoga a la matriz de definicion con dicha
//solución. En esta matriz, un número entero entre 1 y 9 estará donde
//en la posisción donde debería estar en el puzzle; y un 0 estará
//donde haya espacio donde no se puede colocar un número.
Kakuro.buildDataMatrix = function (genome) {
    var data = new Array();
    var k = 0;
    for (var i = 0; i < this.height(); i++) {
        data[i] = new Array();
        for (var j = 0; j < this.width(); j++) {
            if (this.def_matrix[i][j] == 0) {
                data[i][j] = genome[k];
                k++;
            } else {
                data[i][j] = 0;
            }
        }
    }
    return data;
}

//Esta función imprime en pantalla el puzzle definido, la cantidad de
//espacios en blanco y la cantidad de sumas
Kakuro.printMatrix = function () {
    var m = "";
    var s = "";
    for (var i = 0; i < 4 * this.width() + 1; i++) {
        s += "-";
    }
    s += "\n";

    m += s;

    for (var i = 0; i < this.height(); i++) {
        for (var j = 0; j < this.width(); j++) {
            m += "|";
            if (this.def_matrix[i][j] == -1) {
                m += "***";
            } else if (this.def_matrix[i][j] == 0) {
                m += "   ";
            } else {
                m += "\\";
                var k = this.def_matrix[i][j] - 1;
                if (this.sumas_hor[k] == 0) {
                    m += "  ";
                } else if (this.sumas_hor[k] < 10) {
                    m += " " + this.sumas_hor[k];
                } else {
                    m += this.sumas_hor[k];
                }
            }
        }
        m += "|\n";
        for (var j = 0; j < this.width(); j++) {
            m += "|";
            if (this.def_matrix[i][j] == -1) {
                m += "***";
            } else if (this.def_matrix[i][j] == 0) {
                m += "   ";
            } else {
                m += " \\ ";
            }
        }
        m += "|\n";
        for (var j = 0; j < this.width(); j++) {
            m += "|";
            if (this.def_matrix[i][j] == -1) {
                m += "***";
            } else if (this.def_matrix[i][j] == 0) {
                m += "   ";
            } else {
                var k = this.def_matrix[i][j] - 1;
                if (this.sumas_ver[k] == 0) {
                    m += "  ";
                } else if (this.sumas_ver[k] < 10) {
                    m += this.sumas_ver[k] + " ";
                } else {
                    m += this.sumas_ver[k];
                }
                m += "\\";
            }
        }
        m += "|\n" + s;
    }

    console.log(m);
    console.log("Blanks: " + this.getBlanks());
    console.log("Sumas: " + this.getSumas() + "\n");
}

//Esta función imprime el puzzle con la solución proporcionada en el
//parametro "data". "data" debe estar en forma matricial.
Kakuro.printMatrixWithData = function (data) {
    var m = "";
    var s = "";
    for (var i = 0; i < 4 * this.width() + 1; i++) {
        s += "-";
    }
    s += "\n";

    m += s;

    for (var i = 0; i < this.height(); i++) {
        for (var j = 0; j < this.width(); j++) {
            m += "|";
            if (this.def_matrix[i][j] == -1) {
                m += "***";
            } else if (this.def_matrix[i][j] == 0) {
                m += "   ";
            } else {
                m += "\\";
                var k = this.def_matrix[i][j] - 1;
                if (this.sumas_hor[k] == 0) {
                    m += "  ";
                } else if (this.sumas_hor[k] < 10) {
                    m += " " + this.sumas_hor[k];
                } else {
                    m += this.sumas_hor[k];
                }
            }
        }
        m += "|\n";
        for (var j = 0; j < this.width(); j++) {
            m += "|";
            if (this.def_matrix[i][j] == -1) {
                m += "***";
            } else if (this.def_matrix[i][j] == 0) {
                m += " " + data[i][j] + " ";
            } else {
                m += " \\ ";
            }
        }
        m += "|\n";
        for (var j = 0; j < this.width(); j++) {
            m += "|";
            if (this.def_matrix[i][j] == -1) {
                m += "***";
            } else if (this.def_matrix[i][j] == 0) {
                m += "   ";
            } else {
                var k = this.def_matrix[i][j] - 1;
                if (this.sumas_ver[k] == 0) {
                    m += "  ";
                } else if (this.sumas_ver[k] < 10) {
                    m += this.sumas_ver[k] + " ";
                } else {
                    m += this.sumas_ver[k];
                }
                m += "\\";
            }
        }
        m += "|\n" + s;
    }

    console.log(m);
}

module.exports = Kakuro;