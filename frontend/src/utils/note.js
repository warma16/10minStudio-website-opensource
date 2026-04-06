class Note{
    constructor({x=0,y=0,width=20,height=20,img_src,canvas}){
        this.positions=[];
        this.positions.push([x,y]);
        this.img_src=img_src;
        this.width=width;
        this.height=height;
        this.x=x;
        this.y=y;
        this.canvas=canvas;
        this.ctx=canvas.getContext('2d');
        console.log(this.ctx)
        this.img=new Image();
        this.img.src=img_src;
        console.log(this.img)
        this.show();
        this.ctx.lineTo(10,10,100,100);
    }
    move(x,y){
        var last_pos=this.positions[this.positions.length-1];
        this.ctx.clearRect(last_pos[0],last_pos[1],this.width,this.height);
        this.positions.push([x,y]);
        this.y=y;
        this.x=x;
        this.ctx.drawImage(this.img,x,y,this.width,this.height);
    }
    show(){
        this.ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
}
export default Note;