# DOOM Shareware 1.9

`doom.jsdos` contains the unmodified files from the installed shareware archive
at https://www.dosgamesarchive.com/file/doom/doom-box (download endpoint:
https://www.dosgamesarchive.com/file.php?id=75), plus `.jsdos/dosbox.conf`.
Original documentation and distribution notices are preserved inside the bundle.
The WAD is `DOOMS/DOOM1.WAD`, containing only episode 1.

The player uses js-dos v7 (DOSBox compiled for the browser), loaded on demand
from `/vendor/js-dos/`. These files were downloaded from
https://js-dos.com/v7/build/releases/latest/js-dos/.
Both the game bundle and the emulator are served locally to allow worker startup.
Integration documentation: https://js-dos.com/v7/build/docs/browser/.

Keyboard: arrows move, Ctrl fires, Space uses doors, Shift runs, numbers select
weapons, Escape opens the game menu. The site's floating arrow closes the game.
