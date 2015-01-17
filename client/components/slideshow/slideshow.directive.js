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
          
        if(!slides || slides.length === 0) return;
          
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
//                if (j < steps.length - 1) {
//                  subSection.attr('data-autoslide', '1000');
//                }
                section.append(subSection);
              }
            }

            elem.append(section);
        }
        
          updateSettings(config);
    }
            
    var updateSettings = function(config) { 
        var settings = { 
            theme: 'default',
            transition: 'default',
//            loop: false, 
//            controls: true,
            progress: false,
            history: false,
            center: true
        };
          
        if(config) { 
            if(config.theme) {            
              settings.theme =  config.theme; // available themes are in /css/theme
            };            

            if(config.transition) {            
              settings.transition =  config.transition; // available themes are in /css/theme
            };

            if(config.background){            
              // Parallax scrolling            
              settings.parallaxBackgroundImage= config.background;
              settings.parallaxBackgroundSize= '2100px 900px';
            };            
        };
            
        Reveal.initialize(settings);          
    };
      
    var link = function(scope, elem, attrs) {

        scope.$watch(attrs.slides, function(value) {
          scope.slides = value;
          updateSlides(scope.slides, scope.reveal, elem);
        });

//        updateSlides(scope.slides, scope.reveal, elem);
    };
      
    return {
        restrict: 'E',
        scope: {
          slides: '=slides',
          reveal: '=config'
        },
        link: link
    }

});