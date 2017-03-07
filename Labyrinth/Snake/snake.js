var version='0.0.1';

var zXFelder=42; var zYFelder=32;
var hatFeld=new Array(zXFelder);

for(var i=0;i<zXFelder;i++)
{
	hatFeld[i]=new Array(zYFelder);
}

var hatKopf;
var hatFutter;
var hatKoerper=new Array();
var zGroesse=20;
var zGewonnen=false;
var zGameOver=false;
var zGameStarted=false;
var zPunkte;
var zRichtung;
var zZeitStart=30;
var zWarteZeit;
var zIndexKoerper=2;

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

	document.addEventListener("keydown",tasteRunter,false);


	for(var m=0;m<zXFelder;m++)
	{for(var n=0;n<zYFelder;n++)
		{hatFeld[m][n]=new Feld(-zGroesse+m*zGroesse,-zGroesse+n*zGroesse);
		}
	}

	for (var i=0;i<zIndexKoerper;i++)
	{hatKoerper[i]=new Koerper(0,i);}
	hatKopf=new Kopf(0,2);
	hatFutter=new Futter(10,10);
	ladeBilder();
	resetSpielfeld();
	loop();
}


function ladeBilder()
{
	zBild=new Image();
	zBild.src='bilder/gesamt.png';
}

function resetSpielfeld() //Aufbau Spielfeld
{
	zPunkte=0;
	zRichtung=1;
	zZeitStart=20;
	zWarteZeit=zZeitStart;
	zIndexKoerper=2;
	zGameStarted=true;
	hatKopf.zX=1; hatKopf.zY=3;
	hatKoerper[0].zX=1; hatKoerper[0].zY=2;
	hatKoerper[1].zX=1; hatKoerper[1].zY=1;
	hatFutter.zX=Math.round(Math.random()*zXFelder);
	hatFutter.zY=Math.round(Math.random()*zYFelder);
	if(hatFutter.zX<1||hatFutter.zX>zXFelder-2)
	{hatFutter.zX=20;}
	if(hatFutter.zY<1||hatFutter.zY>zYFelder-2)
	{hatFutter.zY=20;}
}

function Feld(pX,pY)
{
	this.zX=pX;
	this.zY=pY;
}

function Kopf(pX,pY)
{
	this.zX=pX;
	this.zY=pY;
}
Kopf.prototype.draw=function()
{
	zMainCtx.drawImage(zBild,50,50,50,50,-zGroesse+this.zX*zGroesse,-zGroesse+this.zY*zGroesse,zGroesse,zGroesse);
};

function Futter(pX,pY)
{
	this.zX=pX;
	this.zY=pY;
}
Futter.prototype.draw=function()
{
	zMainCtx.drawImage(zBild,50,0,50,50,-zGroesse+this.zX*zGroesse,-zGroesse+this.zY*zGroesse,zGroesse,zGroesse);
};

function Koerper(pX,pY)
{
	this.zX=pX;
	this.zY=pY;
}
Koerper.prototype.draw=function()
{
	zMainCtx.drawImage(zBild,0,0,50,50,-zGroesse+this.zX*zGroesse,-zGroesse+this.zY*zGroesse,zGroesse,zGroesse);
};

function tasteRunter(e)	//Kommandos
{
	var key_id=e.keyCode || e.which;
	if(key_id==40) //runter 2
	{zRichtung=2;
	 e.preventDefault();
	}
	if(key_id==38) //hoch 4
	{zRichtung=4;
	 e.preventDefault();
	}
	if(key_id==37) //links 3
	{zRichtung=3;
	 e.preventDefault();
	}
	if(key_id==39) //rechts 1
	{zRichtung=1;
	 e.preventDefault();
	}
}

function restart()
{
	zGameStarted=false;
	zGewonnen=false;
	zGameOver=false;
	resetSpielfeld();
}

function loop() //Futter, Schlangenbewegung, Fresen, Ende, Punkte
{
	//Feld neu zeichnen
	zMainCtx.clearRect(0,0,800,600);
	if(hatKopf!=null&&hatKoerper[0]!=null)
	{hatKopf.draw();
	 hatFutter.draw();
	 for(var i=0;i<zIndexKoerper;i++)
	 {hatKoerper[i].draw();}
	}
	zMainCtx.fillStyle="white";
		zMainCtx.font="20px Arial"
		zMainCtx.textBaseLine='top';
		zMainCtx.fillText("Punkte: "+zPunkte,20,20);

	//Schlange bewegen
	if(!zGameOver&&zWarteZeit==0)
	{
		if(zRichtung==1)  //bewege nach rechts
		{
			for(var i=zIndexKoerper-1;i>=1;i--)
			{
				hatKoerper[i].zX=hatKoerper[i-1].zX;
				hatKoerper[i].zY=hatKoerper[i-1].zY;
			}
			hatKoerper[0].zX=hatKopf.zX;
			hatKoerper[0].zY=hatKopf.zY;
			hatKopf.zX++;
		}
		else if(zRichtung==2) //bewege nach unten
		{
			for(var i=zIndexKoerper-1;i>=1;i--)
			{
				hatKoerper[i].zX=hatKoerper[i-1].zX;
				hatKoerper[i].zY=hatKoerper[i-1].zY;
			}
			hatKoerper[0].zX=hatKopf.zX;
			hatKoerper[0].zY=hatKopf.zY;
			hatKopf.zY++;
		}
		else if(zRichtung==3) //bewege nach links
		{
			for(var i=zIndexKoerper-1;i>=1;i--)
			{
				hatKoerper[i].zX=hatKoerper[i-1].zX;
				hatKoerper[i].zY=hatKoerper[i-1].zY;
			}
			hatKoerper[0].zX=hatKopf.zX;
			hatKoerper[0].zY=hatKopf.zY;
			hatKopf.zX--;
		}
		else if(zRichtung==4) //bewege nach oben
		{
			for(var i=zIndexKoerper-1;i>=1;i--)
			{
				hatKoerper[i].zX=hatKoerper[i-1].zX;
				hatKoerper[i].zY=hatKoerper[i-1].zY;
			}
			hatKoerper[0].zX=hatKopf.zX;
			hatKoerper[0].zY=hatKopf.zY;
			hatKopf.zY--;
		}

		if(hatKopf.zX==hatFutter.zX&&hatKopf.zY==hatFutter.zY) //frisst
		{
			zPunkte++;
			hatFutter.zX=Math.round(Math.random()*zXFelder);
			hatFutter.zY=Math.round(Math.random()*zYFelder);
			if(hatFutter.zX<1||hatFutter.zX>zXFelder-2)
			{hatFutter.zX=20;}
			if(hatFutter.zY<1||hatFutter.zY>zYFelder-2)
			{hatFutter.zY=20;}
			zZeitStart-=1;
			zIndexKoerper++;
			hatKoerper[zIndexKoerper-1]=new Koerper(0,0);
		}

		if(hatKopf.zX<1||hatKopf.zX>zXFelder-2||hatKopf.zY<1||hatKopf.zY>zYFelder-2) //Wand
		{
			zGameOver=true;
		}
		for(var j=0;j<zIndexKoerper;j++)
		{
			if(hatKopf.zX==hatKoerper[j].zX&&hatKopf.zY==hatKoerper[j].zY) //Beißen
			{zGameOver=true;}
		}
		zWarteZeit=zZeitStart;
	}
	zWarteZeit--;

	if(zGameOver) //mit Punkteauswertung
	{
		zMainCtx.fillStyle="red";
		zMainCtx.font="50px Arial"
		zMainCtx.textBaseLine='top';
		zMainCtx.fillText("Game Over:",100,200);
		if(zPunkte>=5)
		{
			zGewonnen=true;
			zMainCtx.fillText("You won!",100,300);
			localStorage.setItem("SnakeGewonnen","true");
			document.getElementById('win').play();
			wait(2000);
			window.open('../Formalien/gewonnen.html',"_self");
		}
		else
		{
			zMainCtx.fillText("You lost!",100,300);
			document.getElementById('lose').play();
		}
	}

	requestaframe(loop);
}

function backToTheMaze()
{
	if(zGewonnen)
	{
		localStorage.setItem("SnakeGewonnen","true");
	}

	close();
}


init();
