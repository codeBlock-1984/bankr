const accountNumGen = () => {
  const base = 1000000000;
  const factor = 100000000;

  return Math.floor((Math.random() * factor) + base);
};

export default accountNumGen;
