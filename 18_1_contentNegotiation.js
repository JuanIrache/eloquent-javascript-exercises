fetch('https://eloquentjavascript.net//author', { headers: { accept: 'text/plain' } })
  .then(resp => resp.text())
  .then(resp => console.log('\nplain\n', resp));
fetch('https://eloquentjavascript.net//author', { headers: { accept: 'text/html' } })
  .then(resp => resp.text())
  .then(resp => console.log('\nHTML\n', resp));
fetch('https://eloquentjavascript.net//author', { headers: { accept: 'application/json' } })
  .then(resp => resp.text())
  .then(resp => console.log('\nJSON\n', resp));
fetch('https://eloquentjavascript.net//author', { headers: { accept: 'application/rainbows+unicorns' } })
  .then(resp => resp.text())
  .then(resp => console.log('\nRainbows\n', resp));
