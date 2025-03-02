// bubble-skills.js
window.addEventListener('load', function() {
    console.log('Bubble skills visualization loaded');
    
    // Get the container
    const container = document.getElementById('skills-bubbles-container');
    if (!container) {
      console.error('Skills bubbles container not found');
      return;
    }
    
    // Set container styles
    container.style.backgroundColor = document.body.classList.contains('light-mode') ? 'rgba(236, 231, 225, 0.7)' : 'rgba(17, 17, 27, 0.7)';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    
    // Define skill categories and their colors (following site's color scheme)
    const categories = {
      languages: {
        name: "Languages",
        color: "#8000ff", // Purple from original theme
        subSkills: [
          { name: "Python", level: 0.95, description: "Primary language for AI, data science and automation" },
          { name: "JavaScript", level: 0.85, description: "Web development, frontend and Node.js" },
          { name: "Go", level: 0.80, description: "Microservices and performance-critical applications" },
          { name: "SQL", level: 0.85, description: "Data querying and database management" },
          { name: "Bash", level: 0.75, description: "Shell scripting for automation" }
        ]
      },
      ai: {
        name: "AI & ML",
        color: "#6bc5f8", // Light blue from original theme
        subSkills: [
          { name: "Deep Learning", level: 0.90, description: "Neural networks, CNN, RNN, transformers" },
          { name: "NLP", level: 0.85, description: "Text processing, sentiment analysis, LLMs" },
          { name: "Computer Vision", level: 0.80, description: "Image recognition and processing" },
          { name: "ML Engineering", level: 0.88, description: "End-to-end ML system design and implementation" },
          { name: "MLOps", level: 0.85, description: "ML pipeline automation and model deployment" }
        ]
      },
      devops: {
        name: "DevOps",
        color: "#cf59e6", // Light purple from original theme
        subSkills: [
          { name: "Docker", level: 0.92, description: "Containerization for consistent environments" },
          { name: "Kubernetes", level: 0.85, description: "Container orchestration at scale" },
          { name: "CI/CD", level: 0.90, description: "Continuous integration and deployment" },
          { name: "Terraform", level: 0.80, description: "Infrastructure as code" },
          { name: "Monitoring", level: 0.75, description: "System and application monitoring" }
        ]
      },
      frameworks: {
        name: "Frameworks",
        color: "#71cbff", // Modified light blue
        subSkills: [
          { name: "TensorFlow", level: 0.88, description: "Deep learning framework" },
          { name: "PyTorch", level: 0.90, description: "Research-oriented ML framework" },
          { name: "Flask", level: 0.85, description: "Lightweight web framework for Python" },
          { name: "React", level: 0.78, description: "Frontend web development" },
          { name: "Node.js", level: 0.75, description: "JavaScript runtime for backend" }
        ]
      },
      cloud: {
        name: "Cloud",
        color: "#FF8A65", // Orange-ish
        subSkills: [
          { name: "AWS", level: 0.85, description: "Amazon Web Services ecosystem" },
          { name: "GCP", level: 0.80, description: "Google Cloud Platform services" },
          { name: "Azure", level: 0.75, description: "Microsoft Azure cloud solutions" },
          { name: "Serverless", level: 0.80, description: "Function-as-a-Service architectures" },
          { name: "Cloud Native", level: 0.85, description: "Distributed systems in cloud environments" }
        ]
      },
      data: {
        name: "Data",
        color: "#4CAF50", // Green
        subSkills: [
          { name: "Data Engineering", level: 0.85, description: "Data pipelines and processing" },
          { name: "Data Analysis", level: 0.90, description: "Statistical analysis and insights" },
          { name: "Data Viz", level: 0.80, description: "Visual representation of complex data" },
          { name: "Databases", level: 0.85, description: "SQL and NoSQL database systems" },
          { name: "Big Data", level: 0.75, description: "Processing large-scale datasets" }
        ]
      }
    };
  
    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.display = "block";
    container.appendChild(svg);
    
    // Add a defs section for filters and gradients
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);
    
    // Create gooey filter for organic look
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "gooey");
    
    // Gaussian blur
    const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feGaussianBlur.setAttribute("in", "SourceGraphic");
    feGaussianBlur.setAttribute("stdDeviation", "3");
    feGaussianBlur.setAttribute("result", "blur");
    filter.appendChild(feGaussianBlur);
    
    // Color matrix for gooey effect
    const feColorMatrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
    feColorMatrix.setAttribute("in", "blur");
    feColorMatrix.setAttribute("mode", "matrix");
    feColorMatrix.setAttribute("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7");
    feColorMatrix.setAttribute("result", "gooey");
    filter.appendChild(feColorMatrix);
    
    // Composite
    const feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
    feComposite.setAttribute("in", "SourceGraphic");
    feComposite.setAttribute("in2", "gooey");
    feComposite.setAttribute("operator", "atop");
    filter.appendChild(feComposite);
    
    defs.appendChild(filter);
    
    // Create group for main bubbles
    const bubblesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    bubblesGroup.setAttribute("class", "bubbles");
    bubblesGroup.setAttribute("filter", "url(#gooey)");
    svg.appendChild(bubblesGroup);
    
    // Create group for sub-skill bubbles (initially empty)
    const subBubblesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    subBubblesGroup.setAttribute("class", "sub-bubbles");
    svg.appendChild(subBubblesGroup);
    
    // Calculate positions for main bubbles
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35; // Radius for bubble placement
    
    // Keep track of current state
    let currentlyActive = null;
    let subBubbles = [];
    
    // Function to create a jelly/bubble effect
    function createBubbleEffect(element, color) {
      // Create radial gradient for bubble effect
      const gradientId = "gradient-" + Math.random().toString(36).substring(2, 9);
      const gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
      gradient.setAttribute("id", gradientId);
      gradient.setAttribute("cx", "0.3");
      gradient.setAttribute("cy", "0.3");
      gradient.setAttribute("r", "0.7");
      
      const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", lightenColor(color, 20));
      
      const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop2.setAttribute("offset", "75%");
      stop2.setAttribute("stop-color", color);
      
      const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop3.setAttribute("offset", "100%");
      stop3.setAttribute("stop-color", darkenColor(color, 15));
      
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      gradient.appendChild(stop3);
      defs.appendChild(gradient);
      
      // Set the fill to use the gradient
      element.setAttribute("fill", `url(#${gradientId})`);
      
      return gradientId;
    }
    
    // Helper functions for color manipulation
    function lightenColor(color, percent) {
      const num = parseInt(color.slice(1), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, (num >> 16) + amt);
      const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
      const B = Math.min(255, (num & 0x0000FF) + amt);
      return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
    
    function darkenColor(color, percent) {
      const num = parseInt(color.slice(1), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, (num >> 16) - amt);
      const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
      const B = Math.max(0, (num & 0x0000FF) - amt);
      return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
    
    // Create main bubbles
    const bubbles = [];
    let index = 0;
    
    for (const [id, category] of Object.entries(categories)) {
      // Calculate position in a circle
      const angle = (index / Object.keys(categories).length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Create group for bubble and text
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${x}, ${y})`);
      group.setAttribute("class", "bubble-group");
      group.setAttribute("data-category", id);
      
      // Create bubble
      const bubbleRadius = 40 + Math.random() * 20; // Varied sizes for organic feel
      const bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      bubble.setAttribute("r", bubbleRadius);
      bubble.setAttribute("class", "main-bubble");
      
      // Add jelly/bubble effect
      const gradientId = createBubbleEffect(bubble, category.color);
      
      // Add slight shadow for depth
      bubble.setAttribute("filter", "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2))");
      
      group.appendChild(bubble);
      
      // Create text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", "0.3em");
      text.setAttribute("fill", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
      text.setAttribute("font-size", "14px");
      text.setAttribute("font-weight", "bold");
      text.setAttribute("pointer-events", "none");
      text.textContent = category.name;
      group.appendChild(text);
      
      // Store bubble data
      bubbles.push({
        id,
        element: group,
        bubble,
        text,
        x,
        y,
        radius: bubbleRadius,
        category,
        gradientId,
        originX: x,
        originY: y
      });
      
      // Add to the SVG
      bubblesGroup.appendChild(group);
      
      // Add event listeners
      group.addEventListener('mouseenter', () => {
        highlightBubble(id);
      });
      
      group.addEventListener('mouseleave', () => {
        if (currentlyActive !== id) {
          resetBubbles();
        }
      });
      
      group.addEventListener('click', () => {
        toggleBubble(id);
      });
      
      index++;
    }
    
    // Function to highlight a bubble on hover
    function highlightBubble(id) {
      bubbles.forEach(bubble => {
        if (bubble.id === id) {
          // Highlight the hovered bubble
          bubble.bubble.setAttribute("stroke", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
          bubble.bubble.setAttribute("stroke-width", "2");
          
          // Animate scale up slightly
          bubble.element.setAttribute("transform", `translate(${bubble.x}, ${bubble.y}) scale(1.1)`);
        } else {
          // Fade other bubbles
          bubble.bubble.setAttribute("opacity", "0.4");
          bubble.text.setAttribute("opacity", "0.4");
        }
      });
    }
    
    // Function to reset all bubbles to normal state
    function resetBubbles() {
      // First clean up any existing sub-bubbles
      clearSubBubbles();
      currentlyActive = null;
      
      // Reset main bubbles
      bubbles.forEach(bubble => {
        bubble.bubble.removeAttribute("stroke");
        bubble.bubble.removeAttribute("stroke-width");
        bubble.bubble.setAttribute("opacity", "1");
        bubble.text.setAttribute("opacity", "1");
        
        // Reset position
        bubble.element.setAttribute("transform", `translate(${bubble.originX}, ${bubble.originY})`);
        
        // Animate back to original position with slight wobble
        animateBubbleWobble(bubble);
      });
    }
    
    // Function to toggle bubble expansion (show sub-skills)
    function toggleBubble(id) {
      // If the same bubble is clicked again, reset everything
      if (currentlyActive === id) {
        resetBubbles();
        return;
      }
      
      // Set current active bubble
      currentlyActive = id;
      
      // Clear any existing sub-bubbles
      clearSubBubbles();
      
      // Find the selected bubble
      const selectedBubble = bubbles.find(bubble => bubble.id === id);
      if (!selectedBubble) return;
      
      // Move selected bubble to center with a spin effect
      const spinKeyframes = [
        { transform: `translate(${selectedBubble.x}px, ${selectedBubble.y}px) scale(1.1) rotate(0deg)` },
        { transform: `translate(${centerX}px, ${centerY}px) scale(1.2) rotate(360deg)` }
      ];
      
      const spinOptions = {
        duration: 800,
        fill: 'forwards',
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      };
      
      selectedBubble.element.animate(spinKeyframes, spinOptions);
      
      // Move other bubbles outward
      bubbles.forEach(bubble => {
        if (bubble.id !== id) {
          // Calculate new position further from center
          const dx = bubble.x - centerX;
          const dy = bubble.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          const newDistance = distance * 1.3; // Push 30% further out
          const newX = centerX + Math.cos(angle) * newDistance;
          const newY = centerY + Math.sin(angle) * newDistance;
          
          // Animate to new position
          const moveKeyframes = [
            { transform: `translate(${bubble.x}px, ${bubble.y}px)` },
            { transform: `translate(${newX}px, ${newY}px)` }
          ];
          
          const moveOptions = {
            duration: 600,
            fill: 'forwards',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          };
          
          bubble.element.animate(moveKeyframes, moveOptions);
          
          // Fade other bubbles
          bubble.bubble.setAttribute("opacity", "0.3");
          bubble.text.setAttribute("opacity", "0.3");
        }
      });
      
      // Create sub-bubbles for the selected category
      createSubBubbles(selectedBubble);
    }
    
    // Function to create sub-bubbles
    function createSubBubbles(mainBubble) {
      const category = mainBubble.category;
      const subSkills = category.subSkills || [];
      
      if (subSkills.length === 0) return;
      
      // Calculate positions in a circle around the main bubble
      const subRadius = Math.min(width, height) * 0.2; // Smaller radius for sub-bubbles
      
      subSkills.forEach((skill, i) => {
        // Calculate position in a circle
        const angle = (i / subSkills.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * subRadius;
        const y = centerY + Math.sin(angle) * subRadius;
        
        // Create group for sub-bubble
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("transform", `translate(${centerX}, ${centerY})`); // Start at center
        group.setAttribute("class", "sub-bubble-group");
        
        // Create sub-bubble
        const bubbleRadius = 25 + skill.level * 15; // Size based on proficiency
        const bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        bubble.setAttribute("r", bubbleRadius);
        bubble.setAttribute("class", "sub-bubble");
        
        // Use a lighter version of the main bubble color
        const subColor = lightenColor(mainBubble.category.color, 10);
        createBubbleEffect(bubble, subColor);
        
        // Add to group
        group.appendChild(bubble);
        
        // Create text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dy", "0.3em");
        text.setAttribute("fill", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
        text.setAttribute("font-size", "12px");
        text.setAttribute("pointer-events", "none");
        text.textContent = skill.name;
        group.appendChild(text);
        
        // Add to SVG
        subBubblesGroup.appendChild(group);
        
        // Store sub-bubble data
        subBubbles.push({
          element: group,
          bubble,
          text,
          skill,
          targetX: x,
          targetY: y
        });
        
        // Animate emergence
        setTimeout(() => {
          const emergeKeyframes = [
            { transform: `translate(${centerX}px, ${centerY}px) scale(0.2)`, opacity: 0 },
            { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 }
          ];
          
          const emergeOptions = {
            duration: 500,
            fill: 'forwards',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            delay: i * 100 // Stagger the animations
          };
          
          group.animate(emergeKeyframes, emergeOptions);
          
          // Add hover effect for sub-bubbles
          group.addEventListener('mouseenter', () => {
            // Show tooltip with skill info
            showSkillTooltip(skill, x, y);
            
            // Highlight sub-bubble
            bubble.setAttribute("stroke", document.body.classList.contains('light-mode') ? "#000000" : "#ffffff");
            bubble.setAttribute("stroke-width", "2");
            
            // Pulse animation
            const pulseKeyframes = [
              { transform: 'scale(1)' },
              { transform: 'scale(1.1)' },
              { transform: 'scale(1)' }
            ];
            
            const pulseOptions = {
              duration: 500,
              easing: 'ease-in-out'
            };
            
            bubble.animate(pulseKeyframes, pulseOptions);
          });
          
          group.addEventListener('mouseleave', () => {
            // Hide tooltip
            hideSkillTooltip();
            
            // Remove highlight
            bubble.removeAttribute("stroke");
            bubble.removeAttribute("stroke-width");
          });
        }, 800); // Start after main bubble animation
      });
    }
    
    // Function to clear sub-bubbles
    function clearSubBubbles() {
      // Remove all sub-bubbles
      while (subBubblesGroup.firstChild) {
        subBubblesGroup.removeChild(subBubblesGroup.firstChild);
      }
      
      subBubbles = [];
      hideSkillTooltip();
    }
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = document.body.classList.contains('light-mode') ? 'rgba(231, 226, 219, 0.95)' : 'rgba(26, 26, 41, 0.95)';
    tooltip.style.color = document.body.classList.contains('light-mode') ? 'black' : 'white';
    tooltip.style.padding = '12px';
    tooltip.style.borderRadius = '8px';
    tooltip.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    tooltip.style.maxWidth = '250px';
    tooltip.style.zIndex = '1000';
    tooltip.style.fontFamily = 'fira code, monospace';
    tooltip.style.fontSize = '14px';
    tooltip.style.transition = 'opacity 0.3s ease';
    tooltip.style.border = `1px solid ${document.body.classList.contains('light-mode') ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`;
    container.appendChild(tooltip);
    
    // Function to show skill tooltip
    function showSkillTooltip(skill, x, y) {
      const level = Math.round(skill.level * 100);
      
      tooltip.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">${skill.name}</div>
        <div style="margin-bottom: 8px;">
          <div style="height: 6px; background: rgba(${document.body.classList.contains('light-mode') ? '0,0,0,0.1' : '255,255,255,0.1'}); border-radius: 3px; overflow: hidden;">
            <div style="height: 100%; width: ${level}%; background: ${currentlyActive ? categories[currentlyActive].color : '#8000ff'};"></div>
          </div>
          <div style="font-size: 12px; margin-top: 4px;">${level}% Proficiency</div>
        </div>
        <div>${skill.description}</div>
      `;
      
      tooltip.style.display = 'block';
      
      // Position tooltip to avoid going off screen
      const rect = container.getBoundingClientRect();
      
      if (x > rect.width / 2) {
        tooltip.style.right = `${rect.width - x + 15}px`;
        tooltip.style.left = 'auto';
      } else {
        tooltip.style.left = `${x + 15}px`;
        tooltip.style.right = 'auto';
      }
      
      if (y > rect.height / 2) {
        tooltip.style.bottom = `${rect.height - y + 15}px`;
        tooltip.style.top = 'auto';
      } else {
        tooltip.style.top = `${y + 15}px`;
        tooltip.style.bottom = 'auto';
      }
    }
    
    // Function to hide skill tooltip
    function hideSkillTooltip() {
      tooltip.style.display = 'none';
    }
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.className = 'bubbles-instructions';
    instructions.style.position = 'absolute';
    instructions.style.bottom = '10px';
    instructions.style.left = '10px';
    instructions.style.backgroundColor = document.body.classList.contains('light-mode') ? 'rgba(231, 226, 219, 0.8)' : 'rgba(26, 26, 41, 0.8)';
    instructions.style.color = document.body.classList.contains('light-mode') ? 'black' : 'white';
    instructions.style.padding = '8px 12px';
    instructions.style.borderRadius = '5px';
    instructions.style.fontSize = '12px';
    instructions.style.fontFamily = 'fira code, monospace';
    instructions.style.zIndex = '5';
    instructions.style.maxWidth = '200px';
    instructions.style.border = `1px solid ${document.body.classList.contains('light-mode') ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`;
    
    instructions.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 4px;">Instructions:</div>
      <div>• Click on a bubble to explore sub-skills</div>
      <div>• Hover over skills for details</div>
      <div>• Click again to reset view</div>
    `;
    
    container.appendChild(instructions);
    
    // Add bubble wobble animation
    function animateBubbleWobble(bubble) {
      const wobbleAmount = bubble.radius * 0.05; // 5% of radius
      
      // Create random wobble
      const animationKeyframes = [];
      const steps = 10;
      
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const xOffset = Math.sin(progress * Math.PI * 2) * wobbleAmount * Math.random();
        const yOffset = Math.cos(progress * Math.PI * 2) * wobbleAmount * Math.random();
        
        animationKeyframes.push({
          transform: `translate(${bubble.originX + xOffset}px, ${bubble.originY + yOffset}px)`
        });
      }
      
      // Add the original position as last keyframe
      animationKeyframes.push({
        transform: `translate(${bubble.originX}px, ${bubble.originY}px)`
      });
      
      const animationOptions = {
        duration: 2000 + Math.random() * 1000, // Slightly varied duration
        iterations: 1,
        easing: 'ease-in-out',
        fill: 'forwards'
      };
      
      // Apply the animation
      bubble.element.animate(animationKeyframes, animationOptions);
    }
    
    // Add bubble floating animation to all bubbles
    bubbles.forEach(bubble => {
      animateBubbleWobble(bubble);
      
      // Repeat animation periodically
      setInterval(() => {
        if (currentlyActive !== bubble.id) {
          animateBubbleWobble(bubble);
        }
      }, 3000 + Math.random() * 2000); // Random timing for more organic feel
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      // Reset everything
      resetBubbles();
      
      // Update dimensions
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      const newCenterX = newWidth / 2;
      const newCenterY = newHeight / 2;
      const newRadius = Math.min(newWidth, newHeight) * 0.35;
      
      // Update bubble positions
      bubbles.forEach((bubble, index) => {
        const angle = (index / bubbles.length) * Math.PI * 2;
        bubble.originX = newCenterX + Math.cos(angle) * newRadius;
        bubble.originY = newCenterY + Math.sin(angle) * newRadius;
        bubble.x = bubble.originX;
        bubble.y = bubble.originY;
        
        bubble.element.setAttribute("transform", `translate(${bubble.originX}, ${bubble.originY})`);
      });
    });
    
    // Handle theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class' && 
            mutation.target === document.body && 
            mutation.target.classList.contains('light-mode') !== undefined) {
          
          // Update tooltip and instructions background
          const isLightMode = document.body.classList.contains('light-mode');
          tooltip.style.backgroundColor = isLightMode ? 'rgba(231, 226, 219, 0.95)' : 'rgba(26, 26, 41, 0.95)';
          tooltip.style.color = isLightMode ? 'black' : 'white';
          tooltip.style.border = `1px solid ${isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`;
          
          instructions.style.backgroundColor = isLightMode ? 'rgba(231, 226, 219, 0.8)' : 'rgba(26, 26, 41, 0.8)';
          instructions.style.color = isLightMode ? 'black' : 'white';
          instructions.style.border = `1px solid ${isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`;
          
          // Update container background
          container.style.backgroundColor = isLightMode ? 'rgba(236, 231, 225, 0.7)' : 'rgba(17, 17, 27, 0.7)';
          
          // Update text colors
          bubbles.forEach(bubble => {
            bubble.text.setAttribute("fill", isLightMode ? "#000000" : "#ffffff");
          });
          
          subBubbles.forEach(bubble => {
            bubble.text.setAttribute("fill", isLightMode ? "#000000" : "#ffffff");
          });
        }
      });
    });
    
    // Start observing body for class changes
    observer.observe(document.body, { attributes: true });
    
    console.log('Bubble skills visualization created');
  });