const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('exam.db',
    (err) => { if (err) throw err; }
);

//called by deserializeUser the user is still authenticated
exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = { id: row.id, username: row.email, nome: row.nome, cognome: row.cognome }
                resolve(user);
            }
        });
    });
};

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?',
            [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve({error: 'User not found.'}); //Resolve: because from DB side everything goes well. 
                } else {
                    const user = { id: row.id, username: row.email, nome: row.nome, cognome: row.cognome, full_time: row.full_time };
                    const salt = row.salt;
                    crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                        if (err) {
                            reject(err);
                        }
                        const passHex = Buffer.from(row.hash, 'hex');
                        if (!crypto.timingSafeEqual(passHex, hashedPassword)) {
                            resolve(false);
                        } else {
                            resolve(user);
                        }
                    });
                }
            });
    });
}