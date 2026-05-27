export interface IMCClassificationResult {
  label: string;
  color: string;
  emoji: string;
}

enum IMCClassification {
  Underweight = 18.5,
  Normal = 25,
  Overweight = 30,
  ObeseI = 35,
  ObeseII = 40,
  ObeseIII = Infinity,
}

export const IMCModel = {
  calculate(weightKg: number, heightM: number) {
    const imc = weightKg / (heightM * heightM);
    return parseFloat(imc.toFixed(2));
  },

  classify(imc: number): IMCClassificationResult {
    if (imc < IMCClassification.Underweight)
      return { label: 'Abaixo do peso', color: '#60A5FA', emoji: '🌧️' };
    if (imc < IMCClassification.Normal)
      return { label: 'Peso normal', color: '#34D399', emoji: '✨' };
    if (imc < IMCClassification.Overweight)
      return { label: 'Sobrepeso', color: '#FBBF24', emoji: '⚡' };
    if (imc < IMCClassification.ObeseI)
      return { label: 'Obesidade grau I', color: '#F97316', emoji: '🔥' };
    if (imc < IMCClassification.ObeseII)
      return { label: 'Obesidade grau II', color: '#EF4444', emoji: '⚠️' };
    return { label: 'Obesidade grau III', color: '#DC2626', emoji: '🚨' };
  },

  validate(weight: string, height: string) {
    if (!weight || !height) return 'Preencha todos os campos.';
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (Number.isNaN(w) || Number.isNaN(h)) return 'Use apenas numeros.';
    if (w <= 0 || w > 500) return 'Peso invalido (1-500 kg).';
    if (h <= 0 || h > 3) return 'Altura invalida (ex: 1.75).';
    return null;
  },
};
