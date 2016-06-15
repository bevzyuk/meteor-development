Images = new Mongo.Collection("Images");

// TODO configure basic security
Images.allow({
	insert:function(userId, doc){
		if (Meteor.user()) { //user is log in
			return true;
		}else{
			console.log("Log in for inserting into collections.");
			return false;			
		}
	},
	update:function(userId, doc){
		if (Meteor.user()) { //user is log in
			return true;
		}else{
			console.log("Log in for updating collections.");
			return false;			
		}
	},
	remove:function(userId, doc){
		if (Meteor.user() && doc.createBy == userId) {
			return true;
		}else{
			console.log("Log in for updating collections.");
			return false;			
		}
	},

})