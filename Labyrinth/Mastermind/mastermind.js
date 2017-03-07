
var zGewonnen=false;
var zGameOver=true;

function aufMachen()
{
			zGewonnen = true;
			localStorage.setItem("MmindGewonnen","true");
			window.open('../Formalien/gewonnen.html',"_self");


}

function backToTheMaze()
{
	if(zGewonnen)
	{
		localStorage.setItem("MmindGewonnen","true");
	}

	close();
}
