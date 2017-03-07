var version='0.0.1';

var hatFrage=new Array(10);
var hatButton=new Array(4);

var zRichtige;
var zFragenGestellt;
var zAktuelleFrage;
var zRichtigerButton;
var zWait=0;

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


	document.addEventListener("click",mausKlick,false);

	//Schleife zum Fragen mit Antworten laden
	for(var i=0;i<10;i++)
	{
		hatFrage[i]=new Frage();
	}
	for(var j=0;j<4;j++)
	{
		hatButton[j]=new Button(0,0);
	}

	ladeBilder();
	resetSpielfeld();
	loop();
}
function mouse(e)
{
	zMausX=e.pageX-document.getElementById('game_object').offsetLeft;
	zMausY=e.pageY-document.getElementById('game_object').offsetTop;

	for(var i=0;i<4;i++)
	{
		if(hatButton[i].enthaelt(zMausX,zMausY))
			{
				hatButton[i].zHover=true;
			}
		else
		{
			hatButton[i].zHover=false;
		}
	}

	document.getElementById('x').innerHTML=zMausX;
	document.getElementById('y').innerHTML=zMausY;
}

function ladeBilder()
{
	zGesamtBild=new Image();
	zGesamtBild.src='bilder/gesamt.png';
}

function resetSpielfeld() //Button-Positionen, Inhalte Fragen und Antworten
{
	hatButton[0].zX=50;hatButton[0].zY=200;
	hatButton[1].zX=400;hatButton[1].zY=200;
	hatButton[2].zX=50;hatButton[2].zY=350;
	hatButton[3].zX=400;hatButton[3].zY=350;

	hatFrage[0].zFrage="Frage 0: Wie lautet der Satz des Pythagoras";
	hatFrage[0].zAntwortRichtig="a^2+b^2=c^2";
	hatFrage[0].zAntwortF1="a+b=c";
	hatFrage[0].zAntwortF2="a^2+b^2=c";
	hatFrage[0].zAntwortF3="a+b=c^2";

	hatFrage[1].zFrage="Frage 1: Pi=";
	hatFrage[1].zAntwortRichtig="3,141592... ";
	hatFrage[1].zAntwortF1="3,141875...";
	hatFrage[1].zAntwortF2="3,14257... ";
	hatFrage[1].zAntwortF3="3,41566...";

	hatFrage[2].zFrage="Frage 2: Hamburg hat ...";
	hatFrage[2].zAntwortRichtig="2000<Brücken<3000";
	hatFrage[2].zAntwortF1="Brücken<1000";
	hatFrage[2].zAntwortF2="1000<Brücken<2000";
	hatFrage[2].zAntwortF3="Brücken>3000";

	hatFrage[3].zFrage="Frage 3: Die Davidwache ist das ... Polizeirevier Europas.";
	hatFrage[3].zAntwortRichtig="kleinste";
	hatFrage[3].zAntwortF1="teuerste";
	hatFrage[3].zAntwortF2="älteste";
	hatFrage[3].zAntwortF3="neuste";

	hatFrage[4].zFrage="Frage 4: Das offizielle Nationalgetränk der Bermudainseln heißt:";
	hatFrage[4].zAntwortRichtig="dark and stormy";
	hatFrage[4].zAntwortF1="cold and mysterious";
	hatFrage[4].zAntwortF2="sweet and spooky";
	hatFrage[4].zAntwortF3="windy and lost";

	hatFrage[5].zFrage="Frage 5: 1 Byte= ";
	hatFrage[5].zAntwortRichtig="8 Bit";
	hatFrage[5].zAntwortF1="7 Bit";
	hatFrage[5].zAntwortF2="10 Bit";
	hatFrage[5].zAntwortF3="1 Bit";

	hatFrage[6].zFrage="Frage 6: \"Wer eine Jogginghose trägt, hat die Kontrolle über sein Leben verloren.\"";
	hatFrage[6].zAntwortRichtig="Karl Lagerfeld";
	hatFrage[6].zAntwortF1="Jan Joseph Liefers";
	hatFrage[6].zAntwortF2="Thomas Gottschalk";
	hatFrage[6].zAntwortF3="Barbara Schöneberger";

	hatFrage[7].zFrage="Frage 7: Summe der Zahlen 1 bis 100: ";
	hatFrage[7].zAntwortRichtig="5050";
	hatFrage[7].zAntwortF1="5055";
	hatFrage[7].zAntwortF2="5000";
	hatFrage[7].zAntwortF3="5500";

	hatFrage[8].zFrage="Frage 8: 42^0=";
	hatFrage[8].zAntwortRichtig="1";
	hatFrage[8].zAntwortF1="0";
	hatFrage[8].zAntwortF2="42";
	hatFrage[8].zAntwortF3="ungültige Rechnung";

	hatFrage[9].zFrage="Frage 9: Welche dieser Logikgatter gibt es nicht?";
	hatFrage[9].zAntwortRichtig="XAND";
	hatFrage[9].zAntwortF1="XNOR";
	hatFrage[9].zAntwortF2="OR";
	hatFrage[9].zAntwortF3="AND";

	zRichtige=0;
	zFragenGestellt=0;
	zWait=-1;
	stelleFrage();
}

function Frage()
{
	this.zFrage;
	this.zAntwortRichtig;
	this.zAntwortF1;this.zAntwortF2;this.zAntwortF3;
	this.zGefragt=false;
}

function Button() //Antwortbuttons, Farbveränderungen
{
	this.zX;
	this.zY;
	this.zWidth=270;
	this.zHeight=100;
	this.zHover=false;
	this.zText="";
}
Button.prototype.enthaelt=function(pX,pY)
{
	if(pX>this.zX&&pX<this.zX+this.zWidth&&pY>this.zY&&pY<this.zY+this.zHeight)
	{
		return true;
	}
	return false;
};
Button.prototype.draw=function()
{
	if(this.zHover==false)
	{
		zMainCtx.drawImage(zGesamtBild,0,0,100,50,this.zX,this.zY,this.zWidth,this.zHeight);
		zMainCtx.fillStyle="white";
	}
	else if(this.zHover)
	{
		zMainCtx.drawImage(zGesamtBild,0,50,100,50,this.zX,this.zY,this.zWidth,this.zHeight);
		zMainCtx.fillStyle="grey";
	}
	zMainCtx.font="20px Arial"
	zMainCtx.textBaseLine='top';
	zMainCtx.fillText(this.zText,this.zX+10,this.zY+this.zHeight/2);
};
Button.prototype.zeichneGruen=function()
{
	zMainCtx.drawImage(zGesamtBild,0,150,100,50,this.zX,this.zY,this.zWidth,this.zHeight);
	zMainCtx.fillStyle="grey";
	zMainCtx.font="20px Arial"
	zMainCtx.textBaseLine='top';
	zMainCtx.fillText(this.zText,this.zX+10,this.zY+this.zHeight/2);
};
Button.prototype.zeichneRot=function()
{
	zMainCtx.drawImage(zGesamtBild,0,100,100,50,this.zX,this.zY,this.zWidth,this.zHeight);
	zMainCtx.fillStyle="grey";
	zMainCtx.font="20px Arial"
	zMainCtx.textBaseLine='top';
	zMainCtx.fillText(this.zText,this.zX+10,this.zY+this.zHeight/2);
};

function stelleFrage() //Frage mit Antworten Aufruf und Mix
{
	for(var i=0;i<4;i++)
	{
		hatButton[i].zText="";
	}
	var pFrage=Math.round(Math.random()*9);
	do
	{
		pFrage=Math.round(Math.random()*9);

	}while(hatFrage[pFrage].zGefragt==true);
	zAktuelleFrage=pFrage;
	hatFrage[zAktuelleFrage].zGefragt=true;

	zRichtigerButton=Math.round(Math.random()*3);
	hatButton[zRichtigerButton].zText=hatFrage[zAktuelleFrage].zAntwortRichtig;

	var f;
	do
	{f=Math.round(Math.random()*3);
	}while (hatButton[f].zText!="");
	hatButton[f].zText=hatFrage[zAktuelleFrage].zAntwortF1;
	do
	{f=Math.round(Math.random()*3);
	}while (hatButton[f].zText!="");
	hatButton[f].zText=hatFrage[zAktuelleFrage].zAntwortF2;
	do
	{f=Math.round(Math.random()*3);
	}while (hatButton[f].zText!="");
	hatButton[f].zText=hatFrage[zAktuelleFrage].zAntwortF3;

}

function mausKlick() //Antwort - Feedback
{
	for(var i=0;i<4;i++)
	{
		if(hatButton[i].zHover&&zWait<-10)
		{
			if(i==zRichtigerButton)
			{
				zRichtige++;
			}
			else
			{
				hatButton[i].zeichneRot();
			}
		 hatButton[zRichtigerButton].zeichneGruen();
		 zFragenGestellt++;
		 zWait=50;

		 if(zFragenGestellt==10)
		 {
			 zGameOver=true;
			 if(zRichtige>=5)
			 {zGewonnen=true;}
		 }
		}
	}
}

function restart()
{
	zRichtige=0;
	zFragenGestellt=0;
	zGewonnen=false;
	zGameOver=false;
	for(var i=0;i<10;i++)
	{
		hatFrage[i].zGefragt=false;
	}
	zWait=-1;
	stelleFrage();
}

function loop() //Fragenaufruf
{

	if(zGameOver==false&&zWait<=0)
	{
		zMainCtx.clearRect(0,0,800,600);
		zMainCtx.fillStyle="black";
		zMainCtx.font="20px Arial"
		zMainCtx.textBaseLine='bottom';
		zMainCtx.fillText(hatFrage[zAktuelleFrage].zFrage,60,150);

		for(var i=0;i<4;i++)
		{hatButton[i].draw();}

		if(zWait==0)
		{
			stelleFrage();
		}
	}
	zWait--;
	zMainCtx.clearRect(0,0,500,100);
	zMainCtx.fillStyle="black";
	zMainCtx.font="15px Arial"
	zMainCtx.textBaseLine='top';
	zMainCtx.fillText("Richtige: "+zRichtige,50,80);

	if(zGameOver&&zWait<=0)
	{
		zMainCtx.fillStyle="red";
		zMainCtx.font="50px Arial"
		zMainCtx.textBaseLine='top';
		if(zGewonnen)
		{
			zMainCtx.fillText("You won!",100,200);
			localStorage.setItem("QuizGewonnen","true");
			window.open('../Formalien/finale.html',"_self");
		}
		else
		{zMainCtx.fillText("You lost!",100,200);}
	}

	requestaframe(loop);
}

function backToTheMaze()
{
	if(zGewonnen)
	{
		localStorage.setItem("QuizGewonnen","true");
	}

	close();
}

init();
