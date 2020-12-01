# List of Callbacks, as sent from a server

## normal callbacks
Refer to the [Maniaplanet docs](https://doc.maniaplanet.com/dedicated-server/references/xml-rpc-callbacks).

## script callbacks
Generally, script callbacks are handled with the "normal" callback `ManiaPlanet.ModeScriptCallbackArray`, where the first parameter in the parameter array is the callback name and the second is JSON payload containing the actual callback information. In the following, there's an overview of some common callbacks and the data they return:

* Trackmania.Event.Waypoint (instead of normal Checkpoint and Finish callbacks):
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


