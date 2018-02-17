INSERT INTO folders(ID,name,parentID,favorited,static)
VALUES
(0,'root',0,NULL,1),
(1,'downloads',0,NULL,1),
(2,'favorites',0,NULL,1);
INSERT INTO folders(ID, name, parentID, favorited)
VALUES
(3, 'steamapps',0,1),
(4, 'programs',0,null),
(5, 'testing',0,null),
(6, 'common',3,null),
(7, 'downloading', 3,null),
(8, 'temp', 4, null),
(9, 'test', 4, null),
(10, 'namesarehard',8, 1);


INSERT INTO applications(ID, name, description, favorited)
VALUES
(1, 'warframe', 'this is a description', 1),
(2, 'chrome', 'its chrome you use it to browse the web', 1),
(3, 'internetExplorer', 'its IE you use it to install a better browser', null),
(4, 'cats', 'you pet them', 1),
(5, 'winderstat', 'provides a visualization of your hardrive usage', null),
(6, 'regex', 'its devil magic', null),
(7, 'tacos', 'you eat them', null);

INSERT INTO filed(folderID, appID)
VALUES
(0,5),
(0,6),
(6,1),
(4,2),
(4,3),
(1,4),
(8,7);

