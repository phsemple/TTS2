
DROP DATABASE IF EXISTS languages;

CREATE DATABASE languages;

USE languages;

-- A lesson can be categorized, although this may be loosely
-- enforced. It will be defaulted to uncategorized.
CREATE TABLE lessons (
    lessonid BIGINT AUTO_INCREMENT,      
    lessonname varchar(40) NOT NULL,
    category varchar(50) NOT NULL,
    PRIMARY KEY (lessonid)
);

CREATE TABLE langcodes (
	langcode CHAR(2) NOT NULL,
    language VARCHAR(30) NOT NULL,
	PRIMARY KEY (langcode)
);

CREATE TABLE regions (
	region CHAR(5) NOT NULL,
    description VARCHAR(30) NOT NULL,
	PRIMARY KEY (region)
);

CREATE TABLE voices (
	voice VARCHAR(20) NOT NULL,
    region CHAR(5) NOT NULL,
	PRIMARY KEY (voice),
    FOREIGN KEY (region) REFERENCES regions(region) ON DELETE RESTRICT ON UPDATE RESTRICT
);


-- Phrase for a specific language and the translation and mp3 audio
-- for the region and voice. 
CREATE TABLE phrases (
    phraseid CHAR(36),                 -- UUID 
    langcode CHAR(2) NOT NULL,         -- Two-character language code
    phrase VARCHAR(500) NOT NULL,      -- Phrase (required)
    region CHAR(5),                    -- 5-character region code
    voice VARCHAR(20),                 -- Voice name (up to 20 characters)
    audioname VARCHAR(60),			   -- will match the file name if we had a file.
    audio BLOB,                        -- Stores the raw binary audio data
    mime_type VARCHAR(50) DEFAULT 'audio/mpeg',  -- Stores the MIME type 
    PRIMARY KEY (phraseid, langcode),
	FOREIGN KEY (langcode) REFERENCES langcodes(langcode) ON DELETE RESTRICT ON UPDATE RESTRICT,
	FOREIGN KEY (region) REFERENCES regions(region) ON DELETE RESTRICT ON UPDATE RESTRICT,
	FOREIGN KEY (voice) REFERENCES voices(voice) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE VIEW phrases_wo_buffer AS 
SELECT phraseid, phrase, langcode, region, voice, audioname, mime_type FROM phrases;

CREATE INDEX idxaudioName ON phrases (audioname); -- api will as for this to play audio
CREATE INDEX idxPhrase ON phrases(phrase);   -- we may want to allow reuse of a phrase.


-- Join a lesson to its phrases for a translation from 
-- one language to another. 
-- The phraseid is the same across all the phrase translations,
-- so we need just one phraseid to tie the translations together.
CREATE TABLE lesson_phrases (
    lessonid BIGINT NOT NULL,     
    phraseid CHAR(36) NOT NULL,
    phraseorder SMALLINT NOT NULL,
    PRIMARY KEY (lessonid, phraseid),
    FOREIGN KEY (lessonid) REFERENCES lessons(lessonid) ON DELETE RESTRICT ON UPDATE RESTRICT
);




    