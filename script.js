//-- img changing --//
// variables
var slider = document.getElementById('myRange');
var slideimg = document.getElementById('slideIMG');
var slideval = document.getElementById('slideval');
// slider value show
slideval.innerHTML = slider.value;
// change img and shown value to the slider val
slider.oninput = function(){
    slideimg.width = slider.value;
    slideval.innerHTML = slider.value;
}


//-- mousetracking part --//
// variables
var Yval = document.getElementById('yposval');
var Xval =document.getElementById('xposval');
function getlocation(event){
    Xval.innerHTML = event.clientX;
    Yval.innerHTML = event.clientY;
}

//-- pong --//
// variables
var playing = false
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5;
const maxPaddleY = canvas.height - grid - paddleHeight;

var paddleSpeed = 6;
var ballSpeed = 3;

var scoreLeft = 0;
var scoreRight = 0;

const leftPaddle = {
    // the position of the paddle
    x: grid * 2,
    y: canvas.height / 2- paddleHeight / 2,
    // define shape
    width: grid,
    height:paddleHeight,
    // the velocity of the paddle
    dy:0
};

const rightPaddle = {
    // the position of the paddle
    x: canvas.width - grid * 3,
    y: canvas.height / 2- paddleHeight / 2,
    // define shape
    width: grid,
    height:paddleHeight,
    // the velocity of the paddle
    dy:0
};

const ball = {
    // the position of the paddle
    x: grid * 2,
    y: canvas.height / 2- paddleHeight / 2,
    // define shape
    width: grid,
    height: grid,
    //keeps track if we need to reset
    resetting:false,
    // the velocity of the paddle
    dx:ballSpeed,
    dy:-ballSpeed   
};

// collision check using axis-alighned bounding box
function collides(obj1,obj2){
    return  obj1.x< obj2.x + obj2.width && 
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height&&
            obj1.y + obj1.height > obj2.y;
}

// gameloop
function loop(){
    if(playing){
        requestAnimationFrame(loop);
    }
    context.clearRect(0,0,canvas.width,canvas.height);

    // paddle movement by velocity
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
    // prevent paddles from going through walls
    if(leftPaddle.y < grid){
        leftPaddle.y = grid;
    }
    else if(leftPaddle.y > maxPaddleY){
        leftPaddle.y = maxPaddleY;
    }

    if(rightPaddle.y < grid){
        rightPaddle.y = grid;
    }
    else if(rightPaddle.y > maxPaddleY){
        rightPaddle.y = maxPaddleY;
    }

    // draw paddles
    context.fillStyle = 'white';
    context.fillRect(leftPaddle.x,leftPaddle.y,leftPaddle.width,leftPaddle.height);
    context.fillRect(rightPaddle.x,rightPaddle.y,rightPaddle.width,rightPaddle.height);

    // ball movement by velocity
    ball.x += ball.dx;
    ball.y += ball.dy;

    // prevent ball from going through walls
    if(ball.y < grid){
        ball.y = grid;
        ball.dy *= -1;
    }
    else if(ball.y + grid > canvas.height - grid){
        ball.y = canvas.height - grid * 2;
        ball.dy *= -1;
    }

    //ball reset if it didn't happen yet
    if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting){
        ball.resetting = true;
        // scoring
        if(ball.x < 0){
            scoreRight += 1;
        }
        else{
            scoreLeft += 1;
        }
        setTimeout(() =>{
            ball.resetting = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
        },400);
    }

    // check if ball collides with leftpaddle
    if(collides(ball,leftPaddle)){
        ball.dx *= -1;
        // we move the ball out of the way so that the collision doesn't happen again in the next frame
        ball.x = leftPaddle.x + leftPaddle.width;
    }
    else if(collides(ball,rightPaddle)){
        ball.dx *= -1;
        // we move the ball out of the way so that the collision doesn't happen again in the next frame
        ball.x = rightPaddle.x - rightPaddle.width;
    }

    // draw the ball
    context.fillRect(ball.x,ball.y,ball.width,ball.height);

    // draw the walls
    context.fillStyle = 'lightgrey';
    context.fillRect(0,0,canvas.width,grid);
    context.fillRect(0,canvas.height-grid,canvas.width,grid);
    // show the score on the canvas
    context.font = '50px Arial';
    context.textAlign = 'center';
    context.fillText(scoreLeft + '  -  ' + scoreRight,canvas.width/2,canvas.height/2);
}
// movement of the paddles
document.addEventListener('keydown',function(e){
    // up arrow key
    if(e.code === 'ArrowUp'){
        rightPaddle.dy = -paddleSpeed;
    }
    // down arrow key
    if(e.code === 'ArrowDown'){
        rightPaddle.dy = paddleSpeed;
    }
    // W key
    if(e.code === 'KeyW'){
        leftPaddle.dy = -paddleSpeed;
    }
    // S key
    if(e.code === 'KeyS'){
        leftPaddle.dy = paddleSpeed;
    }
});
// stops the movement after the key is up
document.addEventListener('keyup',function(e){
    // up arrow key
    if(e.code === 'ArrowUp'){
        rightPaddle.dy = 0;
    }
    // down arrow key
    if(e.code === 'ArrowDown'){
        rightPaddle.dy = 0;
    }
    // W key
    if(e.code === 'KeyW'){
        leftPaddle.dy = 0;
    }
    // S key
    if(e.code === 'KeyS'){
        leftPaddle.dy = 0;
    }
});

function play(){
    playing = !playing;
    if(playing){
        requestAnimationFrame(loop);
        document.getElementById('startstop').innerHTML = 'CLICK TO STOP';
        document.body.style.overflow = 'hidden';
    }
    else{
        document.getElementById('startstop').innerHTML = 'CLICK TO PLAY';
        document.body.style.overflow = 'visible';
    }
}