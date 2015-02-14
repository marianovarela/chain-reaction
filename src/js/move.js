var inc = 16;

	function moveUp(){
		if(game.bomb.y - inc >= 0){
			game.bomb.y -= inc;
		}
		else{
			game.bomb.y -= 0;	
		}
	}
	
	function moveDown(){
		if(game.bomb.y + inc <= 400){
			game.bomb.y += inc;
		}
		else{
			game.bomb.y = 400;
		}
	}
	
	function moveLeft(){
		if(game.bomb.x - inc >= 0){
			game.bomb.x -= inc;
		}
		else{
			game.bomb.x = 0;
		}
	}
	
	function moveRight(){
		if(game.bomb.x + inc <= 620){
			game.bomb.x += inc;
		}
		else{
			game.bomb.x = 620;
		}
	}