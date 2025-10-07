-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create eco_actions table (types of sustainability actions)
CREATE TABLE public.eco_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  icon TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on eco_actions
ALTER TABLE public.eco_actions ENABLE ROW LEVEL SECURITY;

-- Eco actions are viewable by everyone
CREATE POLICY "Eco actions are viewable by everyone"
  ON public.eco_actions FOR SELECT
  USING (true);

-- Create user_actions table (log of user actions)
CREATE TABLE public.user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_id UUID NOT NULL REFERENCES public.eco_actions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_actions
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- User actions policies
CREATE POLICY "Users can view their own actions"
  ON public.user_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actions"
  ON public.user_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all actions for leaderboard"
  ON public.user_actions FOR SELECT
  USING (true);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  badge_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Achievements are viewable by everyone
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  USING (true);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all achievements for display"
  ON public.user_achievements FOR SELECT
  USING (true);

-- Function to update profile updated_at
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert default eco actions
INSERT INTO public.eco_actions (name, description, points, icon, category) VALUES
  ('Used Reusable Water Bottle', 'Avoided single-use plastic bottle', 10, '💧', 'waste'),
  ('Recycled Waste', 'Properly sorted and recycled materials', 15, '♻️', 'waste'),
  ('Biked to Campus', 'Used bicycle instead of car', 25, '🚴', 'transport'),
  ('Used Public Transport', 'Took bus/train instead of driving', 20, '🚌', 'transport'),
  ('Brought Reusable Bag', 'Used own bag for shopping', 10, '👜', 'waste'),
  ('Composted Food Waste', 'Composted organic materials', 20, '🌱', 'waste'),
  ('Turned Off Unused Lights', 'Saved energy by switching off lights', 5, '💡', 'energy'),
  ('Unplugged Devices', 'Reduced phantom energy consumption', 5, '🔌', 'energy'),
  ('Ate Plant-Based Meal', 'Chose vegetarian/vegan option', 15, '🥗', 'food'),
  ('Avoided Food Waste', 'Finished meal without throwing food away', 10, '🍽️', 'food');

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, requirement_type, requirement_value, badge_color) VALUES
  ('Eco Warrior', 'Reach 100 points', '🏆', 'points', 100, 'gold'),
  ('Green Champion', 'Reach 500 points', '👑', 'points', 500, 'emerald'),
  ('Planet Protector', 'Reach 1000 points', '🌍', 'points', 1000, 'blue'),
  ('Action Hero', 'Complete 10 eco-actions', '⭐', 'actions', 10, 'yellow'),
  ('Consistency King', 'Complete 50 eco-actions', '🔥', 'actions', 50, 'orange'),
  ('Waste Warrior', 'Complete 20 waste-related actions', '♻️', 'category_waste', 20, 'green'),
  ('Transport Champion', 'Complete 20 transport-related actions', '🚴', 'category_transport', 20, 'cyan'),
  ('Energy Saver', 'Complete 20 energy-related actions', '💡', 'category_energy', 20, 'amber');