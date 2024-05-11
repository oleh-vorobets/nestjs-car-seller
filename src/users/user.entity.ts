import { ReportEntity } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
// import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: true })
  admin: boolean;

  @Column()
  // @Exclude() // will be excluded after interception the response
  password: string;

  @OneToMany(() => ReportEntity, (report) => report.user) // it not cause a change
  // this decorator will not add column to our table
  reports: ReportEntity[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id: ', this.id);
  }
}
