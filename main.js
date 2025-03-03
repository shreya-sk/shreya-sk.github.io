var audio=document.getElementById("audioPlayer"),loader=document.getElementById("preloader");function settingtoggle(){document.getElementById("setting-container").classList.toggle("settingactivate"),document.getElementById("visualmodetogglebuttoncontainer").classList.toggle("visualmodeshow"),document.getElementById("soundtogglebuttoncontainer").classList.toggle("soundmodeshow")}function playpause(){!1==document.getElementById("switchforsound").checked?audio.pause():audio.play()}function visualmode(){document.body.classList.toggle("light-mode"),document.querySelectorAll(".needtobeinvert").forEach(function(e){e.classList.toggle("invertapplied")})}window.addEventListener("load",function(){loader.style.display="none",document.querySelector(".hey").classList.add("popup")});let emptyArea=document.getElementById("emptyarea"),mobileTogglemenu=document.getElementById("mobiletogglemenu");function hamburgerMenu(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.toggle("show-toggle-menu"),document.getElementById("burger-bar1").classList.toggle("hamburger-animation1"),document.getElementById("burger-bar2").classList.toggle("hamburger-animation2"),document.getElementById("burger-bar3").classList.toggle("hamburger-animation3")}function hidemenubyli(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.remove("show-toggle-menu"),document.getElementById("burger-bar1").classList.remove("hamburger-animation1"),document.getElementById("burger-bar2").classList.remove("hamburger-animation2"),document.getElementById("burger-bar3").classList.remove("hamburger-animation3")}const sections=document.querySelectorAll("section"),navLi=document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li"),mobilenavLi=document.querySelectorAll(".mobiletogglemenu .mobile-navbar-tabs-ul li");window.addEventListener("scroll",()=>{let e="";sections.forEach(t=>{let o=t.offsetTop;t.clientHeight,pageYOffset>=o-200&&(e=t.getAttribute("id"))}),mobilenavLi.forEach(t=>{t.classList.remove("activeThismobiletab"),t.classList.contains(e)&&t.classList.add("activeThismobiletab")}),navLi.forEach(t=>{t.classList.remove("activeThistab"),t.classList.contains(e)&&t.classList.add("activeThistab")})}),console.log("%c Designed and Developed by Vinod Jangid ","background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;");let mybutton=document.getElementById("backtotopbutton");function scrollFunction(){document.body.scrollTop>400||document.documentElement.scrollTop>400?mybutton.style.display="block":mybutton.style.display="none"}function scrolltoTopfunction(){document.body.scrollTop=0,document.documentElement.scrollTop=0}window.onscroll=function(){scrollFunction()},document.addEventListener("contextmenu",function(e){"IMG"===e.target.nodeName&&e.preventDefault()},!1);let Pupils=document.getElementsByClassName("footer-pupil"),pupilsArr=Array.from(Pupils),pupilStartPoint=-10,pupilRangeX=20,pupilRangeY=15,mouseXStartPoint=0,mouseXEndPoint=window.innerWidth,currentXPosition=0,fracXValue=0,mouseYEndPoint=window.innerHeight,currentYPosition=0,fracYValue=0,mouseXRange=mouseXEndPoint-mouseXStartPoint;const mouseMove=e=>{fracXValue=(currentXPosition=e.clientX-mouseXStartPoint)/mouseXRange,fracYValue=(currentYPosition=e.clientY)/mouseYEndPoint;let t=pupilStartPoint+fracXValue*pupilRangeX,o=pupilStartPoint+fracYValue*pupilRangeY;pupilsArr.forEach(e=>{e.style.transform=`translate(${t}px, ${o}px)`})},windowResize=e=>{mouseXEndPoint=window.innerWidth,mouseYEndPoint=window.innerHeight,mouseXRange=mouseXEndPoint-mouseXStartPoint};window.addEventListener("mousemove",mouseMove),window.addEventListener("resize",windowResize);
// Project carousel functionality
// Enhanced 3D Carousel with Bouncy Effects
// Carousel with Preactive/Proactive Design
window.addEventListener('DOMContentLoaded', function() {
    // Get all slides
    const slide = document.querySelectorAll('.project-slide');
    const slideTotal = slide.length - 1;
    let slideCurrent = 0;
    
    console.log(`Initialized carousel with ${slideTotal + 1} projects`);
    
    // Initialize the carousel
    function initCarousel() {
      // Set initial classes for all slides
      slide.forEach((elem, index) => {
        // Remove all possible classes first
        elem.classList.remove('active', 'preactive', 'proactive', 'preactivede', 'proactivede');
        
        // Assign initial positions
        if (index === 0) {
          elem.classList.add('active');
        } else if (index === 1) {
          elem.classList.add('proactive');
        } else {
          elem.classList.add('proactivede');
        }
      });
    }
    
    // Function to arrange slides based on current position
    function updateSlides() {
      // Get the slides we need to modify
      let preactiveSlide, activeSlide, proactiveSlide;
      
      if (slideCurrent > 0) {
        preactiveSlide = slide[slideCurrent - 1];
      } else {
        preactiveSlide = slide[slideTotal];
      }
      
      activeSlide = slide[slideCurrent];
      
      if (slideCurrent < slideTotal) {
        proactiveSlide = slide[slideCurrent + 1];
      } else {
        proactiveSlide = slide[0];
      }
      
      // Reset all slides
      slide.forEach((elem) => {
        elem.classList.remove('active', 'preactive', 'proactive');
        elem.classList.add('proactivede');
      });
      
      // Set the three visible slides with correct classes
      preactiveSlide.classList.remove('proactivede');
      preactiveSlide.classList.add('preactive');
      
      activeSlide.classList.remove('proactivede');
      activeSlide.classList.add('active');
      
      proactiveSlide.classList.remove('proactivede');
      proactiveSlide.classList.add('proactive');
    }
    
    // Navigation Functions
    window.nextProject = function() {
      // Add bouncy animation to button
      const nextBtn = document.getElementById('next-project');
      if (nextBtn) {
        nextBtn.classList.add('bouncy-button');
        setTimeout(() => nextBtn.classList.remove('bouncy-button'), 600);
      }
      
      // Change to next slide
      if (slideCurrent < slideTotal) {
        slideCurrent++;
      } else {
        slideCurrent = 0;
      }
      
      updateSlides();
      console.log(`Navigated to project ${slideCurrent + 1} of ${slideTotal + 1}`);
    };
    
    window.prevProject = function() {
      // Add bouncy animation to button
      const prevBtn = document.getElementById('prev-project');
      if (prevBtn) {
        prevBtn.classList.add('bouncy-button');
        setTimeout(() => prevBtn.classList.remove('bouncy-button'), 600);
      }
      
      // Change to previous slide
      if (slideCurrent > 0) {
        slideCurrent--;
      } else {
        slideCurrent = slideTotal;
      }
      
      updateSlides();
      console.log(`Navigated to project ${slideCurrent + 1} of ${slideTotal + 1}`);
    };
    
    // Initialize
    initCarousel();
    
    // Bind event listeners
    const nextBtn = document.getElementById('next-project');
    const prevBtn = document.getElementById('prev-project');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', nextProject);
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', prevProject);
    }
  });