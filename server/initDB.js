	Meteor.startup(function(){
	if (Images.find().count() == 0) {
		for (var i = 1; i < 23; i++) {
			Images.insert({
				img_src: "img_" + i + ".jpg",
				img_alt: "some imgage " + i,
				tumb_label: "Some label",
				desc:    "some description for the " + i + " images"
			});
		}
	}
})