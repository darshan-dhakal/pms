import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { CreateTaskDto, UpdateTaskDto } from "../dto/task.dto";

export class TaskController {
  /**
   * Create a new task
   */
  static async createTask(req: Request, res: Response) {
    try {
      const data: CreateTaskDto = req.body;

      if (!data.title || !data.projectId) {
        return res.status(400).json({
          message: "Title and projectId are required",
        });
      }

      const task = await TaskService.createTask(data);

      return res.status(201).json({
        message: "Task created successfully",
        task,
      });
    } catch (error: any) {
      console.error("Create task error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * Get task by ID
   */
  static async getTaskById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const task = await TaskService.getTaskById(id);

      return res.status(200).json({
        task,
      });
    } catch (error: any) {
      console.error("Get task error:", error);
      return res.status(404).json({
        message: error.message || "Task not found",
      });
    }
  }

  /**
   * Get all tasks
   */
  static async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await TaskService.getAllTasks();

      return res.status(200).json({
        tasks,
        total: tasks.length,
      });
    } catch (error: any) {
      console.error("Get all tasks error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Get tasks by project
   */
  static async getTasksByProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;

      const tasks = await TaskService.getTasksByProject(projectId);

      return res.status(200).json({
        tasks,
        total: tasks.length,
      });
    } catch (error: any) {
      console.error("Get tasks by project error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Update task
   */
  static async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateTaskDto = req.body;

      const task = await TaskService.updateTask(id, data);

      return res.status(200).json({
        message: "Task updated successfully",
        task,
      });
    } catch (error: any) {
      console.error("Update task error:", error);
      return res.status(404).json({
        message: error.message || "Task not found",
      });
    }
  }

  /**
   * Delete task
   */
  static async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await TaskService.deleteTask(id);

      return res.status(200).json({
        message: "Task deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete task error:", error);
      return res.status(404).json({
        message: error.message || "Task not found",
      });
    }
  }
}
