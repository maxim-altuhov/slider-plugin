import createUniqueID from '../../utils/createUniqueID';

const NUMBER_OF_CHECKS = 50;
const IDArray: string[] = [];
let arrayOfDuplicates: string[] = [];

beforeAll(() => {
  IDArray.length = 0;
  arrayOfDuplicates.length = 0;

  for (let checkCounter = 0; checkCounter < NUMBER_OF_CHECKS; checkCounter++) {
    IDArray.push(createUniqueID());
  }

  arrayOfDuplicates = IDArray.filter((e, index, arr) => arr.indexOf(e) !== index);
});

test('Checking the "createUniqueID" function, the function returns a unique ID each time', () => {
  expect(arrayOfDuplicates).toHaveLength(0);
});
