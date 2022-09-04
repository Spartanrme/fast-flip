# v3.0.0
* V10 compatible (not backwards compatible with V9)

# v2.6.0
* Add a client-side setting to allow players to adjust the font size of speech bubbles
* Cleanup orphaned speech bubbles caused by the client losing focus while the shortcut key is active

# v2.5.0
* Migrate speech bubbles to use the same template as Foundry's chat bubbles for consistency

# v2.4.1
* Fix an issue where speech bubbles failed to render correctly when using Firefox

# v2.4.0
* Add a setting and hotkey (default `Alt+S`) to show speech bubbles attached to the currently selected token

# v2.3.0
* Add a setting to enable/disable sending AFK status indicators in chat

# v2.2.0
* Make AFK indicators a world option that can be disabled for all players
* Only show the AFK toggle on tokens owned by players and only for the owners of the token

# v2.1.0
* Added a `Shift+K` (default binding) shortcut to mark a token as AFK
* Added token HUD buttons for mirroring tokens and marking tokens as AFK
* Added tile HUD buttons for mirroring tiles
* Added settings to allow players to show/hide the mirror and AFK toggle buttons on their token HUD
* Restructured the mod internals to allow for more token related features to be added

# v2.0.0
* Support for Foundry V9
* Migrate to the new V9 Keybindings API (this is a breaking change that requires V9 minimum)

# v1.2.0
* Support for Foundry 0.8.6+

# v1.1.0
Tiles!

* Added the ability to vertically flip tokens (default shortcur `Shift+F`)
* Add the ability to horizontally and vertically flip selected tiles

# v1.0.1
Initial public release of Fast Flip!

* Create a keybind that can be used to horizontally mirror all selected tokens. Works for both the GM and players
