'use strict';

describe('Service: CrawlLink', function () {

  // load the service's module
  beforeEach(module('reclusedashApp'));

  // instantiate service
  var CrawlLink;
  beforeEach(inject(function (_CrawlLink_) {
    CrawlLink = _CrawlLink_;
  }));

  it('should do something', function () {
    expect(!!CrawlLink).toBe(true);
  });

});
