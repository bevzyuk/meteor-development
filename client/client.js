// Routing
Router.route('/', function () {
  this.render('images');
});


Session.set("imagesLimited", 8);
      
  lastScrollTop = 0;
  $(window).scroll(function(event) {
    if($(window).scrollTop() + $(window).height() > $(document).height()-150){
          var scrollTop = $(this).scrollTop();
          if (scrollTop > lastScrollTop) {
            Session.set("imagesLimited", Session.get("imagesLimited") + 4);
          }else{
                // going up
          }
            lastScrollTop = scrollTop;
    }
  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });

  Template.images.helpers({
    images:function(){
    if (Session.get("userFilter")) {
      return Images.find(
        {createBy: Session.get("userFilter")},
        {sort:{CreatedOn: -1,rating:-1}});
    }else{
      return Images.find(
        {},
        {sort:{CreatedOn: -1,rating:-1},
         limit:Session.get("imagesLimited")});
    }},
   filtering_images:function(){
    if(Session.get("userFilter")){
      return true;
    }else{
      return false;
    }
   }, 
   getFilteredUser:function(){
    var filteredUser = Session.get("userFilter");
      if (filteredUser) {
        var user = Meteor.users.findOne({_id:filteredUser});
        return user.username;
      }else{
        return false;
      }
   },
   getUser:function(user_id){
     var user = Meteor.users.findOne({_id:user_id});
     if (user){
        return user.username;
     }else{
    	  return "anonymous";
      }		
		  }		
    
   });

  Template.body.helpers({
    userName:function(){
    if(Meteor.user()){
      return Meteor.user().username;
    }else {
      return "Anonymous user";         
    }
  }})


   Template.images.events({
    'click .js-image':function(event){
        $(event.target).css("width", "50px");
    },
    'click .js-btn-remove':function(event){
      var img_id = this._id;
      //console.log('Id is: '+ img_id);
        $("#"+img_id).hide('slow', function(){
          Images.remove({"_id":img_id});
        });
    },
   'click .js-rate-image':function(event){
     var rating = $(event.currentTarget).data("userrating");
     //console.log(rating);
     var img_id = this.id;
     //console.log(img_id);
     Images.update({_id:img_id},{$set: {rating:rating}})
   },
   'click .js-btn-show-img-form':function(event){
     $('#image_add_form').modal('show');
   },
   'click .js-set-user-filter':function(event){
      Session.set("userFilter", this.createBy);
   },
   'click .js-unset-image-filter':function(event){
      Session.set("userFilter", undefined);
   },
   });

Template.image_add_form.events({
  'submit .js-add-image':function(event){
      var img_src, img_alt;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;
     // console.log('Image src: '+ img_src+ " image alt: "+ img_alt);
     if (Meteor.user()) {
      Images.insert({img_src:img_src,
                     img_alt:img_alt,
                     CreatedOn: new Date(),
                     createBy: Meteor.user()._id,
                     tumb_label: "Some label",
                     desc:    "some description "});
      console.log(Images.find().count());
       
     }
      $('#image_add_form').modal('hide');
      return false;
   }
})
