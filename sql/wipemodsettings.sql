USE uwubot;
DROP TABLE IF EXISTS modsettings;

CREATE TABLE modsettings (
    guildId text,
    warnChannelId text,
    secret text,
    ownerId text,
    strike1RoleId text,
    strike2RoleId text,
    cases int DEFAULT 0,
    warns int DEFAULT 0,
    kicks int DEFAULT 0,
    bans int DEFAULT 0
    
);

