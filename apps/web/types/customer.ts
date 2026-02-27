export interface CustomerProfile {
  _id: string;
  name: string;
  email: string;
}

export interface CustomerProject {
  id: string;
  title: string;
  status: "NEW" | "CONFIRMED" | "COMPLETED";
  date: string;
  value: number;
  businessType: string;
  milestones: {
    key: "planned" | "in_progress" | "delivered";
    title: string;
    status: "PENDING" | "DONE";
    files: string[];
    comments: { text: string; by: string; at: string }[];
    updatedAt: string;
  }[];
}
