import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and retrieve a profile', () => {
    const dto: CreateProfileDto = {
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
    };

    const created = service.create(dto);
    expect(created).toHaveProperty('id');
    expect(created.name).toBe(dto.name);
    expect(created.email).toBe(dto.email);
    expect(created.preferences.genres).toEqual(dto.preferences.genres);

    const found = service.findOne(created.id);
    expect(found).toBeDefined();
    expect(found.id).toBe(created.id);
  });

  it('should throw an exception if profile not found', () => {
    expect(() => service.findOne('non-existent-id')).toThrow();
  });

  it('should update a profile', () => {
    const dto: CreateProfileDto = {
      name: 'John Doe',
      email: 'john@example.com',
      preferences: {
        genres: ['Rock'],
        location: {
          latitude: -33.4326,
          longitude: -70.6149,
        },
        preferredEventTypes: ['concierto'],
      },
    };

    const created = service.create(dto);
    const updated = service.update(created.id, {
      name: 'John Smith',
      preferences: {
        genres: ['Rock', 'Pop'],
        location: {
          latitude: -33.4326,
          longitude: -70.6149,
        },
        preferredEventTypes: ['concierto'],
      },
    });
    expect(updated.name).toBe('John Smith');
    expect(updated.preferences.genres).toContain('Pop');
  });

  it('should remove a profile', () => {
    const dto: CreateProfileDto = {
      name: 'John Doe',
      email: 'john@example.com',
      preferences: {
        genres: ['Rock'],
        location: {
          latitude: -33.4326,
          longitude: -70.6149,
        },
        preferredEventTypes: ['concierto'],
      },
    };

    const created = service.create(dto);
    service.remove(created.id);
    expect(() => service.findOne(created.id)).toThrow();
  });
});
