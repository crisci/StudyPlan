const sqlite = require('sqlite3');
const db = new sqlite.Database('exam.db',
    (err) => { if (err) throw err; }
);


exports.getAllCourses = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM courses ORDER BY nome ASC`, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    });
}






