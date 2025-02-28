// neural-network.js
// This file contains the neural network visualization for skills

// Skills data structure with proficiency levels and relationships
const skillsData = {
    nodes: [
      { id: "ai", name: "Artificial Intelligence", level: 0.9, category: "ai" },
      { id: "ml", name: "Machine Learning", level: 0.85, category: "ai" },
      { id: "dl", name: "Deep Learning", level: 0.8, category: "ai" },
      { id: "nlp", name: "NLP", level: 0.75, category: "ai" },
      { id: "cv", name: "Computer Vision", level: 0.7, category: "ai" },
      
      { id: "python", name: "Python", level: 0.95, category: "programming" },
      { id: "js", name: "JavaScript", level: 0.8, category: "programming" },
      { id: "golang", name: "Go", level: 0.7, category: "programming" },
      { id: "java", name: "Java", level: 0.6, category: "programming" },
      
      { id: "k8s", name: "Kubernetes", level: 0.85, category: "devops" },
      { id: "docker", name: "Docker", level: 0.9, category: "devops" },
      { id: "terraform", name: "Terraform", level: 0.8, category: "devops" },
      { id: "aws", name: "AWS", level: 0.75, category: "devops" },
      { id: "gcp", name: "GCP", level: 0.7, category: "devops" },
      { id: "cicd", name: "CI/CD", level: 0.85, category: "devops" },
      
      { id: "pytorch", name: "PyTorch", level: 0.8, category: "frameworks" },
      { id: "tensorflow", name: "TensorFlow", level: 0.85, category: "frameworks" },
      { id: "react", name: "React", level: 0.7, category: "frameworks" },
      { id: "flask", name: "Flask", level: 0.75, category: "frameworks" },
    ],
    
    // Define relationships between skills (connections in the neural network)
    links: [
      { source: "ai", target: "ml", strength: 0.9 },
      { source: "ai", target: "dl", strength: 0.8 },
      { source: "ml", target: "dl", strength: 0.9 },
      { source: "ml", target: "nlp", strength: 0.7 },
      { source: "ml", target: "cv", strength: 0.7 },
      { source: "dl", target: "nlp", strength: 0.8 },
      { source: "dl", target: "cv", strength: 0.8 },
      
      { source: "python", target: "ai", strength: 0.9 },
      { source: "python", target: "ml", strength: 0.9 },
      { source: "python", target: "dl", strength: 0.9 },
      { source: "python", target: "pytorch", strength: 0.9 },
      { source: "python", target: "tensorflow", strength: 0.9 },
      { source: "python", target: "flask", strength: 0.8 },
      
      { source: "js", target: "react", strength: 0.9 },
      
      { source: "k8s", target: "docker", strength: 0.9 },
      { source: "terraform", target: "aws", strength: 0.8 },
      { source: "terraform", target: "gcp", strength: 0.8 },
      { source: "k8s", target: "cicd", strength: 0.7 },
      
      { source: "tensorflow", target: "dl", strength: 0.9 },
      { source: "pytorch", target: "dl", strength: 0.9 },
    ]
  };
  
  // Colors for different skill categories
  const categoryColors = {
    ai: "#8000ff", // Purple from the original theme
    programming: "#6bc5f8", // Light blue from the original theme
    devops: "#cf59e6", // Light purple from the original theme
    frameworks: "#71cbff" // Modified light blue
  };
  
  // Initialize the neural network visualization
  function initNeuralNetwork() {
    // Get the container element
    const container = document.getElementById('neural-network-container');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Set dimensions based on container size
    const width = container.clientWidth;
    const height = 600; // Fixed height or adjust as needed
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("class", "neural-network-svg");
    container.appendChild(svg);
    
    // Create definitions for gradients
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
    
    // Create groups for links and nodes
    const linksGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    linksGroup.setAttribute("class", "links");
    svg.appendChild(linksGroup);
    
    const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    nodesGroup.setAttribute("class", "nodes");
    svg.appendChild(nodesGroup);
    
    // Initialize D3 force simulation
    const simulation = d3.forceSimulation(skillsData.nodes)
      .force("link", d3.forceLink(skillsData.links)
        .id(d => d.id)
        .distance(d => 150 - d.strength * 50)
        .strength(d => d.strength * 0.1))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(d => 20 + d.level * 30));
    
    // Create links
    const links = skillsData.links.map(link => {
      const element = document.createElementNS("http://www.w3.org/2000/svg", "line");
      element.setAttribute("class", "link");
      element.setAttribute("stroke", "url(#linkGradient)");
      element.setAttribute("stroke-width", link.strength * 3);
      element.setAttribute("stroke-opacity", "0.6");
      element.setAttribute("data-source", link.source);
      element.setAttribute("data-target", link.target);
      linksGroup.appendChild(element);
      return { ...link, element };
    });
    
    // Create nodes
    const nodes = skillsData.nodes.map(node => {
      // Node group
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", "node");
      group.setAttribute("data-id", node.id);
      group.setAttribute("transform", "translate(0,0)"); // Initial position
      nodesGroup.appendChild(group);
      
      // Node circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const radius = 15 + node.level * 25; // Size based on proficiency level
      circle.setAttribute("r", radius);
      circle.setAttribute("fill", categoryColors[node.category]);
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2");
      circle.setAttribute("opacity", "0.8");
      group.appendChild(circle);
      
      // Background for better text readability
      const textBg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      textBg.setAttribute("r", radius - 5);
      textBg.setAttribute("fill", "rgba(0, 0, 0, 0.7)");
      textBg.setAttribute("opacity", "0");
      textBg.setAttribute("class", "text-background");
      group.appendChild(textBg);
      
      // Node text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", "0.3em");
      text.setAttribute("fill", "#ffffff");
      text.setAttribute("font-size", "12px");
      text.setAttribute("opacity", "0");
      text.setAttribute("class", "node-text");
      text.textContent = node.name;
      group.appendChild(text);
      
      // Event listeners
      group.addEventListener("mouseenter", () => highlightConnections(node.id, true));
      group.addEventListener("mouseleave", () => highlightConnections(node.id, false));
      
      return { ...node, element: group, radius };
    });
    
    // Highlight connections for a node
    function highlightConnections(nodeId, isHighlighted) {
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
        link.element.setAttribute("stroke-opacity", isConnected && isHighlighted ? "0.9" : "0.3");
        link.element.setAttribute("stroke-width", isConnected && isHighlighted ? link.strength * 5 : link.strength * 2);
      });
      
      // Highlight the nodes
      nodes.forEach(node => {
        const isConnected = connectedNodeIds.has(node.id);
        const circle = node.element.querySelector("circle");
        const text = node.element.querySelector(".node-text");
        const textBg = node.element.querySelector(".text-background");
        
        if (node.id === nodeId) {
          // Current node
          circle.setAttribute("stroke-width", isHighlighted ? "3" : "2");
          circle.setAttribute("opacity", isHighlighted ? "1" : "0.8");
          // Show text for current node
          text.setAttribute("opacity", isHighlighted ? "1" : "0");
          textBg.setAttribute("opacity", isHighlighted ? "0.7" : "0");
        } else if (isConnected) {
          // Connected node
          circle.setAttribute("opacity", isHighlighted ? "0.9" : "0.7");
          // Hide text for non-selected nodes
          text.setAttribute("opacity", "0");
          textBg.setAttribute("opacity", "0");
        } else {
          // Non-connected node
          circle.setAttribute("opacity", isHighlighted ? "0.3" : "0.8");
          // Hide text for non-selected nodes
          text.setAttribute("opacity", "0");
          textBg.setAttribute("opacity", "0");
        }
      });
      
      // Show skill details in tooltip or info panel if needed
      const selectedNode = nodes.find(node => node.id === nodeId);
      if (selectedNode && isHighlighted) {
        updateSkillInfo(selectedNode);
      } else {
        clearSkillInfo();
      }
    }
    
    // Update simulation on tick
    simulation.on("tick", () => {
      links.forEach(link => {
        link.element.setAttribute("x1", link.source.x);
        link.element.setAttribute("y1", link.source.y);
        link.element.setAttribute("x2", link.target.x);
        link.element.setAttribute("y2", link.target.y);
      });
      
      nodes.forEach(node => {
        // Keep nodes within bounds
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
        
        node.element.setAttribute("transform", `translate(${node.x}, ${node.y})`);
      });
    });
    
    // Make nodes draggable
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Apply drag behavior to nodes
    nodesGroup.querySelectorAll(".node").forEach((nodeElement, i) => {
      d3.select(nodeElement).call(
        d3.drag()
          .on("start", event => dragstarted(event, nodes[i]))
          .on("drag", event => dragged(event, nodes[i]))
          .on("end", event => dragended(event, nodes[i]))
      );
    });
    
    // Create skill info panel
    const infoPanel = document.createElement("div");
    infoPanel.className = "skill-info-panel";
    infoPanel.style.display = "none";
    container.appendChild(infoPanel);
    
    function updateSkillInfo(node) {
      infoPanel.innerHTML = `
        <h3>${node.name}</h3>
        <div class="skill-level">
          <div class="level-bar">
            <div class="level-fill" style="width: ${node.level * 100}%"></div>
          </div>
          <span>${Math.round(node.level * 100)}%</span>
        </div>
        <p class="skill-category">Category: ${node.category.toUpperCase()}</p>
      `;
      infoPanel.style.display = "block";
    }
    
    function clearSkillInfo() {
      infoPanel.style.display = "none";
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener("DOMContentLoaded", function() {
    // Check if D3.js is loaded
    if (typeof d3 === 'undefined') {
      // Load D3.js dynamically if not already loaded
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
      script.onload = initNeuralNetwork;
      document.head.appendChild(script);
    } else {
      initNeuralNetwork();
    }
  });
  
  // Handle window resize
  window.addEventListener("resize", initNeuralNetwork);