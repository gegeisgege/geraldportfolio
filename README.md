# Gerald Mahapranaja Pillian - Portfolio Website

A clean, modern, and interactive portfolio website featuring floating cat companions and smooth animations.

## 🚀 Live Demo

Once deployed, your site will be available at: `https://gegeisgege.github.io/portfolio/`
(or whatever repo name you choose)

## ✨ Features

- **Clean & Modern Design** - Minimalist aesthetic with smooth animations
- **Floating Cat Companions** - Interactive background elements (click them for a surprise!)
- **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- **Smooth Scrolling** - Seamless navigation between sections
- **Intersection Observers** - Elements animate in as you scroll
- **No Dependencies** - Pure HTML, CSS, and JavaScript (fast loading!)
- **GitHub Pages Ready** - Deploy in minutes

## 🛠️ Deployment Instructions

### Option 1: Quick Deploy (Recommended)

1. **Create a new repository on GitHub**
   - Go to github.com and create a new repository
   - Name it `portfolio` (or any name you like)
   - Don't initialize with README (we already have files)

2. **Upload your files**
   - Copy all files from this folder to your new repository
   - Make sure the structure looks like this:
     ```
     portfolio/
     ├── index.html
     ├── styles.css
     ├── script.js
     ├── README.md
     └── assets/
         └── cats/
             ├── akukku.png
             ├── bumba.png
             ├── cebi.png
             ├── koboy.png
             ├── landi.png
             └── lyra.png
     ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live in a few minutes!

### Option 2: Using Git (Command Line)

```bash
# Navigate to the portfolio folder
cd portfolio-site

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Portfolio website"

# Add your GitHub repository as remote
git remote add origin https://github.com/gegeisgege/portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in your repository settings as described above.

## 📁 Project Structure

```
portfolio/
│
├── index.html          # Main HTML file with all content
├── styles.css          # All styling and animations
├── script.js           # Interactive features and cat animations
├── README.md           # This file
│
└── assets/
    └── cats/           # Cat image assets
        ├── akukku.png
        ├── bumba.png
        ├── cebi.png
        ├── koboy.png
        ├── landi.png
        └── lyra.png
```

## 🎨 Customization

### Update Your Information

Edit `index.html` to update:
- Contact information (email, phone, location)
- Professional summary
- Experience details
- Projects
- Skills
- Social media links

### Change Colors

Edit `styles.css` at the top (`:root` section):
```css
:root {
    --primary: #2563eb;      /* Main blue color */
    --secondary: #8b5cf6;    /* Purple accent */
    --text: #1e293b;         /* Dark text */
    --text-secondary: #64748b; /* Light text */
}
```

### Adjust Cat Animation

Edit `script.js`:
- Change `numCats` to add more or fewer floating cats
- Adjust `duration` for faster/slower movement
- Modify `distance` for longer/shorter movements

## 🐱 Easter Eggs

- Click on the floating cats - something fun happens!
- Click 5 cats to spawn even more cats
- Check the browser console for a friendly message

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📝 To-Do / Future Enhancements

- [ ] Add a blog section
- [ ] Integrate with a CMS for easier content updates
- [ ] Add dark mode toggle
- [ ] Add more interactive elements
- [ ] Create a downloadable PDF resume
- [ ] Add contact form functionality

## 📄 License

Feel free to use this template for your own portfolio! Just remember to:
- Update all personal information
- Add your own projects and experience
- Make it your own!

## 🤝 Contributing

Found a bug or have a suggestion? Feel free to open an issue or submit a pull request!

---

**Built with curiosity (and cats) 🐱**

*Gerald Mahapranaja Pillian © 2026*