import React, { useEffect, useState } from 'react';
import { InputScreen } from './InputScreen';
import { ResultScreen } from './ResultScreen';
import type { IMCResultPayload } from './viewModel/IMCViewModel';
import { insertImcHistory, listImcHistory, ImcHistoryRecord } from '../../storage/db';

interface ImcScreenProps {
  userId?: number;
}

export function ImcScreen({ userId }: ImcScreenProps) {
  const [result, setResult] = useState<IMCResultPayload | null>(null);
  const [history, setHistory] = useState<ImcHistoryRecord[]>([]);

  useEffect(() => {
    if (!userId) return;
    listImcHistory(userId, 6).then(setHistory).catch(() => setHistory([]));
  }, [userId]);

  const handleResult = (payload: IMCResultPayload) => {
    setResult(payload);
    if (!userId) return;
    insertImcHistory({
      userId,
      weight: payload.weight,
      height: payload.height,
      imc: payload.imc,
      classification: payload.classification.label,
      createdAt: new Date().toISOString(),
    })
      .then(() => listImcHistory(userId, 6).then(setHistory))
      .catch(() => null);
  };

  if (!result) {
    return <InputScreen onResult={handleResult} history={userId ? history : undefined} />;
  }

  return <ResultScreen data={result} onBack={() => setResult(null)} />;
}
