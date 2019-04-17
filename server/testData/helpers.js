const testArray = [
  {
    propAOne: 'valueAOne',
    propATwo: 'valueATwo',
    propAThree: 'valueAThree',
  },
  {
    propBOne: 'valueBOne',
    propBTwo: 'valueBTwo',
    propBThree: 'valueBThree',
  },
  {
    propCOne: 'valueAOne',
    propCTwo: 'valueCTwo',
    propCThree: 'valueCThree',
  },
  {
    propDOne: 'valueDOne',
    propDTwo: 'valueDTwo',
    propDThree: 'valueDThree',
  },
];

const truthyArray = ['true', true, { true: true, trueToo: 'trueToo' }, 1];

const falsyArray = [false, undefined, null, 0, ''];

export default {
  testArray,
  truthyArray,
  falsyArray,
};
