

USE languages;

INSERT INTO langcodes ( langcode, language)
VALUES ( 'en', 'English'),
	('sw', 'Swahili');
    
INSERT INTO regions ( region, description )
VALUES ('en-US', 'English: United States'),
('sw-TZ' , 'Swahili: Tanzania');

INSERT INTO voices ( voice, region) 
VALUES ( 'Rehema', 'sw-TZ'),
		('Scott', 'en-US');


-- INSERT INTO lessons (lessonname, category) VALUES
-- ( 'Want or Need', 'Common Phrases'),
-- ( 'Common Verbs', 'Verbs'),
-- ( 'Parts of the Body', 'Body'),
-- ( 'Parts of the Body 2', 'Body'),
-- ( 'Things Around the House', 'Household'),
-- ( 'Walking in Town', 'Outdoors'),
-- ( 'Personal Pronouns', 'Grammar'),
-- ( 'Possesive Pronouns', 'Grammar'),
-- ( 'Using Prepositions', 'Grammar'),
-- ( 'Direct Object Nouns','Grammar');

-- can't autoincrement the phraseid, because sw and en for the same phrase must 
-- have the same id.
-- INSERT INTO phrases( phraseid, langcode, phrase, region, voice, audioname,audio)
-- 	VALUES 
--     ( UUID(),'en', 'I want', 'en-US', 'Scott',NULL,NULL),
--     ( UUID(),'en', 'I want a drink', 'en-US', 'Scott',NULL,NULL),
-- 	( UUID(),'en', 'I want a drink', 'en-US', 'Scott',NULL,NULL),
-- 	( UUID(),'en', 'I want money', 'en-US', 'Scott',NULL,NULL),
-- 	( UUID(),'en', 'I want a cookie', 'en-US', 'Scott',NULL,NULL),
-- 	( UUID(),'en', 'I want to go', 'en-US', 'Scott',NULL,NULL),
-- 	( UUID(),'en', 'I want to go to the store', 'en-US', 'Scott',NULL,NULL),
--     ( UUID(),'en', 'I want to go to church', 'en-US', 'Scott',NULL,NULL),
--     ( UUID(),'en', 'I want to go home', 'en-US', 'Scott',NULL,NULL),
--     ( UUID(),'en', 'I want to go shopping', 'en-US', 'Scott',NULL,NULL),
-- 	( UUID(),'en', 'I want to see a movie', 'en-US', 'Scott',NULL,NULL),
--     ( UUID(),'en', 'I want to watch television', 'en-US', 'Scott',NULL,NULL);
        
-- because of foreign key restraint I must have an sw langcode in phrases table.
-- INSERT INTO lesson_phrases( lessonid, phraseid, phraseorder)
-- SELECT l.lessonid, p.phraseid,  ROW_NUMBER() OVER (ORDER BY p.phraseid) AS phraseorder
-- FROM lessons l, phrases p
-- WHERE l.lessonid = 1;


