export function getRand(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=)(/&%$#"!+-.,}+{]*[';
   var charactersLength = characters.length;

   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   return result;
}

export function genRand() {
   const cells = document.querySelectorAll('.char');
   const chars = getRand(cells.length);
   for (let i = 0; i < cells.length; i++) {
      cells[i].innerHTML = chars[i];
   }
}

export function dom(tagName, id = "", attrs = false, content = false) {
   attrs = Object.assign(attrs || {}, { id: id });

   var el = document.createElement(tagName);
   Object.keys(attrs).forEach((key) => {
      if (attrs[key] !== undefined) {
         if (key == "style") {
            setStyle(el, attrs[key]);
         } else {
            el.setAttribute(key, attrs[key]);
         }
      }
   });
   if (content && typeof content == "string") {
      el.innerHTML = content;
      // Object.keys(content).forEach((key) => {
      //    if (content[key] !== undefined) {
      //       el[key] = content[key];
      //    }
      // });
   }
   return el;
}

export function setStyle(el, styleObj) {
   for (let k in styleObj) {
      el.style[k] = styleObj[k];
   }
}

export function switchIndex(array, index, positions) {
   const isAboveLimit = positions > 1 && array.length - 1 < index + positions;
   const isBelowLimit = positions < 0 && (index + positions) < 0;
   if (isAboveLimit || isBelowLimit) {
      return false;
   } else {
      const to_move_index = array[index];
      const target_index = array[index + positions];
      array[index] = target_index;
      array[index + positions] = to_move_index;
      return true;
   }
}

export function query(selector) {
   return document.querySelector(selector);
}

export function queryAll(selector) {
   return document.querySelectorAll(selector);
}

export function getCanvasMousePos(canvas, e) {
   var rect = canvas.getBoundingClientRect();
   return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
   };
}

export function matrixIterate(grid, func, breakOnTrue = false){
   for(let r = 0; r < grid.length; r++){
      for(let c = 0; c < grid[r].length; c++){
         const returned = func(r, c, grid.length, grid[r].length);
         if(breakOnTrue && returned){
            break;
         }
      }
   }
}

export function matrixArea(grid, x, y, xx, yy, border = false, func) {
   // console.log(x, y, xx, yy);
   const xi = x < xx ? 1 : -1;
   const yi = y < yy ? 1 : -1;

   // for every row
   for (let indy = y; indy != yy + yi; indy += yi) {
      for (let indx = x; indx != xx + xi; indx += xi) {
         const inBorder = (indx == x || indx == xx) || (indy == y || indy == yy);

         if (!border || (border && inBorder)) {
            func(grid[indy][indx]);
         }
      }
   }
}