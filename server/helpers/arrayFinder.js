const arrayFinder = (arrayObj, childProp, matchValue) => {
  return arrayObj.find((arrayChild) => { return arrayChild[childProp] === matchValue; });
};

export default arrayFinder;
