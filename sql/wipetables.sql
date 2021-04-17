-- use this if you cant use wipedb.sql or createdb.sql because DROP DATABASE etc is not allowed

USE uwubot;
DROP TABLE IF EXISTS xp;
DROP TABLE IF EXISTS modsettings;

CREATE TABLE xp (
    userId text,
    xpCount int,
    level int,
    username text
);


CREATE TABLE modsettings (
    guildId text,
    warnChannelId text,
    secret text,
    ownerId text,
    cases int DEFAULT 0,
    warns int DEFAULT 0,
    kicks int DEFAULT 0,
    bans int DEFAULT 0,
    strike1RoleId text,
    strike2RoleId text
);
