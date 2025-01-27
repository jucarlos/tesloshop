import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ) {
    
  }

  async runSeed() {

    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.insertNewProducts( adminUser );

    return 'SEED EXECUTED';


  }

  private async deleteTables() {

    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
    

  }

  private async insertUsers() {

    const seedUser = initialData.users;

    const users: User[] = [];
    
    seedUser.forEach( user => {
      user.password = bcrypt.hashSync(user.password, 10),
      users.push( this.userRepository.create ( user))
    });

    const dbUsers = await this.userRepository.save( seedUser);
    return dbUsers[0];


  }

  private async insertNewProducts(user: User) {

    try {
      await this.productService.deleteAllProducts();

      const products = initialData.products;

      const insertPromises = [];

      products.forEach( product => {
        insertPromises.push(this.productService.create( product, user ))
      });

      await Promise.all( insertPromises );


    } catch (error) {
      return false;
    }
      
    return true;

  }

}
