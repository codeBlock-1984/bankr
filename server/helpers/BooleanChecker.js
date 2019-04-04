class BooleanChecker {
  static isDuplicate(val) {
    if (val) return false;
    return true;
  }

  static isExisting(val) {
    if (val) return true;
    return false;
  }
}

export default BooleanChecker;
