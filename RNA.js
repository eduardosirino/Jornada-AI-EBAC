// função que cria número aleatório entre dois valores
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
};

// função de interpolação linear
function lerp(a, b, t) {
    return a + (b - a) * t
};

// classe do neurônio
class Neuron {
    constructor(inputs) {
        this.bias = randomRange(-1, 1);

        this.weightList = new Array(inputs).fill().map(() => randomRange(-1, 1))
    }

    // Método para analisar saída do neurônio
    g(signalList = []) {
        let u = 0;

        for (let i = 0; i < this.weightList.length; i++) {  // Corrigido 'lenght' para 'length'
            u += signalList[i] * this.weightList[i];
        }

        if (Math.tanh(u) > this.bias) {
            return 1; // Ativado
        } else {
            return 0; // Desativado
        }
    }

    // função para mudar o neurônio e não ter um ciclo infinito de neurônios iguais
    mutate(rate = 0.2) {
        this.weightList = this.weightList.map(w => {
            return lerp(w, randomRange(-1, 1), rate);
        })

        this.bias = lerp(this.bias, randomRange(-1, 1), rate)
    }
}

// Cria a rede neural
class RNA {
    constructor(inputCount = 1, levelList = []) {
        this.score = 0;

        this.levelList = levelList.map((l, i) => {
            const inputSize = i === 0 ? inputCount : levelList[i - 1];

            return new Array(l).fill().map(() => new Neuron(inputSize));
        });
    }

    // Calcula saída
    compute(list = []) {
        for (let i = 0; i < this.levelList.length; i++){
            const tempList = []

            for (const neuron of this.levelList[i]) {
                if (list.length !== neuron.weightList.length) throw new Error('Entrada inválida');
                tempList.push(neuron.g(list))
            }

            list = tempList;
        }

        return list;
    }

    // Aplica funções
    mutate(rate = 0.5) {
        for (const level of this.levelList) {
            for (const neuron of level) neuron.mutate(rate)
        }
    }

    // Carrega configuração na mutação
    load(rna) {
        if (!rna) return;

        try {
            this.levelList = rna.map((neuronList) => {
                return neuronList.map((neuron) => {
                    const n = new Neuron();
                    n.bias = neuron.bias;
                    n.weightList = neuron.weightList;

                    return n;
                });
            });
        } catch (e) {
            return;
        }

        save(); {
            return this.levelList;
        }
    }
    save() {
        return this;
    }
}

export default RNA;