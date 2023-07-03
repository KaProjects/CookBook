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