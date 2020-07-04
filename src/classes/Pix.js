export default class Pix {
   constructor(layer, char, color, background_color = false) {
      this.layer = layer;
      this.char = char;
      this.color = color;
      this.background_color = background_color;

      this.x = 0;
      this.y = 0;

      this.start_selection = false;
      this.selected = false;
      this.cursor = false;
      this.hover = false;
   }

   draw(clean = false) {
      const ctx = this.layer.canvas.getContext('2d');
      const font_size = this.layer.pix_size.height - this.layer.font.margin;

      ctx.clearRect(
         this.x * this.layer.pix_size.width,
         this.y * this.layer.pix_size.height,
         this.layer.pix_size.width,
         this.layer.pix_size.height
      ); // Clean canvas

      ctx.font = `${font_size}px ${this.layer.font.family}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const center = {
         x: (this.x * this.layer.pix_size.width) + this.layer.pix_center.x,
         y: (this.y * this.layer.pix_size.height) + this.layer.pix_center.y
      };

      // Draw background if set
      if (!!this.background_color) {
         ctx.fillStyle = pix.background_color;
         ctx.fillRect(
            this.layer.pix_size.width * this.x,
            this.layer.pix_size.height * this.y,
            this.layer.pix_size.width,
            this.layer.pix_size.height,
         );
      }

      // draw text
      ctx.fillStyle = this.color;
      if(!clean){
         if(this.cursor) ctx.fillStyle = "blue";
         if(this.selected) ctx.fillStyle = "green";
         if(this.start_selection) ctx.fillStyle = "yellow";
         if(this.hover) ctx.fillStyle = "red";
      }

      ctx.fillText(this.char, center.x, center.y);

   }

}