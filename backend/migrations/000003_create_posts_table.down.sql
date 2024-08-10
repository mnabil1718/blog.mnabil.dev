ALTER TABLE posts DROP CONSTRAINT IF EXISTS tags_length_check;

DROP INDEX IF EXISTS posts_title_index;
DROP INDEX IF EXISTS posts_tags_index;

DROP TABLE IF EXISTS posts;

DROP TYPE IF EXISTS post_status;