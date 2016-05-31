var siteData={};
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

    pageSwiper();//Must be called after page is built but before all other page interaction functions

    social();
    openVideo();
    openMenu();
    openExpanders();
    menuFunctionality();
    gridFunctionality();
    pagerFunctionality();
    subscriber();
    setTimeout(function(){
      $('.page').eq(1).css('height', 'auto').parent().css('max-height', $('.page').eq(1).height());// Adjusts the page height to match the initial.
    }, 1000);
  }, 1000);
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

function openMenu(){ //Opens the hamburger menu
  $('.hamburger').click(function(event){// Opens the Nav Menu And Starts Hmburger Transition
    $(this).parents('body').toggleClass('opened');
  });
}

function openVideo(){ //opens hero video modals
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
    var child = expander.children('.content-block');
    var childHeight = child.height();
    child.css('max-height', childHeight);
    if(childHeight>300){
      expander.addClass('collapsed');
      expander.find('button').click(function(event){
        expander.toggleClass('collapsed');
        var text = $(this).children('.text').text();
        $(this).children('.text').text(" Expand To read more" === text ? " Collapse" : " Expand To read more");
        $(this).children('.plus').text(" Expand To read more" === text ? "-" : "+" );
      });
    }else{
      expander.find('button').css('display', 'none');
    }
  });
}

function importEl(type){//imports itms for loader functions
  var importedElement = $('.organic-imports .'+type+'-import link[rel="import"]')[0].import;
  return importedElement.querySelector('.'+type); 
}

function staticImports(){ // import all global, static HTML imports
  for(var i=0; i<$('.static-sections link[rel="import"]').length; i++){
    var link=$('.static-sections link[rel="import"]')[i];
    var content = link.import;
        var el = content.querySelector('section');// Grab DOM from html's document.
    var container='header';
    if($('.static-sections link[rel="import"]').length===i+1){
      container='footer';
    }
    $(container).append(el.cloneNode(true));
  }
}

function menuImports(data){ // Insert page links into menu
  data.forEach(function(e, i){
    if('home_page'===e.slug){
    }else{
      var page=siteData.findIndex(function(element){
        return element.slug===e.slug;
      });
      var el = importEl('menu-element');
      el.querySelector('h3').setAttribute('data-page', page);
      el.querySelector('h3').innerHTML=e.name;
      $('section.menu ul').append(el.cloneNode(true));
    }
  });
}

function loadHeroVideo(data){
  var el = importEl(data.type);
  var overlay='rgba(220,180,180,0.5)';
  var background='background-image: -moz-linear-gradient(-45deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+data.image+');background-image: -webkit-linear-gradient(-45deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+data.image+'); background-image: linear-gradient(135deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+data.image+'); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#bcbec0", endColorstr="#bcbec0",GradientType=1 ), url(/_assets/images/video/'+data.image+'); background-image:linear-gradient(135deg, '+overlay+' 0%, '+overlay+' 100%), url(/_assets/images/video/'+data.image+');';
  el.querySelector('.hero-background').setAttribute('style', background);
  var iframeSrc='https://www.youtube.com/embed/'+data.video+'?autoplay=0&origin=http://'+window.location.hostname;
  el.querySelector('.video-button').setAttribute('data-video', iframeSrc);
  el.querySelector('h1').innerHTML=data.header;
  if(data.fb){
    $('.page').last().addClass('alt');
    el.querySelector('.fb-click').setAttribute('class', 'active fb-click');
    el.querySelector('.fb-click').setAttribute('data-title', data.header);
    el.querySelector('.fb-click').setAttribute('data-text', data.fb);
    el.querySelector('.fb-click').setAttribute('data-image', data.fb_image);
    el.querySelector('.fb-click').setAttribute('data-url', data.link);
  }
  if(data.twt){
    el.querySelector('.twt-click').setAttribute('class', 'active twt-click');
    el.querySelector('.twt-click').setAttribute('data-share', data.twt);
  }
  $('div.page').last().append(el.cloneNode(true));// Imports and formats hero_video type content sections
}

function loadExpander(data){ // import and formats expander type content sections  and sub items

  function loadSubItems(subItems){
    if(subItems){
      el = importEl(data.type+'-ul');
      var currentListItem=$('div.list').last().find('li').last();
      currentListItem.append(el.cloneNode(true));
      subItems.forEach(function(e, i){
        el = importEl(data.type+'-element');
        el.querySelector('h4').innerHTML=e;
        currentListItem.children('ul').append(el.cloneNode(true));
      });
    }
  }

  function loadList(type){
    el = importEl(data.type+'-'+type);
    $('div.list').last().append(el.cloneNode(true));
    data.text.forEach(function(e, i){
      el = importEl(data.type+'-element');
      el.querySelector('h4').innerHTML=e.item;
      $(type).last().append(el.cloneNode(true));
      loadSubItems(e.sub_items);
    });
  }

  var el = importEl(data.type);
  el.querySelector('h2').innerHTML=data.header;
  switch(data.format){
    case "paragraph":
      el.querySelector('p').innerHTML=data.text;
      $('div.page').last().append(el.cloneNode(true));
      break;
    case "ordered list":
      el.querySelector('p').innerHTML='';
      $('div.page').last().append(el.cloneNode(true));
      loadList('ol');
      break;
    case "unordered list":
      el.querySelector('p').innerHTML='';
      $('div.page').last().append(el.cloneNode(true));
      loadList('ul');
      break;
  }
  if(data.class){
    var currentExpander = $('.expander').last();
    if(0===currentExpander.siblings('.last-expanders').length){
      currentExpander.parent().append('<section class="last-expanders clearfix"></section>');
    }
    currentExpander.siblings('.last-expanders').append(currentExpander);
    currentExpander.addClass(data.class);
  }
}

function loadGrid(data){ // import and formats grid type content sections and grid items
  var el = importEl(data.type);
  $('div.page').last().append(el.cloneNode(true));
  // Grid is now on the Dom, now we grab the grid items.
  el = importEl(data.type+'-element');
  data.items.forEach(function(e, i){
    el.querySelector('img').setAttribute('src', '/_assets/images/icons/BetterWay_'+e.image);
    el.querySelector('h3.grid-item-header').innerHTML=e.header;
    el.querySelector('.grid-item-text').innerHTML=e.text;
    $('section.grid').append(el.cloneNode(true));
  });
}

function loadSignUp(data){// Imports and formats sign_up type content sections
  var el = importEl(data.type);
  el.querySelector('p').innerHTML=data.text;
  el.querySelector('h2').innerHTML=data.header;
  $('div.page').last().append(el.cloneNode(true)); 
}

function loadAdditional(data){// Imports and formats "additonal" type content sections
  var el = importEl(data.type);
  $('div.page').last().append(el.cloneNode(true));
  data.items.forEach(function(e, i){
    el = importEl(data.type+'-element');
    el.querySelector('h4').innerHTML=e.text;
    el.querySelector('a').setAttribute('href', e.link);
    $('section.'+data.type+' ul').last().append(el.cloneNode(true));
  });
}

function loadPagers(data, index){// imports previous/next buttons on interior pages
  var el = importEl('pagers');
  var pager = {next:{name:''}, previous:{name:''}};
  switch (true){
    case (1===index):
      pager.next.name=data[index+1].name;
      pager.previous.name=data[data.length-1].name;
      break;
    case (data.length-1===index):
      pager.next.name=data[1].name;
      pager.previous.name=data[index-1].name;
      break;
    default:
      pager.next.name=data[index+1].name;
      pager.previous.name=data[index-1].name;
      break;
  }
  el.querySelector('.next .button').innerHTML=pager.next.name;
  el.querySelector('.previous .button').innerHTML=pager.previous.name;
  $('.page').last().find('section.expander').first().append(el.cloneNode(true));
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

function buildPages(data){
  staticImports();
  menuImports(data);
  data.forEach(function(e, i){
    buildPage(e, i);
  });
}

function buildPage(data, index){ // Builds the page depending on the params from QueryString
  var el = importEl('page');
  $('div.container').append(el.cloneNode(true));
  var page=data;
  // function pageFind(value){
  //   return value.slug===query;
  // }
  // if(undefined!==QueryString().topic){
  //   var query= QueryString().topic;
  //   var index=data.findIndex(pageFind);
  //   page = data[index];
  // }
  page.sections.forEach(function(e, i){
    switch(e.type){
      case 'grid':
        loadGrid(e, i);
        break;
      case 'expander':
        loadExpander(e, i);
        break;
      case 'hero_video':
        loadHeroVideo(e, i);
        break;
      case 'sign_up':
        loadSignUp(e, i);
        break;
      case 'additional':
        loadAdditional(e, i);
        break;
    }
  });
  if($('.page.alt').length>0){
    loadPagers(siteData, index);
  }
}

function subscriber(){
  $("#sign_up .button").click(function(event){
    var email= "ian.b.downie@gmail.com";
    $.post("js/subscribe.js",
    email,
    function(data,status){
      alert("Data: " + data + "\nStatus: " + status);
    });
  });
}

function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj["e"+type+fn] = fn;
    obj[type+fn] = function() { obj["e"+type+fn]( window.event ); };
    obj.attachEvent( "on"+type, obj[type+fn] );
  } 
  else{
    obj.addEventListener( type, fn, false );
  } //Initiates the page
}