const sqlite = require('sqlite3');
const db = new sqlite.Database('exam.db',
    (err) => { if (err) throw err; }
);
