export interface Part {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface MaterialInfo {
  id: string;
  type: string;
  title: string;
  url: string;
  thumbnail?: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    size?: string;
    dimensions?: string;
    author?: string;
    tags?: string[];
    rating?: number;
    comments?: string;
    availability?: string;
    cameraInfo?: string;
    cameraModel?: string;
    conditions?: string;
  };
}

export interface StaffAssignment {
  staffId: string;
  role: string;
  name: string;
  nameEn: string;
  isTemporary: boolean;
  assignedAt: string;
  notes?: string;
}

export interface CutEntry {
  id: string;
  partId: string;
  season: string;
  timeOfDay: string;
  weather: string;
  location: string;
  board: string;
  characters: string[];
  costume: string;
  costumeNotes: string;
  props: string;
  notes: string;
  materials: MaterialInfo[];
  remarks: string;
  status: 'default' | 'pending' | 'notUploaded' | 'hasColorRef';
  backgroundColor?: string;
  assignedStaff: StaffAssignment[];
  branchNo?: string; // 枝番を追加
}

export interface CutGroup {
  id: string;
  cutNo: string;
  rangeStart: string;
  rangeEnd: string;
  backgroundColor: string;
  entries: CutEntry[];
}

export interface StaffEntry {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  studio: string;
  department: string;
  order: number;
  status: 'active' | 'inactive';
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  totalCuts: number;
  status: 'draft' | 'in_progress' | 'completed';
  lastModified: string;
  parts: Part[];
  cutGroups: CutGroup[];
}

export interface Studio {
  id: string;
  name: string;
  departments: string[];
}

export interface Character {
  id: string;
  name: string;
  code: string;
}