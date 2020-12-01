# NextControl
A server controller to be used with Trackmania (2020) dedicated servers. Should also work with Trackmania 2 dedicated servers.

### Requirements
- Node.JS
- MongoDB
- Dedicated Server

### Installation
- extract the files somewhere
- move to the extracted files and run `npm install`
- rename `settings-sample.js` to `settings.js` and adjust the file to your setup
- run with `node .`

To add admins in TM2020 you currently need to figure out logins manually, for example by opening the editor and saving a track and copy/remember it from the overview screen shown when saving.

### Usage
A chat commands list can be found in `/commands.md`.

### Contribution
Any help developing and testing and suggesting features to this project is greatly welcomed! Please report bugs and suggest ideas via the issues feature of Github.

You can use the Sample Plugin (`/plugins/sample.js`) as a starting point to develop your own plugin, as it is heavily documented to make getting started as easy as possible. However, it does not save you from learning a bit of Javascript, though.
