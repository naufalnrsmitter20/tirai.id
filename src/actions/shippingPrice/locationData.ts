import * as fs from "fs";
import * as path from "path";

export interface LocationData {
  id: string;
  prop: string;
  kota: string;
  tipe: string;
  kec: string;
}

const dataPath = path.join(
  process.cwd(),
  "/src/actions/shippingPrice/locationData.json",
);
const rawData = fs.readFileSync(dataPath, "utf-8");
const items: LocationData[] = JSON.parse(rawData);

const tokenize = (str: string): string[] => {
  return str
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/);
};

const normalizeInput = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/kab\.?/g, "kabupaten")
    .replace(/kota\.?/g, "kota")
    .replace(/prov\.?/g, "provinsi")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const levenshtein = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost, // Substitution
      );
    }
  }

  return matrix[a.length][b.length];
};

const calculateTokenDistance = (
  queryToken: string,
  tokens: string[],
): number => {
  let minDistance = Infinity;

  for (const dataToken of tokens) {
    const distance = levenshtein(queryToken, dataToken);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance;
};

const findClosestLocation = async (
  query: string,
): Promise<LocationData | null> => {
  const normalizedQuery = normalizeInput(query);
  const queryTokens = tokenize(normalizedQuery);

  let bestMatch: LocationData | null = null;
  let bestScore = Infinity;

  for (const item of items) {
    const kotaTokens = tokenize(item.kota);
    const kecTokens = tokenize(item.kec);
    const propTokens = tokenize(item.prop);

    let totalDistance = 0;
    let matchCount = 0;

    for (const queryToken of queryTokens) {
      const minDistance = calculateTokenDistance(queryToken, [
        ...kotaTokens,
        ...kecTokens,
        ...propTokens,
      ]);

      if (minDistance <= 2) matchCount++;
      totalDistance += minDistance;
    }

    const averageDistance = totalDistance / queryTokens.length;

    if (matchCount > 0 && averageDistance < bestScore) {
      bestScore = averageDistance;
      bestMatch = item;
    }
  }

  return bestScore <= 3 && bestMatch ? bestMatch : null;
};

export { findClosestLocation };
