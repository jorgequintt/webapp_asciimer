import { switchIndex, dom, setStyle, query, queryAll, getCanvasMousePos, matrixIterate, matrixArea } from '../functions';
import Pix from './Pix';

export default class Layer {
   constructor(painting, length, multiplier, font_family) {
      // Length represents the amount of chars that fit in a square (cell)
      this.grid = [];
      this.id = `c${Date.now()}`;
      this.painting = painting;
      this.length = length;
      this.multiplier = multiplier;
      this.font = { family: font_family, margin: 0 };
      this.canvas = dom('canvas', this.id, {
         style: { zIndex: 999, position: 'absolute' }
      });

      // we set canvas dimensions, calculate pix dimensions and generate the grid
      this.mapLayer();
   }

   mapLayer() {
      //set canvas style
      setStyle(this.canvas, { width: this.painting.width, height: this.painting.height });
      //set canvas true size
      this.canvas.width = this.painting.width;
      this.canvas.height = this.painting.height;
      // map pixies (calculate and generate grid)
      this.mapPixies(this.length, this.multiplier, this.font.family);
   }

   mapPixies(length, multiplier, font_family) {
      this.pix_size = {
         width: this.painting.cell_size / (multiplier * length),
         height: this.painting.cell_size / multiplier,
      };
      // calculate center
      this.pix_center = {
         x: this.pix_size.width / 2,
         y: this.pix_size.height / 2,
      }

      this.font.family = font_family;

      // Re-generate grid
      this.generateGrid();

      // save values for layout or re-calculating layer
      this.length = length;
      this.multiplier = multiplier;
   }

   generateGrid() {
      this.grid = [];
      const v_length = this.painting.height / this.pix_size.height;
      const h_length = this.painting.width / this.pix_size.width;
      for (let v = 0; v < v_length; v++) {
         this.grid[v] = [];
         for (let h = 0; h < h_length; h++) {
            this.grid[v][h] = new Pix(this, '?', 'black');
            this.grid[v][h].x = h;
            this.grid[v][h].y = v;
         }
      }

      // now that we have a new grid, we draw it
      this.drawGrid();
   }

   setScale(scale) {
      this.canvas.width = this.painting.width * scale;
      this.canvas.height = this.painting.height * scale;
      // set scale modifier for drawing
      const ctx = this.canvas.getContext('2d');
      ctx.setTransform(scale, 0, 0, scale);

      this.drawGrid();
   }

   drawGrid(clean = false) {
      matrixIterate(this.grid, (r, c) => {
         // draw each pix
         this.grid[r][c].draw(clean);
      }, false);
   }

   setZIndex(val) {
      setStyle(this.canvas, { zIndex: val });
   }

   setMargin(margin) {
      this.font.margin = margin;
      this.drawGrid();
   }

   /* -------------------------------------------------------------------------- */
   /*                        EVENT LISTENERS AND HANDLERS                        */
   /* -------------------------------------------------------------------------- */

   handleMouseMove(e) {
      let pos = getCanvasMousePos(this.canvas, e);
      pos = this.getHoveredPixPos(pos);

      const targetPix = this.grid[pos.y][pos.x];
      // if is not true, we clean previous and highligh new hovered
      if (targetPix.hover === false) {
         this.switchToTargetPix(targetPix, "hover");
      }
   }

   handleClick(e) {
      let pos = getCanvasMousePos(this.canvas, e);
      pos = this.getHoveredPixPos(pos);

      const targetPix = this.grid[pos.y][pos.x];

      const ctrl = e.ctrlKey;
      const shift = e.shiftKey;

      if (shift) {
         let startSelectionPix = false;
         // find if cursor is set
         matrixIterate(this.grid, (r, c) => {
            if (this.grid[r][c].start_selection === true) startSelectionPix = this.grid[r][c];
         });

         if (startSelectionPix) {
            // select area
            startSelectionPix.start_selection = false;
            const startx = startSelectionPix.x;
            const starty = startSelectionPix.y;
            const endx = targetPix.x;
            const endy = targetPix.y;

            matrixArea(this.grid, startx, starty, endx, endy, ctrl, (pix) => {
               pix.selected = true;
               pix.draw();
            });
         } else {
            // select single pix
            targetPix.start_selection = true;
            targetPix.draw();
         }
      } else if (ctrl) {
         // toggle select single
         targetPix.selected = !targetPix.selected;
         targetPix.draw();
      } else {
         // set cursor
         if (targetPix.cursor === false) {
            this.switchToTargetPix(targetPix, "cursor");
         }
         // clean selections
         matrixIterate(this.grid, (r, c) => {
            const pix = this.grid[r][c];
            pix.start_selection = false;
            pix.selected = false;
            pix.draw();
         });
      }
   }

   switchToTargetPix(targetPix, selectionType) {
      matrixIterate(this.grid, (r, c) => {
         const pix = this.grid[r][c];
         if (pix[selectionType] === true) {
            pix[selectionType] = false;
            pix.draw();

            return true;
         }
      }, true);

      targetPix[selectionType] = true;
      targetPix.draw();
   }

   getHoveredPixPos(pos) {
      let pix_x = Math.floor(pos.x / this.pix_size.width);
      let pix_y = Math.floor(pos.y / this.pix_size.height);
      pix_x < 0 && (pix_x = 0);
      pix_y < 0 && (pix_y = 0);
      return { x: pix_x, y: pix_y };
   }
}