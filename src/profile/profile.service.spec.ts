import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { Profile } from './profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockProfile = {
    id: 'uuid-123',
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
      genres: ['Rock', 'Jazz'],
      location: {
        latitude: -33.4326,
        longitude: -70.6149,
        address: 'Santiago, Chile',
      },
      preferredEventTypes: ['concierto', 'tocata'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockProfile),
    save: jest.fn().mockResolvedValue(mockProfile),
    find: jest.fn().mockResolvedValue([mockProfile]),
    findOne: jest.fn().mockResolvedValue(mockProfile),
    merge: jest.fn().mockReturnValue(mockProfile),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getRepositoryToken(Profile), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and retrieve a profile', async () => {
    const dto: CreateProfileDto = {
      name: 'John Doe',
      email: 'john@example.com',
      preferences: {
        genres: ['Rock', 'Jazz'],
        location: { latitude: -33.4326, longitude: -70.6149 },
        preferredEventTypes: ['concierto', 'tocata'],
      },
    };

    const created = await service.create(dto);
    expect(created).toHaveProperty('id');
    expect(created.name).toBe(dto.name);
    expect(created.email).toBe(dto.email);
  });

  it('should throw an exception if profile not found', async () => {
    jest.spyOn(mockRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne('non-existent-id')).rejects.toThrow();
  });
});
