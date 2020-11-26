# List of Callbacks, as sent from a server

Since the official list over at the maniaplanet docs does not cover common script callbacks, this document contains all still used normal callbacks (for example the chat one, or player connect) excluding those, that still exist, but are handled by mode scripts. Additionally, it contains common mode script callbacks.

## normal callbacks
to be done.

## script callbacks
Generally, script callbacks are handled with the "normal" callback `ManiaPlanet.ModeScriptCallbackArray`, where the first parameter in the parameter array is the callback name and the second is JSON payload containing the actual callback information.

* Trackmania.Event.Waypoint, fields:
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


