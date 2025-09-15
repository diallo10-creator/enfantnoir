import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Kouadio Marcel",
    text: "ENFANT NOIR est un artiste exceptionnel ! Ses concerts sont toujours mémorables.",
    rating: 5
  },
  {
    name: "Fatou Diallo",
    text: "J'ai hâte de voir ce show ! L'ambiance va être folle au Palais de la Culture.",
    rating: 5
  },
  {
    name: "Yves Kouassi",
    text: "Un talent authentique qui représente vraiment la culture urbaine ivoirienne.",
    rating: 5
  }
];

export const TestimonialSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gradient-gold">
          Ce que disent les fans
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-concert-gold text-concert-gold" />
                  ))}
                </div>
                <p className="text-foreground/90 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-primary">
                  — {testimonial.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};