// enhanced-bubble-skills.js
window.addEventListener('load', function() {
  console.log('Enhanced bubble skills script loaded');
  
  // Get the container
  const container = document.getElementById('skills-bubbles-container');
  if (!container) {
    console.error('Skills bubbles container not found');
    return;
  }
  
  // Set container styles while preserving the original aesthetic
  container.style.backgroundColor = document.body.classList.contains('light-mode') ? 
    'var(--tech-stack-box-first-color)' : 'var(--tech-stack-box-first-color)';
  container.style.height = '500px';
  container.style.position = 'relative';
  
  // Create SVG
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.display = "block";
  container.appendChild(svg);
  
  // Define skill categories with colors matching Vinod's original theme
  const categories = [
    { 
      name: "AI", 
      color: "#8000ff", // Original purple theme color
      x: "30%", 
      y: "30%",
      level: 0.95,
      subSkills: [
        { name: "Machine Learning", level: 0.90 },
        { name: "Deep Learning", level: 0.85 },
        { name: "NLP", level: 0.80 },
        { name: "Computer Vision", level: 0.75 }
      ]
    },
    { 
      name: "DevOps", 
      color: "#6bc5f8", // Original light blue theme color
      x: "70%", 
      y: "30%",
      level: 0.90,
      subSkills: [
        { name: "Docker", level: 0.92 },
        { name: "Kubernetes", level: 0.88 },
        { name: "CI/CD", level: 0.85 },
        { name: "Terraform", level: 0.80 }
      ]
    },
    { 
      name: "Python", 
      color: "#cf59e6", // Original light purple theme color
      x: "20%", 
      y: "60%",
      level: 0.95,
      subSkills: [
        { name: "TensorFlow", level: 0.90 },
        { name: "PyTorch", level: 0.85 },
        { name: "NumPy/Pandas", level: 0.95 },
        { name: "Flask/Django", level: 0.85 }
      ]
    },
    { 
      name: "Cloud", 
      color: "#8000ff", // Original purple theme color
      x: "50%", 
      y: "60%",
      level: 0.85,
      subSkills: [
        { name: "AWS", level: 0.85 },
        { name: "GCP", level: 0.80 },
        { name: "Azure", level: 0.75 },
        { name: "Serverless", level: 0.80 }
      ]
    },
    { 
      name: "Data", 
      color: "#6bc5f8", // Original light blue theme color
      x: "80%", 
      y: "60%",
      level: 0.90,
      subSkills: [
        { name: "SQL", level: 0.90 },
        { name: "Data Engineering", level: 0.85 },
        { name: "Data Analysis", level: 0.90 },
        { name: "Visualization", level: 0.85 }
      ]
    }
  ];
  
  // Keep track of expanded skill and its sub-bubbles
  let expandedSkill = null;
  let subBubbles = [];
  
  // Function to create main bubbles
  function createMainBubbles() {
    // Clear any existing content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Create bubbles
    categories.forEach((category, index) => {
      // Create group
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("data-category", category.name);
      svg.appendChild(group);
      
      // Calculate size based on proficiency
      const radius = 40 + (category.level * 20);
      
      // Create bubble
      const bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      bubble.setAttribute("cx", category.x);
      bubble.setAttribute("cy", category.y);
      bubble.setAttribute("r", radius);
      bubble.setAttribute("fill", category.color);
      bubble.setAttribute("stroke", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
      bubble.setAttribute("stroke-width", "2");
      bubble.setAttribute("opacity", "0.9");
      bubble.classList.add("skill-bubble");
      group.appendChild(bubble);
      
      // Add subtle shadow for depth
      const shadow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      shadow.setAttribute("cx", category.x);
      shadow.setAttribute("cy", parseInt(category.y) + 3);
      shadow.setAttribute("r", radius);
      shadow.setAttribute("fill", "rgba(0,0,0,0.2)");
      shadow.setAttribute("opacity", "0.3");
      group.insertBefore(shadow, bubble);
      
      // Create text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", category.x);
      text.setAttribute("y", category.y);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
      text.setAttribute("font-family", "fira code, monospace");
      text.setAttribute("font-size", "16px");
      text.setAttribute("font-weight", "bold");
      text.textContent = category.name;
      group.appendChild(text);
      
      // Store references
      category.element = group;
      category.bubbleElement = bubble;
      category.textElement = text;
      
      // Add hover effects
      group.addEventListener('mouseenter', () => {
        // Don't apply hover effect if this or another skill is expanded
        if (expandedSkill !== null) return;
        
        bubble.setAttribute("stroke-width", "3");
        
        // Scale up slightly
        const currentR = parseFloat(bubble.getAttribute("r"));
        bubble.setAttribute("r", (currentR * 1.1).toString());
        
        // Fade other bubbles
        categories.forEach(cat => {
          if (cat.name !== category.name) {
            cat.bubbleElement.setAttribute("opacity", "0.5");
            cat.textElement.setAttribute("opacity", "0.5");
          }
        });
      });
      
      group.addEventListener('mouseleave', () => {
        // Don't restore if this or another skill is expanded
        if (expandedSkill !== null) return;
        
        bubble.setAttribute("stroke-width", "2");
        
        // Scale back to original
        bubble.setAttribute("r", radius.toString());
        
        // Restore other bubbles
        categories.forEach(cat => {
          cat.bubbleElement.setAttribute("opacity", "0.9");
          cat.textElement.setAttribute("opacity", "1");
        });
      });
      
      // Add click effect to expand/collapse
      group.addEventListener('click', () => {
        if (expandedSkill === category.name) {
          // Collapse this skill
          collapseSkill();
        } else {
          // Expand this skill
          expandSkill(category);
        }
      });
    });
  }
  
  // Function to expand a skill and show sub-skills
  function expandSkill(category) {
    // Set as expanded
    expandedSkill = category.name;
    
    // Fade other main skills
    categories.forEach(cat => {
      if (cat.name !== category.name) {
        cat.element.setAttribute("opacity", "0.3");
      }
    });
    
    // Move selected skill to center with animation
    const bubble = category.bubbleElement;
    const originalCx = bubble.getAttribute("cx");
    const originalCy = bubble.getAttribute("cy");
    const targetCx = "50%";
    const targetCy = "35%";
    
    // Animation for main bubble
    const animation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animation.setAttribute("attributeName", "cx");
    animation.setAttribute("from", originalCx);
    animation.setAttribute("to", targetCx);
    animation.setAttribute("dur", "0.5s");
    animation.setAttribute("fill", "freeze");
    bubble.appendChild(animation);
    
    const animationY = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animationY.setAttribute("attributeName", "cy");
    animationY.setAttribute("from", originalCy);
    animationY.setAttribute("to", targetCy);
    animationY.setAttribute("dur", "0.5s");
    animationY.setAttribute("fill", "freeze");
    bubble.appendChild(animationY);
    
    // Update text position
    const text = category.textElement;
    text.setAttribute("x", targetCx);
    text.setAttribute("y", targetCy);
    
    // Also increase size slightly
    const currentR = parseFloat(bubble.getAttribute("r"));
    bubble.setAttribute("r", (currentR * 1.2).toString());
    
    // Create sub-skills with staggered animation
    createSubSkills(category);
    
    // Add instruction to collapse
    const instructionText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    instructionText.setAttribute("x", "50%");
    instructionText.setAttribute("y", "90%");
    instructionText.setAttribute("text-anchor", "middle");
    instructionText.setAttribute("fill", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
    instructionText.setAttribute("font-family", "fira code, monospace");
    instructionText.setAttribute("font-size", "14px");
    instructionText.setAttribute("opacity", "0.7");
    instructionText.setAttribute("id", "instruction-text");
    instructionText.textContent = "Click anywhere to collapse";
    svg.appendChild(instructionText);
  }
  
  // Function to create sub-skill bubbles
  function createSubSkills(category) {
    const subSkills = category.subSkills || [];
    if (subSkills.length === 0) return;
    
    // Calculate positions in a circle around the main bubble
    const centerX = "50%";
    const centerY = "35%";
    const radius = "25%";
    
    subSkills.forEach((skill, index) => {
      // Calculate position in a circle
      const angle = ((index / subSkills.length) * Math.PI * 2) + (Math.PI / 2); // Start from bottom
      const x = `calc(${centerX} + ${radius} * ${Math.cos(angle)})`;
      const y = `calc(${centerY} + ${radius} * ${Math.sin(angle)})`;
      
      // Create group
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", "sub-skill");
      group.setAttribute("opacity", "0");
      svg.appendChild(group);
      
      // Calculate size based on proficiency
      const bubbleRadius = 20 + (skill.level * 15);
      
      // Create bubble
      const bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      bubble.setAttribute("cx", x);
      bubble.setAttribute("cy", y);
      bubble.setAttribute("r", bubbleRadius);
      bubble.setAttribute("fill", category.color);
      bubble.setAttribute("opacity", "0.8");
      bubble.setAttribute("stroke", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
      bubble.setAttribute("stroke-width", "1.5");
      group.appendChild(bubble);
      
      // Create text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
      text.setAttribute("font-family", "fira code, monospace");
      text.setAttribute("font-size", "12px");
      text.textContent = skill.name;
      group.appendChild(text);
      
      // Create line connecting to main bubble
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", centerX);
      line.setAttribute("y1", centerY);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", category.color);
      line.setAttribute("stroke-width", "2");
      line.setAttribute("opacity", "0.6");
      line.setAttribute("stroke-dasharray", "5,3");
      svg.insertBefore(line, group); // Put line behind bubble
      
      // Store for later cleanup
      subBubbles.push(group);
      subBubbles.push(line);
      
      // Animate appearance with delay
      setTimeout(() => {
        group.setAttribute("opacity", "1");
        
        // Add subtle hover effect
        group.addEventListener('mouseenter', () => {
          bubble.setAttribute("stroke-width", "2.5");
          bubble.setAttribute("opacity", "1");
          line.setAttribute("opacity", "1");
          line.setAttribute("stroke-width", "3");
          
          // Show proficiency level
          const levelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
          levelText.setAttribute("x", x);
          levelText.setAttribute("y", `calc(${y} + ${bubbleRadius + 15}px)`);
          levelText.setAttribute("text-anchor", "middle");
          levelText.setAttribute("fill", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
          levelText.setAttribute("font-size", "10px");
          levelText.setAttribute("class", "level-text");
          levelText.textContent = `${Math.round(skill.level * 100)}%`;
          group.appendChild(levelText);
        });
        
        group.addEventListener('mouseleave', () => {
          bubble.setAttribute("stroke-width", "1.5");
          bubble.setAttribute("opacity", "0.8");
          line.setAttribute("opacity", "0.6");
          line.setAttribute("stroke-width", "2");
          
          // Remove proficiency level
          const levelText = group.querySelector('.level-text');
          if (levelText) group.removeChild(levelText);
        });
      }, index * 200); // Staggered appearance
    });
  }
  
  // Function to collapse an expanded skill
  function collapseSkill() {
    if (expandedSkill === null) return;
    
    // Find the expanded category
    const category = categories.find(cat => cat.name === expandedSkill);
    if (!category) return;
    
    // Restore original position
    const bubble = category.bubbleElement;
    const originalX = category.x;
    const originalY = category.y;
    
    bubble.setAttribute("cx", originalX);
    bubble.setAttribute("cy", originalY);
    
    // Restore text position
    category.textElement.setAttribute("x", originalX);
    category.textElement.setAttribute("y", originalY);
    
    // Restore original size
    const originalRadius = 40 + (category.level * 20);
    bubble.setAttribute("r", originalRadius.toString());
    
    // Remove sub-skills
    while (subBubbles.length > 0) {
      const element = subBubbles.pop();
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
    
    // Remove instruction text
    const instructionText = document.getElementById("instruction-text");
    if (instructionText && instructionText.parentNode) {
      instructionText.parentNode.removeChild(instructionText);
    }
    
    // Restore all bubbles
    categories.forEach(cat => {
      cat.element.setAttribute("opacity", "1");
    });
    
    // Reset expanded skill
    expandedSkill = null;
  }
  
  // Initialize the visualization
  createMainBubbles();
  
  // Add click handler to collapse when clicking empty space
  svg.addEventListener('click', (event) => {
    // Only collapse if clicking on SVG background, not on a bubble
    if (event.target === svg && expandedSkill !== null) {
      collapseSkill();
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    // Collapse any expanded skill
    if (expandedSkill !== null) {
      collapseSkill();
    }
    
    // Recreate main bubbles
    createMainBubbles();
  });
  
  // Handle theme changes
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class' && 
          mutation.target === document.body && 
          mutation.target.classList.contains('light-mode') !== undefined) {
        
        // Recreate visualization when theme changes
        if (expandedSkill !== null) {
          collapseSkill();
        }
        createMainBubbles();
      }
    });
  });
  
  // Start observing body for class changes
  observer.observe(document.body, { attributes: true });
  
  console.log('Enhanced bubble visualization created');
});