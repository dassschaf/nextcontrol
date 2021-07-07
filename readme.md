# NextControl
A server controller to be used with Trackmania (2020) dedicated servers. Should also work with Trackmania 2 dedicated servers.

### Requirements
You need to have those three pieces of software set up and running in order to use Nextcontrol:
- Node.JS
- MongoDB
- TM Dedicated Server

You can find Node.JS and MongoDB with the search engine of your choice and the TM Dedicated Server and a guide to set up one in the forums related to the game.

*Note:* Avoid using port 5000 for XML-RPC with the Trackmania server, since the server may unpredictably use port 5001 when the game is running instead.

### Installation
- extract the files somewhere
- move to the extracted files and run `npm install`
- rename `settings-sample.js` to `settings.js` and adjust the file to your setup
- Necessary collections on the MongoDB database should be created automatically - if not, create 'players', 'maps', 'records'.
- run with `node .`

To add admins in TM2020 you currently need to figure out logins manually. The easiest way to do so is with [trackmania.io](https://trackmania.io/#/players).

### Usage
A chat commands list can be found in `/commands.md`.

### Contribution
Any help developing and testing and suggesting features to this project is greatly welcomed! Please report bugs and suggest ideas via the issues feature of Github.

You can use the Sample Plugin (`/plugins/sample.js`) as a starting point to develop your own plugin, as it is heavily documented to make getting started as easy as possible. However, it does not save you from learning a bit of Javascript, though.
