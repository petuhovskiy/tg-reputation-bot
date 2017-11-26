const Queue = require('./queue')

const q = new Queue();

for (let i = 0; i < 10; i++) {
    const num = i;
    q.add(() => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num);
        }, 500);
    })).then(console.log);
}