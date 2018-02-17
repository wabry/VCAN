class dbaccess{
	constructor()
	{
		let sqlite3 = require('sqlite3').verbose();
		let file = "vcan.sqlite3";
		this.db = new sqlite3.Database(file);
		this.db = this.db.run("PRAGMA foreign_keys = ON");
	}

	
	getAsync(sql) {
	    var that = this;
	    return new Promise(function (resolve, reject) {
	        that.db.all(sql, function (err, rows) {
	            if (err)
	                reject(err);
	            else
	                resolve(rows);

	        });
	    });
	};

	asyncrun(sql, values) {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.db.run(sql, values, function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(this.lastID);

                });
            });
        };
	
	//***************************
	//usable functions start here
	//***************************
	selectAllFolders() 
	{
		let sql = "select * from folders";
		return this.getAsync(sql);
	};

	selectFolderByName(name)
        {
                let sql = "select * from folders where name = ?";
                return this.getAsync(sql, [name]);
        };

	selectFolderByNameAndParent(name,parentID)
        {
                let sql = "select * from folders where name = ? and parentID = ?";
                return this.getAsync(sql,[name,parentID]);
        };

	selectFolderByID(id)
        {
                let sql = "select * from folders where id = ?";
                return this.getAsync(sql, [name]);
        };

	selectChildFolders(id)
        {
                let sql = "select * from folders where parentID = ?";
                return this.getAsync(sql, [id]);
        };

	selectFavoritedFolders()
        {
                let sql = "select * from folders where favorited is not null";
                return this.getAsync(sql);
        };

	selectAllApps()
	{
                let sql = "select * from applications";
                return this.getAsync(sql);
        };

	selectAppByID(id)
        {
                let sql = "select * from applications where id = ?";
                return this.getAsync(sql, [id]);
        };

	selectAppByName(name)
        {
                let sql = "select * from applications where name like ?";
                return this.getAsync(sql, [name]);
        };

	selectFavoritedApps()
        {
                let sql = "select * from applications where favorited is not null";
                return this.getAsync(sql);
        };

	selectAllFiled()
	{
                let sql = "select * from filed";
                return this.getAsync(sql);
        };

	createFolder(name, parentID)
	{
		let sql= "INSERT INTO folders(name, parentID) VALUES(?,?)";
		return this.asyncrun(sql, [name, parentID]);
	};

	createApp(name, description = "")
        {
                let sql= "INSERT INTO applications(name,description) VALUES(?,?)";
                return this.asyncrun(sql, [name, description]);
        };

	updateAppDescription(id, description)
        {
                let sql = "update applications set description = ? where id = ?";
                return this.asyncrun(sql, [description, id]);
        };

	fileApp(id, folderID)
	{
		let sql = "insert into filed(folderID, appID) values(?,?)";
		return this.asyncrun(sql, [folderID, id]);
	};

	moveFolderByID(id, newparentID)
	{
		let sql = "update folders set parentID = ? where id = ? and static is null";
		return this.asyncrun(sql, [newparentID, id]);
	};

	moveFolderByName(name, oldparentID, newparentID)
        {
                let sql = "update folders set parentID = ? where parentID = ? and name like ? and static is null";
                return this.asyncrun(sql, [newparentID, oldparentID, name]);
        };

	moveAppByID(id, oldfolderID, newfolderID)
        {
                let sql = "update filed set folderID = ? where folderID = ? and appID = ?";
                return this.asyncrun(sql, [newfolderID, oldfolderID, id]);
        };

	moveAppByNameThisIsRisky(name, oldfolderID, newfolderID)
        {
                let sql = "update filed set folderID = ? where folderID = ? and appID in (select ID from applications where name = ?)";
                return this.asyncrun(sql, [newfolderID, oldfolderID, name]);
        };

	favoriteFolderByID(id)
	{
                let sql = "update folders set favorited = 1 where id = ?";
                return this.asyncrun(sql, [id]);
        };

	favoriteFolderByName(name, parentID)
        {
                let sql = "update folders set favorited = 1 where name like ? and parentID = ?";
                return this.asyncrun(sql, [name,parentID]);
        };

	favoriteAppByID(id)
        {
                let sql = "update applications set favorited = 1 where id = ?";
                return this.asyncrun(sql, [id]);
        };

	favoriteAppByNameThisIsRisky(name)
        {
                let sql = "update applications set favorited = 1 where name like ?";
                return this.asyncrun(sql, [name]);
        };

	deleteFolderByID(id)
	{
		let sql = "delete from folders where id = ? and static is null";
		return this.asyncrun(sql, [id]);
	};

	deleteFolderByName(name, parentID)
        {
                let sql = "delete from folders where name like ? and parentID = ? and static is null";
                return this.asyncrun(sql, [name, parentID]);
        };

	deleteAppByID(id)
        {
                let sql = "delete from applications where id = ?";
                return this.asyncrun(sql, [id]);
        };

	deleteAppByNameThisIsRisky(name)
        {
                let sql = "delete from applications where name like ?";
                return this.asyncrun(sql, [id]);
        };

	unfileAppByID(appID,folderID)
        {
                let sql = "delete from filed where appid = ? and folderID = ?";
                return this.asyncrun(sql, [appID, folderID]);
        };

	unfileAppByNameThisIsRisky(name,folderID)
        {
                let sql = "delete from filed where appID in (select ID from applications where name like ?) and folderID = ?";
                return this.asyncrun(sql, [name, folderID]);
        };

	renameFolderByName(oldname, newname)
        {
                let sql = "update folders set name = ? where name like ? and static is null";
                return this.asyncrun(sql, [oldname, newname]);
        };

	renameFolderByID(id, name)
        {
                let sql = "update folders set name = ? where ID = ? and static is null";
                return this.asyncrun(sql, [id, name]);
        };
};	
//function print(thing)
//{
//	thing.then((rows) =>{console.log(rows);})
//};
//let db = new dbaccess();
//let temp = db.createApp("temp","test");
//let temp2 = temp.then((id) => {db.fileapp(id,0)});
//print(temp2);

//let db = new dbaccess();
//let temp = db.deleteFolderById(0);
