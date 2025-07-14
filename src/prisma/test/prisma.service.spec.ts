import { Logger } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { PrismaService } from '../prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, Logger],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to prisma and log a success message', async () => {
      // Arrange
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue();
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.onModuleInit();

      // Assert
      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith('Prisma connected');
    });

    it('should log an error and re-throw it if connection fails', async () => {
      // Arrange
      const connectionError = new Error('DB Connection Error');
      const connectSpy = jest.spyOn(service, '$connect').mockRejectedValue(connectionError);
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      // Act
      await expect(service.onModuleInit()).rejects.toThrow(connectionError);

      // Assert
      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith('Prisma connection error', connectionError);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect to prisma and log a success message', async () => {
      // Arrange
      const connectSpy = jest.spyOn(service, '$disconnect').mockResolvedValue();
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.onModuleDestroy();

      // Assert
      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith('Prisma disconnected');
    });

    it('should log an error but not throw if disconnection fails', async () => {
      // Arrange
      const disconnectionError = new Error('DB Disconnection Error');
      const connectSpy = jest.spyOn(service, '$disconnect').mockRejectedValue(disconnectionError);
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      // Act
      await expect(service.onModuleDestroy()).resolves.not.toThrow();

      // Assert
      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith('Prisma disconnection error', disconnectionError);
    });
  });
});
