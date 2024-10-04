export const shuffleArray = (array: any[]) => {
  // Fisher-Yates (aka Knuth) Shuffle Algorithm, source: https://stackoverflow.com/a/2450976/14905742
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};
