function resetBoard(){
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    var row1=[0,0,0];
    var row2=[0,0,0];
    var row3=[0,0,0];
    board=[row1,row2,row3];
    mouse_click_count=0;
    var button = document.getElementById("start");
    if (button.value=="Start Game!") button.value = "Reset?";
    document.getElementById("text").innerHTML="";
}

function drawBoard()
  {
    var canvas = document.getElementById('game');
    if (canvas.getContext){
        var ctx = canvas.getContext('2d'); 
        var R = canvas.width / 6 * 0.75;
        for (let i = 0; i < 2; i++) { //making board
            ctx.beginPath();
            ctx.moveTo(canvas.width * (i+1) / 3, 1);
            ctx.lineTo(canvas.width * (i+1) / 3, canvas.height-1);
            ctx.strokeStyle = '#000000'; //black
            ctx.stroke();
        }
        for (let i = 0; i < 2; i++) { //making board pt. 2
            ctx.beginPath();
            ctx.moveTo(1, canvas.height * (i+1) / 3);
            ctx.lineTo(canvas.width-1, canvas.height * (i+1) / 3);
            ctx.strokeStyle = '#000000'; //black
            ctx.stroke();
        }
    }
}

function drawSymbol(mouse_click_count)
{
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d'); 
    for (let i = 0; i < 3; i++) {
        if(click_coords.x_coord>canvas.width*i/3 && click_coords.x_coord<canvas.width*(i+1)/3){
            for (let j = 0; j < 3; j++) {
                if(click_coords.y_coord>canvas.height*j/3 && click_coords.y_coord<canvas.height*(j+1)/3){
                    if(board[j][i]==0){
                        if(mouse_click_count%2==0){  //circle
                            drawCircle(i,j);
                        }
                        else{     //cross
                            drawX(i,j);
                        }
                        return 1;
                    }
                }
            }
        }
    }
    return 0;
}

function drawCircle(i,j){
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    board[j][i]=1;
    var R = canvas.width / 6 * 0.75;
    var X = canvas.width * i / 3 + canvas.width / 6;
    var Y = canvas.height * j / 3 + canvas.height / 6;
    ctx.beginPath();
    ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FF0000'; //red
    ctx.stroke();
}

function drawX(i,j){
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    board[j][i]=-1;
    ctx.beginPath();
    ctx.moveTo(canvas.width * (i+0.2) / 3, canvas.height * (j+0.2) / 3);
    ctx.lineTo(canvas.width * (i+0.8) / 3, canvas.height * (j+0.8) / 3);
    ctx.strokeStyle = '#0000FF'; //blue
    ctx.stroke();
    ctx.moveTo(canvas.width * (i+0.2) / 3, canvas.height * (j+0.8) / 3);
    ctx.lineTo(canvas.width * (i+0.8) / 3, canvas.height * (j+0.2) / 3);
    ctx.strokeStyle = '#0000FF'; //blue
    ctx.stroke();
}

function gameLogic(board,mouse_click_count){
    if (checkWinHuman(board)){
        document.getElementById("text").innerHTML="wow you actually won";
        return 0;
    }
    var count=0;
    var turn_no=1;
    for(let i=0; i<3;i++){
        for(let j=0;j<3;j++){
            if(board[j][i]!=0){
                turn_no++;
            }
        }
    }
    if(turn_no==10){
        document.getElementById("text").innerHTML="its a tie!";
        return 0;
    }
    if(board[1][1]==0&&count==0&&turn_no==2){
        drawX(1,1);
        count=1;
    }
    else if(board[0][0]==0&&count==0&&turn_no==2){
        drawX(0,0);
        count=1;
    }
    for(let i=0; i<3;i++){     //X win condition
        for(let j=0;j<3;j++){
            if(checkWinCondition(board,i,j)!=9999){
                if(checkWinCondition(board,i,j)<0&&count==0){
                    drawX(i,j);
                    count=1;
                }
            }
        }
    }
    for(let i=0; i<3;i++){      //O win condition
        for(let j=0;j<3;j++){
            if(checkWinCondition(board,i,j)!=9999){
                if(checkWinCondition(board,i,j)>0&&count==0){
                    drawX(i,j);
                    count=1;
                }
            }
        }
    }
    count=checkDoubleTrick(count,board);
    if(count==0){
        for(let i=0; i<3;i++){
            for(let j=0;j<3;j++){
                if (checkWinCondition(board,i,j)!=9999&&count==0){
                    var row1=[0,0,0];
                    var row2=[0,0,0];
                    var row3=[0,0,0];
                    var board1=[row1,row2,row3];
                    for(let i=0; i<3;i++){
                        for(let j=0;j<3;j++){
                            board1[j][i]=board[j][i];
                        }
                    }
                    board1[j][i]=-1;
                    var count2=0;
                    for(let i1=0; i1<3;i1++){
                        for(let j1=0;j1<3;j1++){
                            if(checkWinCondition(board1,i1,j1)==-1&&count2==0){
                                board1[j1][i1]=1;
                                count2=1;
                            }
                        }
                    }
                    if(count2==0){
                        var count2=0;
                    for(let i1=0; i1<3;i1++){
                        for(let j1=0;j1<3;j1++){
                            if(checkWinCondition(board1,i1,j1)==-1&&count2==0){
                                board1[j1][i1]=1;
                                count2=1;
                            }
                        }
                    }
                    }
                    var count3=0;
                    for(let i1=0; i1<3;i1++){
                        for(let j1=0;j1<3;j1++){
                            if(checkWinCondition(board1,i1,j1)==1){
                                count3++;
                            }
                        }
                    }
                    if(count3<2){
                        drawX(i,j);
                        count=1;
                    }
                }
            }
        }
    }
    if (checkWinBot(board)){
        document.getElementById("text").innerHTML="you lost hahahaha";
        return 0;
    }
}

function checkWinCondition(board,i,j){
    if (board[j][i]==0){
        var x=board[(j+1)%3][i];
        if(x!=0&&board[(j+1)%3][i]==x&&board[(j+2)%3][i]==x){
            return x;
        }
        var y=board[j][(i+1)%3];
        if(y!=0&&board[j][(i+1)%3]==y&&board[j][(i+2)%3]==y){
            return y;
        }
        var z=board[(j+1)%3][(i+1)%3];
        if(z!=0&&i==j&&board[(j+1)%3][(i+1)%3]==z&&board[(j+2)%3][(i+2)%3]==z){
            return z;
        }
        var w=board[(j+2)%3][(i+1)%3];
        if(w!=0&&i+j==2&&board[(j+2)%3][(i+1)%3]==w&&board[(j+1)%3][(i+2)%3]==w){
            return w;
        }
        return 0;

    }
    else return 9999;
}

function checkWinBot(board){
    for(let i=0; i<3;i++){
        for(let j=0;j<3;j++){
            if (board[j][i]==-1){
                var x=board[(j+1)%3][i];
                if(x==-1&&board[(j+1)%3][i]==x&&board[(j+2)%3][i]==x){
                    return 1;
                }
                var y=board[j][(i+1)%3];
                if(y==-1&&board[j][(i+1)%3]==y&&board[j][(i+2)%3]==y){
                    return 1;
                }
                var z=board[(j+1)%3][(i+1)%3];
                if(z==-1&&i==j&&board[(j+1)%3][(i+1)%3]==z&&board[(j+2)%3][(i+2)%3]==z){
                    return 1;
                }
                var w=board[(j+2)%3][(i+1)%3];
                if(w==-1&&i+j==2&&board[(j+2)%3][(i+1)%3]==w&&board[(j+1)%3][(i+2)%3]==w){
                    return 1;
                }
            }
        }
    }
    return 0;
}

function checkWinHuman(board){
    for(let i=0; i<3;i++){
        for(let j=0;j<3;j++){
            if (board[j][i]==1){
                var x=board[(j+1)%3][i];
                if(x==1&&board[(j+1)%3][i]==x&&board[(j+2)%3][i]==x){
                    return 1;
                }
                var y=board[j][(i+1)%3];
                if(y==1&&board[j][(i+1)%3]==y&&board[j][(i+2)%3]==y){
                    return 1;
                }
                var z=board[(j+1)%3][(i+1)%3];
                if(z==1&&i==j&&board[(j+1)%3][(i+1)%3]==z&&board[(j+2)%3][(i+2)%3]==z){
                    return 1;
                }
                var w=board[(j+2)%3][(i+1)%3];
                if(w==1&&i+j==2&&board[(j+2)%3][(i+1)%3]==w&&board[(j+1)%3][(i+2)%3]==w){
                    return 1;
                }
            }
        }
    }
    return 0;
}

function checkDoubleTrick(count,board){
    if(count==0&&board[0][0]==0&&board[0][1]==1&&board[1][0]==1&&board[0][2]==0&&board[2][0]==0){
        drawX(0,0);
        return 1;
    }
    if(count==0&&board[0][2]==0&&board[0][1]==1&&board[1][2]==1&&board[0][0]==0&&board[2][2]==0){
        drawX(2,0);
        return 1;
    }
    if(count==0&&board[2][0]==0&&board[2][1]==1&&board[1][0]==1&&board[0][0]==0&&board[2][2]==0){
        drawX(0,2);
        return 1;
    }
    if(count==0&&board[2][2]==0&&board[2][1]==1&&board[1][2]==1&&board[0][2]==0&&board[2][0]==0){
        drawX(2,2);
        return 1;
    }
    return count;
}

function getMousePosition(canvas, event, click_coords) {
    let rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    click_coords.x_coord=x;
    click_coords.y_coord=y;
}

//initializing the game elements
canvas=document.getElementById("game");
canvas.width = 600;
canvas.height = 600;
let canvasElem = document.querySelector("canvas");
var click_coords={x_coord:0,y_coord:0};
var mouse_click_count=0;
var row1=[0,0,0];
var row2=[0,0,0];
var row3=[0,0,0];
var board=[row1,row2,row3];

canvasElem.addEventListener("mousedown", function(e)
{
    var cnt=0;
    for(let i=0; i<3;i++){
        for(let j=0;j<3;j++){
            if (board[j][i]!=0){
                cnt++;
            }
        }
    }
    if(document.getElementById("start").value!="Start Game!"&&cnt!=9)
        getMousePosition(canvasElem, e, click_coords);
        var result=drawSymbol(mouse_click_count);
        if(result==1){
            mouse_click_count++;
            gameLogic(board,mouse_click_count);
            mouse_click_count++;
        }
});
