-- Créer une table profiles pour gérer les rôles admin
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs voient leur propre profil
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Politique pour que les utilisateurs créent leur propre profil
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique pour que les utilisateurs mettent à jour leur propre profil
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Fonction pour obtenir le rôle de l'utilisateur actuel
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Mettre à jour les politiques RLS existantes pour reconnaître les admins
DROP POLICY IF EXISTS "Only authenticated admins can view contacts" ON public.contacts;
CREATE POLICY "Only authenticated admins can view contacts" 
ON public.contacts 
FOR SELECT 
USING (public.is_admin());

DROP POLICY IF EXISTS "Only authenticated admins can view registrations" ON public.inscriptions_concert;
CREATE POLICY "Only authenticated admins can view registrations" 
ON public.inscriptions_concert 
FOR SELECT 
USING (public.is_admin());

-- Permettre aux admins de mettre à jour les inscriptions (pour les tickets)
CREATE POLICY "Only authenticated admins can update registrations" 
ON public.inscriptions_concert 
FOR UPDATE 
USING (public.is_admin());

DROP POLICY IF EXISTS "Only authenticated admins can manage medias" ON public.medias;
CREATE POLICY "Only authenticated admins can manage medias" 
ON public.medias 
FOR ALL 
USING (public.is_admin());

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Créer un admin par défaut (email: admin@example.com)
-- Note: L'utilisateur devra d'abord créer ce compte via l'interface d'inscription