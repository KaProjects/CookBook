DROP TABLE IF EXISTS Ingredient;
DROP TABLE IF EXISTS Step;
DROP TABLE IF EXISTS Recipe;

CREATE TABLE Recipe (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        cook TINYTEXT NOT NULL,
        name TINYTEXT NOT NULL,
        category TINYTEXT NOT NULL,
        image LONGBLOB
);
CREATE TABLE Step (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        text TEXT NOT NULL,
        number TINYINT NOT NULL,
        optional BOOLEAN,
        recipeId INT UNSIGNED NOT NULL,
        CONSTRAINT `fk_stepRecipeId` FOREIGN KEY (recipeId) REFERENCES Recipe(id)
);
CREATE TABLE Ingredient (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name TINYTEXT NOT NULL,
        quantity VARCHAR(30) NOT NULL,
        optional BOOLEAN,
        recipeId INT UNSIGNED NOT NULL,
        CONSTRAINT `fk_ingredientRecipeId` FOREIGN KEY (recipeId) REFERENCES Recipe(id)
);
