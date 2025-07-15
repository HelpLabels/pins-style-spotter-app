/*
  # Create vision analyses table

  1. New Tables
    - `vision_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `image_url` (text)
      - `labels` (jsonb) - detected labels from Vision API
      - `colors` (jsonb) - dominant colors
      - `detected_text` (text) - any text found in image
      - `objects` (jsonb) - detected objects
      - `fashion_insights` (jsonb) - processed fashion-specific insights
      - `raw_response` (jsonb) - full Vision API response
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `vision_analyses` table
    - Add policy for users to access their own analyses
*/

CREATE TABLE IF NOT EXISTS public.vision_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  image_url text NOT NULL,
  labels jsonb DEFAULT '[]'::jsonb,
  colors jsonb DEFAULT '[]'::jsonb,
  detected_text text,
  objects jsonb DEFAULT '[]'::jsonb,
  fashion_insights jsonb DEFAULT '{}'::jsonb,
  raw_response jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.vision_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vision analyses"
  ON public.vision_analyses
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create vision analyses"
  ON public.vision_analyses
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own vision analyses"
  ON public.vision_analyses
  FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own vision analyses"
  ON public.vision_analyses
  FOR DELETE
  USING (auth.uid()::text = user_id::text);