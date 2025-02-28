// simplified-neural-network.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if the container exists
    const container = document.getElementById('neural-network-container');
    if (!container) {
      console.error('Neural network container not found');
      return;
    }
    
    // Basic skill data
    const skills = [
      { id: "ai", name: "AI & ML", x: 200, y: 200, radius: 40 },
      { id: "python", name: "Python", x: 350, y: 150, radius: 35 },
      { id: "devops", name: "DevOps", x: 300, y: 300, radius: 35 },
      { id: "cloud", name: "Cloud", x: 450, y: 250, radius: 30 }
    ];
    
    const links = [
      { source: "ai", target: "python" },
      { source: "ai", target: "devops" },
      { source: "python", target: "devops" },
      { source: "devops", target: "cloud" }
    ];
    
    // Set container dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.style.background = "transparent";
    container.appendChild(svg);
    
    // Create background rectangle for debugging
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", width);
    bg.setAttribute("height", height);
    bg.setAttribute("fill", "rgba(30, 30, 40, 0.5)");
    svg.appendChild(bg);
    
    // Create links
    const linksGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(linksGroup);
    
    links.forEach(link => {
      const source = skills.find(s => s.id === link.source);
      const target = skills.find(s => s.id === link.target);
      
      if (source && target) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", source.x);
        line.setAttribute("y1", source.y);
        line.setAttribute("x2", target.x);
        line.setAttribute("y2", target.y);
        line.setAttribute("stroke", "#6bc5f8");
        line.setAttribute("stroke-width", 2);
        line.setAttribute("stroke-opacity", 0.6);
        linksGroup.appendChild(line);
      }
    });
    
    // Create nodes
    const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(nodesGroup);
    
    skills.forEach(skill => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${skill.x}, ${skill.y})`);
      nodesGroup.appendChild(group);
      
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", skill.radius);
      circle.setAttribute("fill", "#8000ff");
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", 2);
      group.appendChild(circle);
      
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", "0.3em");
      text.setAttribute("fill", "#ffffff");
      text.setAttribute("font-size", "14px");
      text.textContent = skill.name;
      group.appendChild(text);
    });
    
    // Add a message to show the visualization is loaded
    const notification = document.createElement('div');
    notification.style.position = 'absolute';
    notification.style.bottom = '10px';
    notification.style.right = '10px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.fontSize = '14px';
    notification.textContent = 'Neural network visualization loaded';
    container.appendChild(notification);
    
    // Auto-hide the notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 1s ease';
      setTimeout(() => notification.remove(), 1000);
    }, 3000);
  });