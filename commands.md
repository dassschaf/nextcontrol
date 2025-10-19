## Chat commands
This document contains almost all chat commands as currently supported by Nextcontrol. It might not be 100% reflecting all chat commands as they are currently implemented on the master branch.

#### General commands
Generally, commands are executed by sending a chat message like `/command parameter1 parameter2 ...`.

| command | parameters | description |
|---------|------------|-------------|
| list | maps {filter/nothing} | Shows (and remembers) a list of maps of all maps fitting the filter (or all, if none is given) |
| list | players {db/online/nothing} | Shows (and remembers) a list of players that are online (default, when no parameter given) or that are stored in the database |
| list | show {type} {n} | Shows the n-th page of the previously queried list. Valid lists are maps, players.
| jukebox | n | Jukeboxes the n-th map from your recent map list. Requires running `/list maps` before. |
| recs | - | Shows local records. |

The `/list` command is the universal tool for making a query about maps and players and stores the given list until you query a new list of the same category or leave the server. 
Lists of different categories are stored independently, so querying for a player list does not overwrite the maps list you queried before. 
Additionally, the lists are stored individually for each player, so if two players do different queries, they are not affected by each other. 

#### Admin commands
Admin commands are generally executed by sending a chat message like `/admin command parameter1 parameter2 ...` in contrast to general commands. 
As such, the command isn't `/admin` but rather what follows afterwards.

| command | parameters                          | description                                                                                                                                                                                                                                                                                                                      |
|---------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| add | {local/url/tmx/pack} {Source}       | Adds a track to the map list and saves the map list. Using parameter local, specify the file path *relative* to /path/to/server/UserData/Maps/. Using parameter url, just paste the full URL to the chat command. Using parameter tmx, give the ID of the track on TMX. Using parameter pack, give the ID of the mappack on TMX. |
| skip | -                                   | Skips the current track.                                                                                                                                                                                                                                                                                                         |
| restart | -                                   | Restarts the current track.                                                                                                                                                                                                                                                                                                      |
| shutdown | -                                   | Shuts down Nextcontrol... but why would you do that?                                                                                                                                                                                                                                                                             |
| jukebox | {n/clear}                           | With parameter *n*, it puts the n-th map from you map list to the front of your jukebox. With parameter *clear* it empties the jukebox.                                                                                                                                                                                          |
| mode | save                                | Saves the current MatchSettings to file.                                                                                                                                                                                                                                                                                         |
| mode | keep                                | Keeps the current temporary game mode settings to prevent discarding them on map change                                                                                                                                                                                                                                          |
| mode | reset                               | Resets the game mode settings currently applied at the server                                                                                                                                                                                                                                                                    |
| mode | read                                | Re-reads the MatchSettings file.                                                                                                                                                                                                                                                                                                 |
| extend | {time}                              | Extends the time for the currently played track by a given number (in seconds) or by default by 300 seconds. Settings reset on map change unless they're specified to be kept. Requires a gamemode to be run, that supports time extension (e. g. Time attack)                                                                   |
| forcemods | {url/save/read/reset/enable/disable} | To force a mod, only use the URL to the mod as parameter. Enable, disable parameters enable or disable whether a map's mod shall be overridden. Save, read save or read the settings from the settings file (`/settings/forceMods.json`)                                                                                         