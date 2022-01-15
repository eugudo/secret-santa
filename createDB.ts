// import { verbose } from 'sqlite3';
// const sqlite = verbose();

// const db = new sqlite.Database('db.sqlite3');

// db.serialize(() => {
//     db.run('CREATE TABLE lorem (info TEXT)');

//     const stmt = db.prepare('INSERT INFO lorem VALUES (?)');
//     for (let i = 0; i < 10; i++) {
//         stmt.run(`Ipsum ${i}`);
//     }
//     stmt.finalize();

//     db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log(`${row.id}: ${row.info}`);
//     });
// });

// db.close();
