import $ from 'jquery';

export default class Layer {
   constructor(grid, size) {
      console.log(grid);
      this.grid = grid;
      this.size = size;
      this.accepted_sizes = [2, 4, 8, 12];
      // this.accepted_sizes = [6, 8, 10, 12, 14];
   }

   update(size = false) {
      if (!size) size = this.size;

      // clean layer
      this.grid.el.innerHTML = "";

      // get and calculate character per cell and its size
      const chars_per_cell = this.accepted_sizes[size];
      const char_size = this.grid.cell_size / chars_per_cell;

      const total_chars = {
         x: this.grid.cols * chars_per_cell,
         y: this.grid.rows * chars_per_cell,
         total: (this.grid.cols * this.grid.rows) * Math.pow(chars_per_cell, 2),
      };

      // add style of chars to grid
      let style = document.createElement('style');
      style.innerHTML = `.char{width: ${char_size}px;height: ${char_size}px;font-size: ${char_size}px;}`;
      this.grid.el.appendChild(style);

      /* ------------------------------- Draw Chars ------------------------------- */

      let x = 0;
      let y = 0;

      const char = document.createElement('div');
      char.classList.add('char');
      char.innerHTML = "?";
      for (let i = 0; i < total_chars.total; i++) {
         const _char = char.cloneNode(true);
         _char.setAttribute('data-x', x);
         _char.setAttribute('data-y', y);

         this.grid.el.appendChild(_char);

         // count x and y
         x++; if (x == total_chars.x) { x = 0; y++; }
      }
   }

   /* -------------------------------------------------------------------------- */
   /*                                event actions                               */
   /* -------------------------------------------------------------------------- */

   select(e) {
      e.preventDefault();
      const shifted = e.shiftKey;
      const ctrled = e.ctrlKey;

      const selection_1 = this.grid.el.querySelector('.first-selected-char');
      if (shifted) {
         if (!!selection_1 && selection_1 != e.currentTarget) {
            // get all selected
            $(selection_1).removeClass('first-selected-char');

            const x = parseInt($(selection_1).attr('data-x'));
            const y = parseInt($(selection_1).attr('data-y'));
            const xx = parseInt($(e.currentTarget).attr('data-x'));
            const yy = parseInt($(e.currentTarget).attr('data-y'));

            this.selectArea(x, y, xx, yy, !!ctrled);
            return;
         } else {
            $(e.currentTarget).addClass('first-selected-char');
            return;
         }
      } else if (ctrled) {
         $(e.currentTarget).toggleClass('selected-char');
         return;
      }

      // clean selection
      !!selection_1 && $(selection_1).removeClass('first-selected-char');
      $('.selected-char').removeClass('selected-char');
      $(e.currentTarget).addClass('first-selected-char');
   }

   selectArea(x, y, xx, yy, border = false) {
      // console.log(x, y, xx, yy);
      const xi = x < xx ? 1 : -1;
      const yi = y < yy ? 1 : -1;

      // for every row
      for (let indy = y; indy != yy + yi; indy += yi) {
         for (let indx = x; indx != xx + xi; indx += xi) {
            const inBorder = (indx == x || indx == xx) || (indy == y || indy == yy);

            if (!border || (border && inBorder)) {
               this.grid.el.querySelector(`[data-x="${indx}"][data-y="${indy}"]`).classList.add('selected-char');
            }
         }
      }
   }
}