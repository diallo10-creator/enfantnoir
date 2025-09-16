import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CountdownTimer } from '@/components/CountdownTimer';
import { RegistrationForm } from '@/components/RegistrationForm';
import { TestimonialSection } from '@/components/TestimonialSection';
import { Calendar, MapPin, Phone, Ticket, Music, Clock } from 'lucide-react';
import { ChatBot } from '@/components/ChatBot';
import enfantNoirImage from '@/assets/enfant-noir-concert.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <img 
            src={enfantNoirImage} 
            alt="ENFANT NOIR Concert" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-concert-dark/80 via-concert-dark/60 to-concert-dark/90"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-7xl font-display font-black mb-6 leading-tight">
              <span className="text-gradient-orange">LA LÉGENDE URBAINE</span>
              <br />
              <span className="text-foreground">ARRIVE À ABIDJAN</span>
              <span className="text-gradient-gold"> 🔥</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/90 mb-8 font-medium">
              Un show exclusif avec <span className="text-gradient-orange font-bold">ENFANT NOIR SD</span>
              <br />
              Le 19 septembre 2025, le Palais de la Culture vibrera !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">19 Septembre 2025</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">Palais de la Culture, Abidjan</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">20h00</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                variant="tickets" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto"
                onClick={() => window.open('https://lenfantnoir.tikerama.com', '_blank')}
              >
                <Ticket className="h-6 w-6" />
                🎟️ Tickets disponibles
              </Button>
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto animate-bounce-subtle"
                onClick={() => document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Music className="h-6 w-6" />
                Je m'inscris maintenant !
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 px-4 bg-card/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 text-gradient-gold">
            Compte à rebours
          </h2>
          <CountdownTimer />
        </div>
      </section>

      {/* Registration Section */}
      <section id="inscription" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-intense">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gradient-orange">
                  Réservez votre place !
                </h2>
                <p className="text-foreground/80 text-lg">
                  Inscrivez-vous pour recevoir toutes les informations exclusives sur le concert
                </p>
              </div>
              
              <div className="flex justify-center">
                <RegistrationForm />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Ticket Prices Section */}
      <section className="py-16 px-4 bg-card/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gradient-gold">
            Tarifs & Catégories
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2 text-foreground">PASS</h3>
                <div className="text-3xl font-display font-bold text-gradient-orange mb-4">
                  5,000 FCFA
                </div>
                <p className="text-muted-foreground">Accès général au concert</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-300 ring-2 ring-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2 text-foreground">VIP</h3>
                <div className="text-3xl font-display font-bold text-gradient-gold mb-4">
                  10,000 FCFA
                </div>
                <p className="text-muted-foreground">Places privilégiées + avantages</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/30 hover:border-accent/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2 text-foreground">VVIP</h3>
                <div className="text-3xl font-display font-bold text-gradient-gold mb-4">
                  20,000 FCFA
                </div>
                <p className="text-muted-foreground">Expérience premium exclusive</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              variant="tickets" 
              size="lg" 
              className="text-lg px-12 py-4 h-auto glow-orange"
              onClick={() => window.open('https://lenfantnoir.tikerama.com', '_blank')}
            >
              <Ticket className="h-6 w-6" />
              Acheter mes tickets maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-concert-dark border-t border-border/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-display font-bold mb-6 text-gradient-orange">
            ENFANT NOIR - La légende urbaine
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5 text-primary" />
              <a href="tel:0704349625" className="font-medium hover:text-primary transition-colors">
                0704349625
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">Palais de la Culture, Abidjan</span>
            </div>
          </div>

          <div className="border-t border-border/20 pt-6">
            <p className="text-muted-foreground text-sm">
              © 2025 ENFANT NOIR Concert. Un événement à ne pas manquer !
            </p>
          </div>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Index;