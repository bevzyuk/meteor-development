Websites = new Mongo.Collection("websites");

Websites.allow({
	insert:function(userId, doc){
		if (Meteor.user()) { //user is logged in
			return true;
		}else{
			console.log("Log in for inserting into collections.");
			return false;			
		}
	},
	update:function(userId, doc, fields, modifier){
		if (Meteor.user()) { //user is logged in
			return true;
		}else{
			console.log("Log in for updating collections.");
			return false;			
		}
	},
	remove:function(userId, doc){
		if (Meteor.user() && doc.createBy == userId) { //only logged in user and owner of image can remove it from collection
			return true;
		}else{
			console.log("Log in for updating collections.");
			return false;			
		}
	},

});

Meteor.methods({

  updateCommentLikes: function(site_id, comments_id) {

    
    //check(checked, Boolean);
    var currentLikes = Websites.findOne({_id:site_id,'comments._id':comments_id}).likes;
			if (currentLikes == null) {
				currentLikes = 1;
			}else {
				currentLikes++;
			}

    Websites.update({
      _id: site_id, 
      'comments._id':comments_id 
    }, {
      $set: {
        'comments.$._id': currentLikes
      }
    });

  }

});