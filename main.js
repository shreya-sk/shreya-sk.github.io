var audio=document.getElementById("audioPlayer"),loader=document.getElementById("preloader");function settingtoggle(){document.getElementById("setting-container").classList.toggle("settingactivate"),document.getElementById("visualmodetogglebuttoncontainer").classList.toggle("visualmodeshow"),document.getElementById("soundtogglebuttoncontainer").classList.toggle("soundmodeshow")}function playpause(){!1==document.getElementById("switchforsound").checked?audio.pause():audio.play()}function visualmode(){document.body.classList.toggle("light-mode"),document.querySelectorAll(".needtobeinvert").forEach(function(e){e.classList.toggle("invertapplied")})}window.addEventListener("load",function(){loader.style.display="none",document.querySelector(".hey").classList.add("popup")});let emptyArea=document.getElementById("emptyarea"),mobileTogglemenu=document.getElementById("mobiletogglemenu");function hamburgerMenu(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.toggle("show-toggle-menu"),document.getElementById("burger-bar1").classList.toggle("hamburger-animation1"),document.getElementById("burger-bar2").classList.toggle("hamburger-animation2"),document.getElementById("burger-bar3").classList.toggle("hamburger-animation3")}function hidemenubyli(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.remove("show-toggle-menu"),document.getElementById("burger-bar1").classList.remove("hamburger-animation1"),document.getElementById("burger-bar2").classList.remove("hamburger-animation2"),document.getElementById("burger-bar3").classList.remove("hamburger-animation3")}const sections=document.querySelectorAll("section"),navLi=document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li"),mobilenavLi=document.querySelectorAll(".mobiletogglemenu .mobile-navbar-tabs-ul li");window.addEventListener("scroll",()=>{let e="";sections.forEach(t=>{let o=t.offsetTop;t.clientHeight,pageYOffset>=o-200&&(e=t.getAttribute("id"))}),mobilenavLi.forEach(t=>{t.classList.remove("activeThismobiletab"),t.classList.contains(e)&&t.classList.add("activeThismobiletab")}),navLi.forEach(t=>{t.classList.remove("activeThistab"),t.classList.contains(e)&&t.classList.add("activeThistab")})}),console.log("%c Designed and Developed by Vinod Jangid ","background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;");let mybutton=document.getElementById("backtotopbutton");function scrollFunction(){document.body.scrollTop>400||document.documentElement.scrollTop>400?mybutton.style.display="block":mybutton.style.display="none"}function scrolltoTopfunction(){document.body.scrollTop=0,document.documentElement.scrollTop=0}window.onscroll=function(){scrollFunction()},document.addEventListener("contextmenu",function(e){"IMG"===e.target.nodeName&&e.preventDefault()},!1);let Pupils=document.getElementsByClassName("footer-pupil"),pupilsArr=Array.from(Pupils),pupilStartPoint=-10,pupilRangeX=20,pupilRangeY=15,mouseXStartPoint=0,mouseXEndPoint=window.innerWidth,currentXPosition=0,fracXValue=0,mouseYEndPoint=window.innerHeight,currentYPosition=0,fracYValue=0,mouseXRange=mouseXEndPoint-mouseXStartPoint;const mouseMove=e=>{fracXValue=(currentXPosition=e.clientX-mouseXStartPoint)/mouseXRange,fracYValue=(currentYPosition=e.clientY)/mouseYEndPoint;let t=pupilStartPoint+fracXValue*pupilRangeX,o=pupilStartPoint+fracYValue*pupilRangeY;pupilsArr.forEach(e=>{e.style.transform=`translate(${t}px, ${o}px)`})},windowResize=e=>{mouseXEndPoint=window.innerWidth,mouseYEndPoint=window.innerHeight,mouseXRange=mouseXEndPoint-mouseXStartPoint};window.addEventListener("mousemove",mouseMove),window.addEventListener("resize",windowResize);
// Project carousel functionality
// Explicitly define these in the global window object
// Project carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all projects
    const projects = document.querySelectorAll('.project-box');
    const totalProjects = projects.length;
    let currentProject = 0;
    
    // Get navigation elements
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');
    const counter = document.getElementById('project-counter');
    const prevPreview = document.getElementById('prev-preview');
    const nextPreview = document.getElementById('next-preview');
    
    // Function to create preview of a project
    function createPreview(projectIndex) {
      const project = projects[projectIndex];
      if (!project) return '';
      
      // Create a preview by cloning the image
      const imageDiv = project.querySelector('.image-div');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          return img.cloneNode(true).outerHTML;
        }
      }
      return '';
    }
    
    // Update the previews
    function updatePreviews() {
      // Prev preview
      const prevIndex = (currentProject - 1 + totalProjects) % totalProjects;
      prevPreview.innerHTML = createPreview(prevIndex);
      
      // Next preview
      const nextIndex = (currentProject + 1) % totalProjects;
      nextPreview.innerHTML = createPreview(nextIndex);
    }
    
    // Update the counter display
    function updateCounter() {
      if (counter) {
        counter.textContent = `${currentProject + 1}/${totalProjects}`;
      }
    }
    
    // Show a specific project
// Show a specific project
function showProject(index) {
    // Hide all projects
    projects.forEach(project => {
      project.style.display = 'none';
      project.classList.remove('active-project'); // Remove any active class
    });
    
    // Show the selected project
    projects[index].style.display = 'flex';
    projects[index].classList.add('active-project'); // Add active class
    projects[index].classList.add('jelly-animation');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      projects[index].classList.remove('jelly-animation');
    }, 1000);
    
    // Update counter and previews
    updateCounter();
    updatePreviews();
    
    // Debug
    console.log(`Showing project ${index + 1} of ${totalProjects}`);
  }
    
    // Next project function
    function goToNextProject() {
      currentProject = (currentProject + 1) % totalProjects;
      showProject(currentProject);
    }
    
    // Previous project function
    function goToPrevProject() {
      currentProject = (currentProject - 1 + totalProjects) % totalProjects;
      showProject(currentProject);
    }
    
    // Add event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        goToNextProject();
        this.classList.add('jelly-animation');
        setTimeout(() => this.classList.remove('jelly-animation'), 700);
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        goToPrevProject();
        this.classList.add('jelly-animation');
        setTimeout(() => this.classList.remove('jelly-animation'), 700);
      });
    }
    
    // Initialize the first project
    showProject(currentProject);
  });