import { Activity, Code, Database, Github, Shield, Users } from "lucide-react";

const features = [
	{
		title: "Contribution & Activity Tracking",
		description:
			"Track daily, weekly, and monthly contributions across repositories with detailed metrics and visualizations.",
		icon: Activity,
	},
	{
		title: "Advanced Metrics",
		description:
			"Analyze code quality, community engagement levels, and impact across various projects and communities.",
		icon: Database,
	},
	{
		title: "Custom Achievements",
		description:
			"Earn badges and recognition for coding milestones, consistency, and domain expertise.",
		icon: Shield,
	},
	{
		title: "Tech Expertise Profiling",
		description:
			"Visualize language proficiency, library usage, and project domain specializations.",
		icon: Code,
	},
	{
		title: "GitHub Profile Analytics",
		description:
			"Get insights into collaboration patterns, contribution history, and community involvement.",
		icon: Github,
	},
	{
		title: "Collaboration Opportunities",
		description:
			"Connect with like-minded developers based on complementary skills and interests.",
		icon: Users,
	},
];

export default function FeaturesSection() {
	return (
		<section id="features" className="py-20 bg-secondary/50">
			<div className="container mx-auto flex flex-col items-center text-center lg:items-center lg:text-center">
				<div className="text-center max-w-2xl mx-auto mb-16">
					<h2 className="text-3xl font-bold mb-4">Core Features</h2>
					<p className="text-muted-foreground">
						Comprehensive tools to analyze, visualize, and enhance your GitHub
						presence and collaboration.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-card rounded-xl p-6 shadow-sm border hover:border-primary/50 hover:shadow-md transition-all"
						>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
								<feature.icon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
							<p className="text-muted-foreground">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
