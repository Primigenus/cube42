Template.start.rendered = function() {
  $("[data-role='lettering']").lettering();
};
Template.start.events({
  "click [data-role='play']": function() {
    play();
  },
  "click [data-role='instructions']": function() {
    showInstructions();
  },
  "click [data-role='rankings']": function() {
    showRankings();
  }
});