import { AppDataSource } from "../config/datasource";
import { Task } from "../entities/task.entity";
import { Project } from "../entities/project.entity";
import { User } from "../entities/user.entity";
import { CreateTaskDto, UpdateTaskDto } from "../dto/task.dto";

const taskRepository = AppDataSource.getRepository(Task);
const projectRepository = AppDataSource.getRepository(Project);
const userRepository = AppDataSource.getRepository(User);

export class TaskService {
  static async createTask(data: CreateTaskDto) {
    const project = await projectRepository.findOne({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const task: any = {
      title: data.title,
      description: data.description,
      project,
    };

    if (data.assignedToId) {
      const user = await userRepository.findOne({
        where: { id: data.assignedToId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      task.assignedTo = user;
    }

    const newTask = taskRepository.create(task);
    return await taskRepository.save(newTask);
  }

  static async getTaskById(id: string) {
    const task = await taskRepository.findOne({
      where: { id },
      relations: ["project", "assignedTo"],
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  static async getTasksByProject(projectId: string) {
    return await taskRepository.find({
      where: { project: { id: projectId } },
      relations: ["project", "assignedTo"],
    });
  }

  static async updateTask(id: string, data: UpdateTaskDto) {
    const task = await taskRepository.findOne({
      where: { id },
      relations: ["project", "assignedTo"],
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (data.title) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.isCompleted !== undefined) task.isCompleted = data.isCompleted;

    if (data.assignedToId) {
      const user = await userRepository.findOne({
        where: { id: data.assignedToId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      task.assignedTo = user;
    } else if (data.assignedToId === null) {
      task.assignedTo = null as any;
    }

    return await taskRepository.save(task);
  }

  static async deleteTask(id: string) {
    const task = await taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return await taskRepository.remove(task);
  }

  static async getAllTasks() {
    return await taskRepository.find({
      relations: ["project", "assignedTo"],
    });
  }
}
