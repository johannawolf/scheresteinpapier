var version='0.0.1';
var zBeginn=0;
var zTasteGedrueckt=false;

var zSpielen=false;
var hatFeld=new Array(16);
for(var i=0;i<16;i++)
{
	hatFeld[i]=new Array(16);
}
var zErwarteEingabe=false;

var zSpiel1Gewonnen="MmindGewonnen";
var zSpiel2Gewonnen="PuzzleGewonnen";
var zSpiel3Gewonnen="FarbenGewonnen";
var zSpiel4Gewonnen="SnakeGewonnen";
var zSpiel5Gewonnen="DartGewonnen";
var zSpiel6Gewonnen="RussianGewonnen";
var zSpiel7Gewonnen="QuizGewonnen";

var zSpiel1Link="Mastermind/Mastermind_spielstartseite.html";
var zSpiel2Link="Puzzle/puzzle_spielstartseite.html";
var zSpiel3Link="Farben/farben_spielstartseite.html";
var zSpiel4Link="Snake/snake_spielstartseite.html";
var zSpiel5Link="Dart/Dart_spielstartseite.html";
var zSpiel6Link="Russian/russian_spielstartseite.html";
var zSpiel7Link="Quiz/quiz_spielstartseite.html";

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

	document.addEventListener("keypress",tasteGedrueckt,false);
	document.addEventListener("keyup",tasteLosgelassen,false);
	window.addEventListener("storage",storage,false);

	for(var i=0;i<16;i++)
	{for(var j=0;j<16;j++)
		{
			hatFeld[i][j]=new Feld(i*50,j*50);
		}}

	if(localStorage.getItem("Reset")==null)
	{
		resetSpiel();
		localStorage.setItem("Reset",true);
	}
	ladeBilder();
	ladeSpielfeld();
	loop();

}

function mouse(e) //position
{
	zMausX=e.pageX-document.getElementById('game_object').offsetLeft;
	zMausY=e.pageY-document.getElementById('game_object').offsetTop;
}

function ladeBilder()
{
	zLabyrinthBild=new Image();
	zLabyrinthBild.src='bilder/labyrinth_new.png';
	zSpieler=new Image();
	zSpieler.src='bilder/feld.png';
}

function ladeSpielfeld()
{
	//prüfe ob Felder freigeschaltet sind
	for(var i=0;i<16;i++)
	{for(var j=0;j<16;j++)
		{
			if(localStorage.getItem("Feld"+i+j)=="true")
			{
				hatFeld[i][j].zAktiv=true;
			}
			else if(localStorage.getItem("Feld"+i+j)=="false")
			{
				hatFeld[i][j].zAktiv=false;
			}
		}}

	zHintergrundCtx.drawImage(zLabyrinthBild,0,0,800,600,0,0,800,600);
	//Schlösser setzen
	setzeSchloesser();


	zMainCtx.clearRect(0,0,800,600);
	var zXS=parseInt(localStorage.getItem("zXSpieler"));
	var zYS=parseInt(localStorage.getItem("zYSpieler"));
	zMainCtx.drawImage(zSpieler,0,0,100,100,hatFeld[zXS][zYS].zX+5,hatFeld[zXS][zYS].zY+3,45,45);
	pruefeFeld(zXS,zYS);
}

function setzeSchloesser()
{
	if(localStorage.getItem(zSpiel1Gewonnen)=="false")
	{
		if(localStorage.getItem("Feld"+1+9)=="true"||localStorage.getItem("Feld"+2+10)=="true")	//Raum 1 Mastermind
		{zHintergrundCtx.drawImage(zSpieler,0,100,65,90,75,470,50,60);}
		else if(localStorage.getItem("Feld"+1+9)=="false"||localStorage.getItem("Feld"+2+10)=="false")
		{zHintergrundCtx.drawImage(zSpieler,100,10,65,90,75,470,50,60);}
	}
	if(localStorage.getItem(zSpiel2Gewonnen)=="false")
	{
		if(localStorage.getItem("Feld"+3+2)=="true"||localStorage.getItem("Feld"+3+11)=="true")	//Raum 2 Puzzle
		{zHintergrundCtx.drawImage(zSpieler,0,100,65,90,170,120,50,60);}
		else if(localStorage.getItem("Feld"+3+2)=="false"||localStorage.getItem("Feld"+3+11)=="false")
		{zHintergrundCtx.drawImage(zSpieler,100,10,65,90,170,120,50,60);}
	}
	if(localStorage.getItem(zSpiel3Gewonnen)=="false")
	{
		if(localStorage.getItem("Feld"+4+6)=="true"||localStorage.getItem("Feld"+5+5)=="true")	//Raum 3 Farben
		{zHintergrundCtx.drawImage(zSpieler,0,100,65,90,225,275,50,60);}
		else if(localStorage.getItem("Feld"+4+6)=="false"||localStorage.getItem("Feld"+5+5)=="false")
		{zHintergrundCtx.drawImage(zSpieler,100,10,65,90,225,275,50,60);}
	}
	if(localStorage.getItem(zSpiel4Gewonnen)=="false")
	{
		if(localStorage.getItem("Feld"+6+3)=="true"||localStorage.getItem("Feld"+7+3)=="true")	//Raum 4 Snake
		{zHintergrundCtx.drawImage(zSpieler,0,100,65,90,325,120,50,60);}
		else if(localStorage.getItem("Feld"+6+3)=="false"||localStorage.getItem("Feld"+7+3)=="false")
		{zHintergrundCtx.drawImage(zSpieler,100,10,65,90,325,120,50,60);}
	}
	if(localStorage.getItem(zSpiel5Gewonnen)=="false")
	{
		if(localStorage.getItem("Feld"+6+8)=="true"||localStorage.getItem("Feld"+7+7)=="true")	//Raum 5 Dart
		{zHintergrundCtx.drawImage(zSpieler,0,100,65,90,325,375,50,60);}
		else if(localStorage.getItem("Feld"+6+8)=="false"||localStorage.getItem("Feld"+7+7)=="false")
		{zHintergrundCtx.drawImage(zSpieler,100,10,65,90,325,375,50,60);}
	}
	if(localStorage.getItem(zSpiel6Gewonnen)=="false")
	{
		if(localStorage.getItem("Feld"+9+4)=="true")	//Raum 6 Russian Roulette
		{zHintergrundCtx.drawImage(zSpieler,0,100,65,90,475,225,50,60);}
		else if(localStorage.getItem("Feld"+9+4)=="false")
		{zHintergrundCtx.drawImage(zSpieler,100,10,65,90,475,225,50,60);}
	}
	if(localStorage.getItem(zSpiel7Gewonnen)=="false")
	{
		if(localStorage.getItem("Feld"+13+4)=="true")	//Raum 7 Quiz
		{zHintergrundCtx.drawImage(zSpieler,0,100,65,90,675,175,50,60);}
		else if(localStorage.getItem("Feld"+13+4)=="false")
		{zHintergrundCtx.drawImage(zSpieler,100,10,65,90,675,175,50,60);}
	}
}

function Feld(pX,pY)
{
	this.zX=pX;
	this.zY=pY;
	this.zAktiv=false;
}

//Bewegungen + Sound
function oben()
{
	laufe("oben");
	document.getElementById('move').play();
}

function unten()
{
	laufe("unten");
	document.getElementById('move').play();
}

function links1()
{
	laufe("links");
	document.getElementById('move').play();
}

function rechts()
{
	laufe("rechts");
	document.getElementById('move').play();
}

function laufe(pRichtung)
{
	var zXS=parseInt(localStorage.getItem("zXSpieler"));
	var zYS=parseInt(localStorage.getItem("zYSpieler"));
	//prüft in welche Richtung gelaufen werden soll
	if(pRichtung=="oben")
	{
		if(zYS>0&&hatFeld[zXS+0][zYS-1].zAktiv&&erlaubt(zXS,zYS,"nachObenErlaubt"))
		{
			zYS--;
		}
	}
	else if(pRichtung=="unten")
	{
		if(zYS<15&&hatFeld[zXS][zYS+1].zAktiv&&erlaubt(zXS,zYS,"nachUntenErlaubt"))
		{
			zYS++;
		}
	}
	else if(pRichtung=="links")
	{
		if(zXS>0&&hatFeld[zXS-1][zYS].zAktiv&&erlaubt(zXS,zYS,"nachLinksErlaubt"))
		{
			zXS--;
		}
	}
	else if(pRichtung=="rechts")
	{
		if(zXS<15&&hatFeld[zXS+1][zYS].zAktiv&&erlaubt(zXS,zYS,"nachRechtsErlaubt"))
		{
			zXS++;
		}
	}

	localStorage.setItem("zXSpieler",zXS);
	localStorage.setItem("zYSpieler",zYS);
	pruefeFeld(zXS,zYS);
}

function erlaubt(pX,pY,pRichtung)
{
	if(pRichtung=="nachObenErlaubt")
	{
		if((pX==4&&pY==4)||(pX==7&&pY==4)||(pX==9&&pY==6)||(pX==10&&pY==6)
		||(pX==5&&pY==7)||(pX==8&&pY==7)||(pX==9&&pY==7)||(pX==7&&pY==9)
		||(pX==3&&pY==10)||(pX==4&&pY==10)||(pX==5&&pY==10)||(pX==5&&pY==10)||(pX==7&&pY==10)
		||(pX==2&&pY==9)||(pX==4&&pY==5)||(pX==5&&pY==5)||(pX==6&&pY==7)||(pX==7&&pY==7)
		||(pX==9&&pY==4)||(pX==9&&pY==4)||(pX==8&&pY==4))
		{
			return false;
		}
	}
	else if(pRichtung=="nachUntenErlaubt")
	{
		if((pX==2&&pY==8)||(pX==4&&pY==4)||(pX==5&&pY==4)||(pX==6&&pY==6)||(pX==7&&pY==6)
		||(pX==8&&pY==6)||(pX==9&&pY==6)||(pX==8&&pY==3)||(pX==9&&pY==3)||(pX==10&&pY==3)
		||(pX==3&&pY==9)||(pX==4&&pY==9)||(pX==5&&pY==9)||(pX==6&&pY==9)||(pX==7&&pY==9)
		||(pX==3&&pY==3)||(pX==7&&pY==3)||(pX==5&&pY==6)||(pX==7&&pY==8)||(pX==4&&pY==3)
		||(pX==10&&pY==5)||(pX==10&&pY==5)||(pX==9&&pY==5))
		{
			return false;
		}
	}
	else if(pRichtung=="nachLinksErlaubt")
	{
		if((pX==3&&pY==9)||(pX==5&&pY==2)||(pX==6&&pY==6)||(pX==8&&pY==2)||(pX==8&&pY==8)
		||(pX==8&&pY==9)||(pX==10&&pY==6)||(pX==11&&pY==4)||(pX==11&&pY==5)
		||(pX==3&&pY==3)||(pX==4&&pY==5)||(pX==4&&pY==6)||(pX==6&&pY==2)||(pX==6&&pY==3)
		||(pX==6&&pY==7)||(pX==6&&pY==8)||(pX==9&&pY==5)||(pX==2&&pY==7))
		{
			return false;
		}
	}
	else if(pRichtung=="nachRechtsErlaubt")
	{
		if((pX==2&&pY==3)||(pX==5&&pY==2)||(pX==5&&pY==3)||(pX==5&&pY==7)||(pX==7&&pY==9)
		||(pX==1&&pY==7)||(pX==5&&pY==8)
		||(pX==2&&pY==9)||(pX==4&&pY==2)||(pX==5&&pY==6)||(pX==7&&pY==2)||(pX==7&&pY==8)
		||(pX==10&&pY==4)||(pX==10&&pY==5))
		{
			return false;
		}
	}

	return true;
}


function enter() //ausgewählter Raum öffnen
{
	var zXS=parseInt(localStorage.getItem("zXSpieler"));
	var zYS=parseInt(localStorage.getItem("zYSpieler"));
	var pZuOeffnenderLink="";

	if(zXS==15&&zYS==4)
	{
		window.open("Formalien/gewonnen.html","_self");
	}
	else
	{
		switch(localStorage.getItem("spielFeld"+zXS+zYS))
		{
			case "Spiel1":pZuOeffnenderLink=zSpiel1Link;
							break;
			case "Spiel2":pZuOeffnenderLink=zSpiel2Link;
							break;
			case "Spiel3":pZuOeffnenderLink=zSpiel3Link;
							break;
			case "Spiel4":pZuOeffnenderLink=zSpiel4Link;
							break;
			case "Spiel5":pZuOeffnenderLink=zSpiel5Link;
							break;
			case "Spiel6":pZuOeffnenderLink=zSpiel6Link;
							break;
			case "Spiel7":pZuOeffnenderLink=zSpiel7Link;
							break;
		}
		window.open(pZuOeffnenderLink,"");
		document.getElementById('door').play();
	}

}

function reset()
{
	resetSpiel();
	ladeSpielfeld();
}

function pruefeFeld( pX, pY)
{
	zMainCtx.clearRect(0,0,800,600);
	var zXS=parseInt(localStorage.getItem("zXSpieler"));
	var zYS=parseInt(localStorage.getItem("zYSpieler"));
	zMainCtx.drawImage(zSpieler,0,0,100,100,hatFeld[pX][pY].zX+5,hatFeld[pX][pY].zY+3,45,45);

	//prüfe, ob Spieler auf einer Tür steht
	var button=document.getElementById("enter");
	var pSpiel=localStorage.getItem("spielFeld"+pX+pY);
	if(pruefeSpiel(pSpiel,pX,pY))
		{
			zErwarteEingabe=true;
			document.getElementById("enter").disabled = false;
		}
	else
		{
			zErwarteEingabe=false;
	 	document.getElementById("enter").disabled = true;
	 }

}

function pruefeSpiel(pSpiel,pX,pY)
{
	if(pSpiel=="Spiel1"||pSpiel=="Spiel2"||pSpiel=="Spiel3"||pSpiel=="Spiel4"||pSpiel=="Spiel5"||
		pSpiel=="Spiel6"||pSpiel=="Spiel7"||(pX==15&&pY==4))
	{
		return true;
	}
	return false;
}

function tasteGedrueckt(e) //Navigation
{
	var key_id=e.keyCode || e.which;

	if(key_id==13&&zTasteGedrueckt==false)
	{enter();e.preventDefault();}
	else if(key_id==40&&zTasteGedrueckt==false) //down key
	{unten();e.preventDefault();}
	else if(key_id==38&&zTasteGedrueckt==false) //up key
	{oben();e.preventDefault();}
	else if(key_id==37&&zTasteGedrueckt==false) //left key
	{links1();e.preventDefault();}
	else if(key_id==39&&zTasteGedrueckt==false) //right key
	{rechts();e.preventDefault();}
	zTasteGedrueckt=true;
}

function tasteLosgelassen(e)
{
	zTasteGedrueckt=false;
}

function resetSpiel()
{
	zBeginn=0;
	/*Das Spielfeld ist in 16x16 Felder aufgeteilt. Für jedes Feld wird im local Storage gespeichert, ob
	  der Spieler dieses Feld betreten darf, oder nicht.
	  Speicherung: localStorage.setItem("Feld"+x-Variable+y-Variable
		darf der Spieler das Feld betreten?)
	*/
	for(var i=0;i<16;i++)
	{for(var j=0;j<16;j++)
		{
			localStorage.setItem("Feld"+i+j,"false");
			localStorage.setItem("spielFeld"+i+j,"");
		}}
	raumFreischalten(1);

	/*Für jede Tür wird gespeichert, welches Spiel damit betreten wird
		Speicherung: localStorage.setItem("spielFeld"+x-Variable+y-Variable
		welches Spiel wird betreten?)
	*/
	localStorage.setItem("spielFeld"+1+9,"Spiel1");
	localStorage.setItem("spielFeld"+2+10,"Spiel1");
	localStorage.setItem("spielFeld"+3+2,"Spiel2");
	localStorage.setItem("spielFeld"+4+3,"Spiel2");
	localStorage.setItem("spielFeld"+4+6,"Spiel3");
	localStorage.setItem("spielFeld"+5+5,"Spiel3");
	localStorage.setItem("spielFeld"+6+3,"Spiel4");
	localStorage.setItem("spielFeld"+7+3,"Spiel4");
	localStorage.setItem("spielFeld"+6+8,"Spiel5");
	localStorage.setItem("spielFeld"+7+7,"Spiel5");
	localStorage.setItem("spielFeld"+9+4,"Spiel6");
	localStorage.setItem("spielFeld"+13+4,"Spiel7");

	//Für jedes Mini-Game wird gespeichert, ob es bereits gewonnen wurde
	localStorage.setItem("MmindGewonnen","false");
	localStorage.setItem("PuzzleGewonnen","false");
	localStorage.setItem("FarbenGewonnen","false");
	localStorage.setItem("SnakeGewonnen","false");
	localStorage.setItem("DartGewonnen","false");
	localStorage.setItem("RussianGewonnen","false");
	localStorage.setItem("QuizGewonnen","false");

	localStorage.setItem("zXSpieler","1");
	localStorage.setItem("zYSpieler","7");
}

function storage(e)
{
	var i=e.key;
	var j=e.newValue;

	localStorage.setItem(e.key,e.newValue);
	if(j=="true")
	{
		switch(i)
		{
			case zSpiel1Gewonnen: spielFreischalten(1);
									break;
			case zSpiel2Gewonnen: spielFreischalten(2);
									break;
			case zSpiel3Gewonnen: spielFreischalten(3);
									break;
			case zSpiel4Gewonnen: spielFreischalten(4);
									break;
			case zSpiel5Gewonnen: spielFreischalten(5);
									break;
			case zSpiel6Gewonnen: spielFreischalten(6);
									break;
			case zSpiel7Gewonnen: spielFreischalten(7);
									break;
		}
	}


	if(pruefeAlleSpieleFreigeschaltet()) //Endgegener
	{
		//Eingang von Spiel 7 freischalten
		localStorage.setItem("Feld"+13+4,"true");
	}


	ladeSpielfeld();
	var zXS=parseInt(localStorage.getItem("zXSpieler"));
	var zYS=parseInt(localStorage.getItem("zYSpieler"));
	pruefeFeld(zXS,zYS);
}

function pruefeAlleSpieleFreigeschaltet()
{
	if(localStorage.getItem(zSpiel1Gewonnen)=="true"
		&&localStorage.getItem(zSpiel2Gewonnen)=="true"
		&&localStorage.getItem(zSpiel3Gewonnen)=="true"
		&&localStorage.getItem(zSpiel4Gewonnen)=="true"
		&&localStorage.getItem(zSpiel5Gewonnen)=="true"
		&&localStorage.getItem(zSpiel6Gewonnen)=="true")
	{
		return true;
	}
	return false;
}

function spielFreischalten(pSpiel) //Vorgabe welche Räume wann freigegeben werden
{
	if(pSpiel==1)
	{
		for(var i=1;i<3;i++)
		{for(var j=9;j<11;j++)
			{
				localStorage.setItem("Feld"+i+j,"true");
			}}

		raumFreischalten(2);
	}
	else if(pSpiel==2)
	{
		for(var i=3;i<5;i++)
		{for(var j=2;j<4;j++)
			{
				localStorage.setItem("Feld"+i+j,"true");
			}}

		raumFreischalten(3);
	}
	else if(pSpiel==3)
	{
		for(var k=4;k<=5;k++)
		{ for(var l=5;l<=6;l++)
			{localStorage.setItem("Feld"+k+l,"true");}
		}

		raumFreischalten(3);
		raumFreischalten(4);
	}
	else if(pSpiel==4)
	{
		for(var k=6;k<=7;k++)
		{ for(var l=2;l<=3;l++)
			{localStorage.setItem("Feld"+k+l,"true");}
		}

		raumFreischalten(3);
		raumFreischalten(2);
	}
	else if(pSpiel==5)
	{
		for(var k=6;k<=7;k++)
		{ for(var l=7;l<=8;l++)
			{localStorage.setItem("Feld"+k+l,"true");}
		}

		raumFreischalten(2);
		raumFreischalten(4);
	}
	else if(pSpiel==6)
	{
		for(var k=9;k<=10;k++)
		{ for(var l=4;l<=5;l++)
			{localStorage.setItem("Feld"+k+l,"true");}
		}
	}
	else if(pSpiel==7)
	{
		for(var k=13;k<=14;k++)
		{ for(var l=3;l<=4;l++)
			{localStorage.setItem("Feld"+k+l,"true");}
		}
		localStorage.setItem("Feld"+15+4,"true");
	}
}

function raumFreischalten(pRaum)
{
	if(pRaum==1)
	{
		localStorage.setItem("Feld"+1+7,"true");
		localStorage.setItem("Feld"+1+8,"true");
		localStorage.setItem("Feld"+1+9,"true");
		for(var k=2;k<=8;k++)
		{localStorage.setItem("Feld"+2+k,"true");}
		localStorage.setItem("Feld"+3+2,"true");
	}
	else if(pRaum==2)
	{
		for(var i=3;i<=8;i++)
		{localStorage.setItem("Feld"+i+10,"true");}
		localStorage.setItem("Feld"+8+9,"true");
		localStorage.setItem("Feld"+8+8,"true");
		localStorage.setItem("Feld"+9+8,"true");
		for(var j=8;j<=11;j++)
		{localStorage.setItem("Feld"+j+7,"true");}
		localStorage.setItem("Feld"+10+6,"true");
		localStorage.setItem("Feld"+11+6,"true");
		localStorage.setItem("Feld"+11+5,"true");
		localStorage.setItem("Feld"+11+4,"true");
		localStorage.setItem("Feld"+12+4,"true");
		for(var k=8;k<=11;k++)
		{ for(var l=2;l<=3;l++)
			{localStorage.setItem("Feld"+k+l,"true");}
		}

		localStorage.setItem("Feld"+7+3,"true");
		localStorage.setItem("Feld"+7+7,"true");
		localStorage.setItem("Feld"+2+10,"true");
	}
	else if(pRaum==3)
	{
		for(var k=5;k<=5;k++)
		{ for(var l=2;l<=4;l++)
			{localStorage.setItem("Feld"+k+l,"true");}
		}
		for(var i=6;i<=8;i++)
		{ for(var j=4;j<=6;j++)
			{localStorage.setItem("Feld"+i+j,"true");}
		}
		localStorage.setItem("Feld"+9+6,"true");
		localStorage.setItem("Feld"+4+4,"true");

			//Türen
		localStorage.setItem("Feld"+6+3,"true");
		localStorage.setItem("Feld"+5+5,"true");
		localStorage.setItem("Feld"+9+4,"true");
		localStorage.setItem("Feld"+4+3,"true");
	}
	else if(pRaum==4)
	{
		for(var k=4;k<=5;k++)
		{ for(var l=7;l<=8;l++)
			{localStorage.setItem("Feld"+k+l,"true");}
		}
		for(var i=3;i<=7;i++)
		{localStorage.setItem("Feld"+i+9,"true");}

		//Türen
		localStorage.setItem("Feld"+4+6,"true");
		localStorage.setItem("Feld"+6+8,"true");
	}

}


function loop()
{
	if(zBeginn<3)
	{ladeSpielfeld();
	 requestaframe(loop);
	 zBeginn++;
	}
}

init();
