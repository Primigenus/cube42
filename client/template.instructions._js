Template.instructions.events({
  "click #instructions, #instructions li": function() {
    instruction++;
    showInstruction(instruction);
  }
})