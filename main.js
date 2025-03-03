var audio=document.getElementById("audioPlayer"),loader=document.getElementById("preloader");function settingtoggle(){document.getElementById("setting-container").classList.toggle("settingactivate"),document.getElementById("visualmodetogglebuttoncontainer").classList.toggle("visualmodeshow"),document.getElementById("soundtogglebuttoncontainer").classList.toggle("soundmodeshow")}function playpause(){!1==document.getElementById("switchforsound").checked?audio.pause():audio.play()}function visualmode(){document.body.classList.toggle("light-mode"),document.querySelectorAll(".needtobeinvert").forEach(function(e){e.classList.toggle("invertapplied")})}window.addEventListener("load",function(){loader.style.display="none",document.querySelector(".hey").classList.add("popup")});let emptyArea=document.getElementById("emptyarea"),mobileTogglemenu=document.getElementById("mobiletogglemenu");function hamburgerMenu(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.toggle("show-toggle-menu"),document.getElementById("burger-bar1").classList.toggle("hamburger-animation1"),document.getElementById("burger-bar2").classList.toggle("hamburger-animation2"),document.getElementById("burger-bar3").classList.toggle("hamburger-animation3")}function hidemenubyli(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.remove("show-toggle-menu"),document.getElementById("burger-bar1").classList.remove("hamburger-animation1"),document.getElementById("burger-bar2").classList.remove("hamburger-animation2"),document.getElementById("burger-bar3").classList.remove("hamburger-animation3")}const sections=document.querySelectorAll("section"),navLi=document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li"),mobilenavLi=document.querySelectorAll(".mobiletogglemenu .mobile-navbar-tabs-ul li");window.addEventListener("scroll",()=>{let e="";sections.forEach(t=>{let o=t.offsetTop;t.clientHeight,pageYOffset>=o-200&&(e=t.getAttribute("id"))}),mobilenavLi.forEach(t=>{t.classList.remove("activeThismobiletab"),t.classList.contains(e)&&t.classList.add("activeThismobiletab")}),navLi.forEach(t=>{t.classList.remove("activeThistab"),t.classList.contains(e)&&t.classList.add("activeThistab")})}),console.log("%c Designed and Developed by Vinod Jangid ","background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;");let mybutton=document.getElementById("backtotopbutton");function scrollFunction(){document.body.scrollTop>400||document.documentElement.scrollTop>400?mybutton.style.display="block":mybutton.style.display="none"}function scrolltoTopfunction(){document.body.scrollTop=0,document.documentElement.scrollTop=0}window.onscroll=function(){scrollFunction()},document.addEventListener("contextmenu",function(e){"IMG"===e.target.nodeName&&e.preventDefault()},!1);let Pupils=document.getElementsByClassName("footer-pupil"),pupilsArr=Array.from(Pupils),pupilStartPoint=-10,pupilRangeX=20,pupilRangeY=15,mouseXStartPoint=0,mouseXEndPoint=window.innerWidth,currentXPosition=0,fracXValue=0,mouseYEndPoint=window.innerHeight,currentYPosition=0,fracYValue=0,mouseXRange=mouseXEndPoint-mouseXStartPoint;const mouseMove=e=>{fracXValue=(currentXPosition=e.clientX-mouseXStartPoint)/mouseXRange,fracYValue=(currentYPosition=e.clientY)/mouseYEndPoint;let t=pupilStartPoint+fracXValue*pupilRangeX,o=pupilStartPoint+fracYValue*pupilRangeY;pupilsArr.forEach(e=>{e.style.transform=`translate(${t}px, ${o}px)`})},windowResize=e=>{mouseXEndPoint=window.innerWidth,mouseYEndPoint=window.innerHeight,mouseXRange=mouseXEndPoint-mouseXStartPoint};window.addEventListener("mousemove",mouseMove),window.addEventListener("resize",windowResize);
// Enhanced Carousel with Previews on Both Sides
window.addEventListener('DOMContentLoaded', function() {
    // Get all slides
    const slides = document.querySelectorAll('.project-slide');
    const slideTotal = slides.length - 1;
    let slideCurrent = 0;
    let isAnimating = false;
    
    console.log(`Initialized carousel with ${slideTotal + 1} projects`);
    
    // Function to update carousel positioning
    function updateCarousel(direction) {
      if (isAnimating) return;
      isAnimating = true;
      
      // Apply proper classes to ALL slides based on their position relative to current
      slides.forEach((slide, index) => {
        // Remove all animation classes first
        slide.classList.remove('smooth-slide', 'smooth-slide-reverse');
        
        // Remove all position classes
        slide.classList.remove('active', 'preactive', 'proactive', 'preactivede', 'proactivede');
        
        // Calculate position relative to current slide
        let position = calculatePosition(index, slideCurrent, slideTotal);
        
        // Set appropriate class based on position
        if (position === 0) {
          slide.classList.add('active');
          if (direction === 'next') {
            slide.classList.add('smooth-slide');
          } else if (direction === 'prev') {
            slide.classList.add('smooth-slide-reverse');
          }
        } else if (position === -1) {
          slide.classList.add('preactive');
        } else if (position === 1) {
          slide.classList.add('proactive');
        } else {
          slide.classList.add('proactivede');
        }
      });
      
      // Reset animation flag after transition completes
      setTimeout(() => {
        isAnimating = false;
      }, 1000); // Match transition duration
    }
    
    // Helper function to calculate a slide's position relative to current
    function calculatePosition(index, current, total) {
      // Get the direct difference
      let position = index - current;
      
      // Handle wraparound at ends
      if (position < -Math.floor((total+1)/2)) {
        position += total + 1;
      } else if (position > Math.floor((total+1)/2)) {
        position -= total + 1;
      }
      
      return position;
    }
    
    // Next project function
    window.nextProject = function() {
      if (isAnimating) return;
      
      // Button animation
      const nextBtn = document.getElementById('prev-project');
      if (nextBtn) {
        nextBtn.classList.add('subtle-bounce');
        setTimeout(() => nextBtn.classList.remove('subtle-bounce'), 400);
      }
      
      // Change to next slide (with endless rotation)
      slideCurrent = (slideCurrent + 1) % (slideTotal + 1);
      
      // Update the carousel
      updateCarousel('next');
      console.log(`Showing project ${slideCurrent + 1} of ${slideTotal + 1}`);
    };
    
    // Previous project function
    window.prevProject = function() {
      if (isAnimating) return;
      
      // Button animation
      const prevBtn = document.getElementById('next-project');
      if (prevBtn) {
        prevBtn.classList.add('subtle-bounce');
        setTimeout(() => prevBtn.classList.remove('subtle-bounce'), 400);
      }
      
      // Change to previous slide (with endless rotation)
      slideCurrent = (slideCurrent - 1 + slideTotal + 1) % (slideTotal + 1);
      
      // Update the carousel
      updateCarousel('prev');
      console.log(`Showing project ${slideCurrent + 1} of ${slideTotal + 1}`);
    };
    
    // Initialize the carousel
    updateCarousel();
    
    // Bind event listeners
    const nextBtn = document.getElementById('prev-project');
    const prevBtn = document.getElementById('next-project');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', nextProject);
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', prevProject);
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        nextProject();
      } else if (e.key === 'ArrowRight') {
        prevProject();
      }
    });
  });