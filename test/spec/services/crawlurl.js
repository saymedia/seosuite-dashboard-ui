'use strict';

describe('Service: CrawlUrl', function () {

  // load the service's module
  beforeEach(module('reclusedashApp'));

  // instantiate service
  var CrawlUrl;
  beforeEach(inject(function (_CrawlUrl_) {
    CrawlUrl = _CrawlUrl_;
  }));

  it('should do something', function () {
    expect(!!CrawlUrl).toBe(true);
  });

});
