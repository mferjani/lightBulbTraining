var log = C3.logger("SmartBulbFailureAlert");

function process(input) {
  var data = input.hasFailed.data(),
      dates = input.hasFailed.dates();
  for (var i = 0; i < data.length; i++) {
    // if the bulb has failed 
    if (data.at(i) == 1) {
      return SmartBulbEvent.make({
        smartBulb: input.source,
        eventCode: "FAILED",
        eventType: "HEALTH",
        start: dates.at(i),
        end: dates.at(i+1)
      });
    }
  }
}
