# Spinning words

A very tentative attempt at sound art based on the poem [Anne Hathaway by Carol Ann Dufy][1].
Use o-p for left-right, q-a for up-down. Best played by two lovers, one for each
set of key.

Sit comfortably close and try not to talk. Listen to the sounds and communicate
through body language.

Various female voices extracted using http://youglish.com.
Final recording of the poem by the author. Background music: [Fantasia by Robert Johnson][2]

## Setup

Install the Node dependencies and start a development server using `gulp`:

```bash
npm install
gulp
```

The command above builds the site in `dev/` and launches a local web server with live reload.

To create a production build run:

```bash
npm run build
```

This executes `gulp deploy` and outputs the site in the `docs/` directory.

### GitHub Pages

GitHub Pages is automatically deployed using the included GitHub Actions workflow. The workflow builds the project and publishes the generated `docs/` folder.

[1]:http://www.scottishpoetrylibrary.org.uk/poetry/poems/anne-hathaway
[2]:https://open.spotify.com/track/5tJ1L1iFP2WRMBPN1gdlTG

## License

[ISC](LICENSE)
