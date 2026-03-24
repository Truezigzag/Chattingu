# Chattingu

A ready-to-publish public chat website.

Anyone who opens the website joins the same global room and can send/receive messages in real time.

## Features

- Global shared chat room (`everyone`) for all visitors.
- No backend required (peer-to-peer using [Trystero](https://github.com/dmotz/trystero)).
- Works as a static website (great for GitHub Pages).
- Nickname saving in browser local storage.

## Run locally

Because this uses ES modules, serve files with a local web server:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. In **Build and deployment**, choose:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your default branch), folder `/ (root)`
4. Save, then wait for GitHub Pages to deploy.
5. Your chat site will be live at:
   - `https://<your-username>.github.io/<repo-name>/`

## Notes

- This app is public by design. Do not share sensitive information.
- Messages are distributed peer-to-peer and are not persisted on a server by this project.
