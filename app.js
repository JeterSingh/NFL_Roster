$(document).ready(function () {
	
	function removePlayer() {
		var removeId = $(this).parents(".player-card").attr('id');
		console.log(removeId);
		$(this).parents(".player-card").remove();
		Players.splice(removeId, 1);  // cant use delete as delete leaves array length unchanged
	}
	var thisPlayer = {};
	
	$('#add-player-button').on('click', addPlayer);
	
						
	function addPlayer() {
		var name = $('#playerName').val();
		var position = $('#playerPosition').val();
		var num = $('#playerNumber').val();
		var photo =  $('#playerPhoto').val();
		thisPlayer = PlayerFactory.createPlayer(name, position, num);
		if (thisPlayer != "") {
		console.log(thisPlayer.id); // prints out id for debugging purposes
		var html = '<div class="player-card" style="display:inline-block; border:10px solid grey" id="' + thisPlayer.id + '">' +
			'<IMG SRC=' +photo+'>'+
			'<div>' +
			'<span>' + name + '</span>' +
			'</div>' +
			'<div>' +
			'<span>' + position + '</span>' +
			'</div>' +
			'<div>' +
			'<span>' + num + '</span>' +
			'</div>' +
			'<div class="remove-button-container">' +
			'<button class="btn btn-primary remove-button">Remove </button>' +
			'</div>' +
			'</div>';
		$(".player-roster").append(html);
		
		// clear forms so that user cant submit player twice in a row
		$('#playerName').val("");
		$('#playerPosition').val("");
		$('#playerNumber').val("");
		$('#playerPhoto').val("");
		$('.remove-button').unbind().click(removePlayer); 
		
		
		} 
		else {alert('20 player limit reached OR You entered a duplicate name')};
	}

})
var Players = new Array();  // main array to store players
var maxPlayers = 20;

function Player(name, position, number, id) {
	this.name = name;
	this.position = position;
	this.number = number;
	this.id = id;
}
var PlayerFactory = {
	_uniqueId: -1,
	createPlayer: function (name, position, number) {	 
		if(Players.length < maxPlayers && !checkDuplicateName(name)) { 
		this._uniqueId++;
		var p = new Player(name, position, number, this._uniqueId);
		Players.push(p);
		return p;} else {return "";}
	}
}

function checkDuplicateName(name) {
	var duplicate = false;
	for (var i =0; i<Players.length; i++) {
		if (Players[i].name === name) {
			duplicate = true; }
	}
	return duplicate;
}

// new code using ajax to get elemenents below

var url = "http://bcw-getter.herokuapp.com/?url=";
var url2 = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";
var apiUrl = url + encodeURIComponent(url2);

var PlayersService = function(endpointUri){
    var playersData=[];
    
        this.getPlayersByTeam = function(teamName){
		var filteredPlayers = playersData.filter(function(player){
			return player.pro_team === teamName;
		});
		return filteredPlayers;
	}
    
    this.getPlayersByPosition = function(position){
		var filteredPlayers = playersData.filter(function(player){
			return player.position === position;
		});
		return filteredPlayers;
	}
    
    function loadPlayersData(){
		$.getJSON(endpointUri,function(data){
			playersData = data.body.players;
		});
	};	
	loadPlayersData();
};
var playerService = new PlayersService(apiUrl);

// the function below gets triggered explicitly via HTML
// when the user selects a team, writes the associated players to the player select form
function teamSelected() {
	
	var sf = playerService.getPlayersByTeam("SF");
	var det = playerService.getPlayersByTeam("DET");
	
	var x = document.getElementById("listOfPlayers");
	//var x = $('#listOfPlayers');  // doesnt work
	
	for (var i =0; i<sf.length; i++) {
		var currentPlayerName = sf[i].fullname;
		var currentPlayerStatus = sf[i].pro_status;
		var currentPlayernum = sf[i].jersey;
		//console.log(currentPlayerName);
		if (currentPlayerName != null && currentPlayerName != "49ers" && currentPlayerStatus === "A" && currentPlayernum != undefined) {
			var option = document.createElement("option");
			option.text = currentPlayerName;
			option.value = currentPlayerName;
			x.add(option); 
		}
	}
}

function playerSelected() {
	var sf = playerService.getPlayersByTeam("SF");
	var x = document.getElementById("listOfPlayers");
	
	var selectedPlayer = x.options[x.selectedIndex].value;
	console.log(selectedPlayer);
	for (var i =0; i<sf.length; i++) {
		if (sf[i].fullname === selectedPlayer) {
			var selectedPos = sf[i].position;
			var selectedNum = sf[i].jersey;
			var selectedPhoto = sf[i].photo;
			// console.log(selectedPos, selectedNum);
			
			$('#playerName').val(selectedPlayer);
			$('#playerPosition').val(selectedPos);
			$('#playerNumber').val(selectedNum);
			$('#playerPhoto').val(selectedPhoto);
			//document.getElementById("playerPosition").value = selectedPos;
			//document.getElementById("playerNumber").value = selectedNum;
			//document.getElementById("playerPhoto").value = selectedPhoto;
		}
	} 
}