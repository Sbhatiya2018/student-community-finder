const db = require('./db');

console.log("Fetching data from database.sqlite...");

db.all("SELECT * FROM communities", [], (err, rows) => {
    if (err) {
        console.error("Error:", err.message);
        return;
    }
    if (rows.length === 0) {
        console.log("Database is empty.");
    } else {
        console.table(rows);
    }
});
