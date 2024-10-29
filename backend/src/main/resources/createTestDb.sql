DROP TABLE IF EXISTS Ingredient;
DROP TABLE IF EXISTS Step;
DROP TABLE IF EXISTS Recipe;
CREATE TABLE Recipe (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        cook TINYTEXT NOT NULL,
        name TINYTEXT NOT NULL,
        category TINYTEXT NOT NULL,
        image LONGBLOB
);
CREATE TABLE Step (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        text TEXT NOT NULL,
        number TINYINT NOT NULL,
        optional BOOLEAN,
        recipeId VARCHAR(36) NOT NULL,
        CONSTRAINT `fk_stepRecipeId` FOREIGN KEY (recipeId) REFERENCES Recipe(id)
);
CREATE TABLE Ingredient (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name TINYTEXT NOT NULL,
        quantity VARCHAR(30) NOT NULL,
        optional BOOLEAN,
        recipeId VARCHAR(36) NOT NULL,
        CONSTRAINT `fk_ingredientRecipeId` FOREIGN KEY (recipeId) REFERENCES Recipe(id)
);

INSERT INTO Recipe (id, cook, name, category) VALUES ('1', 'user', 'First Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('2', 'user', 'Second Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('3', 'user', 'Third Recipe', 'Maso');
INSERT INTO Recipe (id, cook, name, category) VALUES ('4', 'user2', 'First Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('5', 'hellboy', 'aaaa', 'Kuracie Maso');
INSERT INTO Recipe (id, cook, name, category) VALUES ('6', 'updater', 'to update', 'updatable');
INSERT INTO Recipe (id, cook, name, category) VALUES ('7', 'user', '7 Recipe (a la moi)', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('8', 'user', 'Cestoviny s lososom a spenatom', 'Cestoviny');
INSERT INTO Recipe (id, cook, name, category) VALUES ('9', 'user', 'First Recipe', 'Ranajky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('10', 'user', 'First Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('11', 'user', 'First Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('12', 'user', 'First Recipe', 'Morske plody');
INSERT INTO Recipe (id, cook, name, category) VALUES ('13', 'user', 'First Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('14', 'user', 'First Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('15', 'user', 'First Recipe', 'Polievky');


INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('1', 'Pomodoro', '4ks', false, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('2', 'Batatas', '2ks', false, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('3', 'Fruitisimo', '100ml', true, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('4', 'Kachnicka', '1/2', false, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('5', 'Batatas', '3ks', false, '1');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('6', 'Moloko', '1l', false, '4');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('7', 'Mucho Gusto', '100kg', false, '5');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('8', 'Wateva', '1t', false, '6');

INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('1', 'asfialsfk asd s', 1, false, '1');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('2', '1 asd s', 1, false, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('3', '2 asd s', 2, false, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('4', '3 asd s', 3, true, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('5', '4 asd s', 4, false, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('6', 'whateva step', 1, false, '6');

