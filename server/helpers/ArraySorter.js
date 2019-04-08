class ArraySorter {
  static arrayFinder(arrayObj, childProp, matchValue) {
    return arrayObj.find((arrayChild) => { return arrayChild[childProp] === matchValue; });
  }

  static arrayFilter(arrayObj, childProp, matchValue) {
    return arrayObj.filter((arrayChild) => { return arrayChild[childProp] === matchValue; });
  }

  static arrayFilterNot(arrayObj, childProp, matchValue) {
    return arrayObj.filter((arrayChild) => { return arrayChild[childProp] !== matchValue; });
  }

  static arrayFilterProp(arrayObj, childProp, matchValue) {
    return arrayObj.filter((arrayChild) => { return arrayChild[childProp] !== matchValue; });
  }
}

export default ArraySorter;
