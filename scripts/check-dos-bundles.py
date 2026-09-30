"""Validate js-dos archives without extracting or executing their contents."""
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
for manifest_path in sorted((root / 'public/games').glob('*/game.json')):
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    if manifest.get('kind') != 'dos':
        continue
    bundle = manifest_path.parent / manifest.get('entry', 'game.jsdos')
    # zipfile alone may mistakenly find an embedded installer ZIP inside a TAR.
    with bundle.open('rb') as stream:
        assert stream.read(4) == b'PK\x03\x04', f'{bundle}: expected ZIP, not renamed TAR'
    with zipfile.ZipFile(bundle) as archive:
        assert archive.testzip() is None, f'{bundle}: corrupt archive'
        config = archive.read('.jsdos/dosbox.conf').decode('utf-8')
        assert '[autoexec]' in config, f'{bundle}: missing startup commands'
        for name in archive.namelist():
            assert not name.startswith(('/', '\\')) and '..' not in Path(name).parts
    print(f'OK: {manifest["title"]}')
