var Kakuro = require("./Kakuro.js");
var Genetics = require("./Genetics.js");
var conf = require("./Configs.js");

var individuos = new Array();
var generation = 0;
var maxFitness = Number.MAX_SAFE_INTEGER;
var lastFitness = Number.MAX_SAFE_INTEGER;

Kakuro.printMatrix();

console.log("generando población inicial aleatoria (" + conf.muestra + " individuos)\n");

for (var i = 0; i < conf.muestra; i++) {
    individuos[i] = {};
    individuos[i].genome = Genetics.getRandomGenome();
}

while (maxFitness > 0) {
    for (var i = 0; i < individuos.length; i++) {
        individuos[i].fitness = Genetics.evaluateGenome(individuos[i].genome);
    }

    individuos.sort((a, b) => (a.fitness - b.fitness));

    maxFitness = individuos[0].fitness;

    if(maxFitness < lastFitness){
        console.log("Generacion: " + generation + " - Mejor individuo: " + maxFitness);
        Kakuro.printMatrixWithData(Kakuro.buildDataMatrix(individuos[0].genome));
    } else {
        process.stdout.write("Evaluando generacion " + generation);
        process.stdout.cursorTo(0);
    }

    lastFitness = maxFitness;
    
    individuos.length = Math.floor(conf.muestra * conf.porcentaje_ganador);

    while (individuos.length < conf.muestra) {
        var hijo = {};
        if(Math.random() > conf.probabilidad_mutacion){
            var x = Math.floor(Math.random() * individuos.length);
            var y = Math.floor(Math.random() * individuos.length);
            hijo.genome = Genetics.crossoverGenomes(individuos[x].genome, individuos[y].genome);
            if(Math.random() < conf.probabilidad_mutacion){
                hijo.genome = Genetics.mutateGenome(hijo.genome);
            }
        } else {
            var x = Math.floor(Math.random() * individuos.length);
            hijo.genome = Genetics.mutateGenome(individuos[x].genome);
        }
        individuos.push(hijo);
    }

    generation++;
}
