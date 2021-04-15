USE uwubot;
DROP TABLE IF EXISTS xp;

CREATE TABLE xp (
    userId text,
    xpCount int,
    level int,
    zeroNum int DEFAULT 0 
);

