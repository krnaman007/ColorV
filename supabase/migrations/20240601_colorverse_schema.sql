-- Create palettes table
CREATE TABLE IF NOT EXISTS palettes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  colors JSONB NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create palette_likes table
CREATE TABLE IF NOT EXISTS palette_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  palette_id UUID NOT NULL REFERENCES palettes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(palette_id, user_id)
);

-- Create gradients table
CREATE TABLE IF NOT EXISTS gradients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  gradient_data JSONB NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_profiles table to store additional user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create palette_tags junction table
CREATE TABLE IF NOT EXISTS palette_tags (
  palette_id UUID REFERENCES palettes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (palette_id, tag_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  palette_id UUID REFERENCES palettes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_follows table
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- Create palette_history table for version control
CREATE TABLE IF NOT EXISTS palette_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  palette_id UUID REFERENCES palettes(id) ON DELETE CASCADE,
  colors JSONB NOT NULL,
  modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE palettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE palette_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gradients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE palette_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE palette_history ENABLE ROW LEVEL SECURITY;

-- Create policies for palettes
DROP POLICY IF EXISTS "Users can view public palettes" ON palettes;
CREATE POLICY "Users can view public palettes"
  ON palettes FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own palettes" ON palettes;
CREATE POLICY "Users can view their own palettes"
  ON palettes FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own palettes" ON palettes;
CREATE POLICY "Users can insert their own palettes"
  ON palettes FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own palettes" ON palettes;
CREATE POLICY "Users can update their own palettes"
  ON palettes FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own palettes" ON palettes;
CREATE POLICY "Users can delete their own palettes"
  ON palettes FOR DELETE
  USING (user_id = auth.uid());

-- Create policies for palette_likes
DROP POLICY IF EXISTS "Users can view all palette likes" ON palette_likes;
CREATE POLICY "Users can view all palette likes"
  ON palette_likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own likes" ON palette_likes;
CREATE POLICY "Users can insert their own likes"
  ON palette_likes FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own likes" ON palette_likes;
CREATE POLICY "Users can delete their own likes"
  ON palette_likes FOR DELETE
  USING (user_id = auth.uid());

-- Create policies for gradients
DROP POLICY IF EXISTS "Users can view public gradients" ON gradients;
CREATE POLICY "Users can view public gradients"
  ON gradients FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own gradients" ON gradients;
CREATE POLICY "Users can view their own gradients"
  ON gradients FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own gradients" ON gradients;
CREATE POLICY "Users can insert their own gradients"
  ON gradients FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own gradients" ON gradients;
CREATE POLICY "Users can update their own gradients"
  ON gradients FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own gradients" ON gradients;
CREATE POLICY "Users can delete their own gradients"
  ON gradients FOR DELETE
  USING (user_id = auth.uid());

-- Create policies for user_profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid());

-- Create policies for comments
DROP POLICY IF EXISTS "Users can view all comments" ON comments;
CREATE POLICY "Users can view all comments"
  ON comments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own comments" ON comments;
CREATE POLICY "Users can insert their own comments"
  ON comments FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (user_id = auth.uid());

-- Create policies for user_follows
DROP POLICY IF EXISTS "Users can view all follows" ON user_follows;
CREATE POLICY "Users can view all follows"
  ON user_follows FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON user_follows;
CREATE POLICY "Users can follow others"
  ON user_follows FOR INSERT
  WITH CHECK (follower_id = auth.uid());

DROP POLICY IF EXISTS "Users can unfollow others" ON user_follows;
CREATE POLICY "Users can unfollow others"
  ON user_follows FOR DELETE
  USING (follower_id = auth.uid());

-- Create policies for palette_history
DROP POLICY IF EXISTS "Users can view history of their palettes" ON palette_history;
CREATE POLICY "Users can view history of their palettes"
  ON palette_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM palettes p 
    WHERE p.id = palette_id AND p.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can view history of public palettes" ON palette_history;
CREATE POLICY "Users can view history of public palettes"
  ON palette_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM palettes p 
    WHERE p.id = palette_id AND p.is_public = true
  ));

-- Enable realtime for all tables with proper error handling
-- Check if publication exists first
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Publication already exists, continue
    RAISE NOTICE 'Error checking or creating publication: %', SQLERRM;
END
$$;

-- Add tables to publication with proper error handling
DO $$
DECLARE
    table_names text[] := ARRAY['palettes', 'palette_likes', 'gradients', 'user_profiles', 'tags', 'palette_tags', 'comments', 'user_follows', 'palette_history'];
    t text;
    table_exists boolean;
    table_in_publication boolean;
BEGIN
    FOREACH t IN ARRAY table_names LOOP
        BEGIN
            -- Check if table exists
            SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = t) INTO table_exists;
            
            IF table_exists THEN
                -- Check if table is already in publication
                SELECT EXISTS (
                    SELECT 1
                    FROM pg_publication_tables
                    WHERE pubname = 'supabase_realtime'
                    AND schemaname = 'public'
                    AND tablename = t
                ) INTO table_in_publication;
                
                IF NOT table_in_publication THEN
                    EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', t);
                    RAISE NOTICE 'Added table % to publication', t;
                ELSE
                    RAISE NOTICE 'Table % is already in publication', t;
                END IF;
            ELSE
                RAISE NOTICE 'Table % does not exist, skipping', t;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- Table might already be in the publication or other error, continue to next table
            RAISE NOTICE 'Error adding table % to publication: %', t, SQLERRM;
        END;
    END LOOP;
END
$$;

-- Create functions

-- Function to get palette like count
CREATE OR REPLACE FUNCTION get_palette_like_count(palette_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM palette_likes WHERE palette_id = $1);
END;
$$ LANGUAGE plpgsql;

-- Function to check if user liked a palette
CREATE OR REPLACE FUNCTION has_user_liked_palette(palette_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM palette_likes WHERE palette_id = $1 AND user_id = $2);
END;
$$ LANGUAGE plpgsql;

-- Function to toggle palette like
CREATE OR REPLACE FUNCTION toggle_palette_like(palette_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  liked BOOLEAN;
BEGIN
  liked := EXISTS (SELECT 1 FROM palette_likes WHERE palette_id = $1 AND user_id = $2);
  
  IF liked THEN
    DELETE FROM palette_likes WHERE palette_id = $1 AND user_id = $2;
    RETURN FALSE;
  ELSE
    INSERT INTO palette_likes (palette_id, user_id) VALUES ($1, $2);
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create palette history entry
CREATE OR REPLACE FUNCTION create_palette_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO palette_history (palette_id, colors, modified_by)
  VALUES (NEW.id, NEW.colors, auth.uid());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for palette history with proper error handling
DO $$
BEGIN
  -- Check if trigger exists and drop it if it does
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'palette_history_trigger') THEN
    DROP TRIGGER IF EXISTS palette_history_trigger ON palettes;
    RAISE NOTICE 'Dropped existing palette_history_trigger';
  END IF;
  
  -- Create the trigger
  CREATE TRIGGER palette_history_trigger
  AFTER INSERT OR UPDATE OF colors ON palettes
  FOR EACH ROW
  EXECUTE FUNCTION create_palette_history();
  
  RAISE NOTICE 'Created palette_history_trigger';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error managing palette_history_trigger: %', SQLERRM;
END
$$;