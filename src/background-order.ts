type Identified = { id: string };

export function selectedFirst<T extends Identified>(choices: readonly T[], selectedId: string): T[] {
  const selected = choices.find((choice) => choice.id === selectedId) ?? choices[0];
  if (!selected) return [];
  return [selected, ...choices.filter((choice) => choice.id !== selected.id)];
}
