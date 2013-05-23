// Application's events registry module, enumerates all the events in a
// structured JSON object for a consistent access and ability to change
// events names in a DRY manner
define([], function () {
  var eventRegistry;

  eventRegistry = {
    app: {
        bootstrapped  : 'app:bootstrap:finished'
    },

    layout: {
        defaultAppRendered  : 'layout:defaultapp:rendered'
      , subAppRendered      : 'layout:subapp:rendered'
    },
  };

  return eventRegistry;
});
