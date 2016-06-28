var siteData={};
var videoActive=false;
var sectionStatuses=0;
var sectionCount=0;
var slugName = 'page';
var dragendOffset = 2;
d3.json("/data/better-way.json", function(error, data) {//Loads site data
  if(error!==null){
    console.log(error);
  }
  siteData = data;
  init();
});

function init(){//Initiates the page

  // Construct the frame content from data
  setTimeout(function(){
    buildPages(siteData);
    siteData.forEach(function(e){
      e.sections.forEach(function(){
        sectionCount++;
      });
    });
  }, 100);
}

window.onload = function(){// init facebook share function
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1067538003320154',
      xfbml      : true,
      version    : 'v2.6'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
};

function initiateFunctionality(){
  sectionStatuses++;
  if(sectionCount === sectionStatuses){
    pageSwiper();//Must be called after page is built but before all other page interaction functions
    menuFunctionality();
    gridFunctionality();
    pagerFunctionality();
    signUpFunctionality();
    openMenu();
    openVideo();
    openExpanders();
    $('.page-0').css('height', 'auto').parent().css('max-height', $('.page-0').height());// Adjusts the page height to match the initial.
    sectionStatuses=null;
  }
}

function social(){// Twitter and FB Button Functionality
  var windowHeight=260;
  var windowWidth=800;
  var regex=/<p>/gi;
  var regexTwo=/(<\/p>|<br \/>)/gi;
  //popup box style
  var label, current, leftPosition, topPosition;
  //Allow for borders.
  leftPosition = (window.screen.width / 2) - ((windowWidth / 2) + 10);
  //Allow for title and status bars.
  topPosition = (window.screen.height / 2) - ((windowHeight / 2) + 50);
  filterTags=function(text){
    return text= encodeURIComponent(text.replace(regex, '').replace(regexTwo, '\n'));
  };
  var windowFeatures = "status=no,height=" + windowHeight + ",width=" + windowWidth + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";

  setTimeout(function(){
    //twitter sharing
    $('.twt-click').on('click', function(){
      if($(this).data("title")!==undefined){
        var tweetMsg = filterTags($(this).data("title")+$(this).data("share"));
      }else{
        var tweetMsg = filterTags($(this).data("share"));
      }
      if($('#homepage-fullpage').length){
        var twitterLink = "https://twitter.com/intent/tweet?text=" + tweetMsg+" pic.twitter.com/vpXG8tJQcL better.gop&url=better.gop";
      }else{
        var twitterLink = "https://twitter.com/share?text=" + tweetMsg+" pic.twitter.com/vpXG8tJQcL better.gop&url=better.gop";
      }     
      window.open((twitterLink),'Twitter', windowFeatures);
    });
    //facebook sharing
    $('.fb-click').on('click', function(){
      var pageInfo = $(this).data("title").replace(regex, '').replace(regexTwo, '');
      var pageLink = 'http://'+window.location.hostname+'/'+$(this).data('url');
      var imageLink= 'http://'+window.location.hostname+'/_assets/images/'+$(this).data('image');
      var pageDescription = $(this).data('text');
      if(undefined===imageLink||imageLink.length<1){
        imageLink=$('#video-hero img').attr('src');
      }
      FB.ui({
        method: 'feed',
        name: pageInfo,
        description: pageDescription,
        link: pageLink,
        picture:imageLink
      });
    });
  }, 1000);
  

  //video sharing
  $("div.click-video").click(function(event){
    var video=$(this).attr("id");
    var title=$(this).attr("title");
    var twitterBtn= $(".inner-light .click-tweet");
    var fbBtn= $(".inner-light .fb-click");
    $("."+video).removeClass("light-off");
    $("."+video).addClass("light-on");
    if(title!==undefined){
      fbBtn.attr('data-title', title);
      twitterBtn.attr('data-title', title);
    }
  });
}

function pageSwiper(){ //initiates page swipe functionality.
  var firstChild = $(".container .page:first-child").clone(),
    lastChild  = $(".container .page:last-child").clone(),
    container  = $(".container");
  firstChild.appendTo(container);
  lastChild.prependTo(container);
  $(".container").dragend({// Breaks the page into swipable side pages
    pageContainer: ".container",
    jumpToPage: getInitialPage(),
    onSwipeEnd: function() {
      var first = this.pages[0],
          last = this.pages[this.pages.length - 1];
      if (first === this.activeElement) {
        this.jumpToPage(this.pages.length - 1 );
      }
      if (last === this.activeElement) {
        this.jumpToPage(dragendOffset);
      }
      $('.page').eq(this.page).css('height', 'auto').parent().css('max-height', $('.page').eq(this.page).height());// Adjusts the page height to match the new slide.
    },
    pageClass: "page",
    afterInitialize: function() {
      this.container.style.visibility = "visible";
    },
    duration: 750,
  });
}

function menuFunctionality(){ //Menu click functionality
  $(".menu-element h3").click(function(event) {

    var slug = $(event.target).data("slug");
    updateAddress(slug);

    var page = $(event.target).data("page") + dragendOffset;
    $(".container").dragend({
      scrollToPage: page,
      duration: 750,
    });
    setTimeout(function(){
      $('body').removeClass('opened');
    }, 1000);
  });
  $("header .mark, header h1").click(function(event) {
    updateAddress('home-page');
    $(".container").dragend({
      scrollToPage: dragendOffset,
      duration: 750,
    });
  });
}

function gridFunctionality(){ //Grid click functionality
  $(".grid-element .overlay").click(function(event) {
    var slug = $(event.target).parents(".grid-element").attr('data-slug');
    updateAddress(slug);

    // @todo: Change this to look up the position of the parent page
    var page = $(event.target).parents(".grid-element").index() + dragendOffset + 1;

    $(".container").dragend({
      scrollToPage: page,
      duration: 750,
    });
  });
}

/**
 * Next/previous pager functionality
 */
function pagerFunctionality() {

  $(".pager").click(function(event) {

    var target = $(event.target).attr('data-target');
    var targetPosition = getPosition(siteData[target].slug);
    updateAddress(siteData[target].slug);

    // If on final "page", use home-page bookend instead of rewinding
    if (siteData[target].slug === 'home-page'
      && $(this).hasClass('next')) {
      targetPosition = siteData.length + dragendOffset;
    }

    // Scroll to the specified position.
    $(".container").dragend({ scrollToPage: targetPosition });

  });
}

function signUpFunctionality(){
  var form = $('.sign_up .content-block');
  form.css('max-height', form.height());
  form.parents('.sign_up').css('min-height', form.parents('.sign_up').height());
  form.find('#mc-embedded-subscribe-form').eq(0).submit(function(e){
    var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if ( !$( "input:first" ).val().match(regex)) {
      e.preventDefault();
      alert('Please Submit a Valid Email Address');
      return;
    }
    var buttonParents = $(this).parents('.content-block');
    buttonParents.addClass('deactivated');
    setTimeout(function(){
      buttonParents.siblings('iframe').addClass('active');
    }, 750);
  });
}

function openMenu(){ //Opens the hamburger menu
  $('.hamburger').click(function(event){// Opens the Nav Menu And Starts Hamburger Transition
    $(this).parents('body').toggleClass('opened');
  });
}

function openVideo(){ //opens hero video modals
  videoActive=true;
  $('.video-button').on('click', function( e ) {// Opens and closes the video modal.
    $('.iframe-container .hero-video').attr('src', $(this).data('video'));
    Custombox.open({
        target: '.iframe-container',
        effect: 'blur',
        overlayEffect: 'scale'
    });
    e.preventDefault();
    $('.custombox-modal-wrapper').click(function(){
      setTimeout(function(){
        $('.iframe-container iframe').attr('src', '');
      },250);
    });
  });
}

function openExpanders(){ //Collapses and opens expanders
  $('.expander').each(function(){
    var expander = $(this);
    var content = expander.find('.content-block');
    var contentHeight = content.height()*1.5;
    content.css('max-height', contentHeight);
    if(contentHeight>350){
      expander.addClass('collapsed');
      expander.find('button').click(function(event){
        expander.toggleClass('collapsed');
        var text = $(this).children('.text').text();
        $(this).children('.text').text(" Expand To read more" === text ? " Collapse" : " Expand To read more");
        $(this).children('.plus').text(" Expand To read more" === text ? "-" : "+" );
        setTimeout(function(){
          expander.parents('.page').parent().css('max-height',expander.parents('.page').height());// Adjusts the page height to match the new slide.
        },500);
      });
    }else{
      expander.find('button').css('display', 'none');
    }
  });
}

function staticImports(){ // import all global, static HTML imports
  var statics = ['header.html','menu.html', 'iframe.html','footer.html'];
  statics.forEach(function(e, i){
    var container='header';
    if(statics.length===i+1){
      container='footer';
    }
    $(container).append($('<div>').load('html_imports/'+e, function(){
      if('menu.html'===e){
        menuImports(siteData);
      }
    }));
  });
}

function menuImports(data){ // Insert page links into menu
  var container = "<li class='menu-element'>";
  var html = 'menu-element.html';
  data.forEach(function(e, i){
    if('home-page' !== e.slug){
      $('section.menu ul').append($(container).load('/html_imports/'+html,function(){
        $(this).children('h3').data('page', i).data('slug', e.slug).text(e.name);
      }));
    }
  });
}

function loadHeroVideo(section, sectionData, pageIndex){
  var overlay='rgba(220,180,180,0.5)';
  var iframeSrc='https://www.youtube.com/embed/'+sectionData.video+'?&autoplay=1&rel=0&showinfo=0&modestbranding=1&controls=0&autohide=1&color=white"&origin=http://'+window.location.hostname;
  var background='background-image: -moz-linear-gradient(-45deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+sectionData.image+');background-image: -webkit-linear-gradient(-45deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+sectionData.image+'); background-image: linear-gradient(135deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+sectionData.image+'); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#bcbec0", endColorstr="#bcbec0",GradientType=1 ), url(/_assets/images/video/'+sectionData.image+'); background-image:linear-gradient(135deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+sectionData.image+');';
  var ieBackground='background-image: url(/_assets/images/video/'+sectionData.image+');';
  setTimeout(function(){
    $('.page-'+pageIndex+' section.'+sectionData.type).load('html_imports/'+sectionData.type+'.html', function(){
      setTimeout(function(){
        var thisSection= $('.page-'+pageIndex+' section.'+sectionData.type).addClass('clearfix');
        thisSection.attr('id', 'video-hero');
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 && msie < 10) // If Internet Explorer 9 or below
        {
          thisSection.find('.hero-background').attr('style', background);
        }else  {// If another browser
          thisSection.find('.hero-background').attr('style', background);
        }
        var content= thisSection.children('.content-block');
        content.children('.video-button').attr('data-video',iframeSrc);
        content.children('h1').text(sectionData.header);
        var socialContent = content.children('.social');
        if(sectionData.fb!==undefined){
          thisSection.parents('.page').addClass('alt');
          socialContent.children('.fb-click').addClass('active fb-click');
          socialContent.children('.fb-click').attr('data-title', sectionData.header);
          socialContent.children('.fb-click').attr('data-text', sectionData.fb);
          socialContent.children('.fb-click').attr('data-image', sectionData.fb_image);
          socialContent.children('.fb-click').attr('data-url', sectionData.link);
        }
        if(sectionData.twt){
          socialContent.children('.twt-click').addClass('active twt-click');
          socialContent.children('.twt-click').attr('data-share', sectionData.twt);
        }
        if(siteData.length===pageIndex+1&&!videoActive){
          openVideo();
          social();
        }
        initiateFunctionality();
      },100);
    });
  }, 100);
}

function loadExpander(section, sectionData, pageIndex){ // import and formats expander type content sections  and sub items
  section.append($('<div class="expander-container">'));
  section.addClass(sectionData.class);
  setTimeout(function(){
    $(section.selector+' div.expander-container').load('html_imports/expander.html', function(){
      var currentExpander=$(this);
      currentExpander.find('h2').text(sectionData.header);
      if(sectionData.text!==undefined){
        currentExpander.find('p.text').text(sectionData.text);
      }
      if(sectionData.items!==undefined){
        sectionData.items.forEach(function(e, i){
          currentExpander.find('.list ol').append($('<li class="expander-element item-'+i+'">').load('/html_imports/expander-element.html', function(){
            var currentItem=currentExpander.find('.list .item-'+i);
            $(this).find('h4').text(e.item);
              if(e.sub_items.length>0){
                currentItem.append($('<ul class="expander-ul">'));
                e.sub_items.forEach(function(element, index){
                  currentItem.find('.expander-ul').append($('<li class="sub_item-'+index+' expander-element">').load('/html_imports/expander-element.html', function(){
                    $(this).find('h4').text(element);
                    if(i===sectionData.items.length-1&&e.sub_items.length===index+1){
                      initiateFunctionality();
                    }
                  }));
                });
              }else{
                if(i===sectionData.items.length-1){
                  initiateFunctionality();
                }
              }
          }));
        });
      }else{
        initiateFunctionality();
      }
      if(sectionData.class!==undefined && sectionData.class.length>0){
        var lastExpander=$('.container .page-'+pageIndex+' .last-expanders');
        if($('.container .page-'+pageIndex+' .last-expanders').length===0){
          lastExpander=$('<section class="last-expanders clearfix">').insertBefore('.container .page-'+pageIndex+' .additional');
        }
        lastExpander.append($(section.selector));
      }
    });
  },100);
}

function loadGrid(section, sectionData){ // import and formats grid type content sections and grid items

  sectionData.items.forEach(function(item, index){

    var $elem = $("<div class='grid-element'>");
    $elem.attr('data-slug', item.parent);

    // @todo: Change this from element-{index} to use the 'parent' slug and lookup the position
    $elem.addClass('element-'+index);

    section.append($elem);
    setTimeout(function(){
      $('.element-'+index).load('html_imports/grid-element.html', function(){
        $(this).children('img').attr('src', '_assets/images/icons/BetterWay_'+item.image);
        $(this).children('.card').children('h3').text(item.header);
        $(this).children('.card').children('p').text(item.text);
        if(index===sectionData.items.length-1){
          initiateFunctionality();
        }
      });
    }, 100);
  });
}

function loadSignUp(section, sectionData, pageIndex){// Imports and formats sign_up type content sections
  setTimeout(function(){
    $('.page-'+pageIndex+' section.'+sectionData.type).load('html_imports/'+sectionData.type+'.html', function(){
        var thisSection= $('.page-'+pageIndex+' section.'+sectionData.type).addClass('test');
        thisSection.find('p.text').text(sectionData.text);
        thisSection.find('h2').text(sectionData.header);
        initiateFunctionality();
    });
  }, 100);
}

function loadAdditional(section, sectionData, pageIndex){// Imports and formats "additonal" type content sections
  setTimeout(function(){
    $('.page-'+pageIndex+' section.'+sectionData.type).load('html_imports/'+sectionData.type+'.html', function(){
        sectionData.items.forEach(function(item, index){
          $('.page-'+pageIndex+' section.'+sectionData.type).children('ul').append($("<li class='additional-element'>").load('html_imports/'+sectionData.type+'-element.html', function(){
            var elm=$(this).find('h4');
            $(this).find('h4').text(item.text);
            $(this).find('a.button').attr('href', item.link);
            if(index===sectionData.items.length-1){
              initiateFunctionality();
            }
          }));
        });
    });
  }, 100);
}

function loadCentral(section, sectionData, pageIndex){// Imports and formats "additonal" type content sections
  setTimeout(function(){
    $('.page-'+pageIndex+' section.'+sectionData.type).load('html_imports/'+sectionData.type+'.html', function(){
        $(this).find('p').text(sectionData.text);
        $(this).find('img').attr('src', '_assets/images/icons/BetterWay_'+sectionData.image);
        initiateFunctionality();
    });
  }, 100);
}

/**
 * Create previous/next pagination buttons.
 * @param  number pageIndex
 */
function loadPagers(pageIndex) {

  var indexNext = pageIndex + 1;
  var indexPrev = pageIndex - 1;

  // On final "page", 'next' should be homescreen "page" (zero-index):
  if (indexNext === siteData.length) {
    indexNext = 0;
  }

  // Set text and slug-data on prev/next buttons.
  $('.container .page-' + pageIndex + ' .expander')
    .eq(0)
    .append($("<span class='pagers justify space-between'>")
    .load('html_imports/pagers.html', function() {
      // 'Previous' button
      $prev = $(this).find('.previous .button');
      $prev.text(siteData[indexPrev].name);
      $prev.attr('data-target', indexPrev);
      // 'Next' button
      $next = $(this).find('.next .button');
      $next.text(siteData[indexNext].name);
      $next.attr('data-target', indexNext);
    })
  );
}

function buildPages(pages){
  staticImports();
  pages.forEach(function(e, i){
    var $page = $('<div class="page page-'+i+'">');
    $page.data('slug', e.slug);
    $('.container').append($page);
    e.sections.forEach(function(element, index){
      $page.append($('<section class="section clearfix '+element.type+' section-'+index+'">'));
      loadContent($('.page-'+i+' section.'+element.type+'.section-'+index), element, i);
      if(i>0 && index+1===e.sections.length){
        loadPagers(i);
      }
    });
  });
}

function loadContent(section, sectionData, pageIndex){ // Builds the page depending on the params from QueryString
  var html='';
  var innerElements=function(){};
  switch(sectionData.type){
    case 'grid':
      innerElements=loadGrid;
      break;
    case 'expander':
      innerElements=loadExpander;
      break;
    case 'hero_video':
      innerElements=loadHeroVideo;
      break;
    case 'sign_up':
      innerElements=loadSignUp;
      break;
    case 'additional':
      innerElements=loadAdditional;
      break;
    case 'central':
      innerElements=loadCentral;
      break;
  }
  innerElements(section, sectionData, pageIndex);
}

/**
 * Get the position value of a frame by it's slug value.
 * @param string slug
 *        The unique slug for the "page"
 * @return  number Numerical Position
 */
function getPosition(slug) {
  var output;
  siteData.forEach(function(element, index){
    if (element.slug === slug) {
      // Add offset for invisible frames
      output = index + dragendOffset;
    }
  });
  return output;
}

/**
 * Get any URL param values by name
 * @param  string sParam
 * @return  string param value
 */
function getURLParameter(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++){
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam){
        return sParameterName[1];
    }
  }
}

/**
 * Get starting page, if in querystring
 * @return  number Position of page
 */
function getInitialPage() {
  // Jump to any frame specified in query
  var frameNumber, initPage, slug;
  slug = getURLParameter(slugName);
  initPage = dragendOffset;

  if (typeof slug !== "undefined") {
    frameNumber = getPosition(slug);
    if (typeof frameNumber !== "undefined") {
      initPage = frameNumber;
    }
  }

  return initPage;
}

/**
 * Update the page param in Address Bar, if supported
 * @param string slug
 */
function updateAddress(slug) {
  if (history.pushState) {
    var address = window.location.protocol + "//" + window.location.host + window.location.pathname;

    // Except for 'home' page, append query param
    if (slug !== "home-page") {
      address += '?' + slugName + '=' + slug;
    }

    window.history.pushState({path:address},'',address);
  }
}