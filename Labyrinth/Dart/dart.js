var version='0.0.1';

var zXScheibe=600;
var zYScheibe=200;
var zGeschwindigkeit=2;
var zGroesseScheibe=200;
var zLaengePfeil=50;
var zXPfeil=0;
var zYPfeil=0;
var zXSpitze=zXPfeil+zLaengePfeil;
var zYSpitze=zYPfeil;
var zWinkel=0;
var zMausGedruekt=false;
var zPfeile=3;
var zPunkte=0;
var zPfeilFaellt=true;
var zDreheRunter=true;
var zWarte=0;
var zMausTaste;

var zGewonnen=false;
var zGameOver=false;

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

	document.addEventListener("mousedown",mausGedrueckt,false);
	document.addEventListener("mouseup",mausLosgelassen,false);


	ladeBilder();
	resetSpielfeld();
	loop();
}


function ladeBilder()
{
	zScheibeBild=new Image();
	zScheibeBild.src='bilder/gesamt.png';
}

function resetSpielfeld()
{
	zeichneHintergrund();
	zXPfeil=0;
	zYPfeil=0;
	zXSpitze=zXPfeil+zLaengePfeil;
	zYSpitze=zYPfeil;
	zWinkel=0;
	zMausGedruekt=false;
	zPfeile=3;
	zP=0;
	zPfeilFaellt=true;
	zDreheRunter=true;
	zWarte=0;
}

function zeichneHintergrund()
{
	zHintergrundCtx.drawImage(zScheibeBild,0,0,200,200,zXScheibe,zYScheibe,zGroesseScheibe,zGroesseScheibe);
}
function setzePositionPfeil()
{
	var zWinkelInRad=zWinkel*(Math.PI/180);
	var pCos=Math.cos(zWinkelInRad);
	var pSin=Math.sin(zWinkelInRad);

	if(zMausGedruekt)
	{
		if(zMausTaste==1)
		{
			zWinkel++
			if(zWinkel==90)
			{zDreheRunter=false;}
		}
		else if(zMausTaste==2)
		{
			zWinkel--;
			if(zWinkel==-90)
			{zDreheRunter=true;}
		}

		zXSpitze=zXPfeil+Math.cos(zWinkelInRad)*zLaengePfeil;
		zYSpitze=zYPfeil+Math.sin(zWinkelInRad)*zLaengePfeil;
	}

	if(zPfeilFaellt&&zMausGedruekt==false)				//Pfeil fällt runter
	{
		zYPfeil+=zGeschwindigkeit;;
		zYSpitze+=zGeschwindigkeit;;
	}
	else if(zPfeilFaellt==false&&zMausGedruekt==false)	//Pfeil fliegt gerichtet
	{
		zXPfeil=zXPfeil+Math.cos(zWinkelInRad)*zGeschwindigkeit;
		zYPfeil=zYPfeil+Math.sin(zWinkelInRad)*zGeschwindigkeit;
		zXSpitze=zXPfeil+Math.cos(zWinkelInRad)*zLaengePfeil;
		zYSpitze=zYPfeil+Math.sin(zWinkelInRad)*zLaengePfeil;
	}


}
function zeichnePfeil(pX,pY,pXS,pYS)
{
	zMainCtx.beginPath();
	zMainCtx.fillStyle="black";
	zMainCtx.moveTo(pX,pY);
	zMainCtx.lineTo(pXS,pYS);
	zMainCtx.stroke();
	zMainCtx.closePath();

	zMainCtx.beginPath();
	zMainCtx.arc(pXS,pYS,2,0,Math.PI*2,true);
	zMainCtx.fillStyle="white";
	zMainCtx.fill();
	zMainCtx.closePath();
}

function mausGedrueckt(e)
{
	zMausGedruekt=true;
	var pTaste=e.button || e.which;
	zMausTaste=pTaste;
}
function mausLosgelassen()
{
	zMausGedruekt=false;
	zPfeilFaellt=false;
}

function pruefeGameOver()
{
	if(zPfeile==0)
	{
		zGameOver=true;
		if(zPunkte>15)
		{
			zGewonnen=true;
		}
	}
}

function pruefeRundeVorbei()
{
	if(zXSpitze>=zXScheibe+(zGroesseScheibe/2)) //Pfeil angekommen
	{
		if(zPfeile>0)	//noch Pfeile vorhanden
		{
			var pScheibenMittelpunk=zYScheibe+(zGroesseScheibe/2);
			var pFarbenRing=zGroesseScheibe/10;

			// Punkte rechnnung
			if(zYSpitze<=pScheibenMittelpunk+pFarbenRing&&zYSpitze>=pScheibenMittelpunk-pFarbenRing)
			{
				zPunkte+=10;
			}
			else if(zYSpitze<=pScheibenMittelpunk+(pFarbenRing*2)&&zYSpitze>=pScheibenMittelpunk-(pFarbenRing*2))
			{
				zPunkte+=8;
			}
			else if(zYSpitze<=pScheibenMittelpunk+(pFarbenRing*3)&&zYSpitze>=pScheibenMittelpunk-(pFarbenRing*3))
			{
				zPunkte+=6;
			}
			else if(zYSpitze<=pScheibenMittelpunk+(pFarbenRing*4)&&zYSpitze>=pScheibenMittelpunk-(pFarbenRing*4))
			{
				zPunkte+=4;
			}
			else if(zYSpitze<=pScheibenMittelpunk+(pFarbenRing*5)&&zYSpitze>=pScheibenMittelpunk-(pFarbenRing*5))
			{
				zPunkte+=2;
			}

			zPfeile--;
			zXPfeil=0;
			zYPfeil=0;
			zXSpitze=zXPfeil+zLaengePfeil;
			zYSpitze=0;
			zWarte=100;
			zWinkel=0;
			zPfeilFaellt=true;
		}
	}
}

function restart()
{
	resetSpielfeld();
	zGewonnen=false;
	zGameOver=false;
}

function loop()
{
	if(zGameOver==false&&zWarte<=0)
	{
		zMainCtx.clearRect(0,0,800,600);
		zeichneHintergrund();
		setzePositionPfeil();
		zeichnePfeil(zXPfeil,zYPfeil,zXSpitze,zYSpitze);
		pruefeRundeVorbei();
		pruefeGameOver();
	}

	zMainCtx.fillStyle="white";
	zMainCtx.font="20px Arial"
	zMainCtx.textBaseLine='top';
	zMainCtx.fillText("Punkte: "+zPunkte,650,20);
	zMainCtx.fillText("Pfeile: "+zPfeile,650,50);

	if(zGameOver)
	{
		zMainCtx.fillStyle="red";
		zMainCtx.font="50px Arial"
		zMainCtx.textBaseLine='top';
		if(zGewonnen)
		{
			zMainCtx.fillText("You won!",100,200);
			localStorage.setItem("DartGewonnen","true");

			document.getElementById('win').play();
			wait(2000);
			window.open('../Formalien/gewonnen.html',"_self");
		}
		else
			{zMainCtx.fillText("You lost!",100,200);
			document.getElementById('lose').play();
		}
	}

	if(zWarte>0)
	{zWarte--;}
	requestaframe(loop);
}

function backToTheMaze()
{
	if(zGewonnen)
	{
		localStorage.setItem("DartGewonnen","true");
	}

	close();

}

init();
