'use strict';

angular.module('meanappApp')
  .directive('slideshow', function () {
      
    var makeSlide = function(step){
      var section = angular.element('<section>');
      if(step.heading) {
        var heading = angular.element('<h1>').html(step.heading);
        section.append(heading);
      }
      if(step.description) {
        var content = angular.element('<p>').html(step.description);
        section.append(content);
      }
      if(step.list) {
        var list;
          if(step.list.ordered) { 
              list = angular.element('<ol>');
          } else {
              list = angular.element('<ul>'); 
          }
          for (var j = 0; j < step.list.items.length; j++) {
              var item = angular.element('<li>').html(step.list.items[j]);
              list.append(item);
          }
        section.append(list);
      }
      return section;
    };
      
      var updateSlides = function(slides, config, elem) { 
          
        if(!slides || slides.length === 0) { return; }
          
        elem.addClass('slides');
        for (var i = 0; i < slides.length; i++) {
            var section;
            var steps = slides[i].steps;

            if (steps.length === 1) {
              section = makeSlide(steps[0]);    
            } else {
              section = angular.element('<section>');
              for (var j = 0; j < steps.length; j++) {
                var subSection = makeSlide(steps[j]); 
                section.append(subSection);
              }
            }

            if (config.autoslide === true) {
              section.attr('data-autoslide', '2000');
            }
            elem.append(section);
        }
        
          updateSettings(config);
    };
            
    var updateSettings = function(config) { 
//        console.log(config);
        var settings = { 
            theme: 'default',
            transition: 'default',
            loop: true, 
//            controls: true,
            progress: false,
            history: false,
            center: true
        };
          
        if(config) { 
            if(config.theme) {            
              settings.theme =  config.theme; // available themes are in /css/theme
            }            

            if(config.transition) {            
              settings.transition =  config.transition; // available themes are in /css/theme
            }

            if(config.background){            
              // Parallax scrolling            
              settings.parallaxBackgroundImage= config.background;
              settings.parallaxBackgroundSize= '2100px 900px';
            }            
        }
            
        Reveal.initialize(settings);          
    };
      
    var link = function(scope, elem, attrs) {
        
        scope.$watch(attrs.slides, function(value) {
//            console.log(value);
          if(value) {
            scope.slides = value;
            updateSlides(scope.slides, scope.config, elem);
          }
        });

//        updateSlides(scope.slides, scope.config, elem);
    };
      
    return {
        restrict: 'E',
        scope: {
          slides: '=slides',
          config: '=config'
        },
        link: link
    };
});