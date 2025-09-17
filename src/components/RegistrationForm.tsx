import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, User, Download } from 'lucide-react';

export const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [registrationData, setRegistrationData] = useState<{
    registration_id: string;
    email: string;
  } | null>(null);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('register-concert', {
        body: {
          nom: formData.name,
          email: formData.email,
          telephone: formData.phone
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de l'inscription",
          variant: "destructive"
        });
        return;
      }

      if (data?.error) {
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      // Success
      setIsSuccess(true);
      setRegistrationData({
        registration_id: data.registration_id,
        email: formData.email
      });
      setFormData({ name: '', email: '', phone: '' });
      
      toast({
        title: "Inscription réussie ! 🎉",
        description: data?.message || "Votre ticket sera disponible au téléchargement dans quelques instants.",
        className: "bg-primary/10 border-primary text-foreground"
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDownloadTicket = async () => {
    if (!registrationData) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(
        `https://yjohojrcekdskzhaxedm.supabase.co/functions/v1/download-ticket?registration_id=${registrationData.registration_id}&email=${encodeURIComponent(registrationData.email)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du téléchargement');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Succès !",
        description: "Votre ticket a été téléchargé avec succès.",
        className: "bg-green-50 border-green-200 text-green-800"
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors du téléchargement. Le ticket n'est peut-être pas encore prêt.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 w-full max-w-md text-center">
        <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-primary mb-2">
            Inscription réussie !
          </h3>
          <p className="text-foreground/80 mb-4">
            Votre ticket sera disponible au téléchargement dans quelques instants.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="hero" 
              onClick={handleDownloadTicket}
              disabled={isDownloading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Téléchargement...' : 'Télécharger mon ticket'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSuccess(false);
                setRegistrationData(null);
              }}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              Nouvelle inscription
            </Button>
          </div>
          
          {isDownloading && (
            <p className="text-sm text-muted-foreground mt-3">
              Génération du ticket en cours...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          name="name"
          placeholder="Votre nom complet"
          value={formData.name}
          onChange={handleChange}
          className="pl-10 bg-card/50 border-border/50 focus:border-primary focus:ring-primary/20 h-12"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="email"
          name="email"
          placeholder="Votre adresse email"
          value={formData.email}
          onChange={handleChange}
          className="pl-10 bg-card/50 border-border/50 focus:border-primary focus:ring-primary/20 h-12"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="tel"
          name="phone"
          placeholder="Votre numéro de téléphone"
          value={formData.phone}
          onChange={handleChange}
          className="pl-10 bg-card/50 border-border/50 focus:border-primary focus:ring-primary/20 h-12"
          required
          disabled={isSubmitting}
        />
      </div>

      <Button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-orange hover:opacity-90 text-primary-foreground font-bold h-12 text-lg shadow-intense animate-bounce-subtle"
      >
        {isSubmitting ? 'Inscription en cours...' : 'Je m\'inscris maintenant ! 🔥'}
      </Button>
    </form>
  );
};