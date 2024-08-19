 CREATE TABLE IF NOT EXISTS images (
 id bigserial PRIMARY KEY,
 file_name text UNIQUE NOT NULL,
 alt text NOT NULL,
 destination text NOT NULL,
 size integer NOT NULL,
 width integer NOT NULL,
 height integer NOT NULL,
 content_type text NOT NULL,
 created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
 updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
 version integer NOT NULL DEFAULT 1
 );