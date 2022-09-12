// const btn = document.getElementById('btn');
const nik = document.querySelectorAll('.nikunj');

let index = 0;

const colors = ['white','#00a0f7'];

// btn.addEventListener('click', function onClick() {

  // btn.style.backgroundColor = colors[index];
//   btn.contains = 'following'

//   index = index >= colors.length - 1 ? 0 : index + 1;
// });

nik.forEach((e)=>{
  e.addEventListener('click',()=>{
    e.style.backgroundColor =  colors[index];

    if(e.style.backgroundColor == 'white'){
      // e.style.display = 'none';
      e.innerHTML = 'following' ;

      // window.location.href = '/following';
    }
    else{
      e.innerHTML = 'Follow' ;
      // e.style.display ='block';
    }

    index = index >= colors.length - 1 ? 0 : index + 1;

  })

}


)
