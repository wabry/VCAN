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

    static getApps (folderID, callback) {
        // Gets all apps in a folder
        let db = this.connection();
        let sql = "select name from applications where folderID == ?";
        this.getAsync(db, sql, [folderID]).then((rows) => {
            callback(rows);
            db.close();
        })
        .catch(error => console.log(error));
    }
    static addApp (appName, folderID, callback) {
        // Adds the app to the folder
        let db = this.connection();
        let sql = "insert into applications(name, folderID) values(?,?)";
        this.asyncRun(db, sql, [appName, folderID]).then(() => {db.close()})
        .catch(error => console.log(error));
    }

    static removeApp (appName, folderID) {
        // Removes the app from the folder
        let db = this.connection();
        let sql = "delete from applications where name == ? and folderID == ?";
        this.asyncRun(db, sql, [appName, folderID]).then(() => {db.close()})
        .catch(error => console.log(error));
    }

    static getFolders (folderID, callback) {
        // Gets all folders in a folder
        let db = this.connection();
        let sql = "select name, ID, parentID from folders where parentID == ? and ID != 0";
        this.getAsync(db, sql, [folderID]).then((rows) => {
            callback(rows);
            db.close();
        })
        .catch(error => console.log(error));
    }

    static addFolder (folderNameToAdd, parentFolderID, callback) {
        // Adds the folderToAdd to the folder
        let db = this.connection();
        let sqlCheck = "select * from folders where name == ? and parentID == ?";
        this.getAsync(db, sqlCheck, [folderNameToAdd, parentFolderID]).then((rows) =>{
            if (rows === undefined || rows.length == 0) {
                let sql = "insert into folders(name, parentID) values (?,?)";
                this.asyncRun(db, sql, [folderNameToAdd, parentFolderID]).then(() => {db.close()});
                callback(false);
            }
            else {
                callback(true);
                db.close();
            }
        })
        .catch(error => console.log(error));
    }

    static removeFolder (folderIDToRemove) {
        // Removes the folderToRemove from the folder
        let db = this.connection();
        let sql = "delete from folders where ID == ? and static is null";
        this.asyncRun(db, sql, [folderIDToRemove]).then(() => {db.close()})
        .catch(error => console.log(error));
    }

    static getParent(folderID, callback) {
        // Gets the parent folder of a folder
        let db = this.connection();
        let sql = "select parentID from folders where ID == ?";
        this.getAsync(db,sql, [folderID]).then((rows) => {
            callback(rows);
            db.close();
        })
        .catch(error => console.log(error));
    }

    static searchFolder (folderName, callback) {
    	// Searches the database for the folderName
        let db = this.connection();
        let sql = "select name, ID, parentID from folders where ID == ?";
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
