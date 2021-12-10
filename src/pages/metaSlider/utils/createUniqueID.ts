function createUniqueID(): string {
  const IDPartOne = Date.now().toString(36);
  const IDPartTwo = Math.random().toString(36).substring(2);

  return IDPartOne + IDPartTwo;
}

export default createUniqueID;
