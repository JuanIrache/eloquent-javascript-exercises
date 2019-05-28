let select = document.querySelector('#file');
let text = document.querySelector('#text');
let filename = document.querySelector('#filename');
let save = document.querySelector('#save');
let del = document.querySelector('#delete');
let root = 'http://localhost:8000';

function loadSelect() {
  fetch(`${root}/`)
    .then(res => {
      if (res.status !== 200) console.error(`Error ${res.status}`);
      else return res.text();
    })
    .then(text => {
      const files = text.split('\n');
      select.innerHTML = '';
      let choose = document.createElement('option');
      choose.innerHTML = 'Choose file';
      choose.value = '';
      select.appendChild(choose);
      files.forEach((f, i) => {
        let option = document.createElement('option');
        option.innerHTML = f;
        select.appendChild(option);
        if (f === filename.value) select.selectedIndex = i + 1;
      });
    });
}

loadSelect();

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
  e.preventDefault();
  if (filename.value) {
    fetch(`${root}/${filename.value}`, {
      method: 'PUT',
      body: text.value,
      headers: {
        'Content-Type': 'text/plain'
      }
    }).then(loadSelect);
  } else console.error('missing filename');
});

del.addEventListener('click', e => {
  if (filename.value) {
    fetch(`${root}/${filename.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'text/plain'
      }
    }).then(loadSelect);
    filename.value = '';
    text.innerHTML = '';
  } else console.error('missing filename');
});
