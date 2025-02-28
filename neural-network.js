// enhanced-network.js
window.addEventListener('load', function() {
    console.log('Enhanced network script loaded');
    
    // Get the container
    const container = document.getElementById('neural-network-container');
    if (!container) {
      console.error('Neural network container not found');
      return;
    }
    
    // Set container styles
    container.style.backgroundColor = document.body.classList.contains('light-mode') ? '#e7e2db' : '#1a1a29';
    container.style.height = '500px';
    container.style.position = 'relative';
    
    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    container.appendChild(svg);
    
    // Create groups for links and nodes
    const linksGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(linksGroup);
    
    const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(nodesGroup);
    
    // Create a tooltip div
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = document.body.classList.contains('light-mode') ? 'rgba(231, 226, 219, 0.9)' : 'rgba(26, 26, 41, 0.9)';
    tooltip.style.color = document.body.classList.contains('light-mode') ? 'black' : 'white';
    tooltip.style.padding = '10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    tooltip.style.zIndex = '100';
    tooltip.style.maxWidth = '250px';
    tooltip.style.fontFamily = 'fira code, monospace';
    tooltip.style.transition = 'opacity 0.3s ease';
    container.appendChild(tooltip);
    
    // Skill categories
    const categories = {
      ai: { name: "AI & ML", color: "#8000ff" },
      devops: { name: "DevOps", color: "#6bc5f8" },
      languages: { name: "Languages", color: "#cf59e6" },
      tools: { name: "Tools", color: "#FF8A65" },
      frameworks: { name: "Frameworks", color: "#4CAF50" }
    };
    
    // Define skills with more detail
    const skills = [
      { id: "ai", name: "AI & ML", category: "ai", level: 0.9, description: "Artificial Intelligence and Machine Learning skills including supervised/unsupervised learning" },
      { id: "mlops", name: "MLOps", category: "devops", level: 0.85, description: "Machine learning operations practices including CI/CD for ML models" },
      { id: "python", name: "Python", category: "languages", level: 0.95, description: "Python programming for data science, web development, and automation" },
      { id: "tensorflow", name: "TensorFlow", category: "frameworks", level: 0.8, description: "TensorFlow framework for building and deploying ML models" },
      { id: "pytorch", name: "PyTorch", category: "frameworks", level: 0.85, description: "PyTorch for deep learning research and applications" },
      { id: "docker", name: "Docker", category: "tools", level: 0.9, description: "Containerization tool for packaging applications and their dependencies" },
      { id: "kubernetes", name: "Kubernetes", category: "devops", level: 0.8, description: "Container orchestration platform for automating deployment and scaling" },
      { id: "cloud", name: "Cloud Services", category: "devops", level: 0.85, description: "Cloud platforms like AWS, GCP, and Azure" },
      { id: "cicd", name: "CI/CD", category: "devops", level: 0.85, description: "Continuous Integration and Continuous Deployment practices" },
      { id: "nlp", name: "NLP", category: "ai", level: 0.8, description: "Natural Language Processing for text analysis and generation" },
      { id: "cv", name: "Computer Vision", category: "ai", level: 0.75, description: "Computer Vision for image and video analysis" },
      { id: "js", name: "JavaScript", category: "languages", level: 0.8, description: "JavaScript for frontend and backend development" },
      { id: "sql", name: "SQL", category: "languages", level: 0.85, description: "SQL for database querying and management" }
    ];
    
    // Define connections between skills
    const connections = [
      { source: "ai", target: "python", strength: 0.9 },
      { source: "ai", target: "tensorflow", strength: 0.9 },
      { source: "ai", target: "pytorch", strength: 0.9 },
      { source: "ai", target: "mlops", strength: 0.8 },
      { source: "ai", target: "nlp", strength: 0.8 },
      { source: "ai", target: "cv", strength: 0.8 },
      { source: "python", target: "tensorflow", strength: 0.9 },
      { source: "python", target: "pytorch", strength: 0.9 },
      { source: "mlops", target: "docker", strength: 0.8 },
      { source: "mlops", target: "kubernetes", strength: 0.8 },
      { source: "mlops", target: "cicd", strength: 0.8 },
      { source: "docker", target: "kubernetes", strength: 0.9 },
      { source: "kubernetes", target: "cloud", strength: 0.8 },
      { source: "cicd", target: "cloud", strength: 0.7 },
      { source: "python", target: "nlp", strength: 0.8 },
      { source: "python", target: "cv", strength: 0.8 },
      { source: "js", target: "python", strength: 0.6 },
      { source: "js", target: "cicd", strength: 0.7 },
      { source: "sql", target: "python", strength: 0.7 },
      { source: "sql", target: "cloud", strength: 0.6 }
    ];
    
    // Calculate positions using a simple force-directed approach
    function calculatePositions() {
      // Initialize random positions
      skills.forEach(skill => {
        skill.x = Math.random() * container.clientWidth;
        skill.y = Math.random() * container.clientHeight;
        skill.vx = 0;
        skill.vy = 0;
      });
      
      // Run simulation steps
      const steps = 100;
      for (let step = 0; step < steps; step++) {
        // Apply repulsive forces between all nodes
        for (let i = 0; i < skills.length; i++) {
          for (let j = i + 1; j < skills.length; j++) {
            const skillA = skills[i];
            const skillB = skills[j];
            
            const dx = skillB.x - skillA.x;
            const dy = skillB.y - skillA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Avoid division by zero
            if (distance < 0.1) continue;
            
            // Repulsive force (inverse square law)
            const force = 5000 / (distance * distance);
            const fx = dx / distance * force;
            const fy = dy / distance * force;
            
            skillA.vx -= fx;
            skillA.vy -= fy;
            skillB.vx += fx;
            skillB.vy += fy;
          }
        }
        
        // Apply attractive forces along connections
        connections.forEach(conn => {
          const source = skills.find(s => s.id === conn.source);
          const target = skills.find(s => s.id === conn.target);
          
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Avoid division by zero
            if (distance < 0.1) return;
            
            // Attractive force (directly proportional to distance)
            const force = distance * 0.05 * conn.strength;
            const fx = dx / distance * force;
            const fy = dy / distance * force;
            
            source.vx += fx;
            source.vy += fy;
            target.vx -= fx;
            target.vy -= fy;
          }
        });
        
        // Apply central force to keep nodes in center
        skills.forEach(skill => {
          const dx = container.clientWidth / 2 - skill.x;
          const dy = container.clientHeight / 2 - skill.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const centerForce = distance * 0.01;
            skill.vx += dx / distance * centerForce;
            skill.vy += dy / distance * centerForce;
          }
          
          // Apply velocity with damping
          skill.x += skill.vx * 0.8;
          skill.y += skill.vy * 0.8;
          skill.vx *= 0.9;
          skill.vy *= 0.9;
          
          // Keep within bounds
          const padding = 50;
          skill.x = Math.max(padding, Math.min(container.clientWidth - padding, skill.x));
          skill.y = Math.max(padding, Math.min(container.clientHeight - padding, skill.y));
        });
      }
    }
    
    // Calculate initial positions
    calculatePositions();
    
    // Draw connections
    connections.forEach(conn => {
      const source = skills.find(s => s.id === conn.source);
      const target = skills.find(s => s.id === conn.target);
      
      if (source && target) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", source.x);
        line.setAttribute("y1", source.y);
        line.setAttribute("x2", target.x);
        line.setAttribute("y2", target.y);
        line.setAttribute("stroke", document.body.classList.contains('light-mode') ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)');
        line.setAttribute("stroke-width", conn.strength * 3);
        line.setAttribute("data-source", source.id);
        line.setAttribute("data-target", target.id);
        linksGroup.appendChild(line);
        
        // Store reference to the DOM element
        conn.element = line;
      }
    });
    
    // Draw nodes
    skills.forEach(skill => {
      // Create group for node
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${skill.x}, ${skill.y})`);
      group.setAttribute("data-id", skill.id);
      nodesGroup.appendChild(group);
      
      // Calculate radius based on skill level
      const radius = 20 + skill.level * 20;
      
      // Create node circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", radius);
      circle.setAttribute("fill", categories[skill.category].color);
      circle.setAttribute("stroke", document.body.classList.contains('light-mode') ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)');
      circle.setAttribute("stroke-width", "2");
      group.appendChild(circle);
      
      // Create text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", "0.3em");
      text.setAttribute("fill", document.body.classList.contains('light-mode') ? 'black' : 'white');
      text.setAttribute("font-size", "12px");
      text.textContent = skill.name;
      group.appendChild(text);
      
      // Store reference to DOM elements
      skill.element = group;
      skill.circle = circle;
      skill.text = text;
      skill.radius = radius;
      
      // Add hover effect
      group.addEventListener('mouseenter', () => {
        // Highlight node
        circle.setAttribute("stroke-width", "4");
        
        // Highlight connections
        connections.forEach(conn => {
          if (conn.source === skill.id || conn.target === skill.id) {
            conn.element.setAttribute("stroke", document.body.classList.contains('light-mode') ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)');
            conn.element.setAttribute("stroke-width", conn.strength * 5);
          }
        });
        
        // Show tooltip
        tooltip.innerHTML = `
          <h3 style="margin: 0 0 8px; font-size: 16px; color: ${categories[skill.category].color}">${skill.name}</h3>
          <div style="margin-bottom: 8px;">
            <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: ${skill.level * 100}%; background: ${categories[skill.category].color};"></div>
            </div>
            <div style="font-size: 12px; margin-top: 4px;">${Math.round(skill.level * 100)}% Proficiency</div>
          </div>
          <p style="margin: 0; font-size: 14px;">${skill.description}</p>
          <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">Category: ${categories[skill.category].name}</div>
        `;
        
        tooltip.style.display = 'block';
        
        // Position tooltip
        const rect = container.getBoundingClientRect();
        const x = skill.x;
        const y = skill.y;
        
        if (x > rect.width / 2) {
          tooltip.style.right = `${rect.width - x + 20}px`;
          tooltip.style.left = 'auto';
        } else {
          tooltip.style.left = `${x + 20}px`;
          tooltip.style.right = 'auto';
        }
        
        if (y > rect.height / 2) {
          tooltip.style.bottom = `${rect.height - y + 20}px`;
          tooltip.style.top = 'auto';
        } else {
          tooltip.style.top = `${y + 20}px`;
          tooltip.style.bottom = 'auto';
        }
      });
      
      group.addEventListener('mouseleave', () => {
        // Reset node
        circle.setAttribute("stroke-width", "2");
        
        // Reset connections
        connections.forEach(conn => {
          conn.element.setAttribute("stroke", document.body.classList.contains('light-mode') ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)');
          conn.element.setAttribute("stroke-width", conn.strength * 3);
        });
        
        // Hide tooltip
        tooltip.style.display = 'none';
      });
    });
    
    // Add gentle pulsing animation to nodes
    function animateNodes() {
      skills.forEach((skill, index) => {
        const time = Date.now() / 1000;
        const scale = 1 + Math.sin(time + index * 0.5) * 0.05;
        skill.element.setAttribute("transform", `translate(${skill.x}, ${skill.y}) scale(${scale})`);
      });
      
      requestAnimationFrame(animateNodes);
    }
    
    // Start animation
    animateNodes();
    
    // Add legend
    const legend = document.createElement('div');
    legend.style.position = 'absolute';
    legend.style.bottom = '10px';
    legend.style.right = '10px';
    legend.style.backgroundColor = document.body.classList.contains('light-mode') ? 'rgba(231, 226, 219, 0.9)' : 'rgba(26, 26, 41, 0.9)';
    legend.style.padding = '10px';
    legend.style.borderRadius = '5px';
    legend.style.fontFamily = 'fira code, monospace';
    legend.style.fontSize = '12px';
    
    let legendHTML = '<div style="font-weight: bold; margin-bottom: 5px;">Skill Categories</div>';
    
    for (const [id, category] of Object.entries(categories)) {
      legendHTML += `
        <div style="display: flex; align-items: center; margin-bottom: 3px;">
          <div style="width: 12px; height: 12px; background-color: ${category.color}; border-radius: 50%; margin-right: 5px;"></div>
          <div>${category.name}</div>
        </div>
      `;
    }
    
    legend.innerHTML = legendHTML;
    container.appendChild(legend);
    
    console.log('Enhanced network visualization created');
  });