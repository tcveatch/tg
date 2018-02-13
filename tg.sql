// Create tables using the below CREATE TABLE code
--------------------
TABLES
	MEMBERS
--------------------  
docs
	id: integer primary key
	name/title: text
	author: text
	URL: text
	// content: text  NONOJESUS
	// checksum: text (MD5 of content)
	
classes // (can name/classify docs and tiers with this as also via name/author, types, etc.)
	// This creates a classification structure within the tiers of the document.
	id: integer primary key
	doc_id: integer foreign key to docs(id)    
	tier_id: integer foreign key to tiers(id)  // 0 means none, i.e., a doc class
	key: text (such as "date of publication", or "LG")
	value: text (such as "February 6, 2018" or "en")

tiers
	id: integer primary key
	doc_id: integer foreign key to docs(id)

tiertypes 
	// Specify interpretation and data handling methods for tiers.
	tier_id: integer foreign key to tiers(id)
	// type: text // e.g. file http direct mp4 video audio 32khz 16bit
	key: text  // e.g., method mediatype rate fileformat sourcetier derivationmethod
	value: text // e.g. http   video     30hz mp4        $tn        lookup(L2,L1,$data)

nodes
	idx: integer primary key
	id: text
 	doc_id: integer foreign key to docs(id)
	// offset: integer NONOJESUS.
	// predarcs: NO, derive that from arc information
	// succarcs: NO, derive that from arc information

 	// A node is not a pointer referring to a text offset,
	// but an anchor that the content arcs refer to.  Nodes are the
	// primary data in a TG, along with their sequential
	// pattern as realized in the structure of arc linkages between them.
	// Text and content are hung on this primary structure, not the reverse.

arcs
	id: integer primary key
	name: text
	doc_id: integer foreign key to docs(id)
	tier_id: integer foreign key to tiers(id)
	pred_id: integer foreign key to nodes(id) // no other arc in the same doc+tier can have the same pred_id
	succ_id: integer foreign key to nodes(id) // no other arc in the same doc+tier can have the same succ_id
        data: text (utf-8)
	       data is parseable according to the arc's tier's types.
	       It is a sequence of zero or more identifiers encoded as utf8 text
	       If type is "auto", data is read directly as the sequence of characters themselves.
	       Or it can be a delimited sequence of references according to
	       the tier's type, such as id's of lemmas, wordtypes, wordtokens,
	       or URIs or other references to outside content.
	       If prefixed with an access method like http: or file: etc.,
	       and suffixed by access data such as a URI, the method must be
	       consistent (redundant) with the tier's types.

----  a useful SQL table set for processing monolingual language data: ----

lemmas -- one row per distinct lexical element (dictionary entry)
  id
  pos -- part of speech
  citation -- orthographic string representing the "citation form" for the lemma
  ... -- other stuff as needed

wordtypes -- one row per distinct word form or space-separated punctuation string in the corpus
  id
  orth -- character string; how this word/punt type appears in text
  -- the remaining fields apply only to word forms (not free-standing punctuation):
  lemma_id -- integer foreign key to lemmas(id)
  type_label -- morphological categorization
  type_segs -- morphologically segmented rendering of the orthographic form (optional)
  ... -- other stuff as needed

wordtokens -- one row per space-separated token in the corpus
  id
  type_id -- integer foreign key to types(id)
  doc_id -- integer foreign key to docs(id)
  seqno -- relative position of the token within the doc
  prev_punc -- punctuation string (if any) attached at beginning of orthographic word
  foll_punc -- punctuation string (if any) attached at end of orthographic word
