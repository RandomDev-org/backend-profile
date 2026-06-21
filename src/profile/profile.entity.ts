export interface ProfilePreferences {
  genres: string[];
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  preferredEventTypes: string[];
}

export class Profile {
  id: string;
  name: string;
  email: string;
  preferences: ProfilePreferences;
  createdAt: Date;
  updatedAt: Date;
}
