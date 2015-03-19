'use strict';

describe('Directive: menu', function () {

  // load the directive's module and view
  beforeEach(module('meanappApp'));
  beforeEach(module('components/menu/menu.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<menu></menu>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the menu directive');
  }));
});