import { Repository } from "typeorm";
import { AppDataSource } from "../config/datasource";
import { Project } from "../entities/project.entity";
import { ProjectMember } from "../entities/project-member.entity";
// import {ProjectStatus} from "../constant/enums";

export class ProjectRepository {
  private repository: Repository<Project>;
  private memberRepository: Repository<ProjectMember>;

  constructor() {
    this.repository = AppDataSource.getRepository(Project);
    this.memberRepository = AppDataSource.getRepository(ProjectMember);
  }

  async findById(id: string): Promise<Project | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["members", "tasks"],
    });
  }

  async findByIdWithMembers(id: string): Promise<Project | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["members"],
    });
  }

  async findByOrganization(
    organizationId: string,
    includeArchived: boolean = false,
  ): Promise<Project[]> {
    const query = this.repository
      .createQueryBuilder("project")
      .where("project.organizationId = :organizationId", { organizationId })
      .leftJoinAndSelect("project.members", "members");

    if (!includeArchived) {
      query.andWhere("project.isArchived = :isArchived", { isArchived: false });
    }

    return query.getMany();
  }

  async create(projectData: Partial<Project>): Promise<Project> {
    const project = this.repository.create(projectData);
    return this.repository.save(project);
  }

  async update(id: string, updateData: Partial<Project>): Promise<Project> {
    await this.repository.update(id, updateData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error("Project not found after update");
    }
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async getMemberRole(
    projectId: string,
    userId: string,
  ): Promise<string | null> {
    const member = await this.memberRepository.findOne({
      where: { project: { id: projectId }, userId, isActive: true },
    });
    return member ? member.role : null;
  }

  async addMember(memberData: Partial<ProjectMember>): Promise<ProjectMember> {
    const member = this.memberRepository.create(memberData);
    return this.memberRepository.save(member);
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    await this.memberRepository.delete({
      project: { id: projectId },
      userId,
    });
  }

  async isMemberExists(projectId: string, userId: string): Promise<boolean> {
    const count = await this.memberRepository.count({
      where: { project: { id: projectId }, userId },
    });
    return count > 0;
  }

  async updateProgress(projectId: string): Promise<void> {
    const project = await this.repository.findOne({
      where: { id: projectId },
      relations: ["tasks"],
    });

    if (!project) return;

    const totalTasks = project.tasks?.length || 0;
    const completedTasks =
      project.tasks?.filter((task) => task.status === "DONE").length || 0;

    project.totalTasks = totalTasks;
    project.completedTasks = completedTasks;
    project.computeProgress();

    await this.repository.save(project);
  }
}
