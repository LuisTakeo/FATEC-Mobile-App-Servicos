import { useCallback, useState } from 'react';
import { IMCModel } from '../model/IMCModel';

export interface IMCResultPayload {
  imc: number;
  classification: ReturnType<typeof IMCModel.classify>;
  weight: number;
  height: number;
}

export function useIMCViewModel() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');

  const handleCalculate = useCallback((): IMCResultPayload | null => {
    const validationError = IMCModel.validate(weight, height);
    if (validationError) {
      setError(validationError);
      return null;
    }
    setError('');
    const parsedWeight = parseFloat(weight);
    const parsedHeight = parseFloat(height);
    const imc = IMCModel.calculate(parsedWeight, parsedHeight);
    const classification = IMCModel.classify(imc);
    return {
      imc,
      classification,
      weight: parsedWeight,
      height: parsedHeight,
    };
  }, [weight, height]);

  const reset = useCallback(() => {
    setWeight('');
    setHeight('');
    setError('');
  }, []);

  return {
    weight,
    setWeight,
    height,
    setHeight,
    error,
    handleCalculate,
    reset,
  };
}
