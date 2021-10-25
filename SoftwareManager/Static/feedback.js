document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.history.back()
		}
		
		const form = document.querySelector('.container').querySelector('form');
		form.querySelector('#save').onclick = (event) =>
		{
			event.preventDefault();
			rating = 0;
			comments = form.querySelector('#comments').value;
			name = localStorage.getItem('Username');
			const d = new Date();
			var x = d.getDate()+"-"+ (d.getMonth()+1) +"-"+d.getFullYear();

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
			console.log(rating);

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
						alert('Comment successfully added');
					}
				}
			)
		}
	});
