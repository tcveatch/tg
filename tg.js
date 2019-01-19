// JavaScripting Translation Graphs
// (c) Tom Veatch, 1/2/2018, 2/22/2018
//
// Spec, sample code for creating TG objects, sample JSON.
// For general information on TGs see the wiki at github.com/tcveatch/tg
//
//
// ********Things we want to do in TGs:*********
//
// Read them from files, write them to files.
// Define charset and encoding for each tier.
// Refer in content to outside data by URL
//    with a limited set of locator methods followed by : then a URI.
//    If no locator method then the content is considered direct text content.
//    (Because writing the rules to distinguish a/path/to/a/file.txt seems hard,
//    and saying file:a/file.txt is really not much trouble.)

// Refer not in content but in browser to data handling method (e.g. a
//   YouTube segment playback)

// Have content arcs comprised, edited, and viewed, of text, image,
//    audio, video in any format.

// Have nodes located symbolically as within text or between images,
//   and temporally as between samples/frames in audio/video.

// Allow nodes not to have a definite time scale associated with them,
//  since different renderings might take different amounts of time.
//  arcs of different time baselines starting at the same node
//  may want treatment by stretching to end at the same time or not.
//  I'm calling that a browser/viewer problem.
//
// Create them from scratch in code under an editor's control:
//   like: copy a tier, split an arc at a point in its content, modify
//         content for an arc, merge a sequence of arcs to be one arc,
//         deleting the intervening nodes within a given tier.

// Computer-generate tiers, e.g., by dictionary lookup, OCR, MT
//    methods, adding a href links for dict lookup by click, etc.
//    The method is copy tier, replace/modify arcs.

// Let a browser/editor communicate with a growing dictionary: when a
//   word is defined differently then store it, and auto-populate it
//   forward into translation points that are uncorrected,
//   computer-generated.

// Let options for an arc have an annotation, without requiring an
//    entire new tier for it, e.g. dictionary entries with variable
//    numbers of optional meanings/translations, separate them with
//    commas or |'s or something and let the browser/editor know to
//    present them as menu options along with delete, and a text-edit
//    entry widget.

// Manually edit/select-among-options/delete/insert content over
//   machine-generated contents: 

// In a browser, be smart about what tiers to show.
//   Watching a video tagged with text, the UI could reveal only the
//     last sentence or screen-fitting amount of text in LOriginal when
//     the pause is clicked, parameterizing the choice of what tiers to
//     show.
//   Browsing an L2 original document, the UI could reveal only the
//     selected segment up to a sentence or screen-fitting amount of
//     text in LTranslated, or if it's a word, the translated word
//     tier for that selection.
//   I'd like to be able to click through an L2 document selecting
//     words I don't understand, toggling them half-line up with an
//     underdisplay visible as L1, then toggling it back when I
//     understand it, until it is finally all back in L2 and I
//     understand it directly.

// Enable Concordance Display: Define the visible presentation of a
//   text concordance for any given element: All its occurrences are
//   found in a compileable list of locations or At-spans.  Choose a
//   tier for the longest single-arc span, e.g., sentence-sized arcs,
//   and display all the At-spans that long containing the element at
//   a unit-sized or smaller-sized arc tier aligned on that element.  

// Incrementally generate tiers: Add (or split off the front) one arc
//   at a time.

// A mostly blank tier can be mostly comprised of content-less arcs
//   between the non-blank sections. Fine. Just make sure you can read
//   <node><node> with an empty arc.
//
// In the browser establish a different data entry method for different tiers.
//
// Be able to accept a recording of a part in a play or symphony, for
//   example, as a tier.  Then different actors/instruments have their
//   own tier, perhaps unsegmented.

//   It would be nice to have a sync or clap or something to align
//     tier playback.  but silences in one tier can be empty arcs,
//     then the full arcs determine the playback delays.  I like it.
//
// Have different nodes in an A#B type of sequence for end of A and beginning
//   of B such as AAAAA#BABBAABA#BBBBB that links the tiers
//   appropriately.  A given node on a higher level (more sequential)
//   tier corresponds to two nodes at the coarticulated tier,
//   representing the beginning of influence of the successor unit and
//   the ending of influence of the predecessor unit.  Within a tier,
//   no arcs overlap, but in the content in the more etic tier, two
//   "overlapping" arcs are seen as three non-overlapping arcs with
//   the middle one being the overlap of the two at the higher level.

// Here I'm saying that the editor in the etic tier should allow a
//   node split and a node drag (across content in an adjacent arc),
//   thus dividing those two faces and leaving the merged
//   (dragged-over) section in the middle.  I'd say neither the first nor second
//   is to be identified with the node of the higher level, but there are three
//   nodes in the global node space, and the relations are to be made evident in the At span
//   rather than read up the node's tier-applicability array.

//

// 
function At(from[],to[]) { // "At" a span: nodes define start/end within each tier.
    this.p[] = duplicateArray(from[]);
    this.s[] = duplicateArray(to[]);
}

function Arc(label,p,s,content) {
    this.label=label;
    this.p=p;
    this.s=s;
    this.content=content;
    this.writeArc = function() {
	print this.content;// we can assume arcs print only between the nodes they are At
    }
    this.readArc = function() {
	// we should know the previous Node,
	// we should parse through into the next Node, so that we also know that Node.
	// then assign
	label = "t$i.a$j";
	p = prev node label;
	s = succ node label;
	content = read content up to "<node" or EOF,pushing that back into the read buffer;
    }
}

function Node(nodes,label,n,p[],s[]) {
    this.label=label;
    this.p[]=p[];
    this.s[]=s[]; // n elements in these arrays, one for each of TG.docinfo.nTiers tiers.
    this.writeNode = function() {
	print "<node id=\"label\">";
    }
    this.readNode = function(tierN) {
	// in <n 1>arctxt<n 2>, reading <n 1> we must store it for the following arc,
	// also we might get called for pre-reading <n 2> while setting up that arc.
	// we should pre-parse through into the next Node, so that we also know that Node.
	// Here we have to keep the tier straight
	scanf("<node id=%s>",label);
	nodes[label].p[tierN] = the previous arc label;
	nodes[label].s[tierN] = the successor arc label;
	// also we don't know where we are in the node array until we pull out the id label,
	// with which we can index to the right node's p[] and s[] properties.
    }
}

function TG(title,author,nTiers) {
    this.arctiers = []; // array of tiers, each being an associative array of arcs
    this.nodes = {};    // associative array of nodes, each with preds/succs for each tier
    this.docinfo = { "doctitle": title,
	       "author": author,
	       "nTiers": nTiers,
	       "encodings": [],
 	       "tiernames": [],
               "tierlocs":  []
    };

    this.specifyTier = function (tierName,tierLoc,tierEncoding) {
	if (tierName === undefined) tierName = "unstructured";
	if (tierLoc === undefined)  tierLoc  = "file:tg.txt";
	if (tierEncoding === undefined)  tierEncoding  = "utf8"; // could map to UTF-32 on read
	this.tiernames.push(tierName);
	this.tierlocs.push(tierLoc);
	this.tierencoding.push(tierEncoding);
    };
    this.copyTier = function(i) {
	nt = this.docinfo.nTiers++;
	at = this.arcTiers[nt] = duplicateArray(this.arcTiers[i]);
	for (n in this.nodes) { n.s.push(""); n.p.push(""); }
	for (a in at) {
	    this.nodes[a.p].s[nt] = a.key; 
	    this.nodes[a.s].p[nt] = a.key;
	}
    };
    this.serialize = function(io) {
	if (io==="read") {
	    baseTier = empty(this.nodes)?true:false;
	    for (i=0;i<this.docinfo.nTiers;i++) {
		open the tierLoc for reading as tierEncoding,
		ok=ok&&n=readNode(); // expect <node id="$nn">
		if (ok && baseTier) { this.firstNode = n; }
		while (ok) {
		    ok=ok&&readArc(); // expect any text until <node id="$nn">
		    ok=ok&&n=readNode(); // expect any text until <node id="$nn">
		}
		if (ok && baseTier) { this.lastNode = n; }
		// confirm the final node is the global final node.
	    }
	} else { // assume io==="write"
	    writeDocInfo(this.docinfo);
	    for (i=0;i<this.docinfo.nTiers;i++) {
		open the tierLoc[i] for writing as tierEncoding[i],
		arcaa = this.arcTiers[i];
		nodes = this.nodes;
		nn=this.firstNode; // node name
		writeNode(this.nodes.nn);
		while (ok && an=this.nodes.nn.s[i]) { // node has a successor in this tier.
		    ok = ok && arcaa.an && nn = arcaa.an.s;
		    ok = ok &&  writeArc(arcaa.an);
		    ok = ok && writeNode(nodes.nn);
		}
	    }
	    if (nn === this.lastNode) { print("All is good. ran out of arcs at the end.\n"); }
	    else { print("Error, last node name " + nn + "!=" + this.lastNode + ".\n"); }
	}
    }
    
    }
}

function writeDocInfo(docinfo) {
    write to output file
	    '<tg title="'
		. i.doctitle . '" author="'
		. i.author . '" nTiers='
	        . i.nTiers . ' encodings="'
	        . i.encodings.join(',') . '" tiernames="'
	        . i.tiernames.join(',') . '" tierlocs="'
	        . i.tierlocs.join(',') . '">\n'
	    ;
};


/* an example of a tg in JSON */
tg = { // array of tier names, array of arrays of named arc objects, named-array of nodes
    docinfo: [ doctitle: "A Poem",
      author: "Tom Veatch",
	       nTiers: 2,
	       read_encoding: "utf8",  // a default to be minimally used; captures ASCII files. 
	       in_encoding: "UTF-32", // Use UTF-32 internally and for writing.
               tiernames: [ "Words", "Sentences" ],
               tierlocs:  [ "poem.tg#words", "poem.sentences.tg" ]
    ],
    // p for predecessor, s for successor.
    arctiers: [ // Should arcs be numbered or tiernamed or both? both, consistently, after renumbering.
	// arc names are sortable only within tiers: no total ordering across tiers.
	{   "t0.a0": {txt:"Tom",p:"A",s:"B"},
 	    "t0.a1": {txt:"lvs",p:"B",s:"C"},
	    "t0.a2": {txt:"Liz",p:"C",s:"D"}
	},
	{   
	    "t1.a0": {txt:"Tom lvs Liz",p:"A",s:"D" }
	}
    ],


    // here each node contains a list (one per tier) of preds and successor arcs
    nodes: {
	"A": {p: ["",""],           s: ["t0.a0","t1.a0"] },
	"B": {p: ["t0.a0",""     ], s: ["t0.a1",""     ] },
	"C": {p: ["t0.a1",""     ], s: ["t0.a2",""     ] },
	"D": {p: ["t0.a2","t1.a0"], s: [""     ,""     ] }
    }
}; 
