// direct-tooltip-fix.js
// This script adds a simple, reliable tooltip system directly to the page

document.addEventListener('DOMContentLoaded', function() {
    console.log('Direct tooltip fix loaded');
    
    // Create a fixed tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'skill-info-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.left = '50%';
    tooltip.style.bottom = '20px';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.width = '80%';
    tooltip.style.maxWidth = '500px';
    tooltip.style.backgroundColor = 'rgba(26, 26, 41, 0.95)';
    tooltip.style.borderRadius = '10px';
    tooltip.style.padding = '20px';
    tooltip.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    tooltip.style.zIndex = '99999';
    tooltip.style.display = 'none';
    tooltip.style.color = '#ffffff';
    tooltip.style.fontFamily = 'fira code, monospace';
    tooltip.style.textAlign = 'center';
    tooltip.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    document.body.appendChild(tooltip);
    
    // Handle light/dark mode
    function updateTooltipTheme() {
      if (document.body.classList.contains('light-mode')) {
        tooltip.style.backgroundColor = 'rgba(236, 231, 225, 0.95)';
        tooltip.style.color = '#333333';
        tooltip.style.border = '1px solid rgba(0, 0, 0, 0.2)';
      } else {
        tooltip.style.backgroundColor = 'rgba(26, 26, 41, 0.95)';
        tooltip.style.color = '#ffffff';
        tooltip.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      }
    }
    
    updateTooltipTheme();
    
    // Add event listeners to all skill boxes
    document.querySelectorAll('.tech-stack-box').forEach(box => {
      box.addEventListener('mouseenter', function() {
        // Get skill info from the existing tooltip
        const skillName = this.querySelector('.tooltip').textContent;
        
        // Define descriptions based on skill name
        const descriptions = {
          'HTML': 'HTML5, Semantic markup, Accessibility features, and modern web standards.',
          'CSS': 'CSS3, Flexbox, Grid, Animations, and responsive design techniques.',
          'JAVASCRIPT': 'ES6+, DOM manipulation, Async/Await, Promises, and modern JS frameworks.',
          'PYTHON': 'Data analysis, Machine Learning, Automation, and backend development.',
          'REACT': 'React, Hooks, Context API, Redux, and component-based architecture.',
          'NEXTJS': 'Server-side rendering, API routes, and Static Site Generation for React apps.',
          'NODEJS': 'Express, RESTful APIs, Backend development, and server management.',
          'ASTRO': 'Content-focused static site generation with partial hydration.',
          'BOOTSTRAP': 'Responsive design, UI components, and rapid prototyping.',
          'GIT': 'Version control, Branching strategies, Collaboration, and source management.',
          'GITHUB': 'Repository management, CI/CD workflows, GitHub Actions, and GitHub Pages.',
          'TINACMS': 'Headless content management system for Git-based content.',
          'CONTENTFUL': 'API-first content management platform for digital experiences.'
        };
        
        // Get description for this skill or show default
        const description = descriptions[skillName.trim()] || 'Advanced expertise in this technology.';
        
        // Determine proficiency level (mock value based on skill)
        let proficiency = 85;
        if (skillName.includes('HTML') || skillName.includes('CSS') || skillName.includes('JAVASCRIPT') || skillName.includes('PYTHON')) {
          proficiency = 95;
        } else if (skillName.includes('REACT') || skillName.includes('GIT')) {
          proficiency = 90;
        } else if (skillName.includes('ASTRO') || skillName.includes('TINACMS')) {
          proficiency = 75;
        }
        
        // Build tooltip content
        tooltip.innerHTML = `
          <h3 style="margin: 0 0 15px; font-size: 2.2rem; background: -webkit-linear-gradient(135deg, var(--color-light-blue), var(--color-light-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${skillName}</h3>
          <div style="margin-bottom: 15px;">
            <div style="height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; margin: 0 auto; max-width: 300px;">
              <div style="height: 100%; width: ${proficiency}%; background-image: linear-gradient(90deg, var(--color-light-blue), var(--color-light-purple));"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 1.4rem; opacity: 0.8; max-width: 300px; margin: 5px auto 0;">
              <span>Proficiency</span>
              <span>${proficiency}%</span>
            </div>
          </div>
          <p style="margin: 0; font-size: 1.6rem; line-height: 1.5; max-width: 450px; margin: 0 auto;">${description}</p>
        `;
        
        // Fade out other skills
        document.querySelectorAll('.tech-stack-box').forEach(otherBox => {
          if (otherBox !== this) {
            otherBox.style.opacity = '0.3';
            otherBox.style.transition = 'opacity 0.3s ease';
          }
        });
        
        // Highlight this skill
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        this.style.zIndex = '10';
        
        // Show tooltip
        tooltip.style.display = 'block';
      });
      
      box.addEventListener('mouseleave', function() {
        // Hide tooltip
        tooltip.style.display = 'none';
        
        // Restore all skills
        document.querySelectorAll('.tech-stack-box').forEach(otherBox => {
          otherBox.style.opacity = '1';
        });
        
        // Reset this skill
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
        this.style.zIndex = '1';
      });
    });
    
    // Observer for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class' && 
            mutation.target === document.body && 
            mutation.target.classList.contains('light-mode') !== undefined) {
          updateTooltipTheme();
        }
      });
    });
    
    // Start observing body for class changes
    observer.observe(document.body, { attributes: true });
  });