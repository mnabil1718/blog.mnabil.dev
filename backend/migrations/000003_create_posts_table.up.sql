 CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
 CREATE TABLE IF NOT EXISTS posts (
 id bigserial PRIMARY KEY, 
 user_id bigint NOT NULL REFERENCES users ON DELETE RESTRICT,
 title text NULL,
 preview text NULL,
 content text NULL,
 slug text UNIQUE NULL,
 image_name text NULL,
 tags text[] NOT NULL DEFAULT '{}',
 status post_status NOT NULL DEFAULT 'draft',
 created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
 updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
 deleted_at timestamp(0) with time zone DEFAULT NULL,
 version integer NOT NULL DEFAULT 1
 );

ALTER TABLE posts ADD CONSTRAINT tags_length_check CHECK (array_length(tags, 1) BETWEEN 0 AND 5);

CREATE INDEX IF NOT EXISTS posts_title_index ON posts USING GIN (to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS posts_tags_index ON posts USING GIN (tags);