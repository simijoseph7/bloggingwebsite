/*
* Initial setup
* 1. Create a new database called project-database.db
* 2. Execute below scripts to create the tables and insert some initial data 
* 
*/

drop table if exists articles;
drop table if exists comments;
drop table if exists category_subscriber;
drop table if exists subscription;
drop table if exists users;
drop table if exists categories;


create table users(
  userId INTEGER NOT NULL PRIMARY KEY,
  userName VARCHAR(64) NOT NULL UNIQUE,
  password TEXT NOT NULL, 
  fname VARCHAR (64)NOT NULL,
  lname VARCHAR (64) NOT NULL,
  dob date,
  email VARCHAR(128) NOT NULL,
  userImage VARCHAR (20),
  description TEXT NOT NULL,
  authToken TEXT
);

create table categories(
  categoryId integer not null primary key,
  description varchar(300)
);

create table articles(
  articleId integer not null primary key,
  title varchar(300),
  content text,
  creationDate timestamp,
  articleImage varchar(128),
  userId integer not null,
  categoryId integer not null,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
);

create table comments(
  commentId integer not null primary key,
  content text,
  creationDate timestamp,
  articleId integer not null,
  userId integer not null,
  parentCommentId integer,
  FOREIGN KEY (articleId) REFERENCES articles(articleId)  ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(userId) ON DELETE CASCADE
);

create table subscription(
  email varchar(128) not null primary key,
  fullName varchar(128)
);

create table category_subscriber(
  email varchar(128) not null,
  categoryId integer not null,
  FOREIGN KEY (email) REFERENCES subscription(email) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories(categoryId),
  PRIMARY KEY (email,categoryId)
);

insert into users (userName, password, fname, lname, dob, email, userImage, description) values
    ('admin', '$2b$10$Ye/VnI74Y7tzfft6zZG2we6ha4Dicw5nmGIidoNQGVLCtDdPo3cOG', 'admin', 'admin', date('1995-04-04'), 'admin@blah.com', 'avatar00_default.PNG', 'This is the Admin account.'),
    ('user1', '$2b$10$Ye/VnI74Y7tzfft6zZG2we6ha4Dicw5nmGIidoNQGVLCtDdPo3cOG', 'Jill', 'Thomas', date('2000-11-03'), 'jill.thomas@blah.com', 'avatar02.PNG', 'This is a default user.'),
    ('user2', '$2b$10$Ye/VnI74Y7tzfft6zZG2we6ha4Dicw5nmGIidoNQGVLCtDdPo3cOG', 'Jack', 'Jones', date('1995-04-04'), 'jack.jones@blah.com', 'avatar01.PNG', 'This is a default user.');
	
insert into categories (description) values
   ('General'),
   ('Technology'),
   ('Business'),
   ('Travel'),
   ('Culture');
	 
insert into articles (title, content,creationDate, articleImage, userId, categoryId) values 
('Pokem ipsum dolor sit amet Gliscor Venusaur Druddigon Staryu Omanyte Machoke', 'Sapphire Smoochum Granbull Shaymin Skiploom Druddigon Yamask. Venusaur Rapidash Golem our courage will pull us through Vanillish Red Dwebble. Thundershock gym Serperior Sinnoh Storm Badge Steelix Missingno. Thundershock Typhlosion grumpy old man who needs coffee Officer Jenny ex ea commodo consequat Drifblim Thundurus.',datetime('now','localtime'), 'default_tech.jpg', 1, 2),
('Mewtwo Strikes Back Pansear Hoothoot Drifblim Ekans Dragonair Seviper', 'Pallet Town Bonsly Pallet Town Volcarona Prinplup Snorunt Hoenn. Rock Espeon James Shelgon Terrakion Dusknoir Phione. Cascade Badge Junichi Masuda Ludicolo Bidoof Rainbow Badge Illumise Chinchou. Swift Meowth Fraxure Camerupt Mineral Badge Magmar Sunflora.',datetime('now','localtime'), 'default_general.jpg', 2, 1),
('Psychic Johto Dome Fossil Sunkern Dewott Alomomola Growl', 'Psychic Unfezant Sandslash Relicanth Omastar Phione Professor Elm. Pallet Town Natu Machamp Wailmer Jynx Dragon Vespiquen. Hoenn Shellder Mystery Gift Glalie Basculin Steelix Bayleef. Venusaur Machamp Scolipede Cerulean City Golett Mismagius Wurmple.',datetime('now','localtime'), 'default_business3.jpg', 2, 3),
('Mewtwo Strikes Back Giovanni Roserade Heatmor Cascade', 'Badge to extend our reach to the stars above Mightyena. Volcano Badge Horsea Wartortle Houndour Zigzagoon Mamoswine Elite Four. Fog Badge Ice Cloyster Loudred Octillery Gastly Surskit. Ut aliquip ex ea commodo consequat Combusken Croconaw Gold bicycle Houndour Heatran. Razor Leaf Manaphy Goldeen Bonsly Wurmple Seel Kricketune.',datetime('now','localtime'), 'default_travel.jpg', 3, 4),
('Consectetur adipisicing elit Pokeball Panpour Hitmonchan I like shorts Drifloon Ninjask', 'Ivysaur Ditto Rhyhorn Gengar Slaking Pidgeotto Gible. Earth Badge oh, you are my best friend Metang Slakoth Marshtomp Electric Altaria. Hoenn Pidgey Scizor Seismitoad Charizard Rotom Weezing. Gold Swift Magmortar Petilil Pokemon, it is you and me Garbodor ullamco laboris nisi.Tail Whip Sneasel Drapion Wailord Groudon Patrat Wurmple. Pikachu Glameow Audino Piloswine Joltik Gabite Gothita. Ivysaur Nincada Clefable Scraggy Team Rocket Mudkip Kangaskhan. Wartortle Garchomp Venonat Murkrow Bastiodon Rapidash I like shorts. Strength Spearow Garchomp Marshtomp Raticate Nidorina Slash.',datetime('now','localtime'), 'default_business4.jpg', 2, 3),
('Celadon Department Store Roselia Haxorus Krabby Electrike Woobat to train them is my cause', 'Pewter City Kirlia Mareep sunt in culpa qui officia Spearow Drifblim Cubone. Sunt in culpa Voltorb Emolga Drapion Silph Scope Claydol grumpy old man who needs coffee. Red Beldum Tentacruel Pokeball Simisear Pachirisu Hydro Pump. Ivysaur Quagsire Beedrill Ditto Zubat Gorebyss Dusknoir. Bulbasaur Misty Chansey Treecko Machoke Bulbasaur Groudon. Fuchsia City Psyduck Lumineon Koffing Blastoise Dewgong Rock. Blizzard Zangoose Glaceon our courage will pull us through Fighting Gengar Pignite. Tail Whip Jumpluff Golem Girafarig Vaporeon Magikarp Blitzle. Squirtle Joltik Archen Ducklett Fraxure Absol Dodrio.',datetime('now','localtime'), 'default_culture2.jpg', 1, 5);

insert into comments (content,creationDate, articleId, userId) values
('Sonic Boom Magmar Pokemon The Movie 2000 Rising Badge we"re blasting off again Spiritomb Pewter City.',datetime('now','localtime'),1, 1),
('Pokem ipsum dolor sit amet Thundershock Spinarak Armaldo Magmortar Unfezant quis nostrud exercitation..',datetime('now','localtime'),1, 2),
('Ut enim ad minim veniam Tail Whip Pewter City Zangoose Exploud Chandelure Luxray.',datetime('now','localtime'),1, 3),
('Pallet Town Combusken Piplup Remoraid Rayquaza Foongus Wailmer.',datetime('now','localtime'),4, 1),
('Soul Badge Musharna Lickilicky Wobbuffet Gengar Exploud Beheeyem.',datetime('now','localtime'),4, 2),
('Psychic Gulpin Raikou Golurk Unfezant Tympole Chatot.',datetime('now','localtime'),1, 3),
('Bubble Lairon Golduck Steel Durant Sapphire Vigoroth.',datetime('now','localtime'),1, 2),
('Ivysaur Leaf Green Lickitung Pallet Town oh, you"re my best friend Cascoon Spheal. Dragon Croagunk Rotom Pidgey Teleport Octillery Lunatone.',datetime('now','localtime'),1,3);

insert into subscription (email, fullName) values 
('jeannecang@gmail.com', 'Frodo Baggins'),
('simi.joseph7@hotmail.com', 'Gandalf Grey');

insert into category_subscriber (email, categoryId) values 
('jeannecang@gmail.com', '1'),
('simi.joseph7@hotmail.com', '4');
