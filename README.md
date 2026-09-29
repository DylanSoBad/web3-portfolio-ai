# Dylan — Kage personal profile

Personal profile in English, built on the exact registered ThreeUI Kage scene.
Flask serves the page and local assets; React renders `KageLandingPage` with the
requested Onest fonts, 400/300 weights, #e0231c accent, 46/17 sizes and -0.012 spacing.

## Run

```sh
python -m pip install -r requirements.txt
python app.py
```

Open http://localhost:5000. The previously created static CV remains at `/cv`.
Built JS/CSS files are included, so Node is not required to run the Flask app.
No API keys are required. The old AI search endpoint remains removed.

## Rebuild the frontend

```sh
npm ci
npm run build
```

`frontend/main.tsx` contains the configured component usage. The build extracts
only the exact Kage export from the registered source to avoid unrelated page
imports, and reuses the registered frame, typography controls and recipe.
The CSS import resolves to the official package stylesheet. Registered shared
CSS is retained unchanged for auditing; its unrelated Fragment Mono font is not
included in the published package.

## Content and source integrity

- `static/profile-content.js`: personal copy, links and small accessibility fixes.
- `app.py`: response-only branding substitutions (title, language, DYLAN wordmark,
  navigation labels) and the content hook before scene initialization.
- `vendor/threeui/`: original source, local Three.js, fonts, images and notices.
- `kage-source.json`: source registry and checksums from the user-provided reference.

All eight registered files and fourteen assets match their requested SHA-256.
Canonical HTML and binary assets were copied byte-for-byte from official
`@designcodeio/threeui@1.2.0`; the live ThreeUI URL rewrites image paths, so that
version was not used. Vendor source is never edited. Personalization happens on
the served response and DOM, keeping the authored scene, shader code, camera
motion, card effects, responsive layouts and reduced-motion behavior.

Web3 interests are listed without inventing experience. No employment history,
education, dates or achievements have been invented. Update these with confirmed
personal information as needed.

## Verify

```sh
npm run verify:source
python -m unittest discover -s tests -v
```

Checks cover hashes, asset HTTP responses, the personalization layer, static CV,
retired AI endpoint and asset path traversal protection. Desktop and 390px mobile
navigation, rendering and contact targets were also checked in the browser.

Upstream licenses and notices are in `vendor/threeui/`.
