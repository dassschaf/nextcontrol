# List of Callbacks, as sent from a server

Since the official list over at the maniaplanet docs is not ideal for TM2020, as events as player finishes or checkpoints are now caused by the gamemode script and less so by the server, this document contains a number of callbacks how they occour on a TM2020 time attack server.

## normal callbacks
to be done.

## script callbacks
Generally, script callbacks are handled with the "normal" callback `ManiaPlanet.ModeScriptCallbackArray`, where the first parameter in the parameter array is the callback name and the second is JSON payload containing the actual callback information. In the following, there's an overview of some common callbacks and the data they return:

* Trackmania.Event.Waypoint
    * time 
    * login
    * accountid
    * racetime
    * laptime
    * checkpointinrace (index)
    * checkpointinlap (index)
    * isendrace
    * isendlap
    * isinfinitelaps
    * isindependentlaps
    * blockid
    * speed (m/s)

* Trackmania.Event.Respawn
    * time
    * login
    * accountid
    * nbrespawns
    * racetime
    * laptime
    * checkpointinrace (index)
    * checkpointinlap (index)
    * speed

* Trackmania.Event.GiveUp
    * time
    * login
    * accountid


