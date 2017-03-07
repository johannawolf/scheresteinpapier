var version='0.0.1';
var hatFeld=new Array(14);
for(var i=0;i<14;i++)
{
	hatFeld[i]=new Array(14);
}
var zGroesse=22;
var zX0=50;var zY0=30;
var zGewonnen=false;
var zGameOver=false;
var zGameStarted=false;
var zZuege;
var zFarbeObenLinks;
var zFarbeGedrueckt;

function init()
{
	requestaframe=(function()
	  { return window.requestAnimationFrame        ||
			window.webkitRequestAnimationFrame  ||
			window.mozRequestAnimationFrame     ||
			window.oRequestAnimationFrame       ||
			window.msRequestAnimationFrame      ||
			 function(callback)
			 { window.setTimeout(callback,1000/60);}
		 ;
	  })();

	resizeGame();
	zHintergrundCanvas=document.getElementById('background_canvas');
	zHintergrundCtx=background_canvas.getContext('2d');
	zMainCanvas=document.getElementById('main_canvas');
	zMainCtx=main_canvas.getContext('2d');


	for(var m=0;m<14;m++)
	{for(var n=0;n<14;n++)
		{hatFeld[m][n]=new Feld(zX0+m*zGroesse,zY0+n*zGroesse,Math.round(Math.random()*5));
		}
	}

	ladeBilder();
	zZuege=40;
	resetSpielfeld();
	loop();
}

function ladeBilder()
{
	zFeldBild=new Image();
	zFeldBild.src='bilder/gesamt.png';
}

function resetSpielfeld()
{
	for(var m=0;m<14;m++)
	{for(var n=0;n<14;n++)
		{
			hatFeld[m][n].zFarbe=Math.round(Math.random()*5);
		}
	}
	zeichneFeld();
	zGameStarted=true;
}

function Feld(pX,pY,pNummer)
{
	this.zX=pX;
	this.zY=pY;
	this.zSrcX;
	this.zSrcY;
	this.zFarbe=pNummer;
	this.zGeprueft=false;

}

Feld.prototype.draw=function()
{
	if(this.zFarbe==0)
	{this.zSrcX=0;this.zSrcY=0;} //blau 0
	else if(this.zFarbe==1)
	{this.zSrcX=50;this.zSrcY=0;}  //rot 1
	else if(this.zFarbe==2)
	{this.zSrcX=100;this.zSrcY=0;} //gelb 2
	else if(this.zFarbe==3)
	{this.zSrcX=0;this.zSrcY=50;} //gruen 3
	else if(this.zFarbe==4)
	{this.zSrcX=50;this.zSrcY=50;} //orange 4
	else if(this.zFarbe==5)
	{this.zSrcX=100;this.zSrcY=50;} //hellblau 5

	zMainCtx.drawImage(zFeldBild,this.zSrcX,this.zSrcY,50,50,this.zX,this.zY,zGroesse,zGroesse);
};

Feld.prototype.setFarbe=function(pFarbe)
{
	this.zFarbe=pFarbe;
	this.zGeprueft=true;
};

function blau() //blau 0
{
	if(zGameOver==false)
	{findeFarbeOL();
	 zFarbeGedrueckt=0;
	 setzeFarbe(0,0);
	 farbeFertig();}
}
function rot() //rot 1
{
	if(zGameOver==false)
	{
	findeFarbeOL();
	zFarbeGedrueckt=1;
	setzeFarbe(0,0);
	farbeFertig();}
}
function gelb() //gelb 2
{
	if(zGameOver==false)
	{
	findeFarbeOL();
	zFarbeGedrueckt=2;
	setzeFarbe(0,0);
	farbeFertig();}
}
function gruen() //grün 3
{
	if(zGameOver==false)
	{
	findeFarbeOL();
	zFarbeGedrueckt=3;
	setzeFarbe(0,0);
	farbeFertig();}
}
function orange() //orange 4
{
	if(zGameOver==false)
	{
	findeFarbeOL();
	zFarbeGedrueckt=4;
	setzeFarbe(0,0);
	farbeFertig();}
}
function hellblau() //hellblau 5
{
	if(zGameOver==false)
	{
	findeFarbeOL();
	zFarbeGedrueckt=5;
	setzeFarbe(0,0);
	farbeFertig();}
}

function farbeFertig() //neu eingefärbt
{
	for(var i=0;i<14;i++)
	{ for(var j=0;j<14;j++)
		{ hatFeld[i][j].zGeprueft=false;}
	}
	zZuege--;
	pruefeGameOver();
}

function setzeFarbe( pX, pY)
{
	hatFeld[pX][pY].setFarbe(zFarbeGedrueckt);

	if(pX<13)
	{
		if(hatFeld[pX+1][pY].zFarbe==zFarbeObenLinks&&hatFeld[pX+1][pY].zGeprueft==false)
		{
			setzeFarbe(pX+1,pY);
		}
	}
	if(pX>0)
	{
		if(hatFeld[pX-1][pY].zFarbe==zFarbeObenLinks&&hatFeld[pX-1][pY].zGeprueft==false)
		{
			setzeFarbe(pX-1,pY);
		}
	}
	if(pY<13)
	{
		if(hatFeld[pX][pY+1].zFarbe==zFarbeObenLinks&&hatFeld[pX][pY+1].zGeprueft==false)
		{
			setzeFarbe(pX,pY+1);
		}
	}
	if(pY>0)
	{
		if(hatFeld[pX][pY-1].zFarbe==zFarbeObenLinks&&hatFeld[pX][pY-1].zGeprueft==false)
		{
			setzeFarbe(pX,pY-1);
		}
	}

}

function findeFarbeOL()
{
	zFarbeObenLinks=hatFeld[0][0].zFarbe;
}

function zeichneFeld()
{
	zMainCtx.clearRect(0,0,400,340);
	for(var i=0;i<14;i++)
	{ for(var j=0;j<14;j++)
		{
			hatFeld[i][j].draw();
		}
	}
	zMainCtx.fillStyle="white";
	zMainCtx.font="15px Arial"
	zMainCtx.textBaseLine='top';
	zMainCtx.fillText("Züge:",10,30);
	zMainCtx.fillStyle="white";
	zMainCtx.font="15px Arial"
	zMainCtx.textBaseLine='top';
	zMainCtx.fillText(zZuege,10,50);
}

function pruefeGameOver()
{
	var zZaehler=0;
	findeFarbeOL();
	for(var i=0;i<14;i++)
	{ for(var j=0;j<14;j++)
		{
			if(hatFeld[i][j].zFarbe==zFarbeObenLinks)
			{zZaehler++;}
		}
	}
	if(zZaehler==14*14)
	{
		zGameOver=true;
		zGewonnen=true;
		zMainCtx.fillStyle="black";
		zMainCtx.font="20px Arial"
		zMainCtx.textBaseLine='top';
		zMainCtx.fillText("You won!",100,100);
		localStorage.setItem("FarbenGewonnen","true");
		document.getElementById('win').play();
		wait(2000);
		window.open('../Formalien/gewonnen.html',"_self");
	}

	if(zZuege==0&&zGewonnen==false)
	{
		zGameOver=true;
		zGewonnen=false;
		zMainCtx.fillStyle="black";
		zMainCtx.font="20px Arial"
		zMainCtx.textBaseLine='top';
		zMainCtx.fillText("Game Over",100,100);
		document.getElementById('lose').play();
		wait(2000);
	}

}

function restart()
{
	zGameStarted=false;
	zGewonnen=false;
	zGameOver=false;
	zZuege=40;
	resetSpielfeld();
	zZuege=40;
}


function backToTheMaze()
{
	if(zGewonnen)
	{
		localStorage.setItem("FarbenGewonnen","true");
		document.getElementById('win').play();
		wait(2000);
	}

	close();
}

function loop()
{
	zeichneFeld();
	if(zGameOver&&zGewonnen)
	{
		zMainCtx.fillStyle="black";
		zMainCtx.font="50px Arial"
		zMainCtx.textBaseLine='top';
		zMainCtx.fillText("You won!",250,200);
	}

	else if(zGameOver)
	{
		zMainCtx.fillStyle="black";
		zMainCtx.font="50px Arial"
		zMainCtx.textBaseLine='top';
		zMainCtx.fillText("Game Over",250,200);
	}
	requestaframe(loop);
}


init();
