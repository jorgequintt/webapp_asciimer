import $ from 'jquery';
import Grid from './classes/Grid';
import { getRand, genRand } from './functions.js';

$(document).ready(() => {

   /* ------------------------------ RENDER LAYOUR ----------------------------- */
   $('body').append('Size: <input type="number" class="grid-size-input" min="0" max="4" step="1" value="1">');
   $('body').append('<input type="button" class="gen-rand-input" value="Rand">');
   
   const grid = new Grid(document.body);
   grid.render({cols: 5, rows: 6, cell_size: 128});

   /* ------------------------------- EVENT HOOKS ------------------------------ */
   $('body').on('change onblur', '.grid-size-input', (e) => {
      const val = e.currentTarget.value;
      grid.currentLayer.update(val);
   });
   $('body').on('click', '.gen-rand-input', genRand);
});
