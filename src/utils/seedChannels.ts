export default (concurrency: number) => {
  const channels = [];
  for (let c = 0; c < concurrency; c++) {
    channels.push({promise: Promise.resolve(undefined), pushed: undefined, done: false});
  }

  return channels;
};