

export interface Job {
  id: number;
  title: string;
  status: string;
  questionsCount: number;
  createdAt: string;
  updatedAt: string;
  department: string;
  location: string;
  description: string;
  published: boolean;
}

export interface Question {
  id: number;
  text: string;
}

export interface Test {
  id: number;
  jobId: number;
  name: string;
  questions: Question[];
  duration: number;
  status: 'closed' | 'open';
  openAt?: Date; // Date object for scheduled open time
  invitedEmails?: string[]; // Array of email addresses for invites
  accessCode?: string; // Unique generated code for access
}

export interface Session {
  id: number;
  testId: number;
  startTime: Date;
  duration: number;
  code: string;
  status: "Scheduled" | "Active" | "Expired" | "Cancelled";
  accesses: number;
  endTime: Date;
}

export const sampleJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    status: "active",
    questionsCount: 15,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-11-01T14:30:00Z",
    department: "Engineering",
    location: "Remote",
    description: "Responsible for building user interfaces and client-side logic using modern web technologies.",
    published: true
  },
  {
    id: 2,
    title: "Backend Engineer",
    status: "active",
    questionsCount: 20,
    createdAt: "2025-02-20T09:15:00Z",
    updatedAt: "2025-10-28T16:45:00Z",
    department: "Engineering",
    location: "New York, NY",
    description: "Handles server-side logic, database management, and API development for scalable applications.",
    published: true
  },
  {
    id: 3,
    title: "UI/UX Designer",
    status: "draft",
    questionsCount: 10,
    createdAt: "2025-03-10T11:20:00Z",
    updatedAt: "2025-11-14T09:00:00Z",
    department: "Design",
    location: "San Francisco, CA",
    description: "Creates intuitive user experiences through wireframing, prototyping, and visual design.",
    published: false
  },
];

// Sample tests
// Sample tests
export const sampleTests: Test[] = [
  {
    id: 1, // ✅ ID đơn giản, dễ đọc
    jobId: 1,
    name: "React Fundamentals",
    duration: 30,
    questions: [
      {
        id: 1,
        text: "What is JSX?",
      },
      {
        id: 2,
        text: "What hook manages state in functional components?",
      },
      {
        id: 3,
        text: "What is the Virtual DOM?",
      },
    ],
    status: 'open',
    accessCode: 'REACT123',
  },
  {
    id: 2, // ✅ ID tuần tự
    jobId: 2,
    name: "Node.js Basics",
    duration: 45,
    questions: [
      {
        id: 1,
        text: "What is Express.js?",
      },
    ],
    status: 'closed',
  },
  {
    id: 3, // ✅ ID tuần tự
    jobId: 1,
    name: "CSS Layout",
    duration: 20,
    questions: [
      {
        id: 1,
        text: "What does flexbox do?",
      },
    ],
    status: 'closed',
    accessCode: 'CSS456',
  },
];

// Sample sessions
export const sampleSessions: Session[] = [];

export const generateCode = (): string => {
  return Math.random().toString().slice(2, 8);
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Easy":
      return "text-green-600";
    case "Medium":
      return "text-yellow-600";
    case "Hard":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Scheduled":
      return "bg-blue-100 text-blue-800";
    case "Expired":
      return "bg-gray-100 text-gray-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Expired":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};
