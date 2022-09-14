let gridsize=20;
let gridnum=24;
let s=Math.floor(gridnum/2);
let fr=10;
cansize=gridsize*(gridnum+2);
let bordercolor=100;
let p,b,sb;
let curscore=0;
let maxscore=0;
let lastscore=0;

class pos{
    constructor(i,j){
        this.i=i;
        this.j=j;
    }
}

class square{
    constructor(i,j,size,colour) {
        this.i=i;
        this.j=j;
        this.size=size;
        this.colour=colour;
    }
    draw(){
        fill(this.colour);
        rect(this.i*gridsize,this.j*gridsize,this.size,this.size);
    }
}

let state= new Array();
for (let i=0;i<gridnum+2;i++){
    state[i]=[];
    for(let j=0;j<gridnum+2;j++){
        state[i][j]=false;
    }
}

class player extends square{
    constructor(){
        let c=color(255,0,0);
        super(s,s,gridsize,c);
        this.x=0;
        this.y=0;
        this.lastpos=new pos(s,s);
        this.dir="pause";  
    }
    direction(z){
       switch(z){
            case "up":
                this.x=0;
                this.y=-1;
                this.dir="up";
                break;
            case "down":
                this.x=0;
                this.y=1;
                this.dir="down";
                break;
            case "right":
                this.x=1;
                this.y=0;
                this.dir="right";
                break;
            case "left":
                this.x=-1;
                this.y=0;
                this.dir="left";
                break;
            case "pause":
                this.x=0;
                this.y=0;
                this.dir="pause";
                break;
        } 
    }
    collision_detect(){
        if(state[this.i][this.j]==true){
            this.return_back();
        }
    }
    return_back(){
        this.i=s;
        this.j=s;
        this.direction("pause");
        lastscore=curscore;
        curscore=0;
        sb= new snakebody();
        sb.startlenght(4);
        for (let i=1;i<gridnum+1;i++){
            for(let j=1;j<gridnum+1;j++){
                state[i][j]=false;
            }
        }
        f= new food();
    }
    updatepos(){
        this.lastpos = new pos(this.i,this.j);
        this.i+=this.x;
        this.j+=this.y;
        this.collision_detect();
        if(this.dir!="pause"){
            sb.move();
        }
    }    
}

class border{
    constructor(){
        this.border =[];
        for(let i=0;i<gridnum+2;i++){
            let z=new square(i,0,gridsize,0);
            state[i][0]=true;
            this.border.push(z);
        }
        for(let i=0;i<gridnum+2;i++){
            let z=new square(i,gridnum+1,gridsize,0);
            state[i][gridnum+1]=true;
            this.border.push(z);
        }
        for(let i=0;i<gridnum+2;i++){
            let z=new square(0,i,gridsize,0);
            state[0][i]=true;
            this.border.push(z);
        }
        for(let i=0;i<gridnum+2;i++){
            let z=new square(gridnum+1,i,gridsize,0);
            state[gridnum+1][i]=true;
            this.border.push(z);
        }
    }
    draw(){
        for (let y of this.border){
            y.draw();
        }
    }
}

class food extends square{
    constructor(){
        let t=rng();
        let colour=color(0,255,0);
        super(t[0],t[1],gridsize,colour);
   }
   eaten(){
      if(p.i==this.i && p.j==this.j){
        this.ate();
        return true;
      }
   }
   ate(){
        curscore++;
        let t=rng();
        this.i=t[0];
        this.j=t[1];  
   }
   

}

class snakebody{
    constructor(){
        this.part = [];
        this.size = gridsize; 
        this.colour = color(255, 192, 203);
    }
    startlenght(l){
        for(let i=0;i<l;i++){
            let t= new pos(s-i-1,s);
            state[t.i][t.j]=true;
            this.part.push(t);
        }
    }
    draw(){
        for(let y of this.part){
            let t= new square(y.i,y.j,this.size,this.colour);
            t.draw();
        }
    }
    move(){
        let n=this.part.length;
        state[this.part[n-1].i][this.part[n-1].j]=false;
        for(let i=n-1;i>0;i--){
            this.part[i]=this.part[i-1];
        }
        this.part[0]=p.lastpos;
        state[p.lastpos.i][p.lastpos.j]=true;
        if(f.eaten()) {
            this.part.push(this.extend());
            state[this.part[n-1].i][this.part[n-1].j]=true;
        }
    }
    extend(){
        let z=this.part[this.part.length-1];
        return z;
    }
    
    
}

function rng(){
    let x=Math.floor(Math.random() *gridnum) + 1;
    let y=Math.floor(Math.random() *gridnum) + 1;
    if(state[x][y]==true) rng();
    else return [x,y];
}

function setup() {
    frameRate(fr);
    createCanvas(cansize,cansize);
    p = new player();   
    b = new border(); 
    f = new food();
    sb = new snakebody();
    sb.startlenght(4);
}
  
function draw() {
    background(200);
    b.draw();
    f.draw();
    f.eaten();
    sb.draw();
    p.draw();
    p.updatepos();
    p.collision_detect();
    if(maxscore<curscore) maxscore=curscore;
    document.getElementById("score").innerHTML = "CurrentScore = " + curscore +" ; MaxScore = " + maxscore +" ; LastScore = " + lastscore ;
}

function keyPressed(){
    switch(keyCode){
        case LEFT_ARROW:
            if(p.dir!="right") p.direction("left");
            break;
        case RIGHT_ARROW:
            if(p.dir!="left") p.direction("right");
            break;
        case UP_ARROW:
            if(p.dir!="down") p.direction("up");
            break; 
        case DOWN_ARROW:
            if(p.dir!="up") p.direction("down");
            break; 
        case SHIFT:
            p.direction("pause");    
            break;     
    }
}




