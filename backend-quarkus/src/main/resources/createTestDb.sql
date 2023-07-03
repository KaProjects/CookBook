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
        CONSTRAINT `fk_StepRecipeId` FOREIGN KEY (recipeId) REFERENCES Recipe(id)
);
CREATE TABLE Ingredient (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name TINYTEXT NOT NULL,
        quantity VARCHAR(30) NOT NULL,
        optional BOOLEAN,
        recipeId VARCHAR(36) NOT NULL,
        CONSTRAINT `fk_recipeId` FOREIGN KEY (recipeId) REFERENCES Recipe(id)
);

INSERT INTO Recipe (id, cook, name, category) VALUES ('1', 'user', 'First Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('2', 'user', 'Second Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('3', 'user', 'Third Recipe', 'Maso');
INSERT INTO Recipe (id, cook, name, category) VALUES ('4', 'user2', 'First Recipe', 'Polievky');

INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('1', 'Pomodoro', '4ks', false, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('2', 'Batatas', '2ks', false, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('3', 'Fruitisimo', '100ml', true, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('4', 'Kachnicka', '1/2', false, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('5', 'Batatas', '3ks', false, '1');

INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('1', 'asfialsfk asd s', 1, false, '1');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('2', '1 asd s', 1, false, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('3', '2 asd s', 2, false, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('4', '3 asd s', 3, true, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('5', '4 asd s', 4, false, '2');

