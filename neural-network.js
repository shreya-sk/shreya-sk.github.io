// neural-network.js
// This file contains the improved neural network visualization for skills

// Hierarchical skills data with nested relationships
const skillsData = {
    nodes: [
      // Main categories as parent nodes
      { id: "ai", name: "AI & ML", level: 0.95, category: "core", parent: null, expanded: true },
      { id: "devops", name: "DevOps", level: 0.9, category: "core", parent: null, expanded: true },
      { id: "languages", name: "Languages", level: 0.9, category: "core", parent: null, expanded: true },
      { id: "frameworks", name: "Frameworks", level: 0.85, category: "core", parent: null, expanded: true },
      
      // AI & ML sub-skills
      { id: "ml", name: "Machine Learning", level: 0.9, category: "ai", parent: "ai", expanded: false },
      { id: "dl", name: "Deep Learning", level: 0.85, category: "ai", parent: "ai", expanded: false },
      { id: "nlp", name: "NLP", level: 0.8, category: "ai", parent: "ai", expanded: false },
      { id: "cv", name: "Computer Vision", level: 0.75, category: "ai", parent: "ai", expanded: false },
      { id: "rl", name: "Reinforcement Learning", level: 0.7, category: "ai", parent: "ai", expanded: false },
      
      // ML/DL libraries (initially hidden)
      { id: "pytorch", name: "PyTorch", level: 0.85, category: "frameworks", parent: "dl", expanded: false, visible: false },
      { id: "tensorflow", name: "TensorFlow", level: 0.9, category: "frameworks", parent: "dl", expanded: false, visible: false },
      { id: "keras", name: "Keras", level: 0.85, category: "frameworks", parent: "dl", expanded: false, visible: false },
      { id: "sklearn", name: "Scikit-learn", level: 0.95, category: "frameworks", parent: "ml", expanded: false, visible: false },
      { id: "spacy", name: "SpaCy", level: 0.8, category: "frameworks", parent: "nlp", expanded: false, visible: false },
      { id: "nltk", name: "NLTK", level: 0.75, category: "frameworks", parent: "nlp", expanded: false, visible: false },
      { id: "opencv", name: "OpenCV", level: 0.8, category: "frameworks", parent: "cv", expanded: false, visible: false },
      
      // DevOps sub-skills
      { id: "cicd", name: "CI/CD", level: 0.9, category: "devops", parent: "devops", expanded: false },
      { id: "containers", name: "Containers", level: 0.95, category: "devops", parent: "devops", expanded: false },
      { id: "iac", name: "Infrastructure as Code", level: 0.85, category: "devops", parent: "devops", expanded: false },
      { id: "cloud", name: "Cloud Services", level: 0.9, category: "devops", parent: "devops", expanded: false },
      { id: "monitoring", name: "Monitoring", level: 0.8, category: "devops", parent: "devops", expanded: false },
      
      // DevOps tools (initially hidden)
      { id: "docker", name: "Docker", level: 0.95, category: "devops", parent: "containers", expanded: false, visible: false },
      { id: "k8s", name: "Kubernetes", level: 0.9, category: "devops", parent: "containers", expanded: false, visible: false },
      { id: "terraform", name: "Terraform", level: 0.85, category: "devops", parent: "iac", expanded: false, visible: false },
      { id: "ansible", name: "Ansible", level: 0.8, category: "devops", parent: "iac", expanded: false, visible: false },
      { id: "jenkins", name: "Jenkins", level: 0.9, category: "devops", parent: "cicd", expanded: false, visible: false },
      { id: "github", name: "GitHub Actions", level: 0.95, category: "devops", parent: "cicd", expanded: false, visible: false },
      { id: "aws", name: "AWS", level: 0.85, category: "devops", parent: "cloud", expanded: false, visible: false },
      { id: "gcp", name: "GCP", level: 0.8, category: "devops", parent: "cloud", expanded: false, visible: false },
      { id: "prometheus", name: "Prometheus", level: 0.85, category: "devops", parent: "monitoring", expanded: false, visible: false },
      { id: "grafana", name: "Grafana", level: 0.8, category: "devops", parent: "monitoring", expanded: false, visible: false },
      
      // Programming languages
      { id: "python", name: "Python", level: 0.95, category: "languages", parent: "languages", expanded: false },
      { id: "js", name: "JavaScript", level: 0.85, category: "languages", parent: "languages", expanded: false },
      { id: "golang", name: "Go", level: 0.8, category: "languages", parent: "languages", expanded: false },
      { id: "java", name: "Java", level: 0.75, category: "languages", parent: "languages", expanded: false },
      { id: "bash", name: "Bash/Shell", level: 0.85, category: "languages", parent: "languages", expanded: false },
      
      // Python libraries (initially hidden)
      { id: "numpy", name: "NumPy", level: 0.95, category: "frameworks", parent: "python", expanded: false, visible: false },
      { id: "pandas", name: "Pandas", level: 0.95, category: "frameworks", parent: "python", expanded: false, visible: false },
      { id: "matplotlib", name: "Matplotlib", level: 0.9, category: "frameworks", parent: "python", expanded: false, visible: false },
      { id: "scipy", name: "SciPy", level: 0.85, category: "frameworks", parent: "python", expanded: false, visible: false },
      
      // JS frameworks (initially hidden)
      { id: "react", name: "React", level: 0.85, category: "frameworks", parent: "js", expanded: false, visible: false },
      { id: "node", name: "Node.js", level: 0.8, category: "frameworks", parent: "js", expanded: false, visible: false },
      
      // Frameworks/Tools
      { id: "webdev", name: "Web Development", level: 0.8, category: "frameworks", parent: "frameworks", expanded: false },
      { id: "datavis", name: "Data Visualization", level: 0.85, category: "frameworks", parent: "frameworks", expanded: false },
      { id: "databases", name: "Databases", level: 0.8, category: "frameworks", parent: "frameworks", expanded: false },
      
      // Web frameworks (initially hidden)
      { id: "flask", name: "Flask", level: 0.9, category: "frameworks", parent: "webdev", expanded: false, visible: false },
      { id: "django", name: "Django", level: 0.8, category: "frameworks", parent: "webdev", expanded: false, visible: false },
      
      // Visualization tools (initially hidden)
      { id: "d3", name: "D3.js", level: 0.75, category: "frameworks", parent: "datavis", expanded: false, visible: false },
      { id: "plotly", name: "Plotly", level: 0.85, category: "frameworks", parent: "datavis", expanded: false, visible: false },
      { id: "tableau", name: "Tableau", level: 0.7, category: "frameworks", parent: "datavis", expanded: false, visible: false },
      
      // Databases (initially hidden)
      { id: "sql", name: "SQL", level: 0.9, category: "frameworks", parent: "databases", expanded: false, visible: false },
      { id: "mongodb", name: "MongoDB", level: 0.8, category: "frameworks", parent: "databases", expanded: false, visible: false },
      { id: "redis", name: "Redis", level: 0.75, category: "frameworks", parent: "databases", expanded: false, visible: false }
    ],
    
    // Generate links between nodes based on parent-child relationships
    generateLinks: function() {
      // Start with core category links
      let links = [
        { source: "ai", target: "devops", strength: 0.7 },
        { source: "ai", target: "languages", strength: 0.8 },
        { source: "ai", target: "frameworks", strength: 0.7 },
        { source: "devops", target: "languages", strength: 0.6 },
        { source: "devops", target: "frameworks", strength: 0.6 },
        { source: "languages", target: "frameworks", strength: 0.8 }
      ];
      
      // Add links based on parent-child relationships 
      this.nodes.forEach(node => {
        if (node.parent && node.parent !== null) {
          // Only add links for visible nodes
          if (!node.hasOwnProperty('visible') || node.visible) {
            links.push({
              source: node.parent,
              target: node.id,
              strength: 0.8,
              isParentChild: true
            });
          }
        }
      });
      
      // Add some cross-category connections for visible nodes
      const visibleNodeIds = this.nodes
        .filter(n => !n.hasOwnProperty('visible') || n.visible)
        .map(n => n.id);
        
      const additionalLinks = [
        { source: "python", target: "ml", strength: 0.9 },
        { source: "python", target: "dl", strength: 0.9 },
        { source: "js", target: "webdev", strength: 0.9 },
        { source: "cicd", target: "github", strength: 0.8 },
        { source: "containers", target: "cicd", strength: 0.7 },
        { source: "ml", target: "dl", strength: 0.85 },
        { source: "dl", target: "nlp", strength: 0.7 },
        { source: "dl", target: "cv", strength: 0.7 }
      ].filter(link => 
        visibleNodeIds.includes(link.source) && 
        visibleNodeIds.includes(link.target)
      );
      
      return links.concat(additionalLinks);
    }
  };
  
  // Colors for different skill categories
  const categoryColors = {
    core: "#8000ff", // Purple from the original theme
    languages: "#6bc5f8", // Light blue from the original theme
    frameworks: "#cf59e6", // Light purple from the original theme
    ai: "#71cbff", // Modified light blue
    devops: "#FF8A65" // Orange-ish for DevOps
  };
  
  // Initialize the neural network visualization
  function initNeuralNetwork() {
    console.log("Initializing neural network visualization...");
    
    // Get the container element
    const container = document.getElementById('neural-network-container');
    if (!container) {
      console.error("Neural network container not found");
      return;
    }
    
    // Set width and height based on container
    const width = container.clientWidth;
    const height = container.clientHeight || 600;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create zoom container
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'zoom-container';
    container.appendChild(zoomContainer);
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.className = 'network-instructions';
    instructions.innerHTML = `
      <div class="instruction-item">
        <div class="instruction-icon">🔍</div>
        <div class="instruction-text">Scroll to zoom in/out</div>
      </div>
      <div class="instruction-item">
        <div class="instruction-icon">👆</div>
        <div class="instruction-text">Click a node to expand skills</div>
      </div>
      <div class="instruction-item">
        <div class="instruction-icon">✋</div>
        <div class="instruction-text">Drag to pan around</div>
      </div>
    `;
    container.appendChild(instructions);
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("class", "neural-network-svg");
    zoomContainer.appendChild(svg);
    
    // Create main group that will be transformed for zoom
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "zoom-group");
    svg.appendChild(g);
    
    // Create definitions for gradients and markers
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);
    
    // Create a linear gradient for links
    const linkGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linkGradient.setAttribute("id", "linkGradient");
    linkGradient.setAttribute("gradientUnits", "userSpaceOnUse");
    
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#8000ff");
    stop1.setAttribute("stop-opacity", "0.5");
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#6bc5f8");
    stop2.setAttribute("stop-opacity", "0.5");
    
    linkGradient.appendChild(stop1);
    linkGradient.appendChild(stop2);
    defs.appendChild(linkGradient);
    
    // Create groups for links and nodes inside the zoom group
    const linksGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    linksGroup.setAttribute("class", "links");
    g.appendChild(linksGroup);
    
    const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    nodesGroup.setAttribute("class", "nodes");
    g.appendChild(nodesGroup);
    
    // Create loading indicator
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "network-loading";
    loadingIndicator.textContent = "Organizing neural network...";
    container.appendChild(loadingIndicator);
    
    // Filter nodes to show only visible ones
    let visibleNodes = skillsData.nodes.filter(node => !node.hasOwnProperty('visible') || node.visible);
    let visibleLinks = skillsData.generateLinks();
    
    // Ensure all nodes have initial positions
    visibleNodes.forEach(node => {
      if (!node.hasOwnProperty('x') || !node.hasOwnProperty('y')) {
        // Assign initial position based on category
        const angle = Math.random() * 2 * Math.PI;
        const radius = 150 + Math.random() * 100;
        node.x = width / 2 + radius * Math.cos(angle);
        node.y = height / 2 + radius * Math.sin(angle);
      }
    });
    
    // Create D3 force simulation
    let simulation = createSimulation(visibleNodes, visibleLinks, width, height);
    
    // Create links
    let links = createLinks(visibleLinks, linksGroup);
    
    // Create nodes
    let nodes = createNodes(visibleNodes, nodesGroup, width, height);
    
    // Apply zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.setAttribute("transform", event.transform.toString());
      });
    
    d3.select(svg).call(zoom);
    
    // Center and scale initially
    d3.select(svg).call(
      zoom.transform, 
      d3.zoomIdentity.translate(width/2, height/2).scale(0.8).translate(-width/2, -height/2)
    );
    
    // Handle node expansion/collapsing
    function toggleNodeExpansion(nodeId) {
      // Find the node
      const node = skillsData.nodes.find(n => n.id === nodeId);
      if (!node) return;
      
      // Toggle the expanded state
      node.expanded = !node.expanded;
      
      // If expanded, show children. If collapsed, hide children.
      skillsData.nodes.forEach(n => {
        if (n.parent === nodeId) {
          n.visible = node.expanded;
          
          // If this child was expanded and is now hidden, collapse it too
          if (!n.visible && n.expanded) {
            n.expanded = false;
            collapseChildren(n.id);
          }
        }
      });
      
      // Recursively collapse children of a collapsed node
      function collapseChildren(parentId) {
        skillsData.nodes.forEach(n => {
          if (n.parent === parentId) {
            n.visible = false;
            if (n.expanded) {
              n.expanded = false;
              collapseChildren(n.id);
            }
          }
        });
      }
      
      // Update visualization
      updateVisualization();
    }
    
    // Update the visualization with current visible nodes
    function updateVisualization() {
      // Update visible nodes and links
      visibleNodes = skillsData.nodes.filter(node => !node.hasOwnProperty('visible') || node.visible);
      visibleLinks = skillsData.generateLinks();
      
      // Clean up existing elements
      linksGroup.innerHTML = '';
      nodesGroup.innerHTML = '';
      
      // Create new simulation
      simulation = createSimulation(visibleNodes, visibleLinks, width, height);
      
      // Create new links and nodes
      links = createLinks(visibleLinks, linksGroup);
      nodes = createNodes(visibleNodes, nodesGroup, width, height);
      
      // Show loading during transition
      loadingIndicator.style.display = "block";
      loadingIndicator.textContent = "Updating neural network...";
      
      // Run several simulation ticks before rendering
      for (let i = 0; i < 100; i++) {
        simulation.tick();
      }
      
      // Update positions after initial ticks
      updatePositions();
      
      // Start animation
      simulation.on("tick", updatePositions);
      
      function updatePositions() {
        // Update link positions
        links.forEach(link => {
          link.element.setAttribute("x1", link.source.x);
          link.element.setAttribute("y1", link.source.y);
          link.element.setAttribute("x2", link.target.x);
          link.element.setAttribute("y2", link.target.y);
        });
        
        // Update node positions
        nodes.forEach(node => {
          // Keep nodes within reasonable bounds
          node.x = Math.max(50, Math.min(width - 50, node.x));
          node.y = Math.max(50, Math.min(height - 50, node.y));
          
          node.element.setAttribute("transform", `translate(${node.x}, ${node.y})`);
        });
        
        // Hide loading indicator after positions are updated
        loadingIndicator.style.display = "none";
      }
    }
    
    // Create force simulation
    function createSimulation(nodes, links, width, height) {
      return d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
          .id(d => d.id)
          .distance(d => d.isParentChild ? 70 : 120)
          .strength(d => d.isParentChild ? 0.5 : 0.2))
        .force("charge", d3.forceManyBody()
          .strength(d => -500 - d.level * 500))
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide(d => 30 + d.level * 20).strength(0.7).iterations(2))
        .alpha(1)
        .alphaDecay(0.01);
    }
    
    // Create links between nodes
    function createLinks(linkData, container) {
      return linkData.map(link => {
        const element = document.createElementNS("http://www.w3.org/2000/svg", "line");
        element.setAttribute("class", "link");
        element.setAttribute("stroke", "url(#linkGradient)");
        element.setAttribute("stroke-width", link.strength * 2);
        element.setAttribute("stroke-opacity", link.isParentChild ? "0.8" : "0.5");
        element.setAttribute("data-source", typeof link.source === 'object' ? link.source.id : link.source);
        element.setAttribute("data-target", typeof link.target === 'object' ? link.target.id : link.target);
        container.appendChild(element);
        return { ...link, element };
      });
    }
    
    // Create node elements
    function createNodes(nodeData, container, width, height) {
      return nodeData.map(node => {
        // Node group
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", "node");
        group.setAttribute("data-id", node.id);
        group.setAttribute("data-expanded", node.expanded);
        
        // Initial position
        const x = node.x || (width / 2 + (Math.random() - 0.5) * 200);
        const y = node.y || (height / 2 + (Math.random() - 0.5) * 200);
        group.setAttribute("transform", `translate(${x}, ${y})`);
        container.appendChild(group);
        
        // Node circle
        const radius = 15 + (node.level || 0.5) * 15;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", categoryColors[node.category] || "#8000ff");
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("opacity", "0.85");
        group.appendChild(circle);
        
        // If node has children, add expansion indicator
        const hasChildren = skillsData.nodes.some(n => n.parent === node.id);
        if (hasChildren) {
          // Expansion indicator
          const indicator = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          indicator.setAttribute("class", "expand-indicator");
          indicator.setAttribute("r", "10");
          indicator.setAttribute("cy", radius - 5);
          indicator.setAttribute("cx", radius - 5);
          indicator.setAttribute("fill", "#ffffff");
          indicator.setAttribute("stroke", categoryColors[node.category] || "#8000ff");
          indicator.setAttribute("stroke-width", "1.5");
          group.appendChild(indicator);
          
          // Plus or minus sign
          const symbol = document.createElementNS("http://www.w3.org/2000/svg", "text");
          symbol.setAttribute("class", "expand-symbol");
          symbol.setAttribute("y", radius - 2);
          symbol.setAttribute("x", radius - 5);
          symbol.setAttribute("text-anchor", "middle");
          symbol.setAttribute("font-size", "14px");
          symbol.setAttribute("fill", categoryColors[node.category] || "#8000ff");
          symbol.setAttribute("font-weight", "bold");
          symbol.textContent = node.expanded ? "−" : "+";
          group.appendChild(symbol);
        }
        
        // Node text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dy", "0.3em");
        text.setAttribute("fill", "#ffffff");
        text.setAttribute("font-size", "12px");
        text.setAttribute("class", "node-text");
        text.textContent = node.name;
        group.appendChild(text);
        
        // Event handling
        group.addEventListener("mouseenter", () => {
          highlightNode(node.id, true);
          showTooltip(node);
        });
        
        group.addEventListener("mouseleave", () => {
          highlightNode(node.id, false);
          hideTooltip();
        });
        
        group.addEventListener("click", (event) => {
          if (hasChildren) {
            toggleNodeExpansion(node.id);
            event.stopPropagation();
          }
        });
        
        // Make nodes draggable
        d3.select(group).call(
          d3.drag()
            .on("start", (event) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              node.fx = node.x;
              node.fy = node.y;
            })
            .on("drag", (event) => {
              node.fx = event.x;
              node.fy = event.y;
            })
            .on("end", (event) => {
              if (!event.active) simulation.alphaTarget(0);
              node.fx = null;
              node.fy = null;
            })
        );
        
        return { ...node, element: group, radius };
      });
    }
    
    // Highlight connected nodes and links
    function highlightNode(nodeId, isHighlighted) {
      // Find connected links
      const connectedLinks = links.filter(
        link => link.source.id === nodeId || link.target.id === nodeId
      );
      
      // Find connected nodes
      const connectedNodeIds = new Set();
      connectedLinks.forEach(link => {
        connectedNodeIds.add(link.source.id);
        connectedNodeIds.add(link.target.id);
      });
      
      // Highlight the links
      links.forEach(link => {
        const isConnected = link.source.id === nodeId || link.target.id === nodeId;
        link.element.setAttribute("stroke-opacity", isConnected && isHighlighted ? "0.9" : "0.5");
        link.element.setAttribute("stroke-width", isConnected && isHighlighted ? link.strength * 4 : link.strength * 2);
      });
      
      // Highlight the nodes
      nodes.forEach(node => {
        const isConnected = connectedNodeIds.has(node.id);
        const circle = node.element.querySelector("circle");
        
        if (node.id === nodeId) {
          // Current node
          circle.setAttribute("stroke-width", isHighlighted ? "3" : "2");
          circle.setAttribute("opacity", isHighlighted ? "1" : "0.85");
        } else if (isConnected) {
          // Connected node
          circle.setAttribute("opacity", isHighlighted ? "0.95" : "0.85");
        } else {
          // Non-connected node
          circle.setAttribute("opacity", isHighlighted ? "0.4" : "0.85");
        }
      });
    }
    
    // Create tooltip
    const tooltip = document.createElement("div");
    tooltip.className = "skill-tooltip";
    tooltip.style.display = "none";
    container.appendChild(tooltip);
    
    function showTooltip(node) {
      // Find immediate children
      const children = skillsData.nodes.filter(n => n.parent === node.id);
      
      // Find related nodes (connected but not children)
      const connectedNodes = links
        .filter(link => 
          (link.source.id === node.id || link.target.id === node.id) &&
          !link.isParentChild
        )
        .map(link => 
          link.source.id === node.id ? link.target : link.source
        );
      
      // Build tooltip content
      let content = `
        <h3>${node.name}</h3>
        <div class="skill-level">
          <div class="level-bar">
            <div class="level-fill" style="width: ${node.level * 100}%"></div>
          </div>
          <span>${Math.round(node.level * 100)}%</span>
        </div>
      `;
      
      // Add related technologies if any
      if (connectedNodes.length > 0) {
        content += `<div class="related-skills">
          <h4>Related Technologies:</h4>
          <ul>
            ${connectedNodes.map(n => `<li>${n.name}</li>`).join('')}
          </ul>
        </div>`;
      }
      
      // Add children info if expanded
      if (node.expanded && children.length > 0) {
        content += `<div class="child-skills">
          <h4>Sub-skills:</h4>
          <ul>
            ${children.map(child => `<li>${child.name}</li>`).join('')}
          </ul>
        </div>`;
      }
      
      // Add expansion hint if has children
      if (children.length > 0 && !node.expanded) {
        content += `<div class="tooltip-hint">
          <span>Click to explore sub-skills</span>
        </div>`;
      }
      
      tooltip.innerHTML = content;
      tooltip.style.display = "block";
      
      // Position tooltip
      const bounds = container.getBoundingClientRect();
      const x = node.x;
      const y = node.y;
      
      // Position tooltip based on quadrant to avoid going off screen
      if (x > width / 2) {
        tooltip.style.left = "auto";
        tooltip.style.right = "20px";
      } else {
        tooltip.style.left = "20px";
        tooltip.style.right = "auto";
      }
      
      if (y > height / 2) {
        tooltip.style.top = "20px";
        tooltip.style.bottom = "auto";
      } else {
        tooltip.style.top = "auto";
        tooltip.style.bottom = "20px";
      }
    }
    
    function hideTooltip() {
      tooltip.style.display = "none";
    }
    
    // Run several simulation ticks before rendering
    console.log("Running initial simulation ticks...");
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }
    
    // Update initial positions
    links.forEach(link => {
      link.element.setAttribute("x1", link.source.x);
      link.element.setAttribute("y1", link.source.y);
      link.element.setAttribute("x2", link.target.x);
      link.element.setAttribute("y2", link.target.y);
    });
    
    nodes.forEach(node => {
      // Keep nodes within bounds
      node.x = Math.max(50, Math.min(width - 50, node.x));
      node.y = Math.max(50, Math.min(height - 50, node.y));
      
      node.element.setAttribute("transform", `translate(${node.x}, ${node.y})`);
    });
    
    // Hide loading indicator after initial positioning
    if (loadingIndicator && loadingIndicator.parentNode) {
      loadingIndicator.parentNode.removeChild(loadingIndicator);
    }
    
    // Start animation
    simulation.on("tick", () => {
      links.forEach(link => {
        link.element.setAttribute("x1", link.source.x);
        link.element.setAttribute("y1", link.source.y);
        link.element.setAttribute("x2", link.target.x);
        link.element.setAttribute("y2", link.target.y);
      });
      
      nodes.forEach(node => {
        // Keep nodes within bounds
        node.x = Math.max(50, Math.min(width - 50, node.x));
        node.y = Math.max(50, Math.min(height - 50, node.y));
        
        node.element.setAttribute("transform", `translate(${node.x}, ${node.y})`);
      });
    });
    }