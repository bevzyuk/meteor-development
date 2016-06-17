/////
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
	this.render('navbar',{
		to: "navbar"
	});
	this.render('website_form',{
		to: "form"
	});
	this.render('website_list',{
		to: 'main'
	});
}

)

Router.route('/detail/:_id', function(){
	this.render('navbar',{
		to: "navbar"
	});
	this.render('single_item_page',{
		to:"main",
		data:function(){
			return Websites.findOne({_id:this.params._id});
		}
	});
});

function insertSite(url, title, desc){
	if (url != undefined && description != undefined) {
		Websites.insert({
			title: title,
			url: url,
			description: desc,
			createdOn: new Date()
		});	
	}				
};

function convertDate(obj){
	var date = obj.createdOn.getDate();
	var month = obj.createdOn.getMonth()+1;
	var year = obj.createdOn.getFullYear();
	return date + '/' + month + '/' + year;
};

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort:{rating: -1, createdOn: -1 }});
		},
		
	});

	Template.website_item.helpers({
		getFormatedDate:function(){
			var date = convertDate(this);
			return date;
		},
		rating:function(){
			var rating = Websites.findOne({_id:this._id}).rating;
			if (rating == null || rating == undefined) {
				return 0;
			}else{
				return rating;
			}
		},
		commentNum:function(){
			var commentNum = Websites.findOne({_id:this._id});
			if (commentNum.comments==null || commentNum.comments== undefined) {
				return 0;
			}else{
				console.log('Number of commetns:' + commentNum.comments.length);
				return  commentNum.comments.length;
			}
		}
	});
	Template.single_item_page.helpers({
		getFormatedDate:function(){
			var date = convertDate(this);
			return date;
		}
	});

	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			var currentRating = Websites.findOne({_id: website_id}).rating;
			if (currentRating == null) {
				currentRating = 1;
			}else {
				currentRating++;
			}
			// put the code in here to add a vote to a website!
			Websites.update({_id:website_id},{$set:{rating: currentRating}});
			console.log('Current rating is '+ Websites.findOne({_id: website_id}).rating);
			return false;// prevent the button from reloading the page
		}, 

		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);
			var currentRating = Websites.findOne({_id: website_id}).rating;
			if (currentRating == null) {
				currentRating = 1;
			}else {
				currentRating--;
			}
			// put the code in here to add a vote to a website!
			Websites.update({_id:website_id},{$set:{rating: currentRating}});
			console.log('Current rating is '+ Websites.findOne({_id: website_id}).rating);

			// put the code in here to remove a vote from a website!

			return false;// prevent the button from reloading the page
		}
	})

	Template.single_item_page.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			var currentRating = Websites.findOne({_id: website_id}).rating;
			if (currentRating == null) {
				currentRating = 1;
			}else {
				currentRating++;
			}
			// put the code in here to add a vote to a website!
			Websites.update({_id:website_id},{$set:{rating: currentRating}});
			console.log('Current rating is '+ Websites.findOne({_id: website_id}).rating);
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);
			var currentRating = Websites.findOne({_id: website_id}).rating;
			if (currentRating == null) {
				currentRating = 1;
			}else {
				currentRating--;
			}
			// put the code in here to add a vote to a website!
			Websites.update({_id:website_id},{$set:{rating: currentRating}});
			console.log('Current rating is '+ Websites.findOne({_id: website_id}).rating);

			// put the code in here to remove a vote from a website!

			return false;// prevent the button from reloading the page
		},
		'submit .js-add-comment':function(event){
			var website_id = this._id;
			var comment = event.target.comment.value;
			if (Meteor.user()) { // user is logged in
				var user_id = Meteor.user()._id;
				var comment_id = new Meteor.Collection.ObjectID().toHexString();
				console.log('Comment id:' + comment_id);
				Websites.update({_id:website_id},{$push: {
				  	comments:{
							_id: comment_id,
							author: user_id,
							comment: comment,
							likes: 0,
							dislikes:0,
							createdOn: new Date()
				}}});
				
			}else { // user isn't logged in
				console.log('User must sign in to write comment');
				$('.alert_message').append('<div class="alert alert-warning" id="alert-message" role="alert">Please login or register to leave a comment</div>');
				$('#alert-message').alert();
				
			}
			event.target.comment.value = '';
			return false;
		},
		"click .js-comment-like":function(event){
			var comments_id = event.target.parentElement.id;
			var site_id = event.target.parentElement.parentElement.id;
			console.log('Site id: '+ site_id);
			console.log('Likes post with id: ' + comments_id);
			
			var doc = Websites.findOne({'comments._id':comments_id});
			console.log(doc);
			var currentLikes = Websites.findOne({_id:site_id,'comments._id':comments_id}).likes;
			if (currentLikes == null) {
				currentLikes = 1;
			}else {
				currentLikes++;
			}
			
			// put the code in here to add a vote to a website!
			Websites.update({_id:site_id,'comments._id':comments_id},{$set:{'comments.$.likes': currentLikes}});
			//Meteor.call('updateCommentLikes', site_id, comments_id);
		}
	})

	Template.single_item_page.helpers({
		getUserName:function(){
			return Meteor.users.findOne({_id:this.author}).username;
		},
		comments:function(){
			return Websites.findOne({_id:this._id}).comments;
		},
		rating:function(){
			var rating = Websites.findOne({_id:this._id /*, 'comments.id': this._id*/}).rating;
			if (rating == null || rating == undefined) {
				return 0;
			}else {
				return rating;
			}
		}
	})

	Template.website_form.helpers({
		userLogedIn:function(){
			return Meteor.user();
		},

	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){
						
			var url = event.target.url.value;
			var title = event.target.title.value;
			var description = event.target.description.value;
			$("#website_form").toggle('hide');
			event.target.url.value = '';
			event.target.title.value = '';
			event.target.description.value = '';
			insertSite(url, title, description);
/*			HTTP.call( 'GET', url, 
				{}, function( error, response ) {
  					if ( error ) {
			  			insertSite(url, title, description);
					} else {
					    //console.log( response );
					    title = event.target.title.value;
					var desc_start_idx = response.content.indexOf('<title>')+8;   
					var desc_end_idx = response.content.indexOf('</title>');
					var site_desc = response.content.substring(desc_start_idx,desc_end_idx);
					console.log('Title from site: ' + site_desc);
					if (site_desc != null && site_desc!= '') {
						description = site_desc;
					}
					console.log('Title is: '+ description);
			    	console.log("The url they entered is: " + url);
			  		insertSite(url, title, description);
			  }							});	*/
			return false;// stop the form submit from reloading the page
		},
	})