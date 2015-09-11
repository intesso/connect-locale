var test = require('tape');
var Locale = require('../server');

test('require all strategies with Arrays', function(t){
  try{
    var locale = Locale({
      locales: ['de', 'de-ch', 'en', 'en-GB', 'en-us'],
      getLocaleFrom: ['subdomain', 'query', 'path', 'cookie', 'accept-language', 'default'],
      storeLocaleTo: ['cookie', 'session', 'request', 'locals']
    });
    t.true(locale);
    t.end();
  } catch(e) {
    t.fail('initialization failed', e.message);
    t.end(e);
  }
});


test('require all strategies with Strings', function(t){
  try{
    var locale = Locale({
      locales: 'de,de-ch,en,en-GB,en-us',
      getLocaleFrom: 'subdomain,query,path,cookie,accept-language,default',
      storeLocaleTo: 'cookie,session,request,locals'
    });
    t.true(locale);
    t.end();
  } catch(e) {
    t.fail('initialization failed', e.message);
    t.end(e);
  }
});