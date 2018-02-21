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
        var apps = [];
        let db = this.connection();
        let sql = "select a.name from applications a join filed s on" +
                  " a.ID == s.appID join folders f on f.ID == s.folderID" +
                  " where f.name == ?";
        this.getAsync(db, sql, [folder]).then(function(rows) {
            callback(rows);
        });
    }
    static addApp (app, folder) {
        // Adds the app to the folder
        let db = this.connection();
        let sql1 = "select id as fid from folders where name == ?";
        this.getAsync(db, sql1, [folder]).then ((rows1) => {
            let fid = rows1[0].fid;
            let sql2 = "select id as aid from applications where name == ?";
            this.getAsync(db, sql2, [app]).then ((rows2) => {
                let aid = rows2[0].aid;
                let sql3 = "insert into filed(folderID, appID) values(?,?)";
                this.asyncRun(db, sql3, [fid, aid]); 
            });
        });
    }

    static removeApp (app, folder) {
        // Removes the app from the folder
        let db = this.connection();
        let sql1 = "select id as fid from folders where name == ?";
        this.getAsync(db, sql1, [folder]).then ((rows1) => {
            let fid = rows1[0].fid;
            let sql2 = "select id as aid from applications where name == ?";
            this.getAsync(db, sql2, [app]).then ((rows2) => {
                let aid = rows2[0].aid;
                let sql3 = "delete from filed where folderID == ? and appID == ?";
                this.asyncRun(db, sql3, [fid, aid]);
            });
        });
    }

    static getFolders (folder, callback) {
        // Gets all folders in a folder
        var folders = [];
        let db = this.connection();
        let sql1 = "select ID as fid from folders where name == ?";
        this.getAsync(db, sql1, [folder]).then((rows1) => {
            let fid = rows1[0].fid;
            let sql2 = "select name from folders where parentID = ?";
            this.getAsync(db, sql2, [fid]).then(function(rows) {
                callback(rows);
            });
        });
    }

    static addFolder (folderToAdd, folder) {
        // Adds the folderToAdd to the folder
        let db = this.connection();
        let sql1 = "select ID as fid from folders where name == ?";
        this.getAsync(db, sql1, [folder]).then((rows) =>{
            let fid = rows[0].fid;
            let sql2 = "insert into folders(name, parentID) values(?,?)";
            this.asyncRun(db, sql2, [folderToAdd, fid]);
        });
    }

    static removeFolder (folderToRemove, folder) {
        // Removes the folderToRemove from the folder
        let db = this.connection();
        let sql = "delete from folders where name == ?";
        this.asyncRun(db, sql, [folderToRemove]);
    }

    static getParent(folder, callback) {
        // Gets the parent folder of a folder
        let db = this.connection();
        let sql1 = "select id as fid from folders where name == ?";
        this.getAsync(db,sql1, [folder]).then((rows) => {
            let fid = rows[0].fid;
            let sql2 = "select name from folders where id == ?";
            this.getAsync(db, sql2, [fid]).then(callback(rows));
        });
    }

    static search (searchName, callback) {
    	// Searches the database for something with the name
        let db = this.connection();
        let sql = "(select name from folders where name == ?) union all (select name from applications where name == ?";
        this.getAsync(db, sql, [searchName]).then(callback(rows));
    }

    static searchFolder (folderName, callback) {
    	// Searches the database for the folderName
        let db = this.connection();
        let sql = "select name from folders where name == ?";
        this.getAsync(db, sql).thn(callback(rows));
    }

    static searchApp (appName, callback) {
    	// Searches the database for the appName
        let db = this.connection();
        let sql = "select name from apps where name == ?";
        this.getAsync(db, sql).then(callback(rows));
    }
}

module.exports = dbWrapper;