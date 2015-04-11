if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.svgload.helpers({
    svg: function(id){
      var svg = SVGs.findOne(Session.get('loadedSVG'));

      return svg;
    },
  });


  Template.svgload.events({
    'change #fileSVG': function (e, template) {
      var files = e.target.files;

      for (var i = 0, f; f = files[i]; i++) {
        SVGs.insert(f,function(e,fileObj) {
          // nasty hack to for test
          Session.set('loadedSVG', fileObj._id);
          fileObj.update({$set:{'metadata.organisation': template.data.organisation, 'metadata.scanned': false}});
        });
      }
    },
    'click #cancelSVG': function (e, template) {
      Session.set('loadedSVG','');
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup



  });
}

SVGs = new FS.Collection("svgs", {
  stores: [new FS.Store.GridFS("svgs")],
  filter: {
    maxSize: 4096000, //in bytes
    allow: {
      contentTypes: ['image/*'],
      extensions: ['svg','png']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        alert(message);
      } else {
        console.log(message);
      }
    }
  }
});

SVGs.allow({
  insert: function() {return true;},
  download: function() {return true;},
  update: function() {return true;},
  fetch: null,
});
