## Database cmds

ssh 10.0.0.6
/usr/local/mariadb10/bin/mysql -u root -p       # def##Ly...

C:\"Program Files (x86)"\mysql-8.0.18-winx64\bin\mysql.exe -ucookbookuser -h 10.0.0.7 -P 3307 --password=#app7USER7# cookbookdb

select host, user, password from mysql.user;

SHOW DATABASES;

SELECT table_name FROM information_schema.tables WHERE table_schema = 'cookbookdb';

SELECT COLUMN_NAME , COLUMN_TYPE FROM information_schema.columns WHERE table_schema = 'cookbookdb' AND table_name='RecipeIngredient' ;

SHOW ENGINE INNODB STATUS;

## Java app cmds

java -jar /volume1/web/cookbook/cookbook-1.0-SNAPSHOT.jar > /volume1/web/cookbook/rest.log 2>&1 & 

cat /volume1/web/cookbook/rest.log

ps -fea|grep -i java

## Build & Deploy cmds

Push-Location K:\CookBook\cookbookweb; npm run build; Pop-Location;
Copy-Item K:\CookBook\cookbookweb\build\* W:\cookbook\ -Force -Recurse

Copy-Item K:\CookBook\cookbookrest\target\cookbook-1.0-SNAPSHOT.jar W:\cookbook\ -Force

