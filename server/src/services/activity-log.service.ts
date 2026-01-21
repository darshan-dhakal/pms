import { Repository } from "typeorm";
import { AppDataSource } from "../../typeorm.config";
import { ActivityType } from "../constant/enums";

interface ActivityLogData {
  projectId: string;
  activityType: ActivityType;
  actorId: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  description?: string;
}

export class ActivityLogService {
  async log(data: ActivityLogData): Promise<void> {
    // Simple logging implementation
    // In production, you'd save to database
    console.log(`[AUDIT] ${data.activityType}:`, {
      projectId: data.projectId,
      actor: data.actorId,
      changes: data.changes,
      timestamp: new Date().toISOString(),
    });

    // TODO: Save to ActivityLog entity when implemented
  }
}
