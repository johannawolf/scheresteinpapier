function einloggen()
{
	var Username=document.getElementById('username');
	var Password=document.getElementById('pw');

	var i=Username.value;
	var j=Password.value;

	if(Username.value=="abc"&&Password.value=="abc") //Beispiel User 
	{
		location.href="../Labyrinth.html";
		var m=0;
	}
}
