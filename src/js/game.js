/*globals $,Ball,clearInterval,Drawer,levels*/
/// <reference path="levels.js" />
/// <reference path="ball.js" />
/// <reference path="util.drawer.js" />
/// <reference path="util.misc.js" />
	
	var $GAME = {};
	
	$GAME.name = "CHAIN_REACTION";
	$GAME.url_get = "http://localhost:8083/api/v1/score/search/findByGameOrderByScoreDesc?game=";
	$GAME.url_post = "http://localhost:8083/api/v1/score";
	
	component = {};

	component.root = extensible.create_basic('root').initialize();
	
	component.root.handle_inner = function(key) {
	  console.log('handling ' + key);
	  var audio = new Audio('audio/fail.mp3');
	  audio.play();
	};
	
	component.root.set_active_down_to_up = function(child_component, changed_child) {
	  
	  console.log('set_active_down_to_up ' + this.identifier);
	  this.set_current_component(child_component);
	};
	
	$(function(){component.startPanel.set_active(true);});
	
	component.control = (function() {
	  var Control, get_keycode, keycodes, listeners;
	  listeners = [];
	  keycodes = [
	    {
	      key: 'left',
	      code: 37
	    }, {
	      key: 'up',
	      code: 38
	    }, {
	      key: 'right',
	      code: 39
	    }, {
	      key: 'down',
	      code: 40
	    }, {
	      key: 'enter',
	      code: 13
	    }
	  ];
	  get_keycode = function(code) {
	    var keycode, _i, _len;
	    for (_i = 0, _len = keycodes.length; _i < _len; _i++) {
	      keycode = keycodes[_i];
	      if (keycode.code === code) {
	        return keycode;
	      }
	    }
	  };
	  return Control = (function() {
	    function Control() {}
	
	    Control.subscribe = function(listener) {
	      listeners.push(listener);
	      return function() {
	        return unsubscribe(listener);
	      };
	    };
	
	    Control.unsubscribe = function(listener) {
	      return _.remove(listeners, listener);
	    };
	
	    Control.initialize = function() {
	      return document.onkeydown = function(event) {
	        var keycode, listener, _i, _len;
	        if (keycode = get_keycode(event.keyCode)) {
	          for (_i = 0, _len = listeners.length; _i < _len; _i++) {
	            listener = listeners[_i];
	            listener.handle(keycode.key);
	          }
	          event.preventDefault();
	          return false;
	        }
	      };
	    };
	
	    return Control;
	
	  })();
	})(this);

	function playGame(){
		$(function(){component.startPanel.set_not_active();});
		$(function(){component.game.set_active(true);});
	}
	
	function winGame(){
		$(function(){component.winGame.set_not_active();});
		$(function(){component.winGame.set_active(true);});
	}
	
	function initMenuNextLevel(){
		$(function(){component.game.set_not_active();});
		$(function(){component.nextLevelMenu.set_active(true);});
	}
	
	function initGameOver(){
		$(function(){component.game.set_not_active();});
		$(function(){component.gameover.set_active(true);});
	}
	
	function activate(componentId){
		componentId.set_active(true);
	}
	
	function deactivate(componentId){
		componentId.set_not_active();
	}
	
	function initGame() {
		
		component.control.initialize();
		component.control.subscribe(component.root);
		
		component.startPanel = extensible.create_vertical('startPanel');
		
		component.game = extensible.create_horizontal('gameBoard');
		
		component.nextLevelMenu = extensible.create_horizontal('suc');
		
		component.gameover = extensible.create_horizontal('fail');
		
		component.submitScore= extensible.create_horizontal('suc');
		
		component.winGame= extensible.create_horizontal('suc');
		
		component.root
			.add(extensible.create_horizontal('startButtonPanel')
			    .add(component.startPanel.set_priority(0)
		        	.add(extensible.create_leaf('startGame').set_priority(0))
			    )
			);
		
		component.root
			.add(extensible.create_horizontal('levelProgress')
			    .add(component.game.set_priority(0)
		        	.add(extensible.create_ball('game').set_priority(0))
			    )
			);	
			
		component.root
			.add(extensible.create_horizontal('nextLevelMenu')
			    .add(component.nextLevelMenu.set_priority(0)
		        	.add(extensible.create_leaf('nextLevel').set_priority(0))
			    )
			);	
			
		component.root
			.add(extensible.create_horizontal('menuFail')
			    .add(component.gameover.set_priority(0)
		        	.add(extensible.create_leaf('tryAgain').set_priority(0))
		        	.add(extensible.create_leaf('submitScoreFail').set_priority(1))
			    )
			);	
			
		component.root
			.add(extensible.create_horizontal('submitScores')
			    .add(component.submitScore.set_priority(0)
		        	.add(extensible.create_leaf('cancel').set_priority(0))
		        	.add(extensible.create_leaf('submit').set_priority(1))
			    )
			);
			
		component.root
			.add(extensible.create_horizontal('winGame')
			    .add(component.winGame.set_priority(0)
		        	.add(extensible.create_leaf('submitScore').set_priority(0))
		        	.add(extensible.create_leaf('newGame').set_priority(1))
			    )
			);	
					
	}

	initGame();

var game = game || {};

game = {
    canvas: null,
    ctx: null,
    balls: [],
    explodedBalls: [],
    bomb: null,
    level: null,
    currentLevel: 1,
    gameLoopTimer: null,
    defaults: null,
    drawer: null,

    stats: {
        score: 0,
        levelScore: 0
    },

    settings: {
        fps: 35,
        ballSize: 12,
        explodeRadius: 14 * 3,
        explodeTime: 2000,
        bombColor: '#ddd'
    },

    boundary: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },

    events: {
        levelBegin: function () { },
        levelGoalReached: function () { },
        levelFinished: function () { },
        lastLevelFinished: function () { },
        gameOver: function () { },
        explosion: function (ball, score, levelScore) { }
    },

    init: function (canvasId) {
        this.reset();
        this.initContext(canvasId);

        // backup settings
        this.defaults = $.extend(true, {}, game.settings);

        this.startLevel(levels[this.currentLevel]);
    },

    reset: function () {
        this.stats = {
            score: 0,
            levelScore: 0
        };
        this.currentLevel = 1;
        this.level = levels[this.currentLevel];
    },

    startLevel: function (level) {
    	this.bomb = new Ball(305, 205, 25, '#ddd');
    	
        this.level = level;
        this.currentLevel = level.number;
        this.explodedBalls = [];
        this.balls = [];
        // this.bomb = null;
        this.stats.levelScore = 0;

        // default settings in case they have been changed
        this.settings = $.extend(true, {}, this.defaults);

        if (level.settings != null) {
            $.extend(true, this.settings, level.settings);
        }

        this.generateBalls(level);

        this.startGameLoop();
        this.events.levelBegin();
    },

    restartLevel: function () {
        this.stopGameLoop();
        this.startLevel(levels[this.currentLevel]);
    },

    loadNextLevel: function () {
        this.stopGameLoop();
        this.startLevel(levels[++this.currentLevel]);
    },

    generateBalls: function (level) {
        if (level == null)
            throw new Error("Level doesn't exist.");

        for (var i = 0; i < level.ballCount; i++) {
            var ball = Ball.create();
            this.balls.push(ball);
        }
    },

    onMouseUp: function (e) {
        if (game.bomb == null || game.bomb.isExploded)
            return;

        game.bomb.explode();
        game.addExplosion(game.bomb);
    },

    onMouseMove: function (e) {
        var x = e.clientX - game.canvas.offsetLeft + (window.scrollX ? window.scrollX : 0);
        var y = e.clientY - game.canvas.offsetTop + (window.scrollY ? window.scrollY : 0);

        if (game.bomb == null) {
            var radius = game.settings.ballSize / 2;
            game.bomb = new Ball(x, y, radius, game.settings.bombColor);
            game.bomb.isBomb = true;
        } else if (!game.bomb.isExploded) {
            game.bomb.x = x;
            game.bomb.y = y;
        }
    },

    startGameLoop: function () {
        this.gameLoopTimer = setInterval(this.gameLoop, 1000 / this.settings.fps);
    },

    stopGameLoop: function () {
        clearInterval(this.gameLoopTimer);
    },

    gameLoop: function () {
        game.drawer.clear();

        if (game.bomb != null)
            game.bomb.draw();

        for (var i in game.balls) {
            var ball = game.balls[i];

            if (!ball.isExploded) {
                var closestBall = ball.getClosestBall(game.explodedBalls);
                if (closestBall != null) {
                    ball.explodeWith(closestBall);
                    game.addExplosion(ball);
                }

                ball.move();
            }

            ball.draw();
        }


        game.checkGameState();
    },

    addExplosion: function (ball) {
        var newPoints = this.calculateScoreByDepth(ball.depth);

        this.explodedBalls.push(ball);
        this.stats.score += newPoints;
        this.stats.levelScore += newPoints;
        this.events.explosion(ball, this.stats.score, this.stats.levelScore);

        if (this.level.isGoal(this.explodedBalls.length)) {
            this.events.levelGoalReached();
        }
    },
    
    checkGameState: function () {
        if (this.explodedBalls.length > 0 && game.explodedBalls.every(Ball.isClosed)) {
            this.drawer.clear();
            this.stopGameLoop();

            if (this.level.passedGoal(this.explodedBalls.length)) {
                if (this.currentLevel < levels.length - 1){
                    this.events.levelFinished();
                    initMenuNextLevel();
                }    
                else{
                    this.events.lastLevelFinished();
                }    
            }
            else {
                // remove points earned this level because we didn't pass goals.
            	initGameOver();
                this.stats.score -= this.stats.levelScore;

                this.events.gameOver();
            }
        }
    },

    changeFps: function (fps) {
        this.settings.fps = fps;
        this.stopGameLoop();
        this.startGameLoop();
    },

    calculateScoreByDepth: function (depth) {
        return depth * depth * depth * 100;
    },

    initContext: function (canvasId) {
        var canvas = $(canvasId)[0];

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.drawer = new Drawer(this.ctx);

        $(this.canvas).mouseup(this.onMouseUp)
                      .mousemove(this.onMouseMove);

        this.ctx.textBaseline = "top";
        this.ctx.font = "bold 14px Arial";
        this.ctx.globalAlpha = 0.8;

        this.boundary.right = canvas.width;
        this.boundary.bottom = canvas.height;
    },

    getExplosions: function () {
        if (this.explodedBalls == null || this.explodedBalls.length == 0)
            return 0;
        return this.explodedBalls.length - 1; // Remove 'bomb' ball
    },

    getLongestReaction: function () {
        return this.balls.reduce(function (previousBall, currentBall, index, array) {
            return (previousBall.depth > currentBall.depth ? previousBall : currentBall);
        }).depth;
    }
    
};
