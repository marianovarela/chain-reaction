﻿/*globals $,Ball,clearInterval,Drawer,levels*/
/// <reference path="levels.js" />
/// <reference path="ball.js" />
/// <reference path="util.drawer.js" />
/// <reference path="util.misc.js" />
	
	var $GAME = {};
	
	$GAME.name = "CHAIN_REACTION";
	$GAME.server = "http://tiendatac.minplan.gob.ar/games-score";
	// $GAME.server = "http://localhost:8083";
	$GAME.url_get = $GAME.server + "/api/v1/score/search/findByGameOrderByScoreDesc?game=";
	$GAME.url_post = $GAME.server + "/api/v1/score";
	
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
	
	var keymodels = [
      { kind: 'KeyButtonSpecial', content: '1', special: '!' },
      { kind: 'KeyButtonSpecial', content: '2', special: '"' },
      { kind: 'KeyButtonSpecial', content: '3', special: '·' },
      { kind: 'KeyButtonSpecial', content: '4', special: '$' },
      { kind: 'KeyButtonSpecial', content: '5', special: '%' },
      { kind: 'KeyButtonSpecial', content: '6', special: '&' },
      { kind: 'KeyButtonSpecial', content: '7', special: '/' },
      { kind: 'KeyButtonSpecial', content: '8', special: '(' },
      { kind: 'KeyButtonSpecial', content: '9', special: ')' },
      { kind: 'KeyButtonSpecial', content: '0', special: '=' },
      { kind: 'Alphabetic', content: 'q'},
      { kind: 'Alphabetic', content: 'w'},
      { kind: 'Alphabetic', content: 'e'},
      { kind: 'Alphabetic', content: 'r'},
      { kind: 'Alphabetic', content: 't'},
      { kind: 'Alphabetic', content: 'y'},
      { kind: 'Alphabetic', content: 'u'},
      { kind: 'Alphabetic', content: 'i'},
      { kind: 'Alphabetic', content: 'o'},
      { kind: 'Alphabetic', content: 'p'},
      { kind: 'Alphabetic', content: 'a'},
      { kind: 'Alphabetic', content: 's'},
      { kind: 'Alphabetic', content: 'd'},
      { kind: 'Alphabetic', content: 'f'},
      { kind: 'Alphabetic', content: 'g'},
      { kind: 'Alphabetic', content: 'h'},
      { kind: 'Alphabetic', content: 'j'},
      { kind: 'Alphabetic', content: 'k'},
      { kind: 'Alphabetic', content: 'l'},
      { kind: 'Alphabetic', content: "ñ"},
      { kind: 'Alphabetic', content: 'z'},
      { kind: 'Alphabetic', content: 'x'},
      { kind: 'Alphabetic', content: 'c'},
      { kind: 'Alphabetic', content: 'v'},
      { kind: 'Alphabetic', content: 'b'},
      { kind: 'Alphabetic', content: 'n'},
      { kind: 'Alphabetic', content: 'm'},
      { kind: 'KeyButton', content: ','},
      { kind: 'KeyButton', content: '.'},
      { kind: 'KeyButton', content: '?'}
    ];
	
	var constructors = {
		KeyButtonSpecial: function(keymodel, index){
			var element = '<button id="key-' + keymodel.content + '" class="keyButton">' + keymodel.content + '</button>';
			
			var navigable = extensible.create_leaf('key-'+ keymodel.content).set_priority(index);
			navigable.handle = function(key) {
					if (key === 'enter') {
						$("#name").val($("#name").val() + keymodel.content);
						return true;
					}
					return false;
			};
			return {navigable: navigable, element: element};
		},
		KeyButton: function(keymodel, index){
			var id;
			if(keymodel.content == "."){
				id = "point";			
			}else{
				if(keymodel.content == ","){
					id = "comma";			
				}else{
					if(keymodel.content == "?"){
						id = "interrogation";			
					}
				} 
			}
			var element = '<button id="key-' + id + '" class="keyButton">' + keymodel.content + '</button>';
			var navigable = extensible.create_leaf('key-'+ id).set_priority(index);
			navigable.handle = function(key) {
					if (key === 'enter') {
						$("#name").val($("#name").val() + keymodel.content);
						return true;
					}
					return false;
			};
			return {navigable: navigable, element: element};
		},
		Alphabetic: function(keymodel, index){
			var element = '<button id="key-' + keymodel.content + '" class="keyButton">' + keymodel.content + '</button>';
			var navigable = extensible.create_leaf('key-'+ keymodel.content).set_priority(index);
			navigable.handle = function(key) {
					if (key === 'enter') {
						if(component.isShift){
							$("#name").val($("#name").val() + keymodel.content.toUpperCase());
						}
						else{
							$("#name").val($("#name").val() + keymodel.content);
						}
						return true;
					}
					return false;
			};
			return {navigable: navigable, element: element};
		},
	};
	
	function initGame() {
		
		component.control.initialize();
		component.control.subscribe(component.root);
		
		component.isShift = false;
		
		component.startPanel = extensible.create_vertical('startPanel');
		
		component.game = extensible.create_horizontal('gameBoard');
		
		component.nextLevelMenu = extensible.create_horizontal('suc');
		
		component.gameover = extensible.create_horizontal('fail');
		
		component.submitScore= extensible.create_vertical('suc');
		
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
			.add(extensible.create_horizontal('winGame')
			    .add(component.winGame.set_priority(0)
		        	.add(extensible.create_leaf('submitScore').set_priority(0))
		        	.add(extensible.create_leaf('newGame').set_priority(1))
			    )
			);	
	
		component.root
			.add(extensible.create_vertical('submitScores')
			    .add(component.submitScore.set_priority(0)
			    	.add(extensible.create_horizontal('options').set_priority(1)
			    		.add(extensible.create_leaf('shift').set_priority(0))	
			        	.add(extensible.create_leaf('delete').set_priority(1))
			        	.add(extensible.create_leaf('cancel').set_priority(2))
			        	.add(extensible.create_leaf('submit').set_priority(3))
			    	)
			    )
			);
					
	}
	
		

	initGame();
	
	function initKeyboard(){
		var keyboard = extensible.create_multiline('submitScores', 10);
		for(var index = 0; index < keymodels.length; index++){
	      container = constructors[keymodels[index].kind](keymodels[index], index);
	      $("#keyboard").append(container.element);
		  keyboard.add(container.navigable);
		}
		return keyboard;
	}	
		
	
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

	lastScore: {
		score: null,
		name: null,
	},

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
