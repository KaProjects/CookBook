-- Fixtures for the @QuarkusTest classes. The tables come from sql/createTables.sql.
--
-- These rows are only ever read. A test that writes creates recipes of its own, so the suite
-- does not depend on the order its classes run in.
--
-- user  : 1 'First Recipe' (Polievky), 2 'Second Recipe' (Polievky, image), 3 'Third Recipe' (Maso)
-- user2 : 4 'First Recipe' (Polievky)
-- user3 : 5 'Kuracie' (Kuracie Maso)

INSERT INTO Recipe (id, cook, name, category) VALUES ('1', 'user', 'First Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category, image) VALUES ('2', 'user', 'Second Recipe', 'Polievky', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2Q==');
INSERT INTO Recipe (id, cook, name, category) VALUES ('3', 'user', 'Third Recipe', 'Maso');
INSERT INTO Recipe (id, cook, name, category) VALUES ('4', 'user2', 'First Recipe', 'Polievky');
INSERT INTO Recipe (id, cook, name, category) VALUES ('5', 'user3', 'Kuracie', 'Kuracie Maso');

INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('1', 'Pomodoro', '4ks', false, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('2', 'Batatas', '2ks', false, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('3', 'Fruitisimo', '100ml', true, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('4', 'Kachnicka', '1/2', false, '2');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('5', 'Batatas', '3ks', false, '1');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('6', 'Moloko', '1l', false, '4');
INSERT INTO Ingredient (id, name, quantity, optional, recipeId) VALUES ('7', 'Mucho Gusto', '100kg', false, '5');

INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('1', 'Boil the water', 1, false, '1');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('2', 'Chop', 1, false, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('3', 'Fry', 2, false, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('4', 'Garnish', 3, true, '2');
INSERT INTO Step (id, text, number, optional, recipeId) VALUES ('5', 'Serve', 4, false, '2');
