import { ProjectCard } from "./ProjectCard";
import { projects } from "@/data/projects";

export function ProjectList2() {
  const project = projects[1];
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <ProjectCard
          slug={project.slug}
          title={project.title}
          description={project.description}
          badges={project.badges}
          year={project.year}
        />
      </div>
    </section>
  );
}

