var audio=document.getElementById("audioPlayer"),loader=document.getElementById("preloader");function settingtoggle(){document.getElementById("setting-container").classList.toggle("settingactivate"),document.getElementById("visualmodetogglebuttoncontainer").classList.toggle("visualmodeshow"),document.getElementById("soundtogglebuttoncontainer").classList.toggle("soundmodeshow")}function playpause(){!1==document.getElementById("switchforsound").checked?audio.pause():audio.play()}function visualmode(){document.body.classList.toggle("light-mode"),document.querySelectorAll(".needtobeinvert").forEach(function(e){e.classList.toggle("invertapplied")})}window.addEventListener("load",function(){loader.style.display="none",document.querySelector(".hey").classList.add("popup")});let emptyArea=document.getElementById("emptyarea"),mobileTogglemenu=document.getElementById("mobiletogglemenu");function hamburgerMenu(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.toggle("show-toggle-menu"),document.getElementById("burger-bar1").classList.toggle("hamburger-animation1"),document.getElementById("burger-bar2").classList.toggle("hamburger-animation2"),document.getElementById("burger-bar3").classList.toggle("hamburger-animation3")}function hidemenubyli(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.remove("show-toggle-menu"),document.getElementById("burger-bar1").classList.remove("hamburger-animation1"),document.getElementById("burger-bar2").classList.remove("hamburger-animation2"),document.getElementById("burger-bar3").classList.remove("hamburger-animation3")}const sections=document.querySelectorAll("section"),navLi=document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li"),mobilenavLi=document.querySelectorAll(".mobiletogglemenu .mobile-navbar-tabs-ul li");window.addEventListener("scroll",()=>{let e="";sections.forEach(t=>{let o=t.offsetTop;t.clientHeight,pageYOffset>=o-200&&(e=t.getAttribute("id"))}),mobilenavLi.forEach(t=>{t.classList.remove("activeThismobiletab"),t.classList.contains(e)&&t.classList.add("activeThismobiletab")}),navLi.forEach(t=>{t.classList.remove("activeThistab"),t.classList.contains(e)&&t.classList.add("activeThistab")})}),console.log("%c Designed and Developed by Vinod Jangid ","background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;");let mybutton=document.getElementById("backtotopbutton");function scrollFunction(){document.body.scrollTop>400||document.documentElement.scrollTop>400?mybutton.style.display="block":mybutton.style.display="none"}function scrolltoTopfunction(){document.body.scrollTop=0,document.documentElement.scrollTop=0}window.onscroll=function(){scrollFunction()},document.addEventListener("contextmenu",function(e){"IMG"===e.target.nodeName&&e.preventDefault()},!1);let Pupils=document.getElementsByClassName("footer-pupil"),pupilsArr=Array.from(Pupils),pupilStartPoint=-10,pupilRangeX=20,pupilRangeY=15,mouseXStartPoint=0,mouseXEndPoint=window.innerWidth,currentXPosition=0,fracXValue=0,mouseYEndPoint=window.innerHeight,currentYPosition=0,fracYValue=0,mouseXRange=mouseXEndPoint-mouseXStartPoint;const mouseMove=e=>{fracXValue=(currentXPosition=e.clientX-mouseXStartPoint)/mouseXRange,fracYValue=(currentYPosition=e.clientY)/mouseYEndPoint;let t=pupilStartPoint+fracXValue*pupilRangeX,o=pupilStartPoint+fracYValue*pupilRangeY;pupilsArr.forEach(e=>{e.style.transform=`translate(${t}px, ${o}px)`})},windowResize=e=>{mouseXEndPoint=window.innerWidth,mouseYEndPoint=window.innerHeight,mouseXRange=mouseXEndPoint-mouseXStartPoint};window.addEventListener("mousemove",mouseMove),window.addEventListener("resize",windowResize);
// Project carousel functionality
// Advanced Project Carousel with Animations
// Advanced Project Carousel with Animations
window.addEventListener('DOMContentLoaded', function() {
    // Get all slides
    const slides = document.querySelectorAll('.project-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    
    console.log(`Initialized carousel with ${totalSlides} projects`);
    
    // Function to update slide classes with more organic animation
    function updateSlideClasses() {
      // Reset all slides
      slides.forEach((slide) => {
        slide.classList.remove('active', 'prev-preview', 'next-preview', 'rectangle-transition');
      });
      
      // Set active slide
      slides[currentIndex].classList.add('active');
      
      // Add animation after a tiny delay for more organic feel
      setTimeout(() => {
        slides[currentIndex].classList.add('rectangle-transition');
      }, 50);
      
      // Set previous preview slide
      const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      slides[prevIndex].classList.add('prev-preview');
      
      // Set next preview slide
      const nextIndex = (currentIndex + 1) % totalSlides;
      slides[nextIndex].classList.add('next-preview');
    }
    
    // Initialize on page load
    updateSlideClasses();
    
    // Next project function with subtle feedback
    window.nextProject = function() {
      // Add jelly animation to button
      const nextBtn = document.getElementById('next-project');
      if (nextBtn) {
        nextBtn.classList.add('jelly-button');
        setTimeout(() => nextBtn.classList.remove('jelly-button'), 500);
      }
      
      // Add subtle transition class to current slide before changing
      slides[currentIndex].style.transition = 'all 0.3s ease-in';
      slides[currentIndex].style.transform = 'translateX(-10px) scale(0.98)';
      
      // Change to next slide after a tiny delay for more organic feel
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlideClasses();
        console.log(`Navigated to project ${currentIndex + 1} of ${totalSlides}`);
      }, 100);
    };
    
    // Previous project function with subtle feedback
    window.prevProject = function() {
      // Add jelly animation to button
      const prevBtn = document.getElementById('prev-project');
      if (prevBtn) {
        prevBtn.classList.add('jelly-button');
        setTimeout(() => prevBtn.classList.remove('jelly-button'), 500);
      }
      
      // Add subtle transition class to current slide before changing
      slides[currentIndex].style.transition = 'all 0.3s ease-in';
      slides[currentIndex].style.transform = 'translateX(10px) scale(0.98)';
      
      // Change to previous slide after a tiny delay for more organic feel
      setTimeout(() => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlideClasses();
        console.log(`Navigated to project ${currentIndex + 1} of ${totalSlides}`);
      }, 100);
    };
    
    // Alternative event binding if onclick attributes don't work
    const nextBtn = document.getElementById('next-project');
    const prevBtn = document.getElementById('prev-project');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', nextProject);
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', prevProject);
    }
  });