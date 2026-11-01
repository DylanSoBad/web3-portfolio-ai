from functools import lru_cache
from pathlib import Path

from flask import Flask, Response, render_template, send_from_directory, request

ROOT_PATH = Path(__file__).resolve().parent
app = Flask(
    __name__,
    template_folder=str(ROOT_PATH / 'templates'),
    static_folder=str(ROOT_PATH / 'static'),
)
LANDING_PAGES = ROOT_PATH / 'vendor/threeui/public/landing-pages'


class VercelPathFixMiddleware:
    """Ensure Flask router receives the original path from Vercel edge rewrite."""
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        matched_path = environ.get('HTTP_X_MATCHED_PATH')
        if matched_path:
            environ['PATH_INFO'] = matched_path
        elif environ.get('PATH_INFO') in ('/api/index', '/api/index.py', '/app.py'):
            environ['PATH_INFO'] = '/'
        return self.wsgi_app(environ, start_response)


app.wsgi_app = VercelPathFixMiddleware(app.wsgi_app)


@lru_cache(maxsize=1)
def get_personalized_kage_html() -> str:
    # Keep the verified upstream file byte-exact. Personalize only this response.
    source = (LANDING_PAGES / 'kage.html').read_text(encoding='utf-8')
    source = source.replace("const word = 'KAGE', gl = [];", "const word = 'DYLAN', gl = [];", 1)
    source = source.replace('Kage — Where stillness reveals the unseen', 'DylanWeb', 1)
    source = source.replace('A five-chapter night walk through a Kyoto mountain temple. Charred cypress, lantern light and a vermilion moon, rendered live in WebGL.', 'DylanWeb — Dylan tests early Web3 products, researches emerging ecosystems, and builds useful tools.', 1)
    source = source.replace("const names = ['The Hidden Gate', 'The Sanmon', 'Still Gardens', 'Sacred Craft', 'Afterlight', 'Colophon'];", "const names = ['Dylan', 'About', 'Focus', 'Skills', 'Contact', 'Details'];", 1)
    source = source.replace("'px Wordmark, sans-serif'", "'px Onest, sans-serif'")
    source = source.replace("document.fonts.load('600 320px Wordmark')", "document.fonts.load('600 320px Onest')", 1)
    source = source.replace('</head>', '<link rel="icon" type="image/png" href="/static/favicon.png">\n<style id="dylan-unified-font">html, body, body *, body *::before, body *::after { font-family: "Onest", sans-serif !important; }</style>\n</head>', 1)
    source = source.replace('<script src="secret-pathways-assets/three.min.js"></script>', '<script src="/static/profile-content.js"></script>\n<script src="secret-pathways-assets/three.min.js"></script>', 1)
    return source


@app.after_request
def apply_security_headers(response: Response) -> Response:
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-Dylan-Version'] = '2026.11.01'
    return response


@app.errorhandler(404)
def debug_not_found(error):
    return (
        f"404 Debug info: path={request.path!r}, url={request.url!r}, "
        f"PATH_INFO={request.environ.get('PATH_INFO')!r}, "
        f"X_MATCHED_PATH={request.environ.get('HTTP_X_MATCHED_PATH')!r}",
        404,
    )


@app.get('/')
@app.get('/app.py')
@app.get('/api/index')
@app.get('/api/index.py')
def index():
    return render_template('index.html')


@app.get('/cv')
def simple_cv():
    return render_template('cv.html')


@app.get('/landing-pages/kage.html')
def kage_profile():
    return Response(get_personalized_kage_html(), mimetype='text/html')


@app.get('/landing-pages/<path:filename>')
def landing_asset(filename):
    response = send_from_directory(LANDING_PAGES, filename)
    if any(filename.endswith(ext) for ext in ('.png', '.woff', '.woff2', '.ttf', '.js', '.css')):
        response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
    return response


@app.get('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.png', mimetype='image/png')


if __name__ == '__main__':
    app.run(port=5000)
