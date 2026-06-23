export interface Goal {
  id?: string;
  employeeId: string;
  managerId: string;
  title: string;
  description: string;
  target: number;
  uom: string;
  weightage: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  thrustArea: string;
  isLocked: boolean;
  cycle: string;
  createdAt: string;
  updatedAt: string;
}

export const GoalService = {
  async getUserGoals(uid: string): Promise<Goal[]> {
    const response = await fetch(`/api/goals?userId=${uid}`);
    return await response.json();
  },

  async getTeamGoals(managerId: string): Promise<Goal[]> {
    const response = await fetch(`/api/goals/team?managerId=${managerId}`);
    return await response.json();
  },

  async createGoal(goal: Partial<Goal>): Promise<Goal> {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    return await response.json();
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const response = await fetch(`/api/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await response.json();
  },

  async submitGoals(goalIds: string[]) {
    const response = await fetch('/api/goals/batch-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: goalIds,
        updates: { status: 'submitted' }
      }),
    });
    return await response.json();
  }
};
