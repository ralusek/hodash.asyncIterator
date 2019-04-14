const { asyncIterator } = require('../dist');

const data = [];

for (let i = 0; i < 18; i++) {
  data.push('index' + i);
}

function getRecords(data, from = 0, amount = 10) {
  const records = [];
  const last = Math.min(data.length, from + amount);
  for (let i = from; i < last; i++) {
    records.push(data[i]);
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(records), 1000);
  });
}

const paginate = (start = 0) => asyncIterator((from = start, {push, done, index}) => {
  return getRecords(data, from)
  .then(results => {
    if (results.length === 10) push(from + 10);
    else done();
    return results;
  });
});

// Load all
const loadAll = async () => {
  const paginator = paginate();
  const results = [];
  while (true) {
    const next = await paginator.next();
    next.value.forEach(item => results.push(item));
    if (next.done) return results;
  }
};

loadAll()
.then(response => console.log('All', response));

// paginate.next().then((response) => {
//   console.log('Response', response);
// });

// paginate.next().then((response) => {
//   console.log('Response', response);
// });