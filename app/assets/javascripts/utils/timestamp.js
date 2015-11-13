/*
  http://momentjs.com/docs/#/displaying/fromnow/
  has information regarding what each key stands for.

  Keep future and past as they are.
*/

moment.locale('en', {
  relativeTime: {
    future: "in %s",
    past:   "%s ago",
    s: "Just now",
    m: "1 min",
    mm: "%d mins",
    h: "1 hr",
    hh: "%d hrs",
    d: "1 day",
    dd: "%d days",
    M: "1 month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years"
  }
})

timestamp = function(time) {
  return moment(time).fromNow(true)
}
