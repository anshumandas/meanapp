'use strict';

/**
This will work with the following MenuSchema 
    {
      title: {type: String, required: true},
      icon: {clazz:String, beforeTitle:{type:Boolean, default:false}}, //AD:only supports css icons
//      preLogin: {type:Boolean, default:false},//redundant due to permission
      postLogin: {type:Boolean, default:true}, //whether should be shown after login
      showIf: String,
      hideIf: String,
      permission: [{type: String, enum: config.userRoles, default: config.userRoles[0]}], //guest means available preLogin, user or admin means only postLogin
      onClick: String,
      link: String, //you can have link/api/sub menu. 
      state: String,
      submenu:[MenuSchema], //submenu inherits parent's artibutes on permissions unless overridden
      api: String//API call that will be used to populate submenu dynamically by angular
    };
    The controller must have functions user(), isLoggedIn(), hasPermission(permission), isActive(path), extFN(fn)
*/

angular.module('meanappApp')
  .directive('menu', function ($compile) {  
      
    function capitaliseFirstLetter(string) {
        if(string)
            return string.charAt(0).toUpperCase() + string.slice(1);
    };      
        
    function compile(val, scope){
        var i = val.indexOf('{');
        if(i > -1) {              
            var pre = val.substring(0, i);
            var j = val.indexOf('}'); 
            var post = val.substring(j+2);
            var e = val.substring(i+2,j-1).trim();
            var c = pre + ' ' + capitaliseFirstLetter(scope.$eval(e)) + post;
            return c;
        }
        return val;
    };
      
    function createBasicMenuItem(a, item, scope){                     
        var b = angular.element('<b>');
        if(item.icon && item.icon.clazz) {
            b.addClass(item.icon.clazz);
        }
        if(item.icon && item.icon.clazz && item.icon.beforeTitle) {
            a.append(b);
        }
        a.html(compile(item.title, scope)); 
        if(item.icon && item.icon.clazz && !item.icon.beforeTitle) {
            a.append(b);
        }
    };
        
    function createMenu(scope, elem, items, parent){
        if(!items) return;
            
        items.forEach(function(item){ 
            var ngshow='',
                nghide='', ng=' ', ug='', e, a;  
            
            if(item.permission){
                ngshow = ngshow.concat('ng-show=\"hasPermission({permission:\''+item.permission+'\'})');
            }
            
            if(item.showIf) {
                if(ngshow!== '') {
                    ngshow = ngshow.concat(' && ');                    
                } else {
                    ngshow = ngshow.concat('ng-show=\"');                    
                }
                ngshow = ngshow.concat(item.showIf);
            }
            
            if(ngshow!== '') {
                ng = ng.concat(ngshow+'\"');
            }
                        
            if(item.postLogin === false) {
                nghide = nghide.concat('ng-hide=\"isLoggedIn()');
            } 
            
            if(item.hideIf) {
                if(nghide!== '') {
                    nghide = nghide.concat(' && ');                    
                } else {
                    nghide = nghide.concat('ng-hide=\"');                    
                }
                nghide = nghide.concat(item.hideIf);
            } 
            
            if(nghide!== '') {
                ng = ng.concat(nghide+'\"');
            }
            
            if(item.state) {
                ug = ug.concat(' ui-sref=\"'+item.state+'\"');
            }

            if(item.api) {
                //TODO - api calls an external function to populate list. Create cache and timeout logic for refresh. Use socket.io concept
                //should I just use resource here and skip services
                
//                return $resource('/api/sites/:id/:controller', {
//      id: '@_id'
//    },
                
            } 
            else if(item.submenu && item.submenu.length>0) {
                e = angular.element('<li dropdown'+ng+'>');
                e.addClass("dropdown");
                a = angular.element('<a href="#" dropdown-toggle'+ug+'>');
                a.addClass("dropdown-toggle");
                createBasicMenuItem(a, item, scope);
                e.append(a);     
                var ul = angular.element('<ul>');
                ul.addClass('dropdown-menu');
                createMenu(scope,ul, item.submenu, item);
                e.append(ul);
            } else {
                if(item.link) {
                    e = angular.element('<li ng-class="{active: isActive({route:\''+item.link+'\'})}\"'+ng+'>');
                    a = angular.element('<a href=\"'+item.link+'\"'+ug+'>');
                } else if(item.onClick){
                    e = angular.element('<li>');
                    a = angular.element('<a ng-click=\"extFn({fn:\''+item.onClick+'\'})\"'+ug+'>');
                } else {
                    e = angular.element('<li>');
                    a = angular.element('<a href=\"#\"'+ng+'>');
                }

                if(parent) a.addClass("dropdown-option");
                createBasicMenuItem(a, item, scope);
                e.append(a);
            }
            elem.append(e);
        });
        
    };
      
    var link = function(scope, elem, attrs) {   
//        scope.$watch(attrs.items, function(value) {
//          if(value) {
//            scope.items = value; 
//            createMenu(scope, elem, scope.items);
//          }
//        }); 
        createMenu(scope, elem, scope.items);
        $compile(elem.contents())(scope);
    };
      
    return {
        restrict: 'A',
        scope: {
          items: '=',
          user:'&',
          extFn:'&',
          isLoggedIn: '&',
          isActive:'&',
          hasPermission: '&'
        },
        link: link
    };
});