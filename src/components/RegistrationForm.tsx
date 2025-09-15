import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, User } from 'lucide-react';

export const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Inscription réussie ! 🎉",
      description: "Vous recevrez toutes les informations par email",
      className: "bg-concert-orange/10 border-concert-orange text-foreground"
    });
    
    setFormData({ name: '', email: '', phone: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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