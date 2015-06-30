var test = require('tape');

test('reuse local variable in inner function (same name) -> does not get overwritten', function(t){
  var reused = 'hello';

  ['sauabona', 'hi', 'ciao', 'hoi', 'salue', 'hello'].forEach(function(reused){
    if (reused == 'hello') reused = 'hello world';
  });

  t.equal(reused, 'hello');
  t.end();
});

test('try use variable from inner function in outer function -> does not exist', function(t){

  ['sauabona', 'hi', 'ciao', 'hoi', 'salue', 'hello'].forEach(function(reused){
    if (reused == 'hello') reused = 'hello world';
  });

  t.equal(typeof reused, 'undefined');
  t.end();
});

test('assign outer variable in inner function -> gets persisted', function(t){
  var outer = 'hello';

  ['sauabona', 'hi', 'ciao', 'hoi', 'salue', 'hello'].forEach(function(hello){
    if (hello == 'hello') outer = 'hello world';
  });

  t.equal(outer, 'hello world');
  t.end();
});
