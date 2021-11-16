function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+localStorage.getItem('token'));
}
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
function editNotice(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'none'; 
	c.querySelector('form').style.display = 'block';
}

function deleteNotice(event)
{
	var c = event.target.parentElement.parentElement;
	handleModal('Delete Notice', "This cannot be undone, Are you sure you want to delete the Notice?" , function()
		{
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Notice"); DisplayNotices(); DisplayNoticeNotices();} );
		});
}

function saveNotice(event)
{
	var c = event.target.parentElement;
	editCard( c.parentElement.getAttribute('data-cardurl'), c.querySelector('#taskname').value+'\n'+c.querySelector('#taskDescription').value,false, function(obj){DisplayNotices();DisplayNoticeNotices();});
}

function cancelNotice(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
}
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
				if( date > string )
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
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Meeting"); DisplayScrumMeets(); DisplayNoticeMeets();} );
		});
}

function saveScrumMeet(event)
{
	var c = event.target.parentElement;
	meetLink = c.querySelector('#meetinglink').value;
	meetDate = c.querySelector('#meetingDate').value;
	meetDate = meetDate.substring(0, 4)+meetDate.substring(5, 7)+meetDate.substring(8, 10);
	meetTime = c.querySelector('#meetingtime').value;
	meetDescription = c.querySelector('#meetDescription').value;
	con = meetLink+"\n"+meetDate+"\n"+meetTime+"\n"+meetDescription;
	editCard( c.parentElement.getAttribute('data-cardurl'), con, false, function(obj){DisplayScrumMeets();DisplayNoticeMeets();});
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

function DisplayChart()
{
	var number = 6;
	var level = 5;
	var radius = 200/level;
	var str = '';
	for( var i = 0 ; i < level ; i++ )
	{
		str += "<div class = 'circle' id = 'level"+(i+1)+"'><div></div><div></div><div></div><div></div><span class = 'tooltiptext'>ToolTip</span></div>";
	}
	str += "<div id = 'horizontal'></div>"
	str += "<div id = 'vertical'></div>"
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
		//circles[i].style.overflow = 'hidden';
		circles[i].style.zIndex = level-i;
		circles[i].onclick = function(event)
		{
			console.log(event.target.id, " Clicked");
		}
		for( var j = 0 ; j < 4 ; j++ )
		{
			circles[i].querySelectorAll('div')[j].style.width = parseInt(circles[i].style.width)/2+ 'px';
			circles[i].querySelectorAll('div')[j].style.height = parseInt(circles[i].style.height)/2+ 'px';
			//circles[i].querySelectorAll('div')[j].style.borderStyle = 'solid';
			if( j == 0 )
			{
				circles[i].querySelectorAll('div')[0].style.borderTopLeftRadius = parseInt(circles[i].style.width)/2+ 'px';
			}
			else if( j == 1 )
			{
				circles[i].querySelectorAll('div')[1].style.borderTopRightRadius = parseInt(circles[i].style.width)/2+ 'px';
			}
			else if( j == 2 )
			{
				circles[i].querySelectorAll('div')[2].style.borderBottomLeftRadius = parseInt(circles[i].style.width)/2+ 'px';
			}
			else if( j == 3 )
			{
				circles[i].querySelectorAll('div')[3].style.borderBottomRightRadius = parseInt(circles[i].style.width)/2+ 'px';
			}
			circles[i].querySelectorAll('div')[j].style.float = 'left';
			if( i*4+j < number )
			{
				if( j == 0 )
				{
					circles[i].querySelectorAll('div')[1].style.backgroundColor = 'lightblue';
				}
				else if( j == 1 )
				{
					circles[i].querySelectorAll('div')[3].style.backgroundColor = 'lightblue';
				}
				else if( j == 2 )
				{
					circles[i].querySelectorAll('div')[2].style.backgroundColor = 'lightblue';
				}
				else if( j == 3 )
				{
					circles[i].querySelectorAll('div')[0].style.backgroundColor = 'lightblue';
				}
			}
			console.log(circles[i].querySelectorAll('div')[j].style.height);
			console.log(circles[i].querySelectorAll('div')[j].style.width);
			console.log(circles[i].querySelectorAll('div')[j]);
			circles[i].querySelectorAll('div')[j].onclick = function(event)
			{
				console.log(event.target);
			};
			console.log('width set');
		}
	}
	h = document.querySelector("#horizontal");
	v = document.querySelector("#vertical");
	h.style.backgroundColor = 'black';
	h.style.height = '2px';
	h.style.zIndex = level;
	h.style.width = '400px';
	h.style.marginLeft = '200px';
	h.style.marginTop = '200px';
	h.style.position = 'absolute';
	v.style.backgroundColor = 'black';
	v.style.height = '400px';
	v.style.zIndex = 4;
	v.style.width = '2px';
	v.style.marginLeft = '400px';
	v.style.marginTop = '0px';
	v.style.position = 'absolute';

}
document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector("title").innerHTML = localStorage.getItem("Project");
		loadOverviewBox();
		handleContributors();
		DisplayNotices();
		DisplayNoticeNotices();
		DisplayScrumMeets();
		DisplayNoticeMeets();
		DisplayChart();
		document.querySelector("#gobackbutton").onclick = function(){
			window.location = "http://127.0.0.1:8000/";
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
					});
					DisplayNotices();
					DisplayNoticeNotices();
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
					DisplayScrumMeets();} );
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
		}
		display[0].style.display = 'block';

		for( let i = 0 ; i < 6 ; i++ )
		{
			options[i].onclick = (e) =>
			{
				for( let j = 0 ; j < display.length ; j++ )
				{
					display[j].style.display = 'none';
				}
				for( let j = 0 ; j < display.length ; j++ )
				{
					if( e.target == options[j] )
					{
						display[j].style.display = 'block';
					}
				}
			}
		}
		document.querySelector('#projectname').innerHTML = localStorage.getItem('Project');
		console.log("Hello");
	});
