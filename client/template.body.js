Template.body.events({
  'click .cube': function(evt) {
    var $el = $(evt.target).parents(".cube");
    if (!$el.hasClass("removed"))
    {
      $el.toggleClass("clicked");

      var num = Session.get("numToggledCubes")*1;
      if ($el.hasClass("clicked"))
        num++;
      else
        num--;
      Session.set("numToggledCubes", num);

      calcFaces($(evt.target).text());
    }
  }
});