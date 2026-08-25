export function moveItem<T>(items: readonly T[], fromIndex: number, offset: -1 | 1): T[] {
  const reordered = [...items];
  const toIndex = fromIndex + offset;

  if (fromIndex < 0 || fromIndex >= reordered.length || toIndex < 0 || toIndex >= reordered.length) {
    return reordered;
  }

  const [item] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, item);
  return reordered;
}
