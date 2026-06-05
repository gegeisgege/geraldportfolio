# Gerald Mahapranaja Pillian — Portfolio Website

A personal portfolio website showcasing work in data analytics, machine learning, and UI/UX design.

## Features

- Dark/Light mode toggle with LocalStorage persistence
- Floating pet image easter egg (click 5 to spawn more)
- Scroll-triggered animations and fade-in reveals
- Animated stat counters and radar chart skill profile
- Scramble-decode scroll cue animation
- Responsive layout for desktop, tablet, and mobile
- One-click CV download

## Project Structure

```
geraldportfolio/
├── index.html          # Main HTML file
├── styles.css          # Styling and theming (CSS variables)
├── script.js           # All JavaScript functionality
├── CV_2025.pdf         # Resume file
├── assets/
│   └── cats/           # Floating pet images
│       ├── akukiku_cat2.png
│       ├── Bumba_dog1.png
│       ├── Cebi_cat1.png
│       ├── koboy_dog2.png
│       ├── landi_dog3.png
│       └── lyra_cat3.png
└── README.md
```

## Technologies

- HTML5, CSS3, Vanilla JavaScript
- Google Fonts (DM Serif Display, DM Mono, DM Sans)
- LocalStorage for theme persistence
- GitHub Pages for hosting

## Local Development

```bash
git clone https://github.com/gegeisgege/geraldportfolio.git
cd geraldportfolio
```

Open `index.html` directly in a browser, or run a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

Then visit `http://localhost:8000`.

## Deployment

The site is hosted on GitHub Pages. To deploy, push to the `main` branch and enable Pages under **Settings > Pages > Source: main / root**.

Live site: [https://gegeisgege.github.io/geraldportfolio/](https://gegeisgege.github.io/geraldportfolio/)

## Customisation

Personal details, experience, and project content are in `index.html`. Theme colours are controlled via CSS variables in `styles.css`:

```css
:root {
    --accent: #00e6c8;
    --bg: #0b0d11;
    /* etc. */
}
```

To update the resume, replace `CV_2025.pdf` with your own file and update the `href` in the Download CV link accordingly.

## Contact

- Email: gerald.pranaja@gmail.com
- GitHub: [@gegeisgege](https://github.com/gegeisgege)
- LinkedIn: [Gerald Mahapranaja Pillian](https://linkedin.com/in/geraldmpillian)