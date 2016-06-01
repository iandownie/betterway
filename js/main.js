var siteData={};
var videoActive=false;
var sectionStatuses=0;
var sectionCount=0;
d3.json("/data/better-way.json", function(error, data) {//Loads site data
  if(error!==null){
    console.log(error);
  }
  siteData = data;
  init();
});

function init(){//Initiates the page
  setTimeout(function(){
    buildPages(siteData);
    siteData.forEach(function(e){
      e.sections.forEach(function(){
        sectionCount++;
      });
    });
  }, 0);
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

  //twitter sharing
  $('.twt-click').on('click', function(){

    if($(this).data("title")!==undefined){
      var tweetMsg = filterTags($(this).data("title")+$(this).data("share"))+'&original_referer=';
    }else{
      var tweetMsg = filterTags($(this).data("share"));
    }
    if($('#homepage-fullpage').length){
      var twitterLink = "https://twitter.com/intent/tweet?text=" + tweetMsg;
    }else{
      var twitterLink = "https://twitter.com/share?text=" + tweetMsg;
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
    jumpToPage: 2,
    onSwipeEnd: function() {
      var first = this.pages[0],
          last = this.pages[this.pages.length - 1];
      if (first === this.activeElement) {
        this.jumpToPage(this.pages.length - 1 );
      }
      if (last === this.activeElement) {
        this.jumpToPage(2);
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
    var page = $(event.target).data("page")+2;
    $(".container").dragend({
      scrollToPage: page,
      duration: 750,
    });
    setTimeout(function(){
      $('body').removeClass('opened');
    }, 1000);
  });
  $("header .mark, header h1").click(function(event) {
    $(".container").dragend({
      scrollToPage: 2,
      duration: 750,
    });
  });
}

function gridFunctionality(){ //Grid click functionality
  $(".grid-element .overlay").click(function(event) {
    var page = $(event.target).parents(".grid-element").index()+3;
    $(".container").dragend({
      scrollToPage: page,
      duration: 750,
    });
  });
}

function pagerFunctionality(){ //next/previous button functionality
  $(".pager").click(function(event) {
    var page = $(event.target).parents(".page").index();
    if($(this).hasClass('next')){
      page +=2;
    }
    $(".container").dragend({
      scrollToPage: page
    });
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
    $('.iframe-container .hero-video').attr('src', $(this).data('video'));
  });
}

function openExpanders(){ //Collapses and opens expanders
  $('.expander').each(function(){
    var expander = $(this);
    var content = expander.find('.content-block');
    var contentHeight = content.height();
    content.css('max-height', contentHeight);
    if(contentHeight>300){
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
    if('home_page'===e.slug){
    }else{
      var page=siteData.findIndex(function(element){
        return element.slug===e.slug;
      });
      $('section.menu ul').append($(container).load('/html_imports/'+html,function(){
        $(this).children('h3').attr('data-page', page).text(e.name);
      }));
    }
  });
}

function loadHeroVideo(section, sectionData, pageIndex){
  var overlay='rgba(220,180,180,0.5)';
  var iframeSrc='https://www.youtube.com/embed/'+sectionData.video+'?autoplay=0&origin=http://'+window.location.hostname;
  var background='background-image: -moz-linear-gradient(-45deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+sectionData.image+');background-image: -webkit-linear-gradient(-45deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+sectionData.image+'); background-image: linear-gradient(135deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+sectionData.image+'); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#bcbec0", endColorstr="#bcbec0",GradientType=1 ), url(/_assets/images/video/'+sectionData.image+'); background-image:linear-gradient(135deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+sectionData.image+');';
  setTimeout(function(){
    $('.page-'+pageIndex+' section.'+sectionData.type).load('html_imports/'+sectionData.type+'.html', function(){
      setTimeout(function(){
        var thisSection= $('.page-'+pageIndex+' section.'+sectionData.type).addClass('clearfix');
        thisSection.attr('id', 'video-hero');
        thisSection.find('.hero-background').attr('style', background);
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
      },0);
    });
  }, 0);
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
  },0);
}

function loadGrid(section, sectionData){ // import and formats grid type content sections and grid items
  sectionData.items.forEach(function(item, index){
    section.append($("<div class='grid-element'>").addClass('element-'+index));
    setTimeout(function(){
      $('.element-'+index).load('html_imports/grid-element.html', function(){
        $(this).children('img').attr('src', '_assets/images/icons/BetterWay_'+item.image);
        $(this).children('.card').children('h3').text(item.header);
        $(this).children('.card').children('p').text(item.text);
        if(index===sectionData.items.length-1){
          initiateFunctionality();
        }
      });
    }, 0);
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
  }, 0);
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
  }, 0);
}

function loadPagers(pageIndex){// imports previous/next buttons on interior pages
  var pager = {next:{name:''}, previous:{name:''}};
  switch (true){
    case (1===pageIndex):
      pager.next.name=siteData[pageIndex+1].name;
      pager.previous.name=siteData[siteData.length-1].name;
      break;
    case (siteData.length-1===pageIndex):
      pager.next.name=siteData[1].name;
      pager.previous.name=siteData[pageIndex-1].name;
      break;
    default:
      pager.next.name=siteData[pageIndex+1].name;
      pager.previous.name=siteData[pageIndex-1].name;
      break;
  }
 $('.container .page-'+pageIndex+' .expander').eq(0).append($("<span class='pagers justify space-between'>").load('html_imports/pagers.html', function(){
    $(this).find('.previous .button').text(pager.previous.name);
    $(this).find('.next .button').text(pager.next.name);
  }));
}

// function QueryString() {
//   // Grabs Params
//   var query_string = {};
//   var query = window.location.search.substring(1);
//   var vars = query.split("&");
//   for (var i=0;i<vars.length;i++) {
//     var pair = vars[i].split("=");
//         // If first entry with this name
//     if (typeof query_string[pair[0]] === "undefined") {
//       query_string[pair[0]] = decodeURIComponent(pair[1]);
//         // If second entry with this name
//     } else if (typeof query_string[pair[0]] === "string") {
//       var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
//       query_string[pair[0]] = arr;
//         // If third or later entry with this name
//     } else {
//       query_string[pair[0]].push(decodeURIComponent(pair[1]));
//     }
//   } 
//   return query_string;//Grabs Params from URL
// }

function buildPages(pages){
  staticImports();
  pages.forEach(function(e, i){
    var container = $('<div class="page page-'+i+'">');
    $('.container').append(container);
    e.sections.forEach(function(element, index){
      container.append($('<section class="section clearfix '+element.type+' section-'+index+'">'));
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
  }
  innerElements(section, sectionData, pageIndex);
}

