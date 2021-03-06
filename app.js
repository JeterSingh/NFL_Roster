$(document).ready(function () {
	
	function removePlayer() {
		var removeId = $(this).parents(".player-card").attr('id');
			
		$(this).parents(".player-card").remove();
		var removeIdInt = parseInt(removeId); // removeId is apparently a string
		
		var x = returnIndexofId(removeIdInt);
		Players.splice(x, 1);  
		progressSum = progressSum - progressStep;
		currentPlayers= currentPlayers-1;
		$("#progressbar").progressbar("value", progressSum);
		$("#current-count").html("Current Count: " + currentPlayers);
	}
	
	
	var thisPlayer = {};
	
	$('#add-player-button').on('click', addPlayer);
	var maxString = "Max Players: " + maxPlayers;
	document.getElementById("max-count").innerHTML = maxString;
						
	function addPlayer() {
		var name = $('#playerName').val();
		var position = $('#playerPosition').val();
		var num = $('#playerNumber').val();
		var photo =  $('#playerPhoto').val();
		var team = document.getElementById("teamSelect").value;
		var blankComma = " , ";
		thisPlayer = PlayerFactory.createPlayer(name, position, num);
		if (thisPlayer != "") {
		//console.log(thisPlayer.id); // prints out id for debugging purposes
		var html = '<div class="player-card" style="display:inline-block; border:10px solid grey" id="' + thisPlayer.id + '">' +
			'<IMG SRC=' +photo+'>'+
			'<div>' +
			'<span>' + name + '</span>' +
			'</div>' +
			'<div>' +
			'<span>' + position + '</span>' +
			'</div>' +
			'<div>' +
			'<span>' + num + blankComma + team + '</span>' +
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
		$('#playerTeam').val("");
		$('.remove-button').unbind().click(removePlayer); 
		
		
		} 
		else { 
			$( "#dialog" ).dialog(); }
	}

})
var Players = new Array();  // main array to store players
var maxPlayers = 20;
var currentPlayers = 0;
var progressStep = 1/maxPlayers*100;
var progressSum = 0;

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
		progressSum = progressSum + progressStep;
		$("#progressbar").progressbar("value", progressSum);
		currentPlayers+=1;
		$("#current-count").html("Current Count: " + currentPlayers);
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
// returns the exact position in the Players array corresponding to a given id
function returnIndexofId(id) {
			var index = 0;		
			for (var i =0; i < Players.length; i++){			
				if (Players[i].id === id) {
					index += i;
				}
			}
			return index;
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
	var selectedTeam = document.getElementById("teamSelect").value;
	var sf = playerService.getPlayersByTeam(selectedTeam);
	
	
	
	var x = document.getElementById("listOfPlayers");
	$('#listOfPlayers').empty(); // resets player list each time team changes
	$('#listOfPlayers').prepend("<option value='' selected='selected'></option>");
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
	var selectedTeam = document.getElementById("teamSelect").value;
	var sf = playerService.getPlayersByTeam(selectedTeam);
	var x = document.getElementById("listOfPlayers");
	
	var selectedPlayer = x.options[x.selectedIndex].value;
	//console.log(selectedPlayer);
	for (var i =0; i<sf.length; i++) {
		if (sf[i].fullname === selectedPlayer) {
			var selectedPos = sf[i].position;
			var selectedNum = sf[i].jersey;
			var selectedPhoto = sf[i].photo;
			var selectedTeam = sf[i].team;
			
			
			$('#playerName').val(selectedPlayer);
			$('#playerPosition').val(selectedPos);
			$('#playerNumber').val(selectedNum);
			$('#playerPhoto').val(selectedPhoto);
			$('#playerTeam').val(selectedTeam);
		}
	} 
}

$(function() {
    $( "#progressbar" ).progressbar({
      value: 0
    });
  });
  
$(function() {
    $( "#dialog" ).dialog();
  });