# Create tables to store Translation Graphs

CREATE TABLE IF NOT EXISTS docs (
	id     INT NOT NULL,
	name   VARCHAR(255),      # document title
	author VARCHAR(255),    
	URL    VARCHAR(1023),
	# content: text  NONOJESUS
	# checksum: text (MD5 of content)
	PRIMARY KEY (id)
) ENGINE=InnoDB;
	
CREATE TABLE IF NOT EXISTS classes # (can name/classify docs and tiers with this as also via name/author, types, etc.)
	# This creates a classification structure within the tiers of the document.
	id      INT NOT NULL,
	doc_id  INT,   
	tier_id INT,        # 0 means none, i.e., a doc class
	key     VARCHAR(255), # (such as "date of publication", or "LG"),
 	value   VARCHAR(255), # (such as "February 6, 2018" or "en")
	PRIMARY KEY (id),
	FOREIGN KEY (doc_id)  REFERENCES docs(id), 
	FOREIGN KEY (tier_id) REFERENCES tiers(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tiers
	id      INT NOT NULL,
	doc_id  INT foreign key to docs(id),
	PRIMARY KEY (id),
	FOREIGN KEY (doc_id) REFERENCES docs(id)
);

CREATE TABLE IF NOT EXISTS tiertypes 
	# Specify interpretation and data handling methods for tiers.
	tier_id INT,
	# type: text       # e.g. file http direct mp4 video audio 32khz 16bit
	key     VARCHAR(255)   # e.g., method mediatype rate fileformat sourcetier derivationmethod
	value   VARCHAR(255) # e.g. http   video     30hz mp4        $tn        lookup(L2,L1,$data)
        FOREIGN KEY (tier_id) REFERENCES tiers(id)
);

CREATE TABLE IF NOT EXISTS nodes
	idx     INT NOT NULL,
	id      VARCHAR(255),
 	doc_id  INT,
	# offset: integer NONOJESUS.
	# predarcs: NO, derive that from arc information
	# succarcs: NO, derive that from arc information

 	# A node is not a pointer referring to a text offset,
	# but an anchor that the content arcs refer to.  Nodes are the
	# primary data in a TG, along with their sequential
	# pattern as realized in the structure of arc linkages between them.
	# Text and content are hung on this primary structure, not the reverse.
	PRIMARY KEY (idx),
	FOREIGN KEY (doc_id) REFERENCS docs(id)
);

CREATE TABLE IF NOT EXISTS arcs
	id      INT NOT NULL,
	name    VARCHAR(255),
	doc_id  INT,
	tier_id INT,
	pred_id INT, # no other arc in the same doc+tier can have the same pred_id
	succ_id INT, # no other arc in the same doc+tier can have the same succ_id
        data: text (utf-8),
	       data is parseable according to the arc's tier's types.
	       It is a sequence of zero or more identifiers encoded as utf8 text
	       If type is "auto", data is read directly as the sequence of characters themselves.
	       Or it can be a delimited sequence of references according to
	       the tier's type, such as id's of lemmas, wordtypes, wordtokens,
	       or URIs or other references to outside content.
	       If prefixed with an access method like http: or file: etc.,
	       and suffixed by access data such as a URI, the method must be
	       consistent (redundant) with the tier's types.
	PRIMARY KEY (id),
	FOREIGN KEY (doc_id)  REFERENCES docs(id),
	FOREIGN KEY (tier_id) REFERENCES tiers(id),
	FOREIGN KEY (pred_id) REFERENCES nodes(id),
	FOREIGN KEY (succ_id) REFERENCES nodes(id)
);

# ----  a useful SQL table set for processing monolingual language data: ----

CREATE TABLE IF NOT EXISTS lemmas #-- one row per distinct lexical element (dictionary entry)
	id    INT NOT NULL,
	pos   VARCHAR(30),      # part of speech
	citation VARCHAR(255) CHARSET 'utf8', # orthographic string representing the "citation form" for the lemma
  	...       # other stuff as needed
  	UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS wordtypes  # one row per distinct word form or space-separated punctuation string in the corpus
	id INT NOT NULL,
	orth,       # character string; how this word/punt type appears in text
	# the remaining fields apply only to word forms (not free-standing punctuation):
	lemma_id INT,   # integer foreign key to lemmas(id)
	type_label, # morphological categorization
	type_segs,  # morphologically segmented rendering of the orthographic form (optional)
	... -- other stuff as needed
	UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS wordtokens -- one row per space-separated token in the corpus
	id INT NOT NULL,
	type_id,   # integer foreign key to types(id)
	doc_id,    # integer foreign key to docs(id)
	seqno,     # relative position of the token within the doc
	prev_punc, # punctuation string (if any) attached at beginning of orthographic word
	foll_punc  # punctuation string (if any) attached at end of orthographic word
	PRIMARY KEY (id)
);
