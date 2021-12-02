function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+localStorage.getItem('token'));
}

var dataArray =[];

// this function fills the values for hte Progress page of a spiral project

function setProgressValues(array)
{
	if( array.length != 0 )
	{
		var lis = document.querySelector("#spiralProgress").querySelectorAll('li');
		var csp = parseInt(localStorage.getItem('currentSpiral'));
		var cst = parseInt(localStorage.getItem('currentSpiralStage'));
		var distance, days, hours, minutes, seconds;

		distance = new Date().getTime() - new Date(array[csp-1].list[cst-1]).getTime();

		days = Math.floor(distance / (1000 * 60 * 60 * 24));
		hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((distance % (1000 * 60)) / 1000);
		lis[0].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";

		distance = new Date().getTime() - new Date(array[csp-1].list[0]).getTime();

		days = Math.floor(distance / (1000 * 60 * 60 * 24));
		hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((distance % (1000 * 60)) / 1000);
		lis[1].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";

		distance = 0;
		dist = [[], [], [], []];
		distSprint = [];
		for( var i = 0 ; i < array.length ; i++ )
		{
			if( array[i].list[1] == 0 )
			{
				dist[0].push(new Date().getTime() - new Date(array[i].list[0]).getTime());
			}
			else
			{
				dist[0].push(new Date(array[i].list[1]).getTime() - new Date(array[i].list[0]).getTime());
			}

			if( array[i].list[2] == 0 && array[i].list[1] != 0 )
			{
				dist[1].push(new Date().getTime() - new Date(array[i].list[1]).getTime());
			}
			else if( array[i].list[1] != 0 )
			{
				dist[1].push(new Date(array[i].list[2]).getTime() - new Date(array[i].list[1]).getTime());
			}

			if( array[i].list[3] == 0 && array[i].list[2] != 0 )
			{
				dist[2].push(new Date().getTime() - new Date(array[i].list[2]).getTime());
			}
			else if( array[i].list[2] != 0 )
			{
				dist[2].push(new Date(array[i].list[3]).getTime() - new Date(array[i].list[2]).getTime());
			}

			if( i+1 < array.length && array[i].list[3] != 0 )
			{
				dist[3].push(new Date(array[i+1].list[0]).getTime() - new Date(array[i].list[3].getTime()));
			}
			else if( array[i].list[3] != 0 )
			{
				dist[3].push(new Date().getTime() - new Date(array[i].list[3]).getTime());
			}

			if( i+1 < array.length )
			{
				distSprint.push(new Date(array[i+1].list[0]).getTime() - new Date(array[i].list[0].getTime()));
			}
			else
			{
				distSprint.push(new Date().getTime() - new Date(array[i].list[0]).getTime());
			}
		}
		console.log("dist = ", dist);
		console.log("distSprint = ", distSprint);

		distance = 0;
		count = 0;
		for( var i = 0 ; i < 4 ; i++ )
		{
			for( var j = 0  ; j < dist[i].length ; j++ )
			{
				count++;
				distance = distance + dist[i][j];
			}
		}
		distance = Math.round(distance/count);
		days = Math.floor(distance / (1000 * 60 * 60 * 24));
		hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((distance % (1000 * 60)) / 1000);
		lis[2].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";

		distance = 0;
		count = 0;
		for( var i = 0 ; i < distSprint.length ; i++ )
		{
			count++;
			distance = distance + distSprint[i];
		}
		distance = Math.round(distance/count);
		days = Math.floor(distance / (1000 * 60 * 60 * 24));
		hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((distance % (1000 * 60)) / 1000);
		lis[3].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";

		distance = 0;
		count = 0;
		for( var i = 0 ; i < dist[0].length ; i++ )
		{
			count++;
			distance = distance + dist[0][i];
		}
		distance = Math.round(distance/count);
		days = Math.floor(distance / (1000 * 60 * 60 * 24));
		hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((distance % (1000 * 60)) / 1000);
		lis[4].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";

		distance = 0;
		count = 0;
		for( var i = 0 ; i < dist[1].length ; i++ )
		{
			count++;
			distance = distance + dist[1][i];
		}
		if( count != 0 )
		{
			distance = Math.round(distance/count);
		}
		days = Math.floor(distance / (1000 * 60 * 60 * 24));
		hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((distance % (1000 * 60)) / 1000);
		lis[5].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";

		distance = 0;
		count = 0;
		for( var i = 0 ; i < dist[2].length ; i++ )
		{
			count++;
			distance = distance + dist[2][i];
		}
		if( count != 0 )
		{
			distance = Math.round(distance/count);
		}
		days = Math.floor(distance / (1000 * 60 * 60 * 24));
		hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((distance % (1000 * 60)) / 1000);
		lis[6].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";

		distance = 0;
		count = 0;
		for( var i = 0 ; i < dist[3].length ; i++ )
		{
			count++;
			distance = distance + dist[3][i];
		}
		if(count != 0 )
		{
			distance = Math.round(distance/count);
		}
		days = Math.floor(distance / (1000 * 60 * 60 * 24));
		hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((distance % (1000 * 60)) / 1000);
		lis[7].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";
	}
}
function getAllInformation()
{
	console.log("entered get all information");
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');
	$.ajax({
		type: 'GET',
		url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
		beforeSend: beforeSend,
		cache: false,
		success: function(response)
		{
			for(i=0 ; i<response.length ; i++)
			{
				arr = response[i].name.split('-');
				model = arr[0].toLowerCase();
				no = parseInt(arr[1]);
				console.log(model);
				console.log(no);
				if(model == 'spiral')
				{
					dataArray.push({name: response[i].name, columns_url: response[i].columns_url, list:[]});
				}  
			}
			console.log("get all information gave data array = " , dataArray);
			getStagesInformation( dataArray, 0 );
		},
	}

	)
}

// this function gets the information of all the stages .

function getStagesInformation( array, count )
{
	console.log("Entered getSpiralColumns with count = ", count, "  array = ", array);
	if( count == array.length )
	{
		console.log("Data Array = ", array);
		setProgressValues(array);
		return;
	}
	else
	{
		$.ajax({
			type: 'GET',
			url: array[count].columns_url,
			beforeSend: beforeSend,
			cache: false,

			success: function(response)
			{
				var times = [];
				times.push(0);
				times.push(0);
				times.push(0);
				times.push(0);
				for( var i = 0 ; i < response.length ; i++ )
				{
					arr = response[i].name.split('-');
					model = arr[0].toLowerCase();
					no = parseInt(arr[1]);
					console.log("arr = ", arr);
					console.log("model = ", model);
					console.log("no = ", no);
					console.log("typeof no = ", typeof(no));
					if( model == 'stage' )
					{
						times[no-1] = response[i].created_at;
					}
				}
				console.log("times = ", times);
				array[count].list = times;
				getStagesInformation(array, count+1);
			} 
		}

		)
	}
}

// given the url to a column, creates a new card

function createCard( columnURL, content, callback )
{
	$.ajax(
		{
			type:'POST',
			url: columnURL + '/cards',
			beforeSend: beforeSend,
			data: JSON.stringify({
				note: content,
			}),
			success: function(response)
			{
				console.log("Created a card");
				console.log(response)
				obj = {note: response.note, url: response.url, time: response.updated_at, creator: response.creator['login']};
				callback(obj);
			}
		})
}

// deletes a card, given the url to it

function deleteCard( url, callback )
{
	$.ajax(
		{
			type:'DELETE',
			url: url,
			beforeSend: beforeSend,
			success: function(response)
			{
				callback(response);
			}
		})
}
function handleModal( heading, content, callback )
{
	x = document.querySelector("#modal");
	x.querySelector("h1").innerHTML = heading;
	x.querySelector("p").innerHTML = content;
	x.style.display = 'block';
	window.onclick = function(event)
	{
		if( event.target == x )
		{
			x.style.display = 'none';
			console.log("false");
			return false;
		}
	}
	x.querySelector("#yes").onclick = function()
	{
		x.style.display = 'none';
		callback();
		console.log("true");
		return true;
	}
	x.querySelector("#no").onclick = function()
	{
		x.style.display = 'none';
		console.log("false");
		return false;
	}
}


// edtis the card that is referred by the url

function editCard( url , note, archived, callback )
{
	console.log("entered editcard");
	$.ajax(
		{
			type: 'PATCH',
			url: url,
			beforeSend: beforeSend,
			data: JSON.stringify(
				{
					note: note,
					archived: archived,
				}),
			success: function(response)
			{
				console.log("Edited");
				console.log(response);
				callback(response);
			}
		}
	)
}

// edits the notice

function editNotice(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'none'; 
	c.querySelector('form').style.display = 'block';
}

// deletes the notice

function deleteNotice(event)
{
	var c = event.target.parentElement.parentElement;
	handleModal('Delete Notice', "This cannot be undone, Are you sure you want to delete the Notice?" , function()
		{
			startWait();
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Notice"); DisplayNotices(); DisplayNoticeNotices();stopWait();} );
		});
}

function saveNotice(event)
{
	startWait();
	var c = event.target.parentElement;
	editCard( c.parentElement.getAttribute('data-cardurl'), c.querySelector('#taskname').value+'\n'+c.querySelector('#taskDescription').value,false, function(obj){DisplayNotices();DisplayNoticeNotices();stopWait();});
}

function cancelNotice(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
}


// this function sets the view for the meetings and notices blocks.

function handleMeetsNoticeViewing()
{
	var meets = document.querySelector('#upcomingmeets').querySelector('ul').querySelectorAll('li');
	var i;

	console.log(meets);
	for( i = 0 ; i < meets.length ; i++ )
	{
		meets[i].querySelector('div').querySelector('button').addEventListener('click', function() {
			this.classList.toggle('mactive');
			var content = this.nextElementSibling;
			if( content.style.maxHeight )
			{
				content.style.maxHeight = null;
			}
			else
			{
				content.style.maxHeight = content.scrollHeight + 'px';
			}
		});
	}
}
function getAllColumns( url, callback )
{
	$.ajax(
		{
			type: 'GET',
			url: url,
			beforeSend: beforeSend,
			success: function(response)
			{
				list = [];
				for( i = 0 ; i < response.length ; i++ )
				{
					list.push({name:response[i].name, columnURL: response[i].url, cardsURL: response[i].cards_url});
				}
				callback(list);
			}
		}
	)
}

// to display notices and meetings

function DisplayNoticeMeets()
{
	getAllCards( JSON.parse(localStorage.getItem("MeetingsDetails")).cardsURL, function(list)
		{
			document.querySelector("#upcomingmeets").querySelector("ul").innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let meetLink = '';
				let meetDate = '';
				let meetTime = '';
				let meetDescription = '';
				let k = 0;
				for( let i = 0 ; i < list[j].note.length ; i++ )
				{
					if( list[j].note[i] == '\n')
					{
						k++;
					}
					else if( k == 0 )
					{
						meetLink += list[j].note[i];
					}
					else if( k == 1 )
					{
						meetDate += list[j].note[i];
					}
					else if( k == 2 )
					{
						meetTime += list[j].note[i];
					}
					else if( k == 3 )
					{
						meetDescription += list[j].note[i];
					}
				}
				var date = new Date();
				var string = date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString();
				string = parseInt(string);
				date = parseInt(meetDate);
				if( date >= string )
				{
					meetDate = meetDate.substring(6, 8)+"/"+meetDate.substring(4, 6)+"/"+meetDate.substring(0, 4);
					str += "<li><div><button class = 'mhead'>";
					str += "Meeting on: "+meetTime+", "+meetDate+"</button>";
					str += "<div>";
					str+="<h5>Link: <a href = ";
					str+=meetLink+" target = '_blank'>";
					str+=meetLink;
					str+="</a><br>";
					str+="Description: "+meetDescription;
					str+="</h5></div></div></li>";
				}
			}
			document.querySelector("#upcomingmeets").querySelector("ul").innerHTML = str;
			handleMeetsNoticeViewing();
		});
}
function DisplayScrumMeets()
{
	getAllCards( JSON.parse(localStorage.getItem("MeetingsDetails")).cardsURL, function(list)
		{
			document.querySelector("#premeets").innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let meetLink = '';
				let meetDate = '';
				let meetTime = '';
				let meetDescription = '';
				let k = 0;
				for( let i = 0 ; i < list[j].note.length ; i++ )
				{
					if( list[j].note[i] == '\n')
					{
						k++;
					}
					else if( k == 0 )
					{
						meetLink += list[j].note[i];
					}
					else if( k == 1 )
					{
						meetDate += list[j].note[i];
					}
					else if( k == 2 )
					{
						meetTime += list[j].note[i];
					}
					else if( k == 3 )
					{
						meetDescription += list[j].note[i];
					}
				}
				let editmeet = meetDate.substring(0,4)+"-"+meetDate.substring(4,6)+"-"+meetDate.substring(6,8);
				meetDate = meetDate.substring(6, 8)+"/"+meetDate.substring(4, 6)+"/"+meetDate.substring(0, 4);
				str +=	"<li data-cardurl = '"+list[j].url+"'>";
				str +=		"<div>";
				str +=			"<h5>Meeting Link: <a href = \""+meetLink+"\" target = '_blank'>"+meetLink+"</a></h5>";
				str +=			"<h5>Meeting Date: "+meetDate+"</h6>";
				str +=			"<h5>Meeting Time: "+meetTime+"</h6>";
				str +=			"<h5>Description:\n"+meetDescription+"</h5>";
				str +=			"<h6>Created by: "+list[j].creator+"</h6>";
				date = new Date(list[j].time);
				str +=			"<h6>Last Modified: "+date+"</h6>";
				str +=			"<button id = 'delete' onclick = \"deleteScrumMeet(event)\">Delete Meet</button>";
				str += 			"<button id = 'edit' onclick = \"editScrumMeet(event)\">Edit Meet</button>";
				str += 		"</div>";
				str +=		"<form class = 'edit' style ='display : none'>";
				str +=			"<h4>Edit Meeting</h4>";
				str += 			"<label for = 'meetingtime'>Time</label>";
				str +=			"<input type = 'time' id = 'meetingtime' name = 'meetingtime' placeholder = 'Time of the Meeting' value = '"+meetTime+"'>";
				str +=			"<label for = 'meetingDate'>Date</label>";
				str +=			"<input type = 'date' id = 'meetingDate' name = 'meetingDate' value = '"+editmeet+"'>";
				str +=			"<label for = 'meetinglink'>Link</label>";
				str += 			"<input type = 'text' id = meetinglink name = 'meetinglink' placeholder = 'Link to the Meeting' value = '"+meetLink+"'>";
				str += 			"<label for= 'meetDescription'>Purpose</label>";
				str +=			"<textarea type = 'text' id = 'meetDescription' name = 'meetDescription' placeholder = 'Describe the Purpose'>"+meetDescription+"</textarea>";
				str +=			"<button id = 'save' type= 'button' onclick = \"saveScrumMeet(event)\">Save</button>";
				str +=			"<button id = 'cancel' type = 'button'onclick = \"cancelScrumMeet(event)\">Cancel</button>"
				str +=		"</form>";
				str += 	"</li>";
			}
			document.querySelector('#premeets').innerHTML = str;
		});
}

function editScrumMeet(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'none'; 
	c.querySelector('form').style.display = 'block';
}

function deleteScrumMeet(event)
{
	var c = event.target.parentElement.parentElement;
	handleModal('Delete Meeting', "This cannot be undone, Are you sure you want to delete the Meeting?" , function()
		{
			startWait();
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Meeting"); DisplayScrumMeets(); DisplayNoticeMeets();stopWait();} );
		});
}

function saveScrumMeet(event)
{
	var c = event.target.parentElement;
	startWait();
	meetLink = c.querySelector('#meetinglink').value;
	meetDate = c.querySelector('#meetingDate').value;
	meetDate = meetDate.substring(0, 4)+meetDate.substring(5, 7)+meetDate.substring(8, 10);
	meetTime = c.querySelector('#meetingtime').value;
	meetDescription = c.querySelector('#meetDescription').value;
	con = meetLink+"\n"+meetDate+"\n"+meetTime+"\n"+meetDescription;
	editCard( c.parentElement.getAttribute('data-cardurl'), con, false, function(obj){DisplayScrumMeets();DisplayNoticeMeets();stopWait();});
}

function cancelScrumMeet(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
}
function handleContributors()
{
	var list = JSON.parse(localStorage.getItem('contributors'));
	var str = '';
	for( var i = 0 ; i < list.length ; i++ )
	{
		str += "<li>"+list[i]+"</li>";
	}
	document.querySelector("#contributorsbox").querySelector('ul').innerHTML = str;
	document.querySelector('#contributorsbox').querySelector('form').querySelector('button').onclick = function(event)
	{
		event.preventDefault();
		username = document.querySelector('#contributorsbox').querySelector('form').querySelector('#taskname').value;
		var b = false;
		console.log(list[0]);
		console.log(username);
		for( var j = 0 ; j < list.length ; j++ )
		{
			if( list[j] == username )
			{
				b = true;
			}
		}
		if( username == '' )
		{
			alert("Enter Username");
		}
		else if( b == true )
		{
			alert("User already exists");
		}
		else
		{
			$.ajax(
				{
					type: "POST",
					url: "isTrueCredentials",
					data: {
						username: username,
						password: '',
					},
					success: function(data)
					{
						console.log(data);
						if(data != 'y')
						{
							alert("No user with the given username");
						}
						else
						{
							startWait();
							var obj = JSON.parse(localStorage.getItem('description'));
							obj.contributors.push(username);
							localStorage.setItem('description', JSON.stringify(obj));
							localStorage.setItem('contributors', JSON.stringify(obj.contributors));
							$.ajax(
								{
									type: "POST",
									url: 'getProjectsPy',
									data:{
										username: localStorage.getItem('Username'),
										currentScrum: 0,
										currentSprint: 0,
										projectName: localStorage.getItem('Project'),
										description: localStorage.getItem('description'),
										mode: 2,
									},
									success: function(data)
									{
										console.log("successfull modified");
										$.ajax(
											{

												type: "POST",
												url: "insertProject",
												data: {
													model: localStorage.getItem('model'),
													projectName: localStorage.getItem('Project'),
													table_name: username+'projects',
													createdBy:localStorage.getItem('Username'),
													createdOn: localStorage.getItem('createdOn'), 
													repolink: localStorage.getItem('repoName'),
													description: localStorage.getItem('description'),
												},
												success: function(data)
												{
													stopWait();
													alert("Successfully Added");
													handleContributors();
												}
											}
										)
									}
								}
							)
						}
					}
				}
			)
		}
	}

}
function DisplayNotices()
{
	getAllCards( JSON.parse(localStorage.getItem("NoticeDetails")).cardsURL, function(list)
		{
			document.querySelector('#noticelist').innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let taskname = '';
				let taskDescription = '';
				let k = 0;
				for( let i = 0 ; i <  list[j].note.length ; i++ )
				{
					if(list[j].note[i] == '\n')
					{
						k = 1;
					}
					else if( k == 0 )
					{
						taskname += list[j].note[i];
					}
					else if( k == 1 )
					{
						taskDescription += list[j].note[i];
					}
				}
				str +=	"<li data-cardurl = '"+list[j].url+"'>";
				str +=		"<div>";
				str +=			"<h5>" +taskname+"</h5>";
				str +=			"<h5>Description:\n"+taskDescription+"</h5>";
				str +=			"<h6>Created by: "+list[j].creator+"</h6>";
				var date = new Date(list[j].time);
				str +=			"<h6>Last Modified: "+date+"</h6>";
				str +=			"<button id = 'delete' onclick = \"deleteNotice(event)\">Delete Notice</button>";
				str += 			"<button id = 'edit' onclick = \"editNotice(event)\">Edit Notice</button>";
				str += 		"</div>";
				str +=		"<form class = 'edit' style ='display : none'>";
				str +=			"<h4>Edit Notice</h4>";
				str += 			"<label for = 'taskname'>TaskTitle</label>";
				str +=			"<input type = 'text' id = 'taskname' name = 'taskname' placeholder = 'Notice Name' value = '"+taskname+"'>";
				str +=			"<label for = 'taskDescription'>Description</label>";
				str +=			"<textarea type = 'text' id = 'taskDescription' name = 'taskDescription' placeholder = 'Describe the Notice'>"+taskDescription+"</textarea>";
				str +=			"<button id = 'save' type= 'button' onclick = \"saveNotice(event)\">Save</button>";
				str +=			"<button id = 'cancel' type = 'button' onclick = \"cancelNotice(event)\">Cancel</button>"
				str +=		"</form>";
				str += 	"</li>";
			}
			document.querySelector('#noticelist').innerHTML = str;
		});
}
function getAllCards( url , callback )
{
	$.ajax(
		{
			type: 'GET',
			url: url,
			cache: false,
			beforeSend: beforeSend,
			data:{
				archived_state: 'all',
			},
			success: function(response)
			{
				var list = [];
				for( let i = 0 ; i < response.length ; i++ )
				{
					list.push({note: response[i].note, url: response[i].url, time: response[i].updated_at, creator: response[i].creator['login'], archived: response[i].archived});
				}
				callback(list);
			}
		}
	)
}
function loadOverviewBox()
{
	var tas = document.querySelector('#overviewbox').querySelector('ul').querySelectorAll('li');
	tas[0].innerHTML = "<p class = 'id'>Name of the Project: </p><p class = 'value'>"+localStorage.getItem('Project')+"</p>";
	tas[1].innerHTML = "<p class = 'id'>GitHub UserName: </p><p class = 'value'>"+localStorage.getItem('gitUserName')+"</p>";
	tas[2].innerHTML = "<p class = 'id'>Repo Name: </p><p class = 'value'>"+localStorage.getItem('repoName')+"</p>";
	tas[3].innerHTML = "<p class = 'id'>RepositoryLink: </p><p class = 'value'><a href = 'https://github.com/"+localStorage.getItem('gitUserName')+"/"+localStorage.getItem('repoName')+"' target = '_blank' >"+"https://github.com/"+localStorage.getItem('gitUserName')+"/"+localStorage.getItem('repoName')+"</a></p>";
	tas[4].innerHTML = "<p class = 'id'>Model: </p><p class = 'value'>"+localStorage.getItem('model')+"</p>";
	tas[5].innerHTML = "<p class = 'id'>Created By: </p><p class = 'value'>"+localStorage.getItem('Username')+"</p>";
	tas[6].innerHTML = "<p class = 'id'>Created On: </p><p class = 'value'>"+localStorage.getItem('createdOn')+"</p>";
	tas[7].innerHTML = "<p class = 'id'>Description: </p><p class = 'value'>"+JSON.parse(localStorage.getItem('description')).des+"</p>";
}
function DisplayNoticeNotices()
{
	getAllCards( JSON.parse(localStorage.getItem("NoticeDetails")).cardsURL, function(list)
		{
			document.querySelector("#board").querySelector("#notices").querySelector("ul").innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let taskname = '';
				let taskDescription = '';
				let k = 0;
				for( let i = 0 ; i <  list[j].note.length ; i++ )
				{
					if(list[j].note[i] == '\n')
					{
						k = 1;
					}
					else if( k == 0 )
					{
						taskname += list[j].note[i];
					}
					else if( k == 1 )
					{
						taskDescription += list[j].note[i];
					}
				}
				str +=	"<li>";
				str +=		"<div>";
				str +=			"<h5>"+taskname+"</h5>";
				str +=			"<p>"+taskDescription+"</p>";
				str +=		"</div>";
				str +=	"</li>";

			}
			document.querySelector("#board").querySelector("#notices").querySelector("ul").innerHTML = str;
		});
}

function getCommits(callback)
{
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');
	$.ajax(

		{
			type: "GET",
			url: "https://api.github.com/repos/"+username +'/'+ repoName+'/commits',
			beforeSend: beforeSend, 
			data:
			{
				per_page: 10,
			},
			success: function(response)
			{
				list = []
				for(i=0 ; i<response.length ; i++)
				{
					obj = {author: response[i].commit.author.name, message: response[i].commit.message, date: response[i].commit.author.date}
					list.push(obj)
				}
				console.log(list)
				callback(list);
			}
		}

	)	
}
function handleNoticeViewing()
{
	var i;
	var tasks = document.querySelector('#latestcommits').querySelector('ul').querySelectorAll('li');
	console.log(tasks);

	for( i = 0 ; i < tasks.length ; i++ )
	{
		tasks[i].querySelector('div').querySelector('button').addEventListener('click', function() {
			this.classList.toggle('tactive');
			var content = this.nextElementSibling;
			if( content.style.maxHeight )
			{
				content.style.maxHeight = null;
			}
			else
			{
				content.style.maxHeight = content.scrollHeight + 'px';
			}
		});
	}
}
function DisplayCommits()
{
	getCommits(function(list){
		document.querySelector("#latestcommits").querySelector("ul").innerHTML = '';
		var str = '';
		for( let i = 0 ; i < list.length ; i++ )
		{
			str += "<li>";
			str += 		"<div>";
			str +=			"<button class = 'nhead'>";
			str += 				list[i].message;
			str +=			"</button>";
			str += 			"<div>";
			str +=				"author: "+list[i].author;
			date = new Date(list[i].date);
			str += 				"<br>Commited on: "+date;
			str +=			"</div>";
			str +=		"</div>";
			str += "</li>";
		}
		document.querySelector("#latestcommits").querySelector("ul").innerHTML = str;
		handleNoticeViewing();
	});
}

function DisplayChart1( level, sk )
{
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');

	$.ajax(

		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend,
			cache: false,

			success: function(response)
			{
				for(i=0 ; i<response.length ; i++)
				{
					arr = response[i].name.split('-');
					model = arr[0].toLowerCase();
					no = parseInt(arr[1]);
					console.log(model);
					console.log(no);
					list = [];
					if(model == 'spiral')
					{
						list.push(response[i].body);
					}  
				}
				console.log("details = ", list);
				DisplayChart1(level, sk, list);
			},
		}

	)
}

function DisplayChart( level, sk)
{
	var number = (level-1)*4 + sk;
	var radius = 200/level;
	var str = '';
	for( var i = 0 ; i < level ; i++ )
	{
		str += "<div class = 'circle' id = 'level"+(i+1)+"' data-level = '"+(i+1)+"'><div></div><div></div><div></div><div></div><span class = 'tooltiptext'>Circle"+(i+1)+"</span></div>";
	}
	str += "<div class = 'stages' id = 'identify'><span>Identify</span><br>the Requirements for the feature you are working on</div>"
	str += "<div class = 'stages' id = 'design'><span>Design</span><br>the solution for the problem</div>"
	str += "<div class = 'stages' id = 'construct'><span>Construct</span><br>the designed solution</div>"
	str += "<div class = 'stages' id = 'evaluate'><span>Evaluate</span><br>the solution and plan for next cycle</div>"
	colors = ['red', 'blue', 'green', 'yellow', 'violet', 'green', 'blue', 'red'];
	document.querySelector('#chart').innerHTML = str;
	circles = document.querySelectorAll('.circle');
	for( var i = 0 ; i < level ; i++ )
	{
		circles[i].style.width = (i+1)*radius*2-4+'px';
		circles[i].style.height = (i+1)*radius*2-4+'px';
		circles[i].style.marginLeft = (400-radius*(i+1))+'px';
		circles[i].style.marginTop = (200-radius*(i+1))+'px';
		circles[i].style.borderRadius = '100%';
		circles[i].style.borderStyle = 'solid';
		circles[i].style.borderWidth = '2px';
		circles[i].style.position = 'absolute';
		circles[i].style.zIndex = level-i;
		for( var j = 0 ; j < 4 ; j++ )
		{
			circles[i].querySelectorAll('div')[j].style.width = parseInt(circles[i].style.width)/2+ 'px';
			circles[i].querySelectorAll('div')[j].style.height = parseInt(circles[i].style.height)/2+ 'px';
			circles[i].querySelectorAll('div')[j].style.outlineStyle = 'solid';
			circles[i].querySelectorAll('div')[j].style.outlineWidth = '1px';
			//circles[i].querySelectorAll('div')[j].style.borderStyle = 'solid';
			if( j == 0 )
			{
				circles[i].querySelectorAll('div')[0].style.borderTopLeftRadius = parseInt(circles[i].style.width)/2+ 'px';
					circles[i].querySelectorAll('div')[0].onclick = function(event)
					{
						loadStage( event.target.parentElement.getAttribute('data-level'), 4);
					};
			}
			else if( j == 1 )
			{
				circles[i].querySelectorAll('div')[1].onclick = function(event)
				{
					loadStage( event.target.parentElement.getAttribute('data-level'), 1);
				};
				circles[i].querySelectorAll('div')[1].style.borderTopRightRadius = parseInt(circles[i].style.width)/2+ 'px';
			}
			else if( j == 2 )
			{
				circles[i].querySelectorAll('div')[2].onclick = function(event)
				{
					loadStage( event.target.parentElement.getAttribute('data-level'), 3);
				};
				circles[i].querySelectorAll('div')[2].style.borderBottomLeftRadius = parseInt(circles[i].style.width)/2+ 'px';
			}
			else if( j == 3 )
			{
				circles[i].querySelectorAll('div')[3].onclick = function(event)
				{
					loadStage( event.target.parentElement.getAttribute('data-level'), 2);
				};
				circles[i].querySelectorAll('div')[3].style.borderBottomRightRadius = parseInt(circles[i].style.width)/2+ 'px';
			}
			circles[i].querySelectorAll('div')[j].style.float = 'left';
			if( i*4+j < number )
			{
				if( j == 0 )
				{
					circles[i].querySelectorAll('div')[1].style.backgroundColor = 'lightgreen';
				}
				else if( j == 1 )
				{
					circles[i].querySelectorAll('div')[3].style.backgroundColor = 'orange';
				}
				else if( j == 2 )
				{
					circles[i].querySelectorAll('div')[2].style.backgroundColor = 'pink';
				}
				else if( j == 3 )
				{
					circles[i].querySelectorAll('div')[0].style.backgroundColor = 'yellow';
				}
			}
		}
	}
}
function spiralColumnsHelper(spiralCards, columns, idx, callback)
{
	if(idx == columns.length)
	{
		console.log(spiralCards);
		callback(spiralCards);
	}
	else
	{
		$.ajax(

			{
				type: 'GET',
				url: columns[idx].cards_url,
				beforeSend: beforeSend,
				cache: false,
				data: {
					archived_state: 'all',
				},

				success: function(response)
				{
					list = [];
					for(i=0 ; i<response.length ; i++)
						list.push(response[i]);

					spiralCards.push({name: columns[idx].name, cards: list});

					spiralColumnsHelper(spiralCards, columns, idx+1, callback);
				} 
			}

		)
	}
}

function getSpiralColumns(url, callback)
{
	$.ajax({
		type: 'GET',
		url: url,
		beforeSend: beforeSend,

		success: function(response)
		{
			spiralCards = []
			columns = []
			for(i=0 ; i<response.length ; i++)
			{
				columns.push({name: response[i].name, cards_url: response[i].cards_url});
			}
			spiralColumnsHelper(spiralCards, columns, 0, callback);
		}   
	}

	)
}

function spiral(number, callback)
{
	console.log("Number = ", number);
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');

	$.ajax(

		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend,
			cache: false,

			success: function(response)
			{
				for(i=0 ; i<response.length ; i++)
				{
					arr = response[i].name.split('-');
					model = arr[0].toLowerCase();
					no = parseInt(arr[1]);
					console.log(model);
					console.log(no);
					if(model == 'spiral' && number == no)
					{
						console.log('found spiral = ', response[i]);
						getSpiralColumns(response[i].columns_url, callback);
						break;
					}  
				}
				console.log('notfound');
			},
			error: function()
			{
				console.log("error");
			}
		}

	)
}
function createColumn( projectURL, name, callback )
{
	$.ajax(
		{
			type:'POST',
			url: projectURL+'/columns',
			beforeSend: beforeSend,
			data: JSON.stringify({
				name: name,
			}),
			success: function(response)
			{
				console.log("CreatedColumns = ",name, "  successfully");
				console.log(response);
				obj = { name: response.name, cardsURL: response.cards_url, columnURL: response.url , createdTime: response.created_at }
				callback(obj);
			}
		})
}

function setValues()
{
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');

	$.ajax(

		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend,

			success: function(response)
			{
				var count = 0;
				for(i=0 ; i<response.length ; i++)
				{
					arr = response[i].name.split('-');
					model = arr[0].toLowerCase();
					if( model == 'spiral' )
					{
						count++;
					}
				}
				localStorage.setItem('currentSpiral', count);
				if( count == 0 )
				{
					stopWait();
					localStorage.setItem('currentSpiralStage', 0);
					document.querySelector("#nextStage").innerHTML = 'Start The Project';
					document.querySelector("#nextStage").onclick = function(event)
					{
						createNewSpiral();
					}
				}
				else
				{
					for( i = 0 ; i < response.length ; i++ )
					{
						arr = response[i].name.split('-');
						no = parseInt(arr[1]);
						if( no == count )
						{
							localStorage.setItem('currentSpiralURL', response[i].url);
							getAllColumns( response[i].columns_url, function(list)
								{
									localStorage.setItem('currentSpiralStage', list.length-1);
									DisplayChart();
									var csp = parseInt(localStorage.getItem('currentSpiral'));
									var cst = parseInt(localStorage.getItem('currentSpiralStage'));
									DisplayChart(csp, cst);
									loadStage(csp, cst);
								});
						}
					}
				}
			},
		}
	)
}

function createProject( name, notes, callback )
{
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');
	console.log("gitUsername = ", username);
	console.log("repoName = ", repoName);
	$.ajax(
		{
			type: 'POST',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 
			data:
			JSON.stringify({
				name: name,
				body: notes,
			}),
			success: function(response)
			{
				console.log("Created Project = ", name, " Successfully");
				console.log(response);
				obj = { name: response.name, columnsURL: response.columns_url, projectURL: response.url };
				callback(obj);
			}
		})
}

function createNewSpiral()
{
	document.querySelector('.createfolder').style.maxHeight = '200px';
	document.querySelector('.createfolder').querySelector('button').onclick = function(event)
	{
		event.preventDefault();
		var name = document.querySelector(".createfolder").querySelector('#detail').value;	
		if( name == '' )
		{
			alert("Enter the Feature details");
		}
		else
		{
			var csp = parseInt(localStorage.getItem('currentSpiral'));
			var cst = parseInt(localStorage.getItem('currentSpiralStage'));
			createProject('Spiral-'+(csp+1), name, function(obj) {
				createColumn( obj.projectURL , 'Details', function(column)
					{
						createCard( column.columnURL, name,  function(list){
							createColumn( obj.projectURL , 'Stage-1', function(col2)
								{
									createCard( col2.columnURL, 'Your goal for the stage goes here', function(list)
										{
											createCard( col2.columnURL, 'Your Tasks for the stage goes here', function(list){

												setValues();document.querySelector('.createfolder').style.maxHeight = '0px';
												alert('New spiral created successfully');
											});
										});
								});
						});
					});
			});
		}

	}
}

function nextStage(spir, stage)
{
	var csp = parseInt(localStorage.getItem('currentSpiral'));
	var cst = parseInt(localStorage.getItem('currentSpiralStage'));
	handleModal( 'Proceed to next stage', 'Are you sure you want to proceed to next Stage, you will not be able to come back', function()
		{
			if( cst < 4 )
			{
				createColumn( localStorage.getItem('currentSpiralURL'), 'Stage-'+(cst+1), function(obj)
					{
						createCard( obj.columnURL, 'Your goal for the stage goes here', function(list)
							{
								createCard( obj.columnURL, 'Your Tasks for the stage goes here', function(list){

									setValues();
									alert('Stage'+(cst+1)+ ' created successfully');
								});
							});
					});
			}
			else if( cst == 4 )
			{
				createNewSpiral();
			}
		});
}

function loadStage( spir, stage )
{
	if( stage > parseInt(localStorage.getItem('currentSpiralStage')) && spir == parseInt(localStorage.getItem('currentSpiral')) )
	{
		return;
	}
	startWait();
	console.log("entered loadstage");
	var csp = parseInt(localStorage.getItem('currentSpiral'));
	var cst = parseInt(localStorage.getItem('currentSpiralStage'));
	console.log("spir = " , spir, "  stage = " , stage);
	spiral(spir, function(spiralCards){
		str = '';
		str += "<div class= 'title'> Task for this Circle:<br>"+spiralCards[0].cards[0].note+"</div>";
		str += "<br><div class = 'title'>Current Stage: "+spiralCards[stage].name;
		if( stage == 1 )
		{
			str += "  Identify";
		}
		else if( stage == 2 )
		{
			str += "  Design";
		}
		else if( stage == 3 )
		{
			str += "  Construct";
		}
		else if( stage == 4 )
		{
			str += "  Evaluate";
		}
		str += "<button id = 'nextStage' onclick = \"nextStage()\">Proceed to next Stage</button></div><div><ul id = 'pretasks'>";
		var goal = '';
		for( var i = 0 ; i < spiralCards[stage].cards[0].note.length ; i++ )
		{
			if( spiralCards[stage].cards[0].note[i] == '\n' )
			{
				goal = goal + '<br>';
			}
			else
			{
				goal = goal + spiralCards[stage].cards[0].note[i];
			}
		}
		var date = new Date(spiralCards[stage].cards[0].updated_at);
		str += "<li data-cardurl = '"+spiralCards[stage].cards[0].url+"'><div><h5>Goals</h5><div><h6>"+goal+"<br>Created by: "+spiralCards[stage].cards[0].creator['login']+"<br>last Modified: "+date+"</h6>";
		if( spir < csp || stage < cst )
		{
			str += "</div></div></li>";
		}
		else
		{
			str += "<button id = 'edit' onclick = \"editSpiral('0')\" >Edit</button></div>";
			str += "<form><textarea>"+spiralCards[stage].cards[0].note+"</textarea><br><button id = 'save' onclick = \"saveSpiral(event)\">Save</button><button id = 'cancel' onclick = \"cancelSpiral(event)\">Cancel</button></form></div></li>";
		}
		goal = '';
		for( var i = 0 ; i < spiralCards[stage].cards[1].length ; i++ )
		{
			if( spiralCards[stage].cards[1][i] == '\n' )
			{
				goal = goal + '<br>';
			}
			else
			{
				goal = goal + spiralCards[stage].cards[1][i];
			}
		}
		date = new Date(spiralCards[stage].cards[1].updated_at);
		str += "<li data-cardurl = '"+spiralCards[stage].cards[1].url+"'><div><h5>Tasks</h5><div><h6>"+goal+"<br>Created by: "+spiralCards[stage].cards[1].creator['login']+"<br>last Modified: "+date+"</h6>";
		if( spir < csp || stage < cst )
		{
			str += "</div></div></li>";
		}
		else
		{
			str += "<button id = 'edit' onclick = \"editSpiral('1')\" >Edit</button></div>";
			str += "<form><textarea>"+spiralCards[stage].cards[1].note+"</textarea><br><button id = 'save' onclick = \"saveSpiral(event)\">Save</button><button id = 'cancel' onclick = \"cancelSpiral(event)\">Cancel</button></form></div></li>";
		}
		document.querySelector("#tasks").innerHTML = str;
		if( document.querySelector("#pretasks").querySelectorAll('li')[1].querySelector("div").querySelector("form") != null )
		{
			document.querySelector("#pretasks").querySelectorAll('li')[1].querySelector("div").querySelector("form").style.display = 'none';
			document.querySelector("#pretasks").querySelectorAll('li')[0].querySelector("div").querySelector("form").style.display = 'none';
		}
		console.log(str);
		stopWait();
	});
}

function cancelSpiral(event)
{
	event.preventDefault();
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
}

function saveSpiral(event)
{
	startWait();
	event.preventDefault();
	var c = event.target.parentElement;
	console.log(c);
	editCard( c.parentElement.parentElement.getAttribute('data-cardurl'), c.querySelector('textarea').value,false, function(obj){
		var csp = parseInt(localStorage.getItem('currentSpiral'));
		var cst = parseInt(localStorage.getItem('currentSpiralStage'));
		loadStage(csp, cst);
	});
}

function startWait()
{
	document.querySelector('#wait').style.display = 'block';
}

function stopWait()
{
	document.querySelector('#wait').style.display = 'none';
}

function editSpiral(choice)
{
	if( choice == '1' )
	{
		document.querySelector("#pretasks").querySelectorAll('li')[1].querySelector("div").querySelector("form").style.display = 'block';
		document.querySelector("#pretasks").querySelectorAll('li')[1].querySelector("div").querySelector("div").style.display = 'none';
	}
	else
	{
		document.querySelector("#pretasks").querySelectorAll('li')[0].querySelector("div").querySelector("form").style.display = 'block';
		document.querySelector("#pretasks").querySelectorAll('li')[0].querySelector("div").querySelector("div").style.display = 'none';

	}
}

document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector("title").innerHTML = localStorage.getItem("Project");
		startWait();
		setValues();
		DisplayCommits();
		loadOverviewBox();
		handleContributors();
		DisplayNotices();
		DisplayNoticeNotices();
		DisplayScrumMeets();
		DisplayNoticeMeets();
		getAllInformation();

		document.querySelector("#gobackbutton").onclick = function(){
			window.location = "/";
		}
		document.querySelector('#helpbutton').onclick = function(){
			window.location = '/Help';
		}
		document.querySelector('#createNotice').querySelector('button').onclick = (event) =>
		{
			event.preventDefault();
			var taskname = document.querySelector('#createNotice').querySelector('#taskname').value;
			var taskDescription = document.querySelector('#createNotice').querySelector('#taskDescription').value;
			if( taskname == '' )
			{
				alert("Notice name is empty");
			}
			else
			{
				if( taskDescription == '' )
				{
					alert("Notice Description is empty");
				}
				else
				{
					var con = taskname+"\n"+taskDescription;
					startWait();
					createCard( JSON.parse(localStorage.getItem("NoticeDetails")).columnURL, con, function(cardObj){
						var b = document.querySelector("#createNoticeButton");
						console.log(b);
						b.classList.toggle('createactive');
						var content = b.nextElementSibling;
						content.reset();
						if( content.style.maxHeight )
						{
							content.style.maxHeight = null;
							content.style.padding = '0px';
						}
						else
						{
							content.style.maxHeight = content.scrollHeight + 'px';
							content.style.padding = '5px';
						}
						DisplayNotices();
						DisplayNoticeNotices();
						stopWait();
					});

				}
			}
		}
		document.querySelector('#createmeet').querySelector('button').onclick = (event) =>
		{
			event.preventDefault();
			var meetLink = document.querySelector('#createmeet').querySelector('#meetinglink').value;
			var meetDate = document.querySelector('#createmeet').querySelector('#meetingDate').value;
			var meetDate = meetDate.substring(0, 4)+meetDate.substring(5, 7)+meetDate.substring(8, 10);
			var meetTime = document.querySelector('#createmeet').querySelector('#meetingtime').value;
			var meetDescription = document.querySelector('#createmeet').querySelector('#meetDescription').value;
			if( meetLink == '' )
			{
				alert("Meeting link is empty");
			}
			else if( meetDate == '' )
			{
				alert("Meeting date is empty");
			}
			else if( meetTime == '' )
			{
				alert("Meeting Time is empty");
			}
			else if( meetDescription == '' )
			{
				alert("Meeting Description is empty");
			}
			else
			{
				var con = meetLink+"\n"+meetDate+"\n"+meetTime+"\n"+meetDescription;
				console.log(con);
				startWait();
				createCard( JSON.parse(localStorage.getItem("MeetingsDetails")).columnURL, con, function(cardObj){
					var b = document.querySelector("#createScrumMeetButton");
					console.log(b);
					b.classList.toggle('createactive');
					var content = b.nextElementSibling;
					content.reset();
					if( content.style.maxHeight )
					{
						content.style.maxHeight = null;
						content.style.padding = '0px';
					}
					else
					{
						content.style.maxHeight = content.scrollHeight + 'px';
						content.style.padding = '5px';
					}
					DisplayScrumMeets();stopWait()} );
			}
		}
		var create = document.querySelectorAll('.create');
		for( let i = 0 ; i < create.length ; i++ )
		{
			create[i].onclick = function()
			{
				this.classList.toggle('createactive');
				var content = this.nextElementSibling;
				if( content.style.maxHeight )
				{
					content.style.maxHeight = null;
					content.style.padding = '0px';
				}
				else
				{
					content.style.maxHeight = content.scrollHeight + 'px';
					content.style.padding = '5px';
				}
			}
		}
		var options = document.querySelector('#options').querySelectorAll('button');
		var display = document.querySelector('#display').children;

		for(let i = 0 ; i < 6 ; i++ )
		{
			display[i].style.display = 'none';
			options[i].style.backgroundColor = '#dbefdc';
		}
		display[0].style.display = 'block';
		options[0].style.backgroundColor = '#3d8b40';

		for( let i = 0 ; i < 6 ; i++ )
		{
			options[i].onclick = (e) =>
			{
				for( let j = 0 ; j < display.length ; j++ )
				{
					display[j].style.display = 'none';
					options[j].style.backgroundColor = '#dbefdc';
				}
				for( let j = 0 ; j < display.length ; j++ )
				{
					if( e.target == options[j] )
					{
						display[j].style.display = 'block';
						options[j].style.backgroundColor = '#3d8b40';
					}
				}
			}
		}
		document.querySelector('#projectname').innerHTML = localStorage.getItem('Project');
		console.log("Hello");
	});
