import { Badge } from "@/components/ui/badge";

const roadmapItems = [
	{
		version: "V0",
		title: "Foundation",
		description:
			"Initial project setup, architecture design, and core API integrations.",
		status: "completed",
		progress: 100,
	},
	{
		version: "V1",
		title: "Basic UI",
		description: "Creating key UI components, dashboards, and user flows.",
		status: "completed",
		progress: 100,
	},
	{
		version: "V2",
		title: "Extended Features",
		description:
			"Adding contribution analysis, profile enhancements, and basic achievements.",
		status: "in-progress",
		progress: 75,
	},
	{
		version: "V3",
		title: "Core Features",
		description:
			"Integration of advanced metrics, collaboration suggestions, and expanded achievements.",
		status: "upcoming",
		progress: 30,
	},
	{
		version: "V4",
		title: "Collaboration Tools",
		description:
			"Introducing tools for team metrics, project management, and code reviews.",
		status: "planned",
		progress: 10,
	},
	{
		version: "V5",
		title: "Analytics & Dashboard",
		description:
			"Building comprehensive analytics systems, insights, and customizable dashboards.",
		status: "planned",
		progress: 0,
	},
];

export default function RoadmapSection() {
	return (
		<section id="roadmap" className="py-20 bg-secondary/50">
			<div className="container mx-auto text-center">
				<div className="max-w-2xl mx-auto mb-16">
					<h2 className="text-3xl font-bold mb-4">Development Roadmap</h2>
					<p className="text-muted-foreground">
						Our product journey from foundation to comprehensive analytics
						platform.
					</p>
				</div>

				<div className="max-w-4xl mx-auto">
					<div className="space-y-6">
						{roadmapItems.map((item, index) => (
							<div
								key={index}
								className="bg-card rounded-xl p-6 border flex flex-col md:flex-row gap-4"
							>
								<div className="md:w-1/4 flex flex-col">
									<div className="text-2xl font-bold text-primary mb-1">
										{item.version}
									</div>
									<div className="font-semibold mb-2">{item.title}</div>
									<Badge
										variant={
											item.status === "completed"
												? "default"
												: item.status === "in-progress"
												? "secondary"
												: "outline"
										}
										className="w-fit"
									>
										{item.status === "completed"
											? "Completed"
											: item.status === "in-progress"
											? "In Progress"
											: "Planned"}
									</Badge>
								</div>

								<div className="md:w-3/4">
									<p className="text-muted-foreground mb-4">
										{item.description}
									</p>
									<div className="w-full bg-muted rounded-full h-2.5">
										<div
											className="bg-primary h-2.5 rounded-full"
											style={{ width: `${item.progress}%` }}
										></div>
									</div>
									<div className="flex justify-between mt-1 text-xs text-muted-foreground">
										<span>Progress</span>
										<span>{item.progress}%</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
