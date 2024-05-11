import { Expose, Transform } from 'class-transformer';

// Expose for Serialize decorator

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  approved: boolean;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Transform(({ obj }) => obj.user.id)
  // obj is indicate at created object with field user
  @Expose()
  userId: number;
}
