import hashlib
import json
import unittest
from pathlib import Path

from app import app

ROOT = Path(app.root_path)


class ProfileIntegrationTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_source_and_assets_are_byte_exact(self):
        bundle = json.loads((ROOT / 'kage-source.json').read_text(encoding='utf-8-sig'))
        for item in bundle['files'] + bundle['assets']:
            with self.subTest(file=item['path']):
                source = ROOT / 'vendor/threeui' / item['path']
                self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(), item['sha256'])
                if item['path'].startswith('public/') and not item['path'].endswith('kage.html'):
                    with self.client.get('/' + item['path'].removeprefix('public/')) as response:
                        self.assertEqual(response.status_code, 200)
                        self.assertEqual(hashlib.sha256(response.data).hexdigest(), item['sha256'])

    def test_personalization_preserves_upstream(self):
        source = (ROOT / 'vendor/threeui/public/landing-pages/kage.html').read_text(encoding='utf-8')
        page = self.client.get('/landing-pages/kage.html').get_data(as_text=True)
        self.assertIn("const word = 'KAGE', gl = [];", source)
        self.assertIn("const word = 'DYLAN', gl = [];", page)
        self.assertLess(page.index('/static/profile-content.js'), page.index('const SECS ='))
        self.assertIn('<html lang="en">', page)

    def test_entrypoints_and_retired_api(self):
        for url in ['/', '/cv', '/static/kage-ui.js', '/static/kage-ui.css', '/static/profile-content.js']:
            with self.subTest(url=url), self.client.get(url) as response:
                self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.get('/api/search?q=Monad').status_code, 404)
        self.assertEqual(self.client.get('/landing-pages/../app.py').status_code, 404)


if __name__ == '__main__':
    unittest.main()
