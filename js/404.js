$(document).ready(function(){
  staticImports();

  function staticImports(){ // import all global, static HTML imports
    var statics = ['header.html','footer.html'];
    statics.forEach(function(e, i){
      var container='header';
      if(statics.length===i+1){
        container='footer';
      }
      $(container).append($('<div>').load('html_imports/'+e, function(){
        if(e==='header.html'){
          $('.hamburger').click(function(event){// Opens the Nav Menu And Starts Hamburger Transition
            console.log('test');
            document.location.href="/";
          }); 
        }
      }));
    });
  }
});
