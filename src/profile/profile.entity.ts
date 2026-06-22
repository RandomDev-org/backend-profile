import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface ProfilePreferences {
  genres: string[];
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  preferredEventTypes: string[];
}

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'simple-json' })
  preferences: ProfilePreferences;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
