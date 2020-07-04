import $ from 'jquery';
import { makeElement } from '../functions.js';
import Layer from './Layer';

export default class Grid {
   constructor(container) {
      this.el = makeElement('div', 'grid');
      this.container = container;

      this.layers = [];
      this.currentLayer = null;
   }

   render(grid) {
      // create initial layer
      const new_layer = new Layer(this, 1);
      this.layers.push(new_layer);
      this.currentLayer = new_layer;

      this.hookEvents(); // hook events for selections and stuff

      // append grid style and element to body
      this.container.appendChild(this.el);
      this.mapGrid(grid); // draw grid with current layer
   }

   hookEvents() {
      $('body').on('click', '.char', (e) => this.currentLayer.select(e));
   }

   mapGrid(grid) {
      this.rows = grid.rows;
      this.cols = grid.cols;
      this.cell_size = grid.cell_size;

      const grid_width = grid.cols * grid.cell_size;
      const grid_height = grid.rows * grid.cell_size;
      $(this.el).css({width: grid_width, height: grid_height});

      this.currentLayer.update();
   }

}