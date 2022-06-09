const sqlite = require('sqlite3');
const db = new sqlite.Database('exam.db',
    (err) => { if (err) throw err; }
);

exports.getPlanByUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT courseId, titolo, crediti FROM users LEFT JOIN plans ON users.id = plans.userId LEFT JOIN courses ON plans.courseId = courses.codice WHERE id = ?',
        [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if(rows === undefined) {
                    resolve({error: "user not found"});
                } else {
                    console.log(rows);
                    const userPlan = rows.filter(row => row.courseId !== null).map(row => Object.assign({}, {codice: row.courseId, titolo: row.titolo, crediti: row.crediti}));
                    resolve(userPlan)
                }
            }
        })
    });
}
