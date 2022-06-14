const sqlite = require('sqlite3');
const db = new sqlite.Database('exam.db',
    (err) => { if (err) throw err; }
);


exports.getAllCourses = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM courses ORDER BY titolo ASC`, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    });
}

exports.getAllCoursesCode = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT codice FROM courses`, (err, rows) => {
            if (err) reject(err);
            resolve(rows.map(c => c.codice));
        })
    });
}

exports.updateStudentsCount = () => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE courses SET tot_studenti = (SELECT COUNT(*) FROM plans WHERE plans.courseId = courses.codice)',
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
    });
}







