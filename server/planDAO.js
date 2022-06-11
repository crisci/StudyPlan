const sqlite = require('sqlite3');
const db = new sqlite.Database('exam.db',
    (err) => { if (err) throw err; }
);
db.run(`PRAGMA foreign_key = ON`);

//get plan related to the user
exports.getPlanByUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT courseId, titolo, crediti FROM users LEFT JOIN plans ON users.id = plans.userId LEFT JOIN courses ON plans.courseId = courses.codice WHERE id = ?',
            [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows === undefined) {
                        resolve({ error: "user not found" });
                    } else {
                        const userPlan = rows.filter(row => row.courseId !== null).map(row => Object.assign({}, { codice: row.courseId, titolo: row.titolo, crediti: row.crediti }));
                        resolve(userPlan);
                    }
                }
            })
    });
}

// add new course to the plan
exports.addCourseToPlan = (userId, courseId) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO plans(userId, courseId) VALUES (?, ?)',
            [userId, courseId], (err) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    resolve(null);
                }
            })
    });
};


// delete plan (delete all courses related to the user)
exports.deletePlan = (userId) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM plans WHERE userId = ?',
            userId, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
    });
}
