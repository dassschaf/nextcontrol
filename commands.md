## Chat commands
This document contains contains almost all chat commands as currently supported by Nextcontrol. It might not be 100% reflecting all chat commands as they are currently implemented on the master branch.

#### General commands
Generally, commands are executed by sending a chat message like `/command parameter1 parameter2 ...`.

#### Admin commands
Admin commands are generally executed by sending a chat message like `/admin command parameter1 parameter2 ...` in contrast to general commands. As such, the command isn't `/admin` but rather what follows afterwards.

| command | parameters | description |
|---------|------------|-------------|
| add | {local/url/tmx} {Source} | Adds a track to the maplist and saves the maplist. Using parameter local, specify the file path *relative* to /UserData/Maps/. Using parameter url, just paste the full URL to the chat command. Using parameter tmx, give the ID of the track on TMX. |
| skip | - | Skips the current track. |
| restart | - | Restarts the current track. |
|---------|-------------|------------|
| shutdown | - | Shuts down Nextcontrol... but why would you do that? |