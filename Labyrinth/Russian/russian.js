var version='0.0.1';

var zGewonnen=false;
var zGameOver=false;
	zMainCanvas=document.getElementById('main_canvas');
	zMainCtx=main_canvas.getContext('2d');

function feuern(){

var min = 0;
var max = 3;
var kugel = Math.floor(Math.random() * (max - min + 1)) + min;

if (kugel==1)
{
	document.getElementById('gun').play();
	wait(2000);
	alert("Päng!");

	zGewonnen=false;
	zGameOver=true;
	over();

}

else
{
	alert("Glück gehabt!")
	zGewonnen=true;
	zGameOver=true;
	over();
}
}

function backToTheMaze()
{
	if(zGewonnen)
	{
		localStorage.setItem("RussianGewonnen","true");
	}

}


function over(){
if(zGameOver)
{
	zMainCtx.fillStyle="red";
	zMainCtx.font="50px Arial"
	zMainCtx.textBaseLine='top';
	if(zGewonnen)
	{
		zMainCtx.fillText("You won!",400,400);
		localStorage.setItem("RussianGewonnen","true");
		window.open('../Formalien/gewonnen.html',"_self");
	}
	else
	{zMainCtx.fillText("You lost!",400,400);}
}
}
