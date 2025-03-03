var audio=document.getElementById("audioPlayer"),loader=document.getElementById("preloader");function settingtoggle(){document.getElementById("setting-container").classList.toggle("settingactivate"),document.getElementById("visualmodetogglebuttoncontainer").classList.toggle("visualmodeshow"),document.getElementById("soundtogglebuttoncontainer").classList.toggle("soundmodeshow")}function playpause(){!1==document.getElementById("switchforsound").checked?audio.pause():audio.play()}function visualmode(){document.body.classList.toggle("light-mode"),document.querySelectorAll(".needtobeinvert").forEach(function(e){e.classList.toggle("invertapplied")})}window.addEventListener("load",function(){loader.style.display="none",document.querySelector(".hey").classList.add("popup")});let emptyArea=document.getElementById("emptyarea"),mobileTogglemenu=document.getElementById("mobiletogglemenu");function hamburgerMenu(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.toggle("show-toggle-menu"),document.getElementById("burger-bar1").classList.toggle("hamburger-animation1"),document.getElementById("burger-bar2").classList.toggle("hamburger-animation2"),document.getElementById("burger-bar3").classList.toggle("hamburger-animation3")}function hidemenubyli(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.remove("show-toggle-menu"),document.getElementById("burger-bar1").classList.remove("hamburger-animation1"),document.getElementById("burger-bar2").classList.remove("hamburger-animation2"),document.getElementById("burger-bar3").classList.remove("hamburger-animation3")}const sections=document.querySelectorAll("section"),navLi=document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li"),mobilenavLi=document.querySelectorAll(".mobiletogglemenu .mobile-navbar-tabs-ul li");window.addEventListener("scroll",()=>{let e="";sections.forEach(t=>{let o=t.offsetTop;t.clientHeight,pageYOffset>=o-200&&(e=t.getAttribute("id"))}),mobilenavLi.forEach(t=>{t.classList.remove("activeThismobiletab"),t.classList.contains(e)&&t.classList.add("activeThismobiletab")}),navLi.forEach(t=>{t.classList.remove("activeThistab"),t.classList.contains(e)&&t.classList.add("activeThistab")})}),console.log("%c Designed and Developed by Vinod Jangid ","background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;");let mybutton=document.getElementById("backtotopbutton");function scrollFunction(){document.body.scrollTop>400||document.documentElement.scrollTop>400?mybutton.style.display="block":mybutton.style.display="none"}function scrolltoTopfunction(){document.body.scrollTop=0,document.documentElement.scrollTop=0}window.onscroll=function(){scrollFunction()},document.addEventListener("contextmenu",function(e){"IMG"===e.target.nodeName&&e.preventDefault()},!1);let Pupils=document.getElementsByClassName("footer-pupil"),pupilsArr=Array.from(Pupils),pupilStartPoint=-10,pupilRangeX=20,pupilRangeY=15,mouseXStartPoint=0,mouseXEndPoint=window.innerWidth,currentXPosition=0,fracXValue=0,mouseYEndPoint=window.innerHeight,currentYPosition=0,fracYValue=0,mouseXRange=mouseXEndPoint-mouseXStartPoint;const mouseMove=e=>{fracXValue=(currentXPosition=e.clientX-mouseXStartPoint)/mouseXRange,fracYValue=(currentYPosition=e.clientY)/mouseYEndPoint;let t=pupilStartPoint+fracXValue*pupilRangeX,o=pupilStartPoint+fracYValue*pupilRangeY;pupilsArr.forEach(e=>{e.style.transform=`translate(${t}px, ${o}px)`})},windowResize=e=>{mouseXEndPoint=window.innerWidth,mouseYEndPoint=window.innerHeight,mouseXRange=mouseXEndPoint-mouseXStartPoint};window.addEventListener("mousemove",mouseMove),window.addEventListener("resize",windowResize);
// Clean carousel implementation
window.addEventListener('DOMContentLoaded', function() {

    
    const slides = document.querySelectorAll('.project-slide');
    const slideTotal = slides.length - 1;
    let slideCurrent = 0;
    let isAnimating = false;
    
    // Function to initialize the carousel
    function initCarousel() {
      console.log(`Initializing carousel with ${slideTotal + 1} slides`);
      
      // Setup initial positions
      slides.forEach((slide, index) => {
        // Clear all classes
        slide.classList.remove('active', 'preactive', 'proactive', 'preactivede', 'proactivede', 'transitioning');
        
        // Set initial position
        if (index === 0) {
          slide.classList.add('active');
        } else if (index === 1) {
          slide.classList.add('proactive');
        } else if (index === slideTotal) {
          slide.classList.add('preactive');
        } else {
          slide.classList.add('proactivede');
        }
      });
    }
    
    // Function to navigate to next slide
    window.nextProject = function() {
      if (isAnimating) return;
      isAnimating = true;
      
      // Add button animation
      const nextBtn = document.getElementById('prev-project');
      if (nextBtn) {
        nextBtn.classList.add('subtle-bounce');
        setTimeout(() => nextBtn.classList.remove('subtle-bounce'), 400);
      }
      
      // First mark slides that need to move to the other side
      const currentPreactive = document.querySelector('.project-slide.preactive');
      if (currentPreactive) {
        currentPreactive.classList.add('transitioning');
      }
      
      // Short delay to let the transitioning class take effect
      setTimeout(() => {
        // Update current slide index
        slideCurrent = (slideCurrent + 1) % (slideTotal + 1);
        
        // Now update all slide positions
        slides.forEach((slide, index) => {
          // Calculate relative position
          const position = getRelativePosition(index, slideCurrent, slides.length);
          
          // Remove all positioning classes
          slide.classList.remove('active', 'preactive', 'proactive', 'preactivede', 'proactivede');
          
          // Set new position class
          if (position === 0) {
            slide.classList.add('active');
          } else if (position === -1 || position === (slides.length - 1)) {
            slide.classList.add('preactive');
          } else if (position === 1) {
            slide.classList.add('proactive');
          } else {
            slide.classList.add('proactivede');
          }
        });
        
        // Remove transitioning class after positions are updated
        setTimeout(() => {
          slides.forEach(slide => {
            slide.classList.remove('transitioning');
          });
          
          // Reset animation flag
          isAnimating = false;
        }, 50);
      }, 200);
    };
    
    // Function to navigate to previous slide
    window.prevProject = function() {
      if (isAnimating) return;
      isAnimating = true;
      
      // Add button animation
      const prevBtn = document.getElementById('next-project');
      if (prevBtn) {
        prevBtn.classList.add('subtle-bounce');
        setTimeout(() => prevBtn.classList.remove('subtle-bounce'), 400);
      }
      
      // First mark slides that need to move to the other side
      const currentProactive = document.querySelector('.project-slide.proactive');
      if (currentProactive) {
        currentProactive.classList.add('transitioning');
      }
      
      // Short delay to let the transitioning class take effect
      setTimeout(() => {
        // Update current slide index
        slideCurrent = (slideCurrent - 1 + slides.length) % slides.length;
        
        // Now update all slide positions
        slides.forEach((slide, index) => {
          // Calculate relative position
          const position = getRelativePosition(index, slideCurrent, slides.length);
          
          // Remove all positioning classes
          slide.classList.remove('active', 'preactive', 'proactive', 'preactivede', 'proactivede');
          
          // Set new position class
          if (position === 0) {
            slide.classList.add('active');
          } else if (position === -1 || position === (slides.length - 1)) {
            slide.classList.add('preactive');
          } else if (position === 1) {
            slide.classList.add('proactive');
          } else {
            slide.classList.add('proactivede');
          }
        });
        
        // Remove transitioning class after positions are updated
        setTimeout(() => {
          slides.forEach(slide => {
            slide.classList.remove('transitioning');
          });
          
          // Reset animation flag
          isAnimating = false;
        }, 50);
      }, 200);
    };
    
    // Helper function to calculate relative position
    function getRelativePosition(index, current, total) {
      let position = index - current;
      
      // Normalize position for wraparound
      if (position < -Math.floor(total/2)) {
        position += total;
      } else if (position > Math.floor(total/2)) {
        position -= total;
      }
      
      return position;
    }
    
    // Initialize the carousel
    initCarousel();
    
    // Bind event listeners
    const nextBtn = document.getElementById('prev-project');
    const prevBtn = document.getElementById('next-project');
    
    if (nextBtn) nextBtn.addEventListener('click', nextProject);
    if (prevBtn) prevBtn.addEventListener('click', prevProject);
  });

  // Greeting animation
document.addEventListener('DOMContentLoaded', function() {
    new Typed('#greeting-animation', {
      strings: [
        'Hello();', 
        'Bonjour();',
        'Hola();',
        'Ciao();',
        'こんにちは();',
        'Привет();',
        'مرحبا();',
        '你好();',
        'Hallo();',
        'Olá();',
        'Namaste();'
      ],
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 1500,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      fadeOut: true,
      fadeOutDelay: 1000,
      smartBackspace: true
    });
  });