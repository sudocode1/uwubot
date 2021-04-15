# uwubot
uwubot is a utility Discord Bot with NSFW Image, SFW Image, XP and fun Discord Bot.

## Credits
- NSFW Images: [nekos.life](https://nekos.life)
- SFW Images: [nekos.life](https://nekos.life)
- Geometry Dash: [GDBrowser](https://gdbrowser.com) by [GDColon](https://github.com/GDColon)
- COVID-19 Stats: [disease.sh](https://disease.sh) by [The disease.sh Team](https://github.com/disease-sh)

## Using the bot
Create your discord bot, and edit `/static/config.json` to add your bot token and your user id. <br>
At the moment, a database is **required** however there will soon be a config option to disable database needing and XP.

## Using XP
SQL scripts are provided for you (`/sql`) and are intended for use on PHPMyAdmin, however they can (most likely) run on any SQL/MySQL database.
| File Name | Usage |
| ------------- |:-------------:|
| `createdb.sql` | Create the Database required. |
| `wipedb.sql` | Reset the Database. |
| `wipexp.sql` | Reset only the XP table. | 

<br>

You can change the database name etc, but make sure it is consistent across all sql files and `/static/config.json`.


