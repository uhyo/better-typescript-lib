export const test = (getPromise: () => Promise<unknown>) => {
  const start = Date.now();

  getPromise().finally<number>(() => {
    const end = Date.now();
    return end - start;
  });

  getPromise().finally<number>(() => {
    const end = Date.now();
    return Promise.resolve(end - start);
  });

  // @ts-expect-error
  getPromise().finally<number>(() => "NaN");
};
