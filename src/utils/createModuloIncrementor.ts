export default (n: number) => {
  let i = 0;
  return () => {
    const current = i;
    const modulo = i % n;
    i = (modulo + 1);
    return modulo;
  };
};
