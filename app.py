from pathlib import Path

from flask import Flask, Response, render_template, send_from_directory

app = Flask(__name__)
LANDING_PAGES = Path(app.root_path) / 'vendor/threeui/public/landing-pages'

@app.get('/')
def index():
    return render_template('index.html')


@app.get('/cv')
def simple_cv():
    return render_template('cv.html')


@app.get('/landing-pages/kage.html')
def kage_profile():
    # Keep the verified upstream file byte-exact. Personalize only this response.
    source = (LANDING_PAGES / 'kage.html').read_text(encoding='utf-8')
    source = source.replace("const word = 'KAGE', gl = [];", "const word = 'DYLAN', gl = [];", 1)
    source = source.replace('Kage — Where stillness reveals the unseen', 'DylanWeb', 1)
    source = source.replace('A five-chapter night walk through a Kyoto mountain temple. Charred cypress, lantern light and a vermilion moon, rendered live in WebGL.', 'Dylan explores testnets, retroactive campaigns, NFTs, DeFi, gaming, and building in Web3.', 1)
    source = source.replace("const names = ['The Hidden Gate', 'The Sanmon', 'Still Gardens', 'Sacred Craft', 'Afterlight', 'Colophon'];", "const names = ['Dylan', 'About', 'Focus', 'Skills', 'Contact', 'Details'];", 1)
    source = source.replace("'px Wordmark, sans-serif'", "'px Onest, sans-serif'")
    source = source.replace("document.fonts.load('600 320px Wordmark')", "document.fonts.load('600 320px Onest')", 1)
    source = source.replace('</head>', '<link rel="icon" type="image/png" href="/static/favicon.png">\n<style id="dylan-unified-font">html, body, body *, body *::before, body *::after { font-family: "Onest", sans-serif !important; }</style>\n</head>', 1)
    source = source.replace('<script src="secret-pathways-assets/three.min.js"></script>', '<script src="/static/profile-content.js"></script>\n<script src="secret-pathways-assets/three.min.js"></script>', 1)
    return Response(source, mimetype='text/html')


@app.get('/landing-pages/<path:filename>')
def landing_asset(filename):
    return send_from_directory(LANDING_PAGES, filename)


@app.get('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.png', mimetype='image/png')

if __name__ == '__main__':
    app.run(port=5000)
