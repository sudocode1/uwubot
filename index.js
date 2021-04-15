const Discord = require('discord.js');
const bot = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const client = require('nekos.life');
const neko = new client();
const mysql = require('mysql');
const fetch = require('node-fetch');
const config = require('./static/config.json');

const cov = require('novelcovid');
cov.settings({
    baseUrl: 'https://disease.sh'
});


let connection = mysql.createConnection({
    host: config.dbhost,
    user: config.dbusername,
    password: config.dbpassword,
    database: config.dbname
});

connection.connect(function(err) {
    if (err) return console.error('error:' + err.message);
    console.log('mysql connected');
});

// connection.query(`DELETE FROM xp WHERE userId = '204255221017214977'`, (_1, ___, ____) => {
//     if (_1) return console.log(_1);
// });

// connection.query(`INSERT INTO xp (userId, xpCount, level, zeroNum) VALUES ('2', 0, 0, 0)`, (error, results, fields) => {
//     if (error) console.error(error);
// });

// connection.query(`DELETE FROM xp WHERE userId = '2'`, (error, results, fields) => {
//          if (error) console.error(error);
// });

let sql = `SELECT * FROM xp`;
connection.query(sql, (error, results, fields) => {
    if (error) console.error(error);

    //console.log(results);
    //console.log(results[0].userId);
});

let commands = {
    help: { category: 'util', params: '[command]', description: 'Help command' },
    color: { category: 'util', params: '[#hex]', description: 'Get your hex color or see a hex color' },
    nsfw: { category: 'nsfw', params: '<type>', description: 'Get an NSFW Image', footer: 'API Provided by nekos.life' },
    nsfwlist: { category: 'nsfw', params: '', description: 'See a list of NSFW types', footer: 'API Provided by nekos.life' },
    nsfwreddit: { category: 'nsfw', params: '[--hentaionly]', description: 'Get a random image from a random NSFW subreddit' },
    sfw: { category: 'sfw', params: '<type>', description: 'Get an SFW image', footer: 'API Provided by nekos.life' },
    sfwlist: { category: 'sfw', params: '', description: 'See a list of SFW types', footer: 'API Provided by nekos.life' },
    uwu: { category: 'fun', params: '<type>', description: 'UwUify your text', footer: 'API Provided by nekos.life' },
    rank: { category: 'xp', params: '[@user/id]', description: 'See level and XP' },
    leaderboard: { category: 'xp', params: '', description: 'See Global Leaderboard' },
    serverleaderboard: { category: 'xp', params: '', description: 'See Global Leaderboard only with the members in this server' },
    covid: { category: 'util', params: '[countryname/--ordered]', description: 'See Global Covid Stats, Covid Stats of a specific country or Countries ordered by Covid Cases', footer: 'API Provided by disease.sh' },
    gdicon: { category: 'gd', params: '<type> <id> [col1] [col2] [glow (true/false)]', description: 'Get a Geometry Dash icon', footer: 'API Provided by GDBrowser / GDColon' },
    gdprofile: { category: 'gd', params: '<username/id>', description: 'Get a Geometry Dash profile', footer: 'API Provided by GDBrowser / GDColon' },
    gdlevel: { category: 'gd', params: '<levelId>', description: 'Get a Geometry Dash level', footer: 'API Provided by GDBrowser / GDColon' },
    cat: { category: 'fun', params: '', description: 'Get random cats', footer: 'API Provided by aws.random.cat' },
    cattext: { category: 'fun', params: '<text>', description: 'Get a cat with text', footer: 'API Provided by cataas.com' }
}



let categories = {
    util: '🛠️ Util',
    nsfw: '🔞 NSFW Image',
    sfw: '🥺 SFW Image',
    fun: '💎 Fun',
    xp: '🎊 XP',
    gd: '<:icon:831847586934816809> Geometry Dash'
}

/* 
                .addField('🔞 NSFW Image', '`nsfwlist`, `nsfw <type>`, `nsfwreddit`')
                .addField('🥺 SFW Image', '`sfwlist`, `sfw <type>`')
                .addField('💎 Fun', '`uwu <text>`')
                .addField('🛠️ Util', '`color [#hex]`')
*/

bot.on('ready', () => {
    console.log('ready');
    bot.user.setActivity('uwu! use >help');
});

let baseXp = 300;

bot.on('message', async message => {
    if (message.author.id == bot.user.id) return;
    if (message.author.bot) return;

    connection.query(`SELECT * FROM xp WHERE userId = ${message.author.id}`, (error, results, _) => {
        if (error) return console.log(error);
    
        

        if (!results.length) {
            connection.query(`INSERT INTO xp (userId, xpCount, level, username) VALUES ('${message.author.id}', 0, 1, '${message.author.tag}')`, (e, _, __) => {
                if(e) return console.log(e);
            });
        } else {
            connection.query(`UPDATE xp SET username = '${message.author.tag}' WHERE userId = '${message.author.id}'`, (b6, _, __) => {
                if (b6) console.error(b6);
            });

            results = results[0];
            let addition = Math.round(Math.random() * 50);
            if (results.xpCount + addition > baseXp * results.level) {
                connection.query(`UPDATE xp SET xpCount = 0 WHERE userId = '${message.author.id}'`, (e2, _, __) => {
                    if (e2) return console.error(e2);
                    connection.query(`UPDATE xp SET level = ${results.level + 1} WHERE userId = '${message.author.id}'`, (e4, ____, ______) => {
                        if (e4) return console.error(e4);
                        message.channel.send(`your level is now level ${results.level + 1}`);
                    }) 
                   
                });
            } else {
                connection.query(`UPDATE xp SET xpCount = ${results.xpCount + addition} WHERE userId = '${message.author.id}'`, (e3, _, __) => {
                    if (e3) console.error(e3);
                });
            }

            
        }

        
    });



    async function sendNeko(nsfw = false, type, query = {}, resultType = 'url') {
        try {
            if (nsfw && !message.channel.nsfw && message.channel.type !== 'dm') return sendNeko(false, 'OwOify', { text: 'use this command in an nsfw channel!' }, 'owo');
            await neko[nsfw ? 'nsfw' : 'sfw'][type](query)
            .then(result => {
                //console.log(result);
                message.channel.send(result[resultType]);
            });
        } catch (e) {
            message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
        }
    }

    let [ cmd, args, prefix ] = [ message.content.split(' ')[0], message.content.split(' ').slice(1), '>' ];
    cmd = cmd.toLowerCase();
    
    switch (cmd) {
        case `${prefix}uwu`:
            if (!args[0]) sendNeko(false, 'OwOify', { text: 'you did not enter text!' }, 'owo')
            else {
                sendNeko(false, 'OwOify', { text: args.join(' ') }, 'owo');
            }
        break;

        case `${prefix}raw`:
            sendNeko(args[0], args[1], {}, args[2]);
        break;

        case `${prefix}eval`:
            if (message.author.id !== config.ownerid) return message.reply('no');
            function clean(text) {
                if (typeof(text) === "string")
                  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else
                    return text;
              }

              try {
                const code = args.join(" ");
                let evaled = eval(code);
           
                if (typeof evaled !== "string")
                  evaled = require("util").inspect(evaled);
           
                message.channel.send(clean(evaled), {code:"xl"});
              } catch (err) {
                console.log(err);
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
              }
        break;

        case `${prefix}nsfw`:
            if(!neko.nsfw[args[0]]) return sendNeko(false,'OwOify', { text: 'invalid!' }, 'owo');

            
            sendNeko(true, args[0], {}, 'url');
        break;

        case `${prefix}sfw`:
            if(!neko.sfw[args[0]]) return sendNeko(false,'OwOify', { text: 'invalid!' }, 'owo');
            if(args[0] == 'why') return message.channel.send('\`why\` is disabled.');

            if (args[0] == 'OwOify') return message.channel.send('use >uwu [text]');
            sendNeko(false, args[0], {}, 'url');
        break;

        case `${prefix}nsfwlist`:
            let test = '';

            Object.entries(neko.nsfw).map(x => {
                test += x[0] + '\n';
            });

            

            message.channel.send(`\`\`\`\n${test}\n\`\`\``);
        break;

        case `${prefix}sfwlist`:
            let test2 = '';

            Object.entries(neko.sfw).map(x => {
                test2 += x[0] + '\n';
            });

            

            message.channel.send(`\`\`\`\n${test2}\n\`\`\``);
        break;

        case `${prefix}help`:
            if (args[0] && commands[args[0]]) {
                let embed = new Discord.MessageEmbed();

                commands[args[0]].footer ? embed.setFooter(commands[args[0]].footer) : null;

                return message.channel.send(
                    embed
                    .setColor('YELLOW')
                    .setTitle(`>${args[0]} ${commands[args[0]].params}`)
                    .addField(`Description`, commands[args[0]].description, true)
                    .addField(`Category`, categories[commands[args[0]].category], true)
                );
            }

            let helpCommand = {
                nsfw: '',
                sfw: '',
                util: '',
                fun: '',
                xp: '',
                gd: ''
            };
            
            Object.entries(commands).forEach(x => {
                helpCommand[x[1].category] += `\`${x[0]}\`, `;
            });

            message.channel.send(
                new Discord.MessageEmbed()
                .setColor('#eba2df')
                .setTitle('command list')
                .addField(categories.nsfw, helpCommand.nsfw.slice(0, -2))
                .addField(categories.sfw, helpCommand.sfw.slice(0, -2))
                .addField(categories.fun, helpCommand.fun.slice(0, -2))
                .addField(categories.util, helpCommand.util.slice(0, -2))
                .addField(categories.xp, helpCommand.xp.slice(0, -2))
                .addField(categories.gd, helpCommand.gd.slice(0, -2))

            )
        break;

        case `${prefix}color`:
                if (message.channel.type == 'dm') return;
            //if (args[1] == 'whatsmycolor') {
                

                if (args[0]) {
                    var { createCanvas, loadImage } = require('canvas')
                    var canvas = createCanvas(512, 512)
                    var ctx = canvas.getContext('2d')

                    ctx.fillStyle = args[0];
                    ctx.fillRect(0,0,512,512);

                    message.channel.send({ files: [new Discord.MessageAttachment(canvas.toBuffer(), 'shutup.png')] })
                } else {
                    message.channel.send(
                        new Discord.MessageEmbed()
                        .setColor(message.member.roles.highest.color.toString(16))
                        .setTitle('#' + message.member.roles.highest.color.toString(16))
                    )
                }
            //}
        break;

        case `${prefix}nsfwreddit`:
            return message.reply('`nsfwreddit` is temporarily disabled.');


            let reddits = [ 'hentai', 'nsfw', 'MiaMalkova', 'MiaKhalifa', 'anal' ];
            if (args[0] == '--hentaionly') reddits = [ 'hentai' ];

            await reddit.getImage(reddits[Math.floor(Math.random() * reddits.length)])
            .then(x => {
                message.channel.send(x);
            });
        break;

        case `${prefix}rank`:
            if (args[0] && message.mentions.users.first()) args[0] = message.mentions.users.first().id;

            connection.query(`SELECT * FROM xp WHERE userId = ${args[0] ? args[0] : message.author.id}`, (error, results, _) => {
                if (!results.length) return message.reply('that user does not exist in the database!');
                

                message.channel.send(
                    new Discord.MessageEmbed()
                    .setTitle(`${bot.users.cache.find(x => x.id == results[0].userId).username} (${results[0].userId})`)
                    .setColor('YELLOW')
                    .addField('Level', results[0].level, true)
                    .addField('XP', `${results[0].xpCount}/${results[0].level * baseXp} (${(baseXp * (results[0].level - 1)) + results[0].xpCount})`, true)
                )
            });
        break;

        case `${prefix}leaderboard`:
            connection.query(`SELECT * FROM xp ORDER BY level DESC`, (e, r, _) => {
                r.sort((a, b) => a.level === b.level ? b.xpCount - a.xpCount : b.level - a.level)

                

                let embed = new Discord.MessageEmbed().setColor('YELLOW');
                let array = [];
                let string = '';
                for (i=0;i<10;i++) {
                    array.push(r[i]);
                }

                console.log(array);

                let num = 1;

                array.forEach(x => {
                    if (x == undefined) return;
                    try {
                        message.guild.members.cache.find(y => y.id == x.userId) ? (
                            string += `${num}. <@${x.userId}> Level: ${x.level} XP: ${x.xpCount} (${(baseXp * (x.level - 1)) + x.xpCount})\n`
                        ) : string += `${num}. ${bot.users.cache.find(z => z.id == x.userId).username} Level: ${x.level} XP: ${x.xpCount} (${(baseXp * (x.level - 1)) + x.xpCount})\n`
                    } catch (e) {
                        string += `${num}. ${x.userId} (uncached) Level: ${x.level} XP: ${x.xpCount} (${(baseXp * (x.level - 1)) + x.xpCount})\n`
                    }

                    num++;
                });

                message.channel.send(embed.addField('Global Leaderboard', `${string}`));
            });
        break;

        case `${prefix}serverleaderboard`:
            if (message.channel.type == 'dm') return;

            connection.query(`SELECT * FROM xp ORDER BY level DESC`, (e, r, _) => {
                let embed = new Discord.MessageEmbed().setColor('BLUE').setFooter('This leaderboard is the **global leaderboard** containing only the top 10 users from THIS SERVER');
                let array = [];
                let string = '';
                //console.log(r);
                let num = 1;

                r.forEach(x => {
                    if(num > 10) return;
                    if (!message.guild.members.cache.find(y => y.id == x.userId)) return;
                    string += `${num}. <@${message.guild.members.cache.find(z => z.id == x.userId).id}> Level: ${x.level} XP: ${x.xpCount} (${(baseXp * (x.level - 1)) + x.xpCount})\n`;
                    num++;
                });

                if (!string.length) string = 'There are no ranked users in this server.';

                message.channel.send(embed.addField('Server Leaderboard', string));
            })
        break;

        case `${prefix}covid`:
            let stats;
            

            if (args[0] && args[0] == '--ordered') {
                cov.countries({ sort: 'cases' }).then(x => {
                    //console.log(x);
                    let date = new Date(x.updated);
                    
                    let glob = '';

                    for (i=0;i<10;i++) {
                        glob += `:flag_${x[i].countryInfo.iso2.toLowerCase()}: ${x[i].country}: ${x[i].cases} cases\n`;
                    }

                    message.channel.send(
                        new Discord.MessageEmbed()
                        .setTitle(`Covid ordered by cases (top 10)`)
                        .setColor('RED')
                        .addField(`list`, glob)
    
                    )
                });
            }

            else if (!args[0]) {
                cov.all().then(x => {
                    let date = new Date(x.updated);
                    
                    message.channel.send(
                        new Discord.MessageEmbed()
                        .setTitle(`Covid Global Stats`)
                        .setColor('RED')
                        .addField('updated at', date.toLocaleString(), true)
                        .addField('cases', x.cases, true)
                        .addField('todays cases', x.todayCases, true)
                        .addField('recovered', x.recovered, true)
                        .addField('today recovered', x.todayRecovered, true)
                        .addField('active cases', x.active, true)
                        .addField('critical cases', x.critical, true)
                        .addField('cases per one million', x.casesPerOneMillion, true)
                        .addField('deaths per one million', x.deathsPerOneMillion, true)
                        .addField('tests completed', x.tests, true)
                        .addField('tests per one million', x.testsPerOneMillion, true)
                        .addField('affected countries', x.affectedCountries, true)
    
                    )
                });
            } else {
                cov.countries({ country: args[0] }).then(x => {
                    let date = new Date(x.updated);

                    if (x.message) return message.reply('invalid');
                        
                    //console.log(x);
                    message.channel.send(
                        new Discord.MessageEmbed()
                        .setTitle(`:flag_${x.countryInfo.iso2.toLowerCase()}: Covid in ${x.country}`)
                        .setColor('RED')
                        .addField('updated at', date.toLocaleString(), true)
                        .addField('cases', x.cases, true)
                        .addField('todays cases', x.todayCases, true)
                        .addField('recovered', x.recovered, true)
                        .addField('today recovered', x.todayRecovered, true)
                        .addField('recovered per one million', x.recoveredPerOneMillion, true)
                        .addField('active cases', x.active, true)
                        .addField('critical cases', x.critical, true)
                        .addField('cases per one million', x.casesPerOneMillion, true)
                        .addField('deaths per one million', x.deathsPerOneMillion, true)
                        .addField('tests completed', x.tests, true)
                        .addField('tests per one million', x.testsPerOneMillion, true)
                            
        
                    )
                });
                
            }
           
        break;

        case `${prefix}gdicon`:
            if (!args[0] || !args[1]) return message.reply('missing required args');

            let colorFailed = false;
            let glowFailed = false;

            if (!args[2] || !args[3]) {
                args[2] = '0';
                args[3] = '3';

                colorFailed = true;
            }

            if (!args[4]) {
                args[4] = false;

                glowFailed = true;
            }

            message.channel.send(`https://gdbrowser.com/icon/icon?icon=${args[1]}&form=${args[0]}&col1=${args[2]}&col2=${args[3]}&glow=${args[4] ? 1 : 0}`)
            
           
        break;
    
        case `${prefix}gdprofile`:
            if (!args[0]) return message.reply('missing required args');
            await fetch(`https://gdbrowser.com/api/profile/${args[0]}`)
            .then(res => res.json())
            .then(x => {
                message.channel.send(new Discord.MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`${x.username} (${x.playerID}/${x.accountID})`, true)
                .addField(`Rank`, x.rank, true)
                .addField(`Stars`, x.stars, true)
                .addField(`Diamonds`, x.diamonds, true)
                .addField(`Coins`, x.coins, true)
                .addField(`User Coins`, x.userCoins, true)
                .addField(`Demons`, x.demons, true)
                .addField(`Creator Points`, x.cp, true)
                .addField(`Friend Requests?`, x.friendRequests, true)
                .addField(`Messages?`, x.messages, true)
                .addField(`Comment History?`, x.commentHistory, true)
                .addField(`Moderator`, x.moderator, true)
                .addField(`Twitter`, x.twitter, true)
                .addField(`Icons`, `Cube: ${x.icon}\nShip: ${x.ship}\nBall: ${x.ball}\nUFO: ${x.ufo}\nWave: ${x.wave}\nRobot: ${x.robot}\nSpider: ${x.spider}\nColor 1: ${x.col1}\nColor 2: ${x.col2}\nDeath Effect: ${x.deathEffect}\nGlow: ${x.glow}`, true)
                )
            })

            
        break;

        case `${prefix}gdlevel`:
            let x;
            if (!args[0]) return message.reply('missing required args');
            await fetch(`https://gdbrowser.com/api/level/${args[0]}`)
            .then(res => res.json())
            .then(x => {
                if (x.name == undefined) return message.reply('this level does not exist!');

                message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setTitle(`${x.name} (${x.id}) by ${x.author} (${x.playerID}/${x.accountID})`, true)
                    .addField(`Description`, x.description, true)
                    .addField(`Difficulty`, x.difficulty, true)
                    .addField(`Downloads`, x.downloads, true)
                    .addField(`Likes`, x.likes, true)
                    .addField(`Disliked?`, x.disliked, true)
                    .addField(`Length`, x["length"], true)
                    .addField(`Stars`, x.stars, true)
                    .addField(`Mana Orbs`, x.orbs, true)
                    .addField(`Diamonds`, x.diamonds, true)
                    .addField(`Featured / Epic`, `${x.featured}/${x.epic}`, true)
                    .addField(`Game Version`, x.gameVersion, true)
                    .addField(`Song Name`, x.songName, true)
                    .addField(`Official Song / Custom Song`, `${x.officialSong}/${x.customSong}`, true)
                )
            })
        break;

        case `${prefix}cat`:
            fetch(`https://aws.random.cat/meow`)
            .then(res => res.json())
            .then(body => message.channel.send({files: [{attachment: body.file, name: `cat.${body.file.split('.')[4]}`}]}))
        break;

        case `${prefix}cattext`:
            if (!args[0]) return message.reply('you need text! (sorry gamer)')
            message.channel.send(`https://cataas.com/cat/says/${args.join("%20")}`)
        break;
    }

    
});

bot.login(config.token);