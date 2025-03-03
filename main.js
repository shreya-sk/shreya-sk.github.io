var audio=document.getElementById("audioPlayer"),loader=document.getElementById("preloader");function settingtoggle(){document.getElementById("setting-container").classList.toggle("settingactivate"),document.getElementById("visualmodetogglebuttoncontainer").classList.toggle("visualmodeshow"),document.getElementById("soundtogglebuttoncontainer").classList.toggle("soundmodeshow")}function playpause(){!1==document.getElementById("switchforsound").checked?audio.pause():audio.play()}function visualmode(){document.body.classList.toggle("light-mode"),document.querySelectorAll(".needtobeinvert").forEach(function(e){e.classList.toggle("invertapplied")})}window.addEventListener("load",function(){loader.style.display="none",document.querySelector(".hey").classList.add("popup")});let emptyArea=document.getElementById("emptyarea"),mobileTogglemenu=document.getElementById("mobiletogglemenu");function hamburgerMenu(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.toggle("show-toggle-menu"),document.getElementById("burger-bar1").classList.toggle("hamburger-animation1"),document.getElementById("burger-bar2").classList.toggle("hamburger-animation2"),document.getElementById("burger-bar3").classList.toggle("hamburger-animation3")}function hidemenubyli(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.remove("show-toggle-menu"),document.getElementById("burger-bar1").classList.remove("hamburger-animation1"),document.getElementById("burger-bar2").classList.remove("hamburger-animation2"),document.getElementById("burger-bar3").classList.remove("hamburger-animation3")}const sections=document.querySelectorAll("section"),navLi=document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li"),mobilenavLi=document.querySelectorAll(".mobiletogglemenu .mobile-navbar-tabs-ul li");window.addEventListener("scroll",()=>{let e="";sections.forEach(t=>{let o=t.offsetTop;t.clientHeight,pageYOffset>=o-200&&(e=t.getAttribute("id"))}),mobilenavLi.forEach(t=>{t.classList.remove("activeThismobiletab"),t.classList.contains(e)&&t.classList.add("activeThismobiletab")}),navLi.forEach(t=>{t.classList.remove("activeThistab"),t.classList.contains(e)&&t.classList.add("activeThistab")})}),console.log("%c Designed and Developed by Vinod Jangid ","background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;");let mybutton=document.getElementById("backtotopbutton");function scrollFunction(){document.body.scrollTop>400||document.documentElement.scrollTop>400?mybutton.style.display="block":mybutton.style.display="none"}function scrolltoTopfunction(){document.body.scrollTop=0,document.documentElement.scrollTop=0}window.onscroll=function(){scrollFunction()},document.addEventListener("contextmenu",function(e){"IMG"===e.target.nodeName&&e.preventDefault()},!1);let Pupils=document.getElementsByClassName("footer-pupil"),pupilsArr=Array.from(Pupils),pupilStartPoint=-10,pupilRangeX=20,pupilRangeY=15,mouseXStartPoint=0,mouseXEndPoint=window.innerWidth,currentXPosition=0,fracXValue=0,mouseYEndPoint=window.innerHeight,currentYPosition=0,fracYValue=0,mouseXRange=mouseXEndPoint-mouseXStartPoint;const mouseMove=e=>{fracXValue=(currentXPosition=e.clientX-mouseXStartPoint)/mouseXRange,fracYValue=(currentYPosition=e.clientY)/mouseYEndPoint;let t=pupilStartPoint+fracXValue*pupilRangeX,o=pupilStartPoint+fracYValue*pupilRangeY;pupilsArr.forEach(e=>{e.style.transform=`translate(${t}px, ${o}px)`})},windowResize=e=>{mouseXEndPoint=window.innerWidth,mouseYEndPoint=window.innerHeight,mouseXRange=mouseXEndPoint-mouseXStartPoint};window.addEventListener("mousemove",mouseMove),window.addEventListener("resize",windowResize);
// Project carousel functionality
// Simple project carousel
document.addEventListener('DOMContentLoaded', function() {
    // Get all projects
    const projects = document.querySelectorAll('.project-box');
    const totalProjects = projects.length;
    let currentIndex = 0;
    
    console.log(`Found ${totalProjects} projects`);
    
    // Set up navigation buttons
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');
    const counter = document.getElementById('project-counter');
    
    // Function to show a specific project
    function showProject(index) {
      // Log what we're doing
      console.log(`Showing project ${index + 1} of ${totalProjects}`);
      
      // Hide all projects
      for (let i = 0; i < totalProjects; i++) {
        projects[i].style.display = 'none';
      }
      
      // Show the selected project
      if (projects[index]) {
        projects[index].style.display = 'flex';
        
        // Add animation class
        projects[index].classList.add('jelly-animation');
        setTimeout(() => {
          projects[index].classList.remove('jelly-animation');
        }, 700);
      } else {
        console.error(`Project at index ${index} doesn't exist`);
      }
      
      // Update counter
      if (counter) {
        counter.textContent = `${index + 1}/${totalProjects}`;
      }
    }
    
    // Set up click handlers
    if (nextBtn) {
      nextBtn.onclick = function() {
        console.log('Next button clicked');
        currentIndex = (currentIndex + 1) % totalProjects;
        showProject(currentIndex);
      };
    }
    
    if (prevBtn) {
      prevBtn.onclick = function() {
        console.log('Previous button clicked');
        currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        showProject(currentIndex);
      };
    }
    
    // Show the first project initially
    showProject(0);
  });