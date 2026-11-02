import unittest
from app import app


class DylanOSTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_os_index_renders_properly(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers.get('X-Content-Type-Options'), 'nosniff')
        html = res.get_data(as_text=True)

        # Check core OS elements
        self.assertIn('DYLAN OS', html)
        self.assertIn('boot-screen', html)
        self.assertIn('desktop-container', html)
        self.assertIn('bg-canvas', html)
        self.assertIn('taskbar', html)
        self.assertIn('start-menu', html)

        # Check desktop icons & windows
        for target in ['profile', 'projects', 'terminal', 'contact', 'cv']:
            self.assertIn(f'data-target="{target}"', html)
            self.assertIn(f'data-window="{target}"', html)

        # Check all 5 authentic projects
        self.assertIn('Dylan HQ (NoteBook)', html)
        self.assertIn('Wallet Activity Scanner', html)
        self.assertIn('Pact', html)
        self.assertIn('Shelby CLI', html)
        self.assertIn('DylanWeb OS', html)

        # Check static links
        self.assertIn('/static/os.css', html)
        self.assertIn('/static/os.js', html)

    def test_os_static_assets(self):
        for path in ['/static/os.css', '/static/os.js']:
            with self.subTest(path=path):
                res = self.client.get(path)
                self.assertEqual(res.status_code, 200)
                self.assertEqual(res.headers.get('X-Content-Type-Options'), 'nosniff')

    def test_cv_route_intact(self):
        res = self.client.get('/cv')
        self.assertEqual(res.status_code, 200)
        html = res.get_data(as_text=True)
        self.assertIn('Dylan', html)
        self.assertIn('Web3', html)


if __name__ == '__main__':
    unittest.main()

