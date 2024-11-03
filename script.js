// 模型系数和标准误
const recessiveModelCoefficients = {
    intercept: 8.1794,
    age: -0.6749,
    alccc: 45.3377
};

const rapidModelCoefficients = {
    intercept: 5.3816,
    age: -0.6522,
    alccc: 50.9034
};

// 计算Logistic回归的概率
function logisticFunction(z) {
    return 1 / (1 + Math.exp(-z));
}

// Bootstrap方法计算置信区间
function bootstrapConfidenceInterval(data, modelCoefficients, nBootstrap = 1000, alpha = 0.05) {
    const bootstrapSamples = [];
    
    for (let i = 0; i < nBootstrap; i++) {
        const sample = [];
        for (let j = 0; j < data.length; j++) {
            const randomIndex = Math.floor(Math.random() * data.length);
            sample.push(data[randomIndex]);
        }

        const probabilities = sample.map(entry => {
            const z = modelCoefficients.intercept +
                      modelCoefficients.age * entry.age +
                      modelCoefficients.alccc * entry.alccc;
            return logisticFunction(z);
        });

        bootstrapSamples.push(...probabilities);
    }

    bootstrapSamples.sort((a, b) => a - b);
    const lowerIndex = Math.floor(nBootstrap * alpha / 2);
    const upperIndex = Math.floor(nBootstrap * (1 - alpha / 2));
    
    return [
        bootstrapSamples[lowerIndex],
        bootstrapSamples[upperIndex]
    ];
}

// 计算预测概率和95%置信区间
function calculateProbability() {
    const age = parseFloat(document.getElementById("age").value);
    const alccc = parseFloat(document.getElementById("alccc").value);

    const data = [{ age, alccc }]; // 构建单个样本数据

    // 计算 recessive-model 的概率
    const z1 = recessiveModelCoefficients.intercept +
        recessiveModelCoefficients.age * age +
        recessiveModelCoefficients.alccc * alccc;
    const probability1 = logisticFunction(z1);

    // 计算 recessive-model 的Bootstrap置信区间
    const confidenceInterval1 = bootstrapConfidenceInterval(data, recessiveModelCoefficients);

    // 计算 rapid-model 的概率
    const z2 = rapidModelCoefficients.intercept +
        rapidModelCoefficients.age * age +
        rapidModelCoefficients.alccc * alccc;
    const probability2 = logisticFunction(z2);

    // 计算 rapid-model 的Bootstrap置信区间
    const confidenceInterval2 = bootstrapConfidenceInterval(data, rapidModelCoefficients);

    // 显示 recessive-model 的结果
    document.getElementById("result-recessive").innerText =
    `Risk of excessive myopia progression: ${probability1.toFixed(4)},\n95% confidence intervals: [${confidenceInterval1[0].toFixed(4)}, ${confidenceInterval1[1].toFixed(4)}]`;

    // 显示 rapid-model 的结果
    document.getElementById("result-rapid").innerText =
    `Risk of rapid myopia progression: ${probability2.toFixed(4)},\n95% confidence intervals: [${confidenceInterval2[0].toFixed(4)}, ${confidenceInterval2[1].toFixed(4)}]`;
}

