// editor for Translation Graphs

// open/close/rename/delete TG
// hold a TG
// know of a Point in it, with all the tiers and encompassing corresponding minimum arcs
// be able to browse forward and backward upon demand.
// from Point expand backward to a window start and forward to a window end.
// display a range from window start to end with focus on Point
// offer functions to:
//   delete a node merging adjacent arcs on all the tiers it belongs on
//   edit (add, delete, overwrite at cursor) content of an arc, resetting view around point with each character entered
//   with cursor inside content of an arc, insert a node splitting arc ito two at cursor
//   Add a tier, specify its name and characteristics
