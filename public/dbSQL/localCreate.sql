-- If we are in localhost then we have to create the database
-- named languages. If on a hosting site the db is initialize
-- and has a name and USE is set.
DROP DATABASE IF EXISTS languages;
CREATE DATABASE languages;
USE languages;