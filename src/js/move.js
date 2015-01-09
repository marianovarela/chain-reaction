	function moveUp(){
		if(game.bomb.y - 4 >= 0){
			game.bomb.y -= 4;
		}
		else{
			game.bomb.y -= 0;	
		}
	}
	
	function moveDown(){
		if(game.bomb.y + 4 <= 400){
			game.bomb.y += 4;
		}
		else{
			game.bomb.y = 400;
		}
	}
	
	function moveLeft(){
		if(game.bomb.x -4 >= 0){
			game.bomb.x -= 4;
		}
		else{
			game.bomb.x = 0;
		}
	}
	
	function moveRight(){
		if(game.bomb.x + 4 <= 620){
			game.bomb.x += 4;
		}
		else{
			game.bomb.x = 620;
		}
	}