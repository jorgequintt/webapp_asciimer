import $ from 'jquery';

window.onload = () => {
   const canvas1 = document.createElement('canvas');
   const canvas2 = document.createElement('canvas');
   const cw = 400;
   const ch = 400;

   canvas1.width = cw;
   canvas1.width = ch;
   canvas1.style = 'position:absolute;z-index:0;';
   canvas1.setAttribute('data-name', 'canvas red');
   canvas1.addEventListener('mousemove', (e) => {
      console.log(e.currentTarget.getAttribute('data-name'));
   });

   canvas2.width = cw;
   canvas2.width = ch;
   canvas2.style = 'position:absolute;z-index:1;';
   canvas2.setAttribute('data-name', 'canvas blue');
   // canvas2.addEventListener('mousemove', (e) => {
   //    console.log(e.currentTarget.getAttribute('data-name'));
   // });

   const c1 = canvas1.getContext('2d');
   c1.fillStyle = 'red';
   c1.fillRect(5, 5, 30, 30);

   const c2 = canvas2.getContext('2d');
   c2.fillStyle = 'blue';
   c2.fillRect(15, 15, 30, 30);

   const container = document.createElement('div');
   container.appendChild(canvas2);
   container.appendChild(canvas1);

   document.body.appendChild(container);
};