
import { Award, Bug, Code, Heart, Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const achievements = [
  {
    title: "Code Quality Guardian",
    description: "Maintaining high code standards with clean, well-documented commits",
    icon: Shield,
    color: "bg-blue-500",
  },
  {
    title: "Community Builder",
    description: "Active contributions to discussions and helping other developers",
    icon: Heart,
    color: "bg-pink-500",
  },
  {
    title: "Bug Hunter",
    description: "Identifying and fixing critical bugs across repositories",
    icon: Bug,
    color: "bg-red-500",
  },
  {
    title: "Language Polyglot",
    description: "Proficiency in multiple programming languages and frameworks",
    icon: Code,
    color: "bg-purple-500",
  },
  {
    title: "Open Source Advocate",
    description: "Significant contributions to open source projects and communities",
    icon: Star,
    color: "bg-amber-500",
  },
  {
    title: "Rising Star",
    description: "Rapidly growing contributor with exceptional potential",
    icon: Award,
    color: "bg-emerald-500",
  },
];

export default function AchievementsSection() {
  return (
    <section id="achievements" className="py-20">
      <div className="container mx-auto flex flex-col items-center text-center lg:items-center lg:text-center">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Unlock Developer Achievements</h2>
          <p className="text-muted-foreground">
            Earn badges and recognition for your GitHub contributions and coding milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="group bg-card rounded-xl p-6 border hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className={`absolute right-0 top-0 w-24 h-24 -mr-12 -mt-10 rounded-full ${achievement.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="flex flex-col items-center text-center">
                <div className={`h-16 w-16 rounded-full ${achievement.color} flex items-center justify-center mb-5`}>
                  <achievement.icon className="h-8 w-8 text-white" />
                </div>
                
                <Badge variant="outline" className="mb-3 px-3 text-xs">Achievement</Badge>
                
                <h3 className="text-xl font-semibold mb-3">{achievement.title}</h3>
                <p className="text-muted-foreground text-sm">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
