// startWait and stopWait are used to display the "Please Wait" msg when the page loads

function startWait()
{
	document.querySelector('#wait').style.display = 'block';
}

function stopWait()
{
	document.querySelector('#wait').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.location = '/';
		}
		
		const form = document.querySelector('.container').querySelector('form');

		// this inserts the comments when the user click on save btn
		form.querySelector('#save').onclick = (event) =>
		{
			startWait();
			event.preventDefault();
			rating = 0;
			comments = form.querySelector('#comments').value;
			name = localStorage.getItem('Username');
			const d = new Date();
			var x = d.getDate()+"-"+ (d.getMonth()+1) +"-"+d.getFullYear();

			// get the rating
			if( form.querySelector('#star5').checked == true )
			{
				rating = 5;
			}
			else if( form.querySelector('#star4').checked == true )
			{
				rating = 4;
			}
			else if( form.querySelector('#star3').checked == true )
			{
				rating = 3;
			}
			else if( form.querySelector('#star2').checked == true )
			{
				rating = 2;
			}
			else if( form.querySelector('#star1').checked == true )
			{
				rating = 1;
			}
			else
			{
				alert("Give a Rating");
				window.location = '';
			}
			// check if the commnet is valid
			if( feedback == '' )
			{
				alert("Feedback is empty");
				window.location = '';
			}
			//console.log(rating);
			// insert the comment into the database
			$.ajax(
				{
					type: "POST",
					url: "insertComment",
					data:
					{
						createdBy: name,
						createdOn: x,
						feedback: comments,
						rating: rating,
					},
					success: function(data){
						stopWait();
						alert('Comment successfully added');
						window.location = '/';
					}
				}
			)
		}
	});
