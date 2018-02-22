// This file wraps database commands for interaction with the webserver - these are blocking
class dbWrapper {
    static connection()
    {
        let sqlite3 = require('sqlite3').verbose();
        let file = "vcan.sqlite3";
        let db = new sqlite3.Database(file);
        db = db.run("PRAGMA foreign_keys = ON");
        return db;
    }

    static getAsync(db, sql, values = []) {
        return new Promise(function (resolve, reject) {
            db.all(sql, values, function (err, rows) {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
    };

    static asyncRun(db, sql, values) {
        return new Promise(function (resolve, reject) {
            db.run(sql, values, function (err) {
                if (err)
                    reject(err);
                else
                    resolve(this.lastID);
            });
        });
    };

    static getApps (folder, callback) {
        // Gets all apps in a folder
        let db = this.connection();
        let sql = "select name from applications where folderName = ?";
        this.getAsync(db, sql, [folder]).then((rows) => {
            callback(rows);
            db.close();
        })
        .catch(error => console.log(error));
    }
    static addApp (app, folder, callback) {
        // Adds the app to the folder
        let db = this.connection();
        let sql = "insert into applications(name, folderName) values(?,?)";
        this.asyncRun(db, sql, [app, folder]).then(() => {db.close()})
        .catch(error => console.log(error));
    }

    static removeApp (app, folder) {
        // Removes the app from the folder
        let db = this.connection();
        let sql = "delete from applications where name = ? and folderName = ?";
        this.asyncRun(db, sql, [app, folder]).then(() => {db.close()})
        .catch(error => console.log(error));
    }

    static getFolders (folder, callback) {
        // Gets all folders in a folder
        let db = this.connection();
        let sql = "select name from folders where parentName = ? and name != 'root'";
        this.getAsync(db, sql, [folder]).then((rows) => {
            callback(rows);
            db.close();
        })
        .catch(error => console.log(error));
    }

    static addFolder (folderToAdd, folder) {
        // Adds the folderToAdd to the folder
        let db = this.connection();
        let sql = "insert into folders(name, parentName) values (?,?)";
        this.asyncRun(db, sql, [folderToAdd, folder]).then(() = > {db.close()})
        .catch(error => console.log(error));
    }

    static removeFolder (folderToRemove, folder) {
        // Removes the folderToRemove from the folder
        let db = this.connection();
        let sql = "delete from folders where name == ? and static is null";
        this.asyncRun(db, sql, [folderToRemove]).then(() = > {db.close()})
        .catch(error => console.log(error));
    }

    static getParent(folder, callback) {
        // Gets the parent folder of a folder
        let db = this.connection();
        let sql = "select parentName from folders where name == ?";
        this.getAsync(db,sql, [folder]).then((rows) => {
            callback(rows);
            db.close();
        })
        .catch(error => console.log(error));
    }

    static search (searchName, callback) {
    	// Searches the database for something with the name
        let db = this.connection();
        let sql = "(select name from folders where name == ?) union all (select name from applications where name == ?";
        this.getAsync(db, sql, [searchName]).then((rows) => {
            callback(rows);
            db.close();
        })
        .catch(error => console.log(error));
    }

    static searchFolder (folderName, callback) {
    	// Searches the database for the folderName
        let db = this.connection();
        let sql = "select name from folders where name == ?";
        this.getAsync(db, sql, [folderName]).then((rows) => {
            callback(rows);
            db.close();
        })
        .catch(error => console.log(error));
    }

    static searchApp (appName, callback) {
    	// Searches the database for the appName
        let db = this.connection();
        let sql = "select name from apps where name == ?";
        this.getAsync(db, sql, [appName]).then((rows) => {
            callback(rows);
            db.close();
        })
        .catch(error => console.log(error));
    }
}

module.exports = dbWrapper;
