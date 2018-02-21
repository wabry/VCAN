PRAGMA foreign_keys = ON;

CREATE TABLE folders(
	ID INTEGER NOT NULL,
	name VARCHAR(40) NOT NULL,
	parentName VARCHAR(40) NOT NULL,
	favorited INTEGER,
	static integer,
	PRIMARY KEY(ID),
	CONSTRAINT foldernames UNIQUE(name),
	FOREIGN KEY(parentName) REFERENCES folders(name) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE applications(
	ID INTEGER NOT NULL,
	name VARCHAR(40) NOT NULL,
	description VARCHAR(1024),
	favorited INTEGER,
	CONSTRAINT appnames UNIQUE(name),
	PRIMARY KEY(ID)
);

CREATE TABLE filed(
	folderName VARCHAR(40) NOT NULL,
	appName VARCHAR(40) NOT NULL,
	PRIMARY KEY (folderName, appName),
	FOREIGN KEY (folderName) REFERENCES folders(name) ON DELETE CASCADE,
	FOREIGN KEY (appName) REFERENCES applications(name) ON DELETE CASCADE,
	CONSTRAINT singlefiled UNIQUE(appName)
);
