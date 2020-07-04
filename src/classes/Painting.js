import { switchIndex, dom, setStyle, query, queryAll } from '../functions';
import Layer from './Layer';

export default class Painting {
   constructor(container) {
      this.layers = [];

      this.container = container;
      this.el = dom('div', 'painting');

      // grab, calculate and set default painting values
      this.mapDimensions(7, 4, 128);

      // variable to disable hovering highlights when rendering final image
      this.rendering = false;
   }

   render() {
      this.container.appendChild(this.el);

      const id = this.createLayer();
      this.focusLayer(id); // todo
      this.hookListeners();
   }

   createLayer() {
      const new_layer = new Layer(this, 1, 4, 'Px437 IBM CGAthin');
      this.layers.push(new_layer);
      this.el.appendChild(new_layer.canvas);
      this.updateLayerStack();

      return new_layer.id;
   }

   focusLayer(id) {
      for (let i = 0; i < this.layers.length; i++) {
         if(id == this.layers[i].id){
            this.focusedLayer = this.layers[i];
            break;
         }
      }
      //TODO Update layer option values
   }

   mapDimensions(cols, rows, cell_size) {
      this.cols = cols;
      this.rows = rows;
      this.cell_size = cell_size;

      // calculated values
      this.width = cols * cell_size;
      this.height = rows * cell_size;

      setStyle(this.el, { width: this.width + "px", height: this.height + "px", border: "1px solid #CACACA" });

      // TODO recalculate existing layer grids
      this.recalculateLayers();
   }

   recalculateLayers() {
      this.layers.forEach((layer) => {
         layer.mapLayer();
      });
   }

   switchLayer(index, positions) {
      switchIndex(this.layers, index, positions)
      this.updateLayerStack();
   }

   updateLayerStack() {
      // * Set z-index according to layer index
      // * Re-organize (or clean and create?) layer list view
   }

   renderImage() {
      //TODO
   }

   /* -------------------------------------------------------------------------- */
   /*                        EVENT LISTENERS AND HANDLERS                        */
   /* -------------------------------------------------------------------------- */

   hookListeners() {
      // On mouse move
      this.el.addEventListener('mousemove', e => this.handleMouseMove(e));
      // On click
      this.el.addEventListener('click', e => this.handleClick(e));
   }

   handleMouseMove(e){
      if(this.rendering) return;
      this.focusedLayer.handleMouseMove(e);
   }
   
   handleClick(e){
      if(this.rendering) return;
      this.focusedLayer.handleClick(e);
   }

}