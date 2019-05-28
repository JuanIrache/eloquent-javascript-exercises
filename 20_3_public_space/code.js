let select = document.querySelector('#file');
let text = document.querySelector('#text');
let filename = document.querySelector('#filename');
let save = document.querySelector('#save');
let del = document.querySelector('#delete');
let root = 'http://localhost:8000';
fetch(`${root}/`)
  .then(res => {
    if (res.status !== 200) console.error(`Error ${res.status}`);
    else return res.text();
  })
  .then(text => {
    const files = text.split('\n');
    files.forEach(f => {
      let option = document.createElement('option');
      option.innerHTML = f;
      select.appendChild(option);
    });
  });

select.addEventListener('change', e => {
  if (select.value) {
    filename.value = select.value;
    fetch(`${root}/${select.value}`)
      .then(res => {
        if (res.status !== 200) console.error(`Error ${res.status}`);
        else return res.text();
      })
      .then(t => {
        text.innerHTML = t;
      });
  } else {
    filename.value = '';
    text.innerHTML = '';
  }
});

save.addEventListener('click', e => {
  if (filename.value) {
    fetch(`${root}/${filename.value}`, {
      method: 'PUT',
      body: text.innerHTML,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else console.error('missing filename');
});
