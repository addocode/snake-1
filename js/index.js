// REPLICA SNAKE GAME

// KONFIGURATION VOR DEM SPIEL
// Start-Bildschirm und Game-Over-Bildschirm
$('#starterInformation').on("click", start)

function start() 
{
	$("#starter").fadeOut("fast");
	$("#starterTitle").fadeOut("fast");
	$("#starterInformation").fadeOut("fast");
}

// MECHANIK WÄHREND DEM SPIEL
$(document).ready(function()
	{
	// Konfigurationen der <canvas>
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	ctx.font = "0.5em pixelmixregular";
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	// Breite der Zelle (Grösse der einzelnen Pixel)
	var cw = 10;
	var d;
	var food;
	var score;
   	var level;
	
	// SNAKE
	var snake_array; // ein Array für die Snake
	
	function init()
	{
		d = "right"; // Standard-Richtung
		create_snake();
		create_food(); // Punkte auf der Karte erstellen
		// Score und Level unten links anzeigen
		score = 0;
		level_value = 1;
		level_definition = "DEFAULT";
    	level = level_definition +  " (" + level_value + "x)";
		
		// Die Snake wird alle 60ms bewegt (wenn setInterval = 100) und löst somit die Paint-Funktion aus
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 100); // Geschwindigkeit der Snake (Default: 100)
	}
	init();
	
	function create_snake()
	{
		var length = 1; // anfängliche Länge der Snake
		snake_array = []; // leeres Array für den Snake-Body
		for(var i = length-1; i>=0; i--)
		{
			// eine horizontal ausgerichtete Snake wird oben links erstellt
			snake_array.push({x: i, y:0});
		}
	}
	
	// PUNKTE
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		// eine Position wird zufällig auf den <canvas> definiert
		// anschliessend wird dann dort ein Punkt (food) generiert
	}
	
	// SNAKE OPTISCH BEARBEITEN
	function paint()
	{
		// Style der <canvas>
		ctx.fillStyle = "#54ab83"; // Farbe der Fläche
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "#54ab83"; // Farbe der Kontur
		ctx.strokeRect(0, 0, w, h);
		
		// Bewegungen der Snake
		// die letzte Zelle (Rücken) wird an die Stelle der ersten Zelle (Kopf) verschoben
		// Positionen der ersten Zelle (Kopf):
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		// neue Position der ersten Zelle (Kopf) durch Vergrösserung:
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		// Registrierung von Kollisionen zusammen mit Snake & Snake / Snake & Border
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			$("#starter").remove();
			$("#starterTitle").remove();
			$("#starterInformation").remove();

			$("ul").append('<li><p id="starterTitle">Snake</p></li>');
			$("ul").append('<li><a id="starterInformation" href="#">Click to play!</a></li>');
			$("figure").append('<img id="starter" src="img/starter.png" alt="Nokia Snake Game">');
			
			$('#starterInformation').on("click", start)

			// das Spiel wird neugestartet -> mit Start-Bildschirm, welches das Spielgeschehen verdeckt (kann durch Klicken versteckt werden)
			init();
			return;
		}
		
		// SNAKE KONSUMIERT PUNKTE
		// wenn Position des Kopfes = Position des Punktes
		// dann wird ein neuer Kopf erstellt und nicht der Rücken auf die Position des Kopfes verschoben
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};

			// ein zufälliger Wert wird für den Score generiert
			var s = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
					 3, 5, 20
					 ];

			var score_amount = s[Math.floor(Math.random()*s.length)];
			for(var score_add = 0; score_add < score_amount; score_add++)
			{
				score++;
			}
       
			create_food();

			// kurzes Flackern der Fläche
			ctx.fillStyle = "#85c79b";
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = "#85c79b";
			ctx.strokeRect(0, 0, w, h);
			//$("#canvas").css({"border": "20px solid #85c79b"})
			//$("#canvas").css({"border": "20px solid #55ac84"})
		}
		else
		{
			var tail = snake_array.pop(); // die letzte Zelle wird gelöscht
			tail.x = nx; tail.y = ny;
		}
		

		snake_array.unshift(tail); // der Rücken wird auf die Position des Kopfes verschoben
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y, "#366b52"); // Farbe der Snake
		}
		
		paint_cell(food.x, food.y, "#172e23"); // Farbe von Punkten und Text
		var score_text = "Score: " + score;
    	var level_text = "Speed: " + level;
		ctx.fillText(score_text, 15, h-0);
     	ctx.fillText(level_text, 80, h-0);
	}
	
	function paint_cell(x, y, color)
	{
		ctx.fillStyle = color;
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "#366b52"; // Farbe der Kontur von Punkten und Snake
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function check_collision(x, y, array)
	{
		// Abfrage, ob x/y in einem Array von Zellen existiert oder nicht
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	// Steuerung über Tasten
	$(document).keydown(function(e)
	{
		var key = e.which;
		// WASD Steuerung & Mechanismus, der das Umkehren in die entgegengesetzte Richtung unmöglich macht
		if(key == "65" && d != "right") d = "left";
		else if(key == "87" && d != "down") d = "up";
		else if(key == "68" && d != "left") d = "right";
		else if(key == "83" && d != "up") d = "down";
	});	
});