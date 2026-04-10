# Gerald Mahapranaja Pillian - Portfolio Website

A modern, interactive portfolio website showcasing my work in data analytics, machine learning, and UI/UX design.

## 🌟 Features

- **Dark/Light Mode** - Toggle between themes with the button in top right
- **Floating Cats Easter Egg** - Interactive floating pet images (click 5 cats to spawn more!)
- **Blog CMS** - Secret admin panel (press `Ctrl+Shift+B` to access)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** - Scroll-triggered animations and parallax effects
- **CV Download** - One-click download of my resume

## 🚀 Live Demo

Visit: [https://gegeisgege.github.io/geraldportfolio/](https://gegeisgege.github.io/geraldportfolio/)

## 📂 Project Structure

```
geraldportfolio/
├── index.html          # Main HTML file
├── styles.css          # All styling and theming
├── script.js           # Main JavaScript functionality
├── cv-generator.js     # CV download handler
├── CV.pdf              # Resume file
├── assets/
│   └── cats/           # Floating cat images
│       ├── akukiku_cat2.png
│       ├── Bumba_dog1.png
│       ├── Cebi_cat1.png
│       ├── koboy_dog2.png
│       ├── landi_dog3.png
│       └── lyra_cat3.png
└── README.md           # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables for theming
- **Vanilla JavaScript** - No frameworks, pure JS
- **LocalStorage** - For blog posts and theme persistence
- **GitHub Pages** - Free hosting

## 📥 Installation & Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/gegeisgege/geraldportfolio.git
   cd geraldportfolio
   ```

2. **Open locally**
   - Simply open `index.html` in your browser
   - Or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. **View in browser**
   - Navigate to `http://localhost:8000`

## 🌐 Deploy to GitHub Pages

### Method 1: Through GitHub Website

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Select **/ (root)** folder
5. Click **Save**
6. Wait 1-2 minutes for deployment
7. Visit `https://gegeisgege.github.io/geraldportfolio/`

### Method 2: Using Git Commands

```bash
# Make sure all files are committed
git add .
git commit -m "Deploy portfolio website"
git push origin main

# GitHub Pages will automatically deploy
```

## 📝 Customization Guide

### Update Your Information

1. **Personal Info** - Edit `index.html`:
   - Hero section: name, title, description
   - About section: bio, stats, skills
   - Experience timeline: jobs and education
   - Projects: your work
   - Contact: email, GitHub, LinkedIn

2. **CV/Resume** - Replace `CV.pdf` with your own resume

3. **Cat Images** - Add your pet photos to `assets/cats/` folder

4. **Colors & Theme** - Edit CSS variables in `styles.css`:
   ```css
   :root {
       --primary: #2563eb;
       --secondary: #8b5cf6;
       /* etc. */
   }
   ```

### Blog Management

- Press `Ctrl+Shift+B` anywhere on the site to access the blog admin panel
- Add, edit, or delete blog posts
- Posts are saved in browser LocalStorage

## 🎨 Features Walkthrough

### Easter Eggs
- **Cat Click**: Click on 5 floating cats to spawn 4 more cats
- **Secret Message**: Click 20 cats total for a special message
- **Console Messages**: Open browser console for fun messages

### Dark Mode
- Click the sun/moon icon in top right
- Preference is saved in LocalStorage
- Smooth transitions between themes

### Smooth Scrolling
- Click nav links for smooth scroll to sections
- Parallax effect on hero section
- Fade-in animations as you scroll

## 📧 Contact

- **Email**: gerald.pranaja@gmail.com
- **GitHub**: [@gegeisgege](https://github.com/gegeisgege)
- **LinkedIn**: [Gerald Mahapranaja Pillian](https://linkedin.com/in/geraldmpillian)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ (and cats 🐱) by Gerald Mahapranaja Pillian