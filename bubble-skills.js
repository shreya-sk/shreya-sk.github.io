// fixed-hexagon-skills.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('Fixed hexagonal skills layout script loaded (4-5-4 pattern)');
  
  // Skill data with proficiency levels (0.0 to 1.0)
  const skills = [
    // First row (4)
    { name: "HTML", icon: "./src/png/htmllogo.png", level: 0.95, description: "HTML5, Semantic markup, Accessibility" },
    { name: "CSS", icon: "./src/png/csslogo.png", level: 0.9, description: "CSS3, Flexbox, Grid, Animations" },
    { name: "JavaScript", icon: "./src/png/jslogo.png", level: 0.85, description: "ES6+, DOM manipulation, Async/Await" },
    { name: "Python", icon: "./src/png/python.png", level: 0.95, description: "Data analysis, Automation, ML/AI" },
    
    // Second row (5)
    { name: "React", icon: "./src/png/reactlogo.png", level: 0.9, description: "React, Hooks, Context API, Redux" },
    { name: "Next.js", icon: "./src/png/nextlogo.png", level: 0.85, description: "Server-side rendering, API routes" },
    { name: "Node.js", icon: "./src/png/node.png", level: 0.8, description: "Express, RESTful APIs, Backend development" },
    { name: "Astro", icon: "./src/png/astro.png", level: 0.8, description: "Content-focused static site generation" },
    { name: "Bootstrap", icon: "./src/png/bootstraplogo.png", level: 0.85, description: "Responsive design, UI components" },
    
    // Third row (4)
    { name: "Git", icon: "./src/png/gitlogo.png", level: 0.9, description: "Version control system" },
    { name: "GitHub", icon: "./src/png/githublogo.png", level: 0.85, description: "Repository management", invert: true },
    { name: "TinaCMS", icon: "./src/png/tinacms.png", level: 0.75, description: "Headless content management system" },
    { name: "Contentful", icon: "./src/png/contentfulcms.png", level: 0.8, description: "API-first content management platform" }
  ];
  
  // Select the tech stack wrapper
  const techStackWrapper = document.querySelector('.tech-stack-wrapper');
  if (!techStackWrapper) {
    console.error('Tech stack wrapper not found');
    return;
  }
  
  // Clear existing content
  techStackWrapper.innerHTML = '';
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'skill-tooltip';
  tooltip.style.display = 'none';
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = 'var(--tech-stack-box-first-color)';
  tooltip.style.border = '1px solid var(--tech-stack-box-border-color)';
  tooltip.style.borderRadius = '10px';
  tooltip.style.padding = '15px';
  tooltip.style.zIndex = '1000';
  tooltip.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  tooltip.style.maxWidth = '250px';
  tooltip.style.backdropFilter = 'blur(5px)';
  tooltip.style.transition = 'opacity 0.3s ease';
  tooltip.style.pointerEvents = 'none'; // Ensure tooltip doesn't interfere with mouse events
  document.body.appendChild(tooltip);
  
  // Set fixed rows for 4-5-4 hexagonal layout
  const rows = [
    { count: 4, skills: skills.slice(0, 4) },
    { count: 5, skills: skills.slice(4, 9) },
    { count: 4, skills: skills.slice(9, 13) }
  ];
  
  // Create hexagonal layout
  rows.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'skill-row';
    rowDiv.style.display = 'flex';
    rowDiv.style.justifyContent = 'center';
    rowDiv.style.alignItems = 'center';
    rowDiv.style.margin = rowIndex === 1 ? '10px 0' : '20px 0';
    rowDiv.style.flexWrap = 'nowrap'; // Prevent wrapping within rows
    
    row.skills.forEach(skill => {
      // Calculate size based on proficiency (70% to 100% of original)
      const sizeMultiplier = 0.7 + (skill.level * 0.3);
      const baseSize = 160; // Base size in the original design
      const size = Math.round(baseSize * sizeMultiplier);
      
      // Create skill box
      const skillBox = document.createElement('li');
      skillBox.className = 'tech-stack-box';
      skillBox.setAttribute('data-aos', 'fade-up'); // Keep Vinod's AOS animation
      skillBox.style.width = `${size}px`;
      skillBox.style.height = `${size}px`;
      skillBox.style.margin = '0 15px';
      skillBox.style.flexShrink = '0'; // Prevent shrinking in flex layout
      
      // Create skill icon
      const img = document.createElement('img');
      img.src = skill.icon || './src/png/placeholder.png'; // Fallback for missing icons
      img.alt = `${skill.name} skill`;
      img.className = 'tech-stack-logo';
      if (skill.invert) img.classList.add('needtobeinvert');
      
      // Create tooltip span (from original design)
      const tooltipSpan = document.createElement('span');
      tooltipSpan.className = 'tooltip';
      tooltipSpan.textContent = skill.name.toUpperCase();
      
      // Add to skill box
      skillBox.appendChild(img);
      skillBox.appendChild(tooltipSpan);
      
      // Add enhanced hover effect with fade-out of other skills
      skillBox.addEventListener('mouseenter', (e) => {
        // Fade out all other skill boxes
        document.querySelectorAll('.tech-stack-box').forEach(box => {
          if (box !== skillBox) {
            box.style.opacity = '0.3';
            box.style.transition = 'opacity 0.3s ease';
          }
        });
        
        const rect = skillBox.getBoundingClientRect();
        
        // Generate tooltip content
        tooltip.innerHTML = `
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <img src="${skill.icon}" alt="${skill.name}" style="width: 30px; height: 30px; ${skill.invert ? 'filter: invert(1);' : ''}" />
            <h3 style="margin: 0 0 0 10px; color: ${document.body.classList.contains('light-mode') ? '#000000' : '#ffffff'}; font-size: 1.8rem;">${skill.name}</h3>
          </div>
          <div style="margin-bottom: 12px;">
            <div style="height: 8px; background: rgba(${document.body.classList.contains('light-mode') ? '0,0,0,0.1' : '255,255,255,0.1'}); border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: ${skill.level * 100}%; background-image: linear-gradient(90deg, var(--color-light-blue), var(--color-light-purple));"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 1.2rem; color: ${document.body.classList.contains('light-mode') ? '#333333' : 'var(--color-ddd-color)'};">
              <span>Proficiency</span>
              <span>${Math.round(skill.level * 100)}%</span>
            </div>
          </div>
          <p style="margin: 0; color: ${document.body.classList.contains('light-mode') ? '#333333' : 'var(--color-ddd-color)'}; font-size: 1.4rem; line-height: 1.5;">${skill.description}</p>
        `;
        
        // Position tooltip - ensure it's visible on screen
        const tooltipWidth = 250; // Match the max-width from the CSS
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Default position to the right of the skill box
        let left = rect.right + 10;
        let top = rect.top + (rect.height / 2);
        
        // Check if tooltip would go off the right edge
        if (left + tooltipWidth > viewportWidth) {
          // Position to the left of the skill box instead
          left = rect.left - tooltipWidth - 10;
        }
        
        // If left is negative (off screen to the left), reset to a safe position
        if (left < 10) {
          left = 10;
        }
        
        // Calculate top position to center vertically with the skill box
        top = top - (tooltip.offsetHeight / 2 || 75); // Use 75px as fallback if height not known yet
        
        // Make sure tooltip is not positioned off the top
        if (top < 10) {
          top = 10;
        }
        
        // Make sure tooltip is not positioned off the bottom
        if (top + (tooltip.offsetHeight || 150) > viewportHeight) {
          top = viewportHeight - (tooltip.offsetHeight || 150) - 10;
        }
        
        // Set the position
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.right = 'auto';
        tooltip.style.bottom = 'auto';
        
        // Show the tooltip
        tooltip.style.display = 'block';
        tooltip.style.opacity = '0';
        
        // Fade in
        setTimeout(() => {
          tooltip.style.opacity = '1';
        }, 10);
        
        // Highlight the hovered skill
        skillBox.style.transform = 'scale(1.05)';
        skillBox.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        skillBox.style.zIndex = '10';
      });
      
      skillBox.addEventListener('mouseleave', () => {
        // Restore opacity of all skill boxes
        document.querySelectorAll('.tech-stack-box').forEach(box => {
          box.style.opacity = '1';
        });
        
        tooltip.style.display = 'none';
        
        // Reset skill box
        skillBox.style.transform = 'scale(1)';
        skillBox.style.boxShadow = 'none';
        skillBox.style.zIndex = '1';
      });
      
      skillBox.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        
        // Reset skill box
        skillBox.style.transform = 'scale(1)';
        skillBox.style.boxShadow = 'none';
        skillBox.style.zIndex = '1';
      });
      
      rowDiv.appendChild(skillBox);
    });
    
    techStackWrapper.appendChild(rowDiv);
  });
  
  // Handle light/dark mode changes for tooltip
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class' && 
          mutation.target === document.body && 
          mutation.target.classList.contains('light-mode') !== undefined) {
        
        // Update tooltip styling based on theme
        const isLightMode = document.body.classList.contains('light-mode');
        tooltip.style.boxShadow = isLightMode ? '0 4px 8px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.3)';
      }
    });
  });
  
  // Start observing body for class changes
  observer.observe(document.body, { attributes: true });
  
  console.log('Fixed 4-5-4 hexagonal skills layout created');
});