Images = new Mongo.Collection("Images");

// TODO configure basic security
Images.allow({
	insert:function(userId, doc){
		if (Meteor.user()) { //user is logged in
			return true;
		}else{
			console.log("Log in for inserting into collections.");
			return false;			
		}
	},
	update:function(userId, doc){
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

})