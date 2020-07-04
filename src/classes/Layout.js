import $ from 'jquery';
import { dom, query, queryAll } from '../functions';
import '../style/uikit.min.css';

import Painting from './Painting';

export default class Layout {
   constructor() {
      // Options sidebar
      this.optionsContainer = dom('div', 'options-container', {
         style: { display: "flex", height: "100vh", flex: "1", borderLeft: "1px solid #CACACA" }
      });
      // Layers and menu section
      this.layersContainer = dom('div', 'layers-container', {
         style: { height: "100vh", flex: "1", borderRight: "1px solid #CACACA" }
      });
      this.menuContainer = dom('div', 'menu-container', {
         style: { height: "100vh", flex: "7", padding: "10px 13px" }
      });
      this.optionsContainer.appendChild(this.layersContainer);
      this.optionsContainer.appendChild(this.menuContainer);

      // Painting
      this.paintingContainer = dom('div', 'painting-container', {
         style: { height: "100vh", flex: "2.5", display: "flex", justifyContent: "center", alignItems: "center" }
      });

      // App
      this.appContainer = dom('div', 'app-container', {
         style: {
            display: "flex",
            justifyContent: "center",
            alignItems: 'center'
         }
      });

      this.populateOptions();
      this.createPainting();
   }

   render() {
      this.appContainer.appendChild(this.paintingContainer);
      this.appContainer.appendChild(this.optionsContainer);

      document.body.appendChild(this.appContainer);
      this.hookListeners();
   }

   populateOptions() {
      // Painting: Cols, rows, cell size
      const paintingOptions = dom('div', 'painting-options');
      // Add title
      paintingOptions.appendChild(dom('h5', '', {}, "Painting Options"));
      // Field holder
      const fields = dom('div', 'painting-options-fields', {
         style: { display: "flex", justifyContent: "space-between" }
      });
      // Add fiels
      const default_painting_values = { 'cols': 5, 'rows': 5, 'cell-size': 128 };
      for (let k in default_painting_values) {
         fields.appendChild(dom('input', `painting-${k}-value`, {
            type: "number",
            style: { width: "65px" },
            placeholder: k,
            value: default_painting_values[k]
         }));
      }

      // Add button
      fields.appendChild(dom('button', 'save-painting-values-btn', {}, "Save"));

      // Append fields to Painting Options Container
      paintingOptions.appendChild(fields);
      this.menuContainer.appendChild(paintingOptions);

      // Separator
      this.menuContainer.appendChild(dom('hr'));

      // Layer options: pix per cell
      const layerOptions = dom('div', 'layer-options');
      // Add title
      layerOptions.appendChild(dom('h5', '', {}, "Layer Options"));

      // Create fields container to add it later
      const layerFields = dom('div', 'layer-options-fields', {
         style: { display: "flex", justifyContent: "space-between" }
      });

      // Select Font Family Field
      const selectFontFamily = dom('select', `layer-font-family-value`, {
         style: { width: "180px" },
         placeholder: 'font-family'
      });

      // Fonts -- Value represents how many of that caracter fits in a square
      const fonts = {'Px437 IBM CGAthin': 1, 'Consolas': 2};
      for(let k in fonts){
         selectFontFamily.appendChild(dom('option', "", { value: k, 'data-length': fonts[k] }, `${k} (${fonts[k]})`));
      }
      layerFields.appendChild(selectFontFamily);

      // Select Pix Size Field
      const selectPixSize = dom('select', `layer-pix-size-value`, {
         style: { width: "100px" },
         placeholder: 'pix-size'
      });
      [2, 4, 6, 8, 10, 12, 14, 16].forEach((key) => {
         selectPixSize.appendChild(dom('option', "", { value: key }, "" + key));
      });
      layerFields.appendChild(selectPixSize);
      
      // Add Save button and add it to Layer options
      layerFields.appendChild(dom('button', 'save-layer-values-btn-1', {}, "Save"));
      layerOptions.appendChild(layerFields);
      this.menuContainer.appendChild(layerOptions);
   }

   createPainting() {
      this.painting = new Painting(this.paintingContainer);
      this.painting.render();
   }

   /* -------------------------------------------------------------------------- */
   /*                        EVENT LISTENERS AND HANDLERS                        */
   /* -------------------------------------------------------------------------- */

   hookListeners() {
      // Painting Save button
      query('#save-painting-values-btn').addEventListener('click', e => this.setPaintingDimensions(e));
      query('#save-layer-values-btn-1').addEventListener('click', e => this.setLayerDimensions(e));
   }

   setPaintingDimensions(e) {
      const cols = query('#painting-cols-value').value;
      const rows = query('#painting-rows-value').value;
      const cell_size = query('#painting-cell-size-value').value;

      const no_number = isNaN(cols) || isNaN(rows) || isNaN(cell_size);
      if (!no_number) {
         this.painting.mapDimensions(cols, rows, cell_size);
      }
   }

   setLayerDimensions(e){
      const font_family = query('#layer-font-family-value').value;
      // length is "chars per square"
      const length = query(`#layer-font-family-value option[value="${font_family}"]`).getAttribute('data-length');
      const multiplier = query('#layer-pix-size-value').value;

      this.painting.focusedLayer.mapPixies(parseInt(length), parseInt(multiplier), font_family);
   }

   //* After selection feature...
   //TODO paint, set char selected
   //TODO Move to electron to load images and color grid?

   /* -------------------------------------------------------------------------- */

}